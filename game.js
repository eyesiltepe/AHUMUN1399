/* =====================================================================
   GAME LOGIC - State machine, lifelines, and event wiring.

   Depends on:
     - ../questions/questions.js  — QUESTIONS, PRIZES, SAFE_LEVELS, BANK_QUESTION_COUNT,
       buildQuestionSet(classic|study), formatMoney, pickAlternativeQuestion, …
     - audio.js  — initAudio, playSound, stopThinking
   ===================================================================== */

const STATE = {
  IDLE: 'idle',
  SELECTING: 'selecting',
  REVEALING: 'revealing',
  ENDED: 'ended'
};

const game = {
  currentLevel: 0,
  selectedAnswer: null,
  state: STATE.IDLE,
  lifelines: { fifty: true, audience: true, phone: true, switch: true, clue: true },
  hiddenAnswers: [],
  soundOn: true,

  /**
   * @param {'classic'|'study'} mode - classic = 15 (5 easy / 5 medium / 5 hard). study = entire bank shuffled.
   */
  start(mode = 'classic') {
    buildQuestionSet(mode);
    initAudio();
    playSound('start');
    document.getElementById('welcome').classList.remove('active');
    document.getElementById('game').classList.add('active');
    this.renderLadder();
    this.loadQuestion();
  },

  renderLadder() {
    const ladder = document.getElementById('ladder');
    ladder.innerHTML = '';
    PRIZES.forEach((prize, i) => {
      const rung = document.createElement('div');
      rung.className = 'rung';
      if (SAFE_LEVELS.includes(i)) rung.classList.add('safe');
      if (i === this.currentLevel) rung.classList.add('current');
      else if (i < this.currentLevel) rung.classList.add('passed');
      rung.innerHTML = `
        <span><span class="rung-num">${i + 1}</span></span>
        <span class="rung-amount">${formatMoney(prize)}</span>
      `;
      ladder.appendChild(rung);
    });
    setTimeout(() => {
      const current = ladder.querySelector('.rung.current');
      if (current) current.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    }, 50);
  },

  loadQuestion() {
    this.state = STATE.IDLE;
    this.selectedAnswer = null;
    this.hiddenAnswers = [];
    document.getElementById('counter').textContent = `Round ${this.currentLevel + 1} / ${QUESTIONS.length}`;
    document.getElementById('walk-away-btn').disabled = false;

    const q = QUESTIONS[this.currentLevel];
    document.getElementById('question-box').textContent = q.question;
    const srcEl = document.getElementById('question-source');
    if (srcEl) {
      if (q.source) {
        srcEl.textContent = 'Source: ' + q.source;
        srcEl.hidden = false;
      } else {
        srcEl.textContent = '';
        srcEl.hidden = true;
      }
    }
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    q.answers.forEach((answer, i) => {
      const el = document.createElement('div');
      el.className = 'answer';
      el.dataset.index = i;
      el.innerHTML = `<span class="letter">${letters[i]}:</span><span>${answer}</span>`;
      el.onclick = () => this.selectAnswer(i);
      answersDiv.appendChild(el);
    });
    playSound('next');
  },

  selectAnswer(index) {
    if (this.state !== STATE.IDLE) return;
    if (this.hiddenAnswers.includes(index)) return;

    this.state = STATE.SELECTING;
    this.selectedAnswer = index;
    document.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));
    document.querySelectorAll('.answer')[index].classList.add('selected');
    document.getElementById('confirm-text').textContent =
      ['A', 'B', 'C', 'D'][index] + ': ' + QUESTIONS[this.currentLevel].answers[index];
    document.getElementById('modal-confirm').classList.add('active');
    playSound('select');
  },

  confirmAnswer() {
    document.getElementById('modal-confirm').classList.remove('active');
    this.state = STATE.REVEALING;
    document.getElementById('walk-away-btn').disabled = true;

    const correctIndex = QUESTIONS[this.currentLevel].correct;
    const answers = document.querySelectorAll('.answer');

    playSound('lock');
    playSound('thinking');

    setTimeout(() => {
      stopThinking();
      if (this.selectedAnswer === correctIndex) {
        answers[this.selectedAnswer].classList.add('correct');
        playSound('correct');
        setTimeout(() => this.next(), 3200);
      } else {
        answers[this.selectedAnswer].classList.remove('selected');
        answers[this.selectedAnswer].classList.add('wrong');
        setTimeout(() => answers[correctIndex].classList.add('correct'), 1000);
        playSound('wrong');
        setTimeout(() => this.gameOver('wrong'), 4500);
      }
    }, 2200);
  },

  cancelAnswer() {
    document.getElementById('modal-confirm').classList.remove('active');
    document.querySelectorAll('.answer').forEach(a => a.classList.remove('selected'));
    this.selectedAnswer = null;
    this.state = STATE.IDLE;
  },

  next() {
    this.currentLevel++;
    if (this.currentLevel >= QUESTIONS.length) {
      this.gameOver('won');
      return;
    }
    this.renderLadder();
    this.loadQuestion();
  },

  guaranteedAmount() {
    let amount = 0;
    for (const safe of SAFE_LEVELS) {
      if (this.currentLevel > safe) amount = PRIZES[safe];
    }
    return amount;
  },

  walkAwayAmount() {
    if (this.currentLevel === 0) return 0;
    return PRIZES[this.currentLevel - 1];
  },

  askWalkAway() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();
    document.getElementById('walkaway-amount').textContent = formatMoney(this.walkAwayAmount());
    document.getElementById('modal-walkaway').classList.add('active');
  },

  confirmWalkAway() {
    this.closeModal('modal-walkaway');
    this.gameOver('walkaway');
  },

  gameOver(reason) {
    this.state = STATE.ENDED;
    setTimeout(() => {
      document.getElementById('game').classList.remove('active');
      document.getElementById('end').classList.add('active');
      const titleEl = document.getElementById('end-title');
      const prizeEl = document.getElementById('end-prize');
      const msgEl = document.getElementById('end-message');
      const iconEl = document.getElementById('end-icon');

      let amount, title, message, icon;
      if (reason === 'won') {
        amount = PRIZES[PRIZES.length - 1];
        title = "CONGRATULATIONS, YOU'RE A MILLIONAIRE!";
        message = `You answered all ${QUESTIONS.length} rounds correctly — outstanding.`;
        icon = '🏆';
        playSound('win');
      } else if (reason === 'walkaway') {
        amount = this.walkAwayAmount();
        title = 'A SMART DECISION';
        message = amount > 0
          ? `Rather than risk it, you walked away with ${formatMoney(amount)}. Well played!`
          : "You walked away without answering a single question. Try your luck next time!";
        icon = '💼';
        playSound('walkaway');
      } else {
        amount = this.guaranteedAmount();
        title = 'GAME OVER';
        message = amount > 0
          ? `That was the wrong answer, but your guaranteed prize stands: ${formatMoney(amount)}`
          : "Wrong answer, and you hadn't reached a safe level yet. Better luck next time!";
        icon = amount > 0 ? '🎯' : '😢';
        playSound('gameover');
      }
      titleEl.textContent = title;
      prizeEl.textContent = formatMoney(amount);
      msgEl.textContent = message;
      iconEl.textContent = icon;
    }, 800);
  },

  /* === LIFELINES === */
  useFiftyFifty() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.fifty) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    const correctIndex = QUESTIONS[this.currentLevel].correct;
    const wrongIndices = [0, 1, 2, 3].filter(
      i => i !== correctIndex && !this.hiddenAnswers.includes(i)
    );
    if (wrongIndices.length === 0) return;

    this.lifelines.fifty = false;
    document.getElementById('ll-fifty').classList.add('used');
    shuffle(wrongIndices);
    const take = Math.min(2, wrongIndices.length);
    const toHide = wrongIndices.slice(0, take);
    this.hiddenAnswers = [...new Set([...this.hiddenAnswers, ...toHide])];
    const answers = document.querySelectorAll('.answer');
    toHide.forEach(i => answers[i].classList.add('hidden'));
    playSound('lifeline');
  },

  useAudience() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.audience) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    this.lifelines.audience = false;
    document.getElementById('ll-audience').classList.add('used');

    const correctIndex = QUESTIONS[this.currentLevel].correct;
    const visibleIndices = [0, 1, 2, 3].filter(i => !this.hiddenAnswers.includes(i));

    const denom = Math.max(1, QUESTIONS.length - 1);
    const difficulty = Math.min(this.currentLevel / denom, 1);
    let correctPct = 70 - difficulty * 30 + (Math.random() * 15 - 5);
    correctPct = Math.max(40, Math.min(85, Math.round(correctPct)));
    if (visibleIndices.length === 2) correctPct = Math.max(60, correctPct);

    const percentages = [0, 0, 0, 0];
    percentages[correctIndex] = correctPct;
    let remaining = 100 - correctPct;
    const otherVisible = visibleIndices.filter(i => i !== correctIndex);
    otherVisible.forEach((idx, i) => {
      if (i === otherVisible.length - 1) {
        percentages[idx] = remaining;
      } else {
        const portion = Math.round(Math.random() * remaining * 0.7) + 1;
        percentages[idx] = portion;
        remaining -= portion;
      }
    });

    const barsDiv = document.getElementById('audience-bars');
    barsDiv.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    [0, 1, 2, 3].forEach(i => {
      if (this.hiddenAnswers.includes(i)) return;
      const col = document.createElement('div');
      col.className = 'audience-col';
      col.innerHTML = `
        <div class="audience-percent">${percentages[i]}%</div>
        <div class="audience-bar" data-pct="${percentages[i]}"></div>
        <div class="audience-letter">${letters[i]}</div>
      `;
      barsDiv.appendChild(col);
    });
    document.getElementById('modal-audience').classList.add('active');
    playSound('lifeline');
    setTimeout(() => {
      barsDiv.querySelectorAll('.audience-bar').forEach(bar => {
        bar.style.height = bar.dataset.pct + '%';
      });
    }, 100);
  },

  usePhone() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.phone) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    this.lifelines.phone = false;
    document.getElementById('ll-phone').classList.add('used');

    const q = QUESTIONS[this.currentLevel];
    const correctText = q.answers[q.correct];
    const correctLetter = ['A', 'B', 'C', 'D'][q.correct];
    const denom = Math.max(1, QUESTIONS.length - 1);
    const difficulty = this.currentLevel / denom;

    const confidentReplies = [
      `I know this one. The answer is definitely ${correctLetter}: "${correctText}". Lock it in.`,
      `Easy! The answer is ${correctLetter}, which is "${correctText}". I know this topic well.`,
      `I'm sure of it. The answer is ${correctLetter}: "${correctText}". Go with that.`
    ];
    const mediumReplies = [
      `Hmm, I think the answer is ${correctLetter}, "${correctText}", but I'm not 100% sure.`,
      `${correctLetter}, "${correctText}", feels right to me. At least, that's what makes the most sense.`,
      `Looking at the options, I'd say ${correctLetter}: "${correctText}". But the call is yours.`
    ];
    const uncertainReplies = [
      `This is a tough one. I'd guess ${correctLetter} ("${correctText}"), but it's risky.`,
      `Really hard. I think it might be ${correctLetter}, "${correctText}", but honestly I'm not sure.`,
      `I don't really know, but my best guess is ${correctLetter}: "${correctText}". Up to you to decide.`
    ];

    let pool;
    if (difficulty < 0.35) pool = confidentReplies;
    else if (difficulty < 0.7) pool = mediumReplies;
    else pool = uncertainReplies;

    const reply = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById('phone-text').textContent = '"' + reply + '"';
    document.getElementById('modal-phone').classList.add('active');
    playSound('lifeline');
  },

  useSwitchQuestion() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.switch) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    const replacement = pickAlternativeQuestion(this.currentLevel, QUESTIONS[this.currentLevel]);
    if (!replacement) return;

    this.lifelines.switch = false;
    document.getElementById('ll-switch').classList.add('used');
    QUESTIONS[this.currentLevel] = replacement;
    this.loadQuestion();
    playSound('lifeline');
  },

  useHostClue() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.clue) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    const correctIndex = QUESTIONS[this.currentLevel].correct;
    const wrongPool = [0, 1, 2, 3].filter(
      i => i !== correctIndex && !this.hiddenAnswers.includes(i)
    );
    if (wrongPool.length === 0) return;

    this.lifelines.clue = false;
    document.getElementById('ll-clue').classList.add('used');

    shuffle(wrongPool);
    const eliminated = wrongPool[0];
    this.hiddenAnswers.push(eliminated);
    const answers = document.querySelectorAll('.answer');
    if (answers[eliminated]) answers[eliminated].classList.add('hidden');

    const letter = ['A', 'B', 'C', 'D'][eliminated];
    document.getElementById('clue-text').textContent =
      `The booth agrees: answer ${letter} is not correct. Eliminate it and focus on what's left.`;
    document.getElementById('modal-clue').classList.add('active');
    playSound('lifeline');
  },

  closeModal(id) {
    document.getElementById(id).classList.remove('active');
  },

  toggleSound() {
    this.soundOn = !this.soundOn;
    document.getElementById('sound-toggle').textContent = this.soundOn ? '🔊' : '🔇';
    if (!this.soundOn) stopThinking();
  }
};

/* =====================================================================
   MOBILE: real viewport height (handles mobile browser address bar)
   ===================================================================== */
function setRealVh() {
  document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
}
setRealVh();
window.addEventListener('resize', setRealVh);
window.addEventListener('orientationchange', () => setTimeout(setRealVh, 200));

/* Clicking outside the modal closes audience/phone modals only. */
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    const id = e.target.id;
    if (id === 'modal-audience' || id === 'modal-phone' || id === 'modal-clue') {
      e.target.classList.remove('active');
    }
  }
});

/* Keyboard shortcuts: 1-4 or A-D to select; Enter confirms; Esc cancels. */
document.addEventListener('keydown', (e) => {
  if (game.state === STATE.IDLE) {
    if (e.key === '1' || e.key.toLowerCase() === 'a') game.selectAnswer(0);
    else if (e.key === '2' || e.key.toLowerCase() === 'b') game.selectAnswer(1);
    else if (e.key === '3' || e.key.toLowerCase() === 'c') game.selectAnswer(2);
    else if (e.key === '4' || e.key.toLowerCase() === 'd') game.selectAnswer(3);
  } else if (game.state === STATE.SELECTING) {
    if (e.key === 'Enter') game.confirmAnswer();
    else if (e.key === 'Escape') game.cancelAnswer();
  }
});
