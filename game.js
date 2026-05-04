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
  lifelines: { fifty: true, audience: true, phone: true, sarah: true, switch: true, clue: true },
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
    const letters = ['A', 'B', 'C', 'D', 'E'];
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
      ['A', 'B', 'C', 'D', 'E'][index] + ': ' + QUESTIONS[this.currentLevel].answers[index];
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

  /* === END-SCREEN QUOTE POOLS ===
     Drawn from the AHUM UN1399 readings — Attar, Rumi, Ibn 'Arabi, Ibn Tufayl,
     the Qur'an, 1001 Nights, Ibn Khaldun, the Ikhwan al-Safa, and others.
     Mix of profound, wry, and self-aware. Some are paraphrased for brevity. */
  quotePools: {
    won: [
      { text: "When you reach the Simorgh, you find only your own reflection. So too with $1,000,000.", source: "After 'Attar, The Conference of the Birds" },
      { text: "Knowledge has long roots and longer branches. Tonight, you have climbed both.", source: "After Tawaddud, 1001 Nights" },
      { text: "Hayy ibn Yaqzan needed no teacher to discover the truth. You needed only fifteen rounds.", source: "After Ibn Tufayl" },
      { text: "Out beyond ideas of right and wrong, there is a field. You won the prize there.", source: "After Rumi" },
      { text: "The sweetest of stories is the one that ends well. The Qur'an said so.", source: "After Sura Yusuf 12:3" },
      { text: "Be sure: with hardship comes ease. Also, sometimes, $1,000,000.", source: "After Sura 94:6" },
      { text: "I am the Real, said al-Hallaj. They executed him. You won the money. Good trade.", source: "Wry note on al-Hallaj" },
      { text: "Even the King of the Jinn would have ruled in your favor tonight.", source: "After the Ikhwan al-Safa" },
    ],
    walkaway: [
      { text: "The donkey gave the ox advice on how to escape work. The donkey ended up doing the work himself. Walking away was wiser.", source: "After 1001 Nights, the Tale of the Ox" },
      { text: "He who understands his limits, said the philosophers, is closer to wisdom than he who multiplies his gains.", source: "After al-Farabi, On the Perfect State" },
      { text: "Civilizations fall when 'asabiyyah is lost to luxury. You quit before the luxury caught up to you.", source: "After Ibn Khaldun, Muqaddimah" },
      { text: "The hoopoe led the birds across seven valleys. The nightingale stayed home with his rose. Both, in their way, were right.", source: "After 'Attar, Conference of the Birds" },
      { text: "Patience is sweet, said Jacob. Especially when accompanied by a check.", source: "After Sura Yusuf 12:18" },
      { text: "The wise traveler knows when to dismount the camel.", source: "Anonymous, in the spirit of adab" },
      { text: "Murua: he who knows when to stop is most refined of all.", source: "After the glossary on muru'a" },
      { text: "Shahrazad told a story for a thousand and one nights. You knew when to end yours.", source: "After 1001 Nights, Frame Tale" },
    ],
    lostNoMoney: [
      { text: "The merchant threw date pits and killed the jinni's invisible son. Sometimes the wrong answer finds you first.", source: "After 1001 Nights, The Merchant and the Jinni" },
      { text: "The nightingale could not leave his rose, the peacock could not forget paradise, the duck could not leave the pond. We all have our excuses.", source: "After 'Attar, Conference of the Birds" },
      { text: "Joseph too was thrown into a well. Look how that turned out for him.", source: "After Sura Yusuf 12:15" },
      { text: "Fana — the annihilation of the ego. Tonight, briefly, you achieved it.", source: "After the Sufi glossary on fana'" },
      { text: "Ibn Khaldun observed that all dynasties decline. Yours simply did so faster than most.", source: "After Ibn Khaldun" },
      { text: "The Ikhwan al-Safa argued that humans have no inherent claim over animals. Tonight, the animals win.", source: "After The Case of the Animals versus Man" },
      { text: "The donkey advised the ox to refuse food and pretend to be sick. The donkey ended up doing the ox's work. Wisdom is hard.", source: "After 1001 Nights" },
      { text: "Dunyazad said: Sister, tell us a tale. The story you told tonight was short.", source: "After 1001 Nights" },
      { text: "Hayy ibn Yaqzan deduced God's existence from first principles, alone, on an island. You had multiple choice and still struggled. Be kind to yourself.", source: "After Ibn Tufayl" },
    ],
    lostWithMoney: [
      { text: "Even Joseph, master of dreams, sat in prison for years before his rise. Your prize is your foothold.", source: "After Sura Yusuf 12:42" },
      { text: "The wise teacher al-Farabi said: a partial good is still a good. Take what you have won.", source: "After al-Farabi" },
      { text: "The Simorgh waits behind Mount Qaf. You did not cross all seven valleys, but you crossed several.", source: "After 'Attar, Conference of the Birds" },
      { text: "Patience, said Jacob, is sweet. So is your guaranteed prize.", source: "After Sura Yusuf 12:18" },
      { text: "Ibn 'Arabi taught that every veil lifted reveals another. You lifted some tonight.", source: "After Ibn 'Arabi, Tarjuman al-Ashwaq" },
      { text: "The path of murua'a is difficult. So too is trivia. You walked both with honor.", source: "After the glossary on muru'a" },
      { text: "Shahrazad would not have made it 1,001 nights without a few cliffhangers. Yours just came early.", source: "After 1001 Nights" },
    ]
  },

  pickQuote(reason, amount) {
    let pool;
    if (reason === 'won') pool = this.quotePools.won;
    else if (reason === 'walkaway') pool = this.quotePools.walkaway;
    else pool = amount > 0 ? this.quotePools.lostWithMoney : this.quotePools.lostNoMoney;
    return pool[Math.floor(Math.random() * pool.length)];
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
      const quoteEl = document.getElementById('end-quote');
      const sourceEl = document.getElementById('end-quote-source');

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

      // Display random quote
      if (quoteEl && sourceEl) {
        const quote = this.pickQuote(reason, amount);
        quoteEl.textContent = '"' + quote.text + '"';
        sourceEl.textContent = '— ' + quote.source;
      }
    }, 800);
  },

  /* === LIFELINES === */
  useFiftyFifty() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.fifty) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    const correctIndex = QUESTIONS[this.currentLevel].correct;
    const numAnswers = QUESTIONS[this.currentLevel].answers.length;
    const allIndices = Array.from({ length: numAnswers }, (_, i) => i);
    const wrongIndices = allIndices.filter(
      i => i !== correctIndex && !this.hiddenAnswers.includes(i)
    );
    if (wrongIndices.length === 0) return;

    this.lifelines.fifty = false;
    document.getElementById('ll-fifty').classList.add('used');
    shuffle(wrongIndices);
    // Hide enough wrong answers to leave 2 visible (the correct one + 1 wrong)
    const visibleCount = numAnswers - this.hiddenAnswers.length;
    const toHideCount = Math.max(0, visibleCount - 2);
    const toHide = wrongIndices.slice(0, toHideCount);
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
    const numAnswers = QUESTIONS[this.currentLevel].answers.length;
    const allIndices = Array.from({ length: numAnswers }, (_, i) => i);
    const visibleIndices = allIndices.filter(i => !this.hiddenAnswers.includes(i));

    const denom = Math.max(1, QUESTIONS.length - 1);
    const difficulty = Math.min(this.currentLevel / denom, 1);
    let correctPct = 70 - difficulty * 30 + (Math.random() * 15 - 5);
    correctPct = Math.max(40, Math.min(85, Math.round(correctPct)));
    if (visibleIndices.length === 2) correctPct = Math.max(60, correctPct);

    const percentages = new Array(numAnswers).fill(0);
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
    const letters = ['A', 'B', 'C', 'D', 'E'];
    allIndices.forEach(i => {
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

  /* === CLASSMATES POOL ===
     Real students from AHUM UN1399 (Spring 2026). Each has a distinct
     "specialty" or quirk that flavors how they hint at the answer.
     They never give the answer directly - they steer you toward it. */
  classmates: [
    { name: "Shehar Bano", quirk: "footnote nerd", style: "thoughtful" },
    { name: "Juliana Bryant", quirk: "perfect attendance", style: "confident" },
    { name: "Ines Caldara", quirk: "glossary obsessive", style: "scholarly" },
    { name: "Ibrahim Ibrahim", quirk: "vibes-based reasoning", style: "casual" },
    { name: "Michael Ishak", quirk: "logic puzzle solver", style: "analytical" },
    { name: "Shunammite Jiwanmall", quirk: "Sufi enthusiast", style: "warm" },
    { name: "Nafeesa Mahmood", quirk: "color-coded notes", style: "precise" },
    { name: "Pranav Manoj", quirk: "wrote his paper on Ibn Tufayl", style: "philosophical" },
    { name: "Lucy Markow", quirk: "syllabus memorized", style: "witty" },
    { name: "Jason McCord", quirk: "second-guesser, usually right", style: "humble" },
    { name: "Narges Noorbakhsh", quirk: "quotes Rumi at brunch", style: "poetic" },
    { name: "Lynsey Overturf", quirk: "no-nonsense", style: "decisive" },
    { name: "Andrea Riccelli", quirk: "law school energy", style: "dramatic" },
    { name: "Yuval Shemla", quirk: "calm under pressure", style: "calm" },
    { name: "Luke Suess", quirk: "human exclamation point", style: "energetic" },
    { name: "Nina Wang", quirk: "flashcard queen", style: "meticulous" }
  ],

  /* Stash for the multi-step phone lifeline */
  phonePending: null,

  /**
   * Build a HINT (not the direct answer) that steers the player toward the
   * correct option without naming it. Each hint:
   *  - eliminates one wrong option (always), OR
   *  - hints at the position of the correct answer with a clue, OR
   *  - quotes the correct answer's first words / hints at a theme
   * The HINT delivery is shaped by the classmate's personality.
   */
  buildPhoneHint(classmate, q) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const correctIndex = q.correct;
    const correctText = q.answers[correctIndex];
    const correctLetter = letters[correctIndex];

    // Pick a wrong index that hasn't been eliminated by 50:50, to "steer away from"
    const wrongIndices = q.answers
      .map((_, i) => i)
      .filter(i => i !== correctIndex && !this.hiddenAnswers.includes(i));

    // Two hint techniques, chosen randomly
    const technique = Math.random() < 0.5 ? 'eliminate' : 'narrow';

    // The first 3-5 words of the correct answer (as a teaser)
    const firstWords = correctText.split(/\s+/).slice(0, 3).join(' ');

    let hint;
    if (technique === 'eliminate' && wrongIndices.length > 0) {
      const eliminated = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
      const elimLetter = letters[eliminated];
      hint = { kind: 'eliminate', letter: elimLetter };
    } else {
      // Narrow toward correct: teaser + nearby letter range
      hint = { kind: 'narrow', firstWords, letter: correctLetter };
    }

    return this.phrasePhoneHint(classmate, hint);
  },

  phrasePhoneHint(classmate, hint) {
    // Personality-flavored hint phrasings.
    // Each style has variants for both 'eliminate' and 'narrow' hint kinds.
    const phrasings = {
      thoughtful: {
        eliminate: [
          `Hmm, let me think... I'm pretty sure it's NOT ${hint.letter}. Rule that one out.`,
          `Give me a second... I remember crossing out ${hint.letter} in my notes. Don't pick it.`
        ],
        narrow: [
          `I'm fairly sure the right answer starts with the words "${hint.firstWords}..." — does that match one of your options?`,
          `From what I recall, the answer begins with something like "${hint.firstWords}..." — go from there.`
        ]
      },
      confident: {
        eliminate: [
          `${hint.letter}? No way. That's wrong. Eliminate it.`,
          `Whatever you do, don't pick ${hint.letter}. I'm telling you.`
        ],
        narrow: [
          `Look for the option that starts with "${hint.firstWords}..." — that's the one.`,
          `The right answer begins "${hint.firstWords}..." — find it.`
        ]
      },
      scholarly: {
        eliminate: [
          `According to my notes, ${hint.letter} is definitively incorrect. Discard it.`,
          `${hint.letter} is a common distractor — it's wrong. Move on.`
        ],
        narrow: [
          `The accurate response in the readings opens with "${hint.firstWords}..." — that's your direction.`,
          `From the glossary, the correct phrasing starts "${hint.firstWords}..." — match it.`
        ]
      },
      casual: {
        eliminate: [
          `Bro, ${hint.letter} is a trap. Don't fall for it.`,
          `Yeah, ${hint.letter}? Skip it. Trust me.`
        ],
        narrow: [
          `Look for something like "${hint.firstWords}..." — that's the vibe of the right answer.`,
          `The answer kinda starts with "${hint.firstWords}..." — you'll see it.`
        ]
      },
      analytical: {
        eliminate: [
          `By process of elimination — ${hint.letter} is logically inconsistent. Cross it out.`,
          `${hint.letter} contradicts the source material. It's wrong.`
        ],
        narrow: [
          `The correct response begins with "${hint.firstWords}..." — that's where the logic points.`,
          `Pattern-matching from the readings: the right answer opens "${hint.firstWords}..."`
        ]
      },
      warm: {
        eliminate: [
          `Aw sweetie, ${hint.letter} is wrong. Just don't pick that one and you'll be fine!`,
          `Oh honey, skip ${hint.letter} — it's a trap! You've got this!`
        ],
        narrow: [
          `The right answer starts with something like "${hint.firstWords}..." — I believe in you!`,
          `Look for "${hint.firstWords}..." — you'll see it, sweetie!`
        ]
      },
      precise: {
        eliminate: [
          `${hint.letter} is incorrect. Underlined in my notes. Eliminate.`,
          `Not ${hint.letter}. I have it in red ink. Skip.`
        ],
        narrow: [
          `Correct answer begins: "${hint.firstWords}..." — verbatim from the text.`,
          `The exact wording starts with "${hint.firstWords}..." — find that option.`
        ]
      },
      philosophical: {
        eliminate: [
          `Truth is rarely found in ${hint.letter}. Look elsewhere.`,
          `${hint.letter} is a shadow on the wall, not the form itself. Discard it.`
        ],
        narrow: [
          `The essence of the answer begins with "${hint.firstWords}..." — meditate on that.`,
          `Seek the option that opens with "${hint.firstWords}..." — therein lies the truth.`
        ]
      },
      witty: {
        eliminate: [
          `${hint.letter}? Sarah Bin Tyeer would weep. It's wrong.`,
          `If you pick ${hint.letter}, I'm changing my number. Don't.`
        ],
        narrow: [
          `The right one starts "${hint.firstWords}..." — like, obviously.`,
          `Look for "${hint.firstWords}..." — it's the only one that doesn't sound made up.`
        ]
      },
      humble: {
        eliminate: [
          `I think... I mean, I'm pretty sure... ${hint.letter} is not it. Probably skip it.`,
          `Don't quote me, but ${hint.letter} feels wrong. I'd avoid it.`
        ],
        narrow: [
          `I might be off, but I think the answer starts with "${hint.firstWords}..." — that ring a bell?`,
          `Maybe look for something like "${hint.firstWords}..."? I think that's it.`
        ]
      },
      poetic: {
        eliminate: [
          `${hint.letter} is the nightingale's excuse — alluring, but a distraction. Pass.`,
          `Like the duck who would not leave the pond, ${hint.letter} stays put. It is wrong.`
        ],
        narrow: [
          `The hoopoe whispers: the answer begins with "${hint.firstWords}..."`,
          `As if from the Conference itself: look for "${hint.firstWords}..." — it leads to truth.`
        ]
      },
      decisive: {
        eliminate: [
          `Not ${hint.letter}. Done. Move on.`,
          `${hint.letter}: wrong. Next.`
        ],
        narrow: [
          `Starts with "${hint.firstWords}..." — pick it.`,
          `"${hint.firstWords}..." — that's your answer. Lock it.`
        ]
      },
      dramatic: {
        eliminate: [
          `Ladies and gentlemen of the jury — ${hint.letter} is FALSE! Strike it from the record!`,
          `Objection! ${hint.letter} is a baseless claim. Strike it.`
        ],
        narrow: [
          `The truth, your honor, begins with the words "${hint.firstWords}..."!`,
          `I submit to the court that the answer opens "${hint.firstWords}..."`
        ]
      },
      calm: {
        eliminate: [
          `Take a breath. ${hint.letter} is not it. You're fine.`,
          `Easy now. ${hint.letter} is wrong. Just skip it and you'll see the answer.`
        ],
        narrow: [
          `Slow down. The answer starts with "${hint.firstWords}..." — find it calmly.`,
          `Breathe. Look for "${hint.firstWords}..." — it's right there.`
        ]
      },
      energetic: {
        eliminate: [
          `NOT ${hint.letter}!! TRUST ME!! Skip skip skip!`,
          `${hint.letter} IS A TRAP!! Avoid! GO GO GO!`
        ],
        narrow: [
          `THE ANSWER STARTS WITH "${hint.firstWords}..."!! YES!! GO!!`,
          `LOOK FOR "${hint.firstWords}..."!! YOU'VE GOT THIS!!`
        ]
      },
      meticulous: {
        eliminate: [
          `Checking flashcards... ${hint.letter}: incorrect. Confirmed wrong.`,
          `Per my week-three notes, ${hint.letter} is not the answer. Eliminate.`
        ],
        narrow: [
          `Per flashcard #47: the correct response begins "${hint.firstWords}..." — verified.`,
          `My notes show the answer starting with "${hint.firstWords}..." — page reference available on request.`
        ]
      }
    };

    const styleSet = phrasings[classmate.style] || phrasings.confident;
    const pool = styleSet[hint.kind];
    return pool[Math.floor(Math.random() * pool.length)];
  },

  /**
   * STEP 1 of the phone lifeline: pick 3 random classmates and let the
   * user choose who to call. The lifeline is NOT consumed yet (only on confirm).
   */
  usePhone() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.phone) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    // Pick 3 random distinct classmates
    const pool = this.classmates.slice();
    shuffle(pool);
    const candidates = pool.slice(0, 3);
    this.phonePending = candidates;

    // Render the picker modal
    const pickerEl = document.getElementById('phone-picker');
    pickerEl.innerHTML =
      `<div class="phone-picker-prompt">Three of your classmates are available. Who do you want to call?</div>` +
      candidates.map((c, i) =>
        `<button class="phone-candidate" onclick="game.callClassmate(${i})">` +
          `<div class="phone-candidate-name">${c.name}</div>` +
          `<div class="phone-candidate-quirk">${c.quirk}</div>` +
        `</button>`
      ).join('');
    document.getElementById('modal-phone-picker').classList.add('active');
    playSound('lifeline');
  },

  /**
   * STEP 2: user picked a classmate. Consume the lifeline, close the picker,
   * show the hint modal with that person's flavored hint.
   */
  callClassmate(index) {
    if (!this.phonePending) return;
    const classmate = this.phonePending[index];
    this.phonePending = null;
    this.lifelines.phone = false;
    document.getElementById('ll-phone').classList.add('used');
    this.closeModal('modal-phone-picker');

    const q = QUESTIONS[this.currentLevel];
    const hintText = this.buildPhoneHint(classmate, q);

    const phoneEl = document.getElementById('phone-text');
    phoneEl.innerHTML =
      `<div class="phone-caller">📞 ${classmate.name} picks up...</div>` +
      `<div class="phone-reply">"${hintText}"</div>` +
      `<div class="phone-tip">💡 Hint, not the answer — you decide.</div>`;
    document.getElementById('modal-phone').classList.add('active');
    playSound('select');
  },

  useSarah() {
    if (this.state !== STATE.IDLE && this.state !== STATE.SELECTING) return;
    if (!this.lifelines.sarah) return;
    if (this.state === STATE.SELECTING) this.cancelAnswer();

    this.lifelines.sarah = false;
    document.getElementById('ll-sarah').classList.add('used');

    const q = QUESTIONS[this.currentLevel];
    const correctText = q.answers[q.correct];
    const correctLetter = ['A', 'B', 'C', 'D', 'E'][q.correct];

    const sarahReplies = [
      `The answer is ${correctLetter}: "${correctText}". This is straight from the syllabus, dear. Trust me.`,
      `Of course, that's ${correctLetter} - "${correctText}". We covered this in class. The answer is certain.`,
      `${correctLetter}: "${correctText}". I designed this course - I know the answer. Lock it in with confidence.`,
      `Without a doubt, ${correctLetter}: "${correctText}". You should have remembered this from the readings!`,
      `Definitively ${correctLetter}: "${correctText}". As your professor, I assure you this is correct.`
    ];

    const reply = sarahReplies[Math.floor(Math.random() * sarahReplies.length)];
    document.getElementById('sarah-text').textContent = '"' + reply + '"';
    document.getElementById('modal-sarah').classList.add('active');
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
    if (id === 'modal-audience' || id === 'modal-phone' || id === 'modal-clue' || id === 'modal-sarah') {
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
    else if (e.key === '5' || e.key.toLowerCase() === 'e') game.selectAnswer(4);
  } else if (game.state === STATE.SELECTING) {
    if (e.key === 'Enter') game.confirmAnswer();
    else if (e.key === 'Escape') game.cancelAnswer();
  }
});
