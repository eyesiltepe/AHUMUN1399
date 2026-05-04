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
    // Try the proper builder; if it throws or yields nothing, fall back to a
    // simple build that just shuffles whatever tiers exist. This guarantees
    // the game NEVER ends up with an empty question set, regardless of which
    // version of questions.js is deployed.
    try {
      buildQuestionSet(mode);
    } catch (e) {
      console.warn('buildQuestionSet threw, using fallback:', e);
      QUESTIONS = [];
    }
    if (!Array.isArray(QUESTIONS) || QUESTIONS.length === 0) {
      this.fallbackBuildQuestions();
    }
    initAudio();
    playSound('start');
    document.getElementById('welcome').classList.remove('active');
    document.getElementById('game').classList.add('active');
    this.renderLadder();
    this.loadQuestion();
  },

  /**
   * Last-resort question-set builder. Works with any version of questions.js
   * by reading whatever tiers exist on QUESTION_POOL and shuffling 15 from them.
   * Prioritizes glossary -> poem -> hikaya -> easy -> medium -> hard if present.
   */
  fallbackBuildQuestions() {
    if (typeof QUESTION_POOL === 'undefined') {
      console.error('QUESTION_POOL is not defined - questions.js failed to load');
      QUESTIONS = [];
      return;
    }
    const order = ['glossary', 'poem', 'hikaya', 'easy', 'medium', 'hard'];
    // Collect everything available, in tier order
    const all = [];
    for (const k of order) {
      if (Array.isArray(QUESTION_POOL[k])) all.push(...QUESTION_POOL[k]);
    }
    // Plus any tiers I forgot to list
    for (const k of Object.keys(QUESTION_POOL)) {
      if (!order.includes(k) && Array.isArray(QUESTION_POOL[k])) {
        all.push(...QUESTION_POOL[k]);
      }
    }
    // Shuffle and take 15
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    QUESTIONS = all.slice(0, 15);
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

    // Stop any speech still going from a previous question
    if (typeof stopSpeaking === 'function') stopSpeaking();

    const q = QUESTIONS[this.currentLevel];
    if (!q || !q.question || !Array.isArray(q.answers)) {
      // This should never happen, but make it visible if it does
      document.getElementById('question-box').textContent =
        '⚠️ Question failed to load. Please reload the page (Cmd+Shift+R). ' +
        'If this persists, questions.js may be out of date on the server.';
      document.getElementById('answers').innerHTML = '';
      console.error('Missing or malformed question at index', this.currentLevel, q);
      return;
    }
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

    // Question 2 is always a poem. Read the poem aloud with a contemplative
    // voice. The poem sits between blank lines in q.question; we extract the
    // longest such block, strip line/em-dash breaks, and feed it to TTS.
    if (this.currentLevel === 1) {
      const blocks = q.question.split(/\n\s*\n/);
      // Pick the block that looks most like a poem - one with line breaks
      let poemBlock = blocks
        .filter(b => b.includes('\n'))
        .sort((a, b) => b.length - a.length)[0];
      if (!poemBlock) poemBlock = blocks.sort((a, b) => b.length - a.length)[0] || q.question;
      // Clean for speech: remove leading quotes/spaces, collapse whitespace,
      // turn slashes (line breaks within a verse) into pauses, dedupe punctuation
      const toRead = poemBlock
        .replace(/^[\s'"]+|[\s'"]+$/g, '')
        .replace(/\s*\/\s*/g, ', ')
        .replace(/\s+/g, ' ')
        .replace(/,\s*,/g, ',')
        .replace(/\.\s*,/g, '.')
        .trim();
      if (typeof speakPoem === 'function') {
        setTimeout(() => speakPoem(toRead), 700);
      }
    }
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
     Real students from AHUM UN1399 (Spring 2026). Each classmate has:
     - style: voice/personality, used to flavor their answer
     - accuracy: probability (0-1) they give the CORRECT answer when called.
       The rest of the time they give an incorrect one but still confidently!
       Player must learn over time who to trust. The accuracy field is never
       shown to the player - they have to read the room. */
  classmates: [
    { name: "Shehar Bano",         style: "thoughtful",    accuracy: 0.75 },
    { name: "Juliana Bryant",      style: "confident",     accuracy: 0.55 },  // confident bluffer
    { name: "Ines Caldara",        style: "scholarly",     accuracy: 0.85 },  // reliable
    { name: "Ibrahim Ibrahim",     style: "casual",        accuracy: 0.40 },  // big bluffer
    { name: "Michael Ishak",       style: "analytical",    accuracy: 0.80 },
    { name: "Shunammite Jiwanmall",style: "warm",          accuracy: 0.65 },
    { name: "Nafeesa Mahmood",     style: "precise",       accuracy: 0.85 },  // reliable
    { name: "Pranav Manoj",        style: "philosophical", accuracy: 0.70 },
    { name: "Lucy Markow",         style: "witty",         accuracy: 0.50 },  // 50/50 - reads syllabus but distracted
    { name: "Jason McCord",        style: "humble",        accuracy: 0.75 },  // second-guesser, usually right
    { name: "Narges Noorbakhsh",   style: "poetic",        accuracy: 0.65 },
    { name: "Lynsey Overturf",     style: "decisive",      accuracy: 0.60 },  // decisive but not always right
    { name: "Andrea Riccelli",     style: "dramatic",      accuracy: 0.45 },  // dramatic bluffer
    { name: "Yuval Shemla",        style: "calm",          accuracy: 0.75 },
    { name: "Luke Suess",          style: "energetic",     accuracy: 0.50 },  // enthusiasm != accuracy
    { name: "Nina Wang",           style: "meticulous",    accuracy: 0.90 }   // most reliable - flashcards work
  ],

  /* Stash for the multi-step phone lifeline */
  phonePending: null,

  /**
   * Build the classmate's ANSWER. Each classmate has an `accuracy` (probability
   * of giving the correct answer). When wrong, they pick a plausible-looking
   * wrong answer (one of the visible non-correct options). They always sound
   * confident - no hints, no hedging, no "but I'm not sure". The player must
   * decide who they trust based on this answer alone. This is a real bluff:
   * even Lucy Markow can be wrong; even Ibrahim might be right by accident.
   */
  buildPhoneAnswer(classmate, q) {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const correctIndex = q.correct;

    // Roll the dice: do they get it right?
    const isCorrect = Math.random() < classmate.accuracy;

    let chosenIndex;
    if (isCorrect) {
      chosenIndex = correctIndex;
    } else {
      // Pick a wrong option (preferably one not eliminated by 50:50)
      const wrongOptions = q.answers
        .map((_, i) => i)
        .filter(i => i !== correctIndex && !this.hiddenAnswers.includes(i));
      // Fallback to any wrong if all visible-wrong are gone
      const pool = wrongOptions.length > 0
        ? wrongOptions
        : q.answers.map((_, i) => i).filter(i => i !== correctIndex);
      chosenIndex = pool[Math.floor(Math.random() * pool.length)];
    }

    const chosenLetter = letters[chosenIndex];
    const chosenText = q.answers[chosenIndex];
    return this.phrasePhoneAnswer(classmate, chosenLetter, chosenText);
  },

  /**
   * Phrase the answer in the classmate's personal voice. They ALWAYS sound
   * confident - that's the point of the bluff. Whether they're right or
   * wrong, you can't tell from how they say it.
   */
  phrasePhoneAnswer(classmate, letter, text) {
    // Truncate very long answer text for display
    const shortText = text.length > 70 ? text.substring(0, 67) + '...' : text;

    const phrasings = {
      thoughtful: [
        `Hmm, let me think... yes, it's ${letter}. "${shortText}". I'm sure of it.`,
        `Give me a second... okay, the answer is ${letter}. Lock it in.`,
        `I remember this from the reading. It's ${letter}. Definitely.`
      ],
      confident: [
        `That's ${letter}. Easy. Lock it in.`,
        `${letter}. 100%. Move on.`,
        `Trust me, it's ${letter}. No question.`
      ],
      scholarly: [
        `According to the readings, the answer is ${letter}.`,
        `Based on my notes, it's ${letter}. I have it underlined.`,
        `From the glossary, definitely ${letter}.`
      ],
      casual: [
        `Oh that one? Yeah it's ${letter}, no worries.`,
        `Bro, it's ${letter}. You got this.`,
        `Easy, it's ${letter}. Trust me.`
      ],
      analytical: [
        `By process of elimination, the answer is ${letter}.`,
        `Logically the answer is ${letter}. The other options don't hold up.`,
        `Cross-referencing the source — it's ${letter}.`
      ],
      warm: [
        `Oh sweetie, the answer is ${letter}! You've got this!`,
        `Don't worry honey, it's ${letter}. I believe in you!`,
        `${letter}, dear. I'm certain.`
      ],
      precise: [
        `The answer is ${letter}. I have it underlined in my notes.`,
        `Exactly ${letter}. Page reference and everything.`,
        `${letter}. Verbatim from the text.`
      ],
      philosophical: [
        `Ah, this question reaches the essence of the matter. The answer is ${letter}.`,
        `In the spirit of the text itself, ${letter} is the truth.`,
        `${letter}. The deeper meaning points there.`
      ],
      witty: [
        `Oh, did Sarah Bin Tyeer write this one? It's ${letter}. Obviously.`,
        `${letter}. I'd bet my participation grade on it.`,
        `${letter}. Did you even do the reading? Just kidding. Mostly.`
      ],
      humble: [
        `I think... I mean I'm pretty sure... it's ${letter}. Yeah, go with that.`,
        `Don't quote me but I'm fairly confident it's ${letter}.`,
        `${letter}. Probably. I mean, definitely. Go with ${letter}.`
      ],
      poetic: [
        `As the Persian masters would say — the answer is ${letter}.`,
        `${letter}. Like a hoopoe, the answer flies straight to me.`,
        `The wind whispers ${letter}. Trust it.`
      ],
      decisive: [
        `${letter}. Done. Next question.`,
        `It's ${letter}. Don't overthink it.`,
        `${letter}. Lock it in. Move on.`
      ],
      dramatic: [
        `Ladies and gentlemen of the jury — the answer is ${letter}!`,
        `Without a shadow of a doubt: ${letter}. I rest my case.`,
        `${letter}! Mark my words!`
      ],
      calm: [
        `Yes, the answer is ${letter}. Take a breath. You're fine.`,
        `${letter}. Stay calm, lock it in.`,
        `Easy, it's ${letter}. No need to second-guess.`
      ],
      energetic: [
        `OH I KNOW THIS ONE!! It's ${letter}!! GO!!`,
        `Yes! ${letter}! I just covered this in my study group!`,
        `${letter}!! I'M SURE!! GO GO GO!`
      ],
      meticulous: [
        `Hold on, checking my flashcards... yes, ${letter}. Confirmed.`,
        `Per my notes from week three, the answer is ${letter}.`,
        `${letter}. Per flashcard #47. Verified.`
      ]
    };

    const pool = phrasings[classmate.style] || phrasings.confident;
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

    // Render the picker modal - clean, just names
    const pickerEl = document.getElementById('phone-picker');
    pickerEl.innerHTML =
      `<div class="phone-picker-prompt">Choose someone to call:</div>` +
      candidates.map((c, i) =>
        `<button class="phone-candidate" onclick="game.callClassmate(${i})">` +
          `<div class="phone-candidate-name">${c.name}</div>` +
        `</button>`
      ).join('');
    document.getElementById('modal-phone-picker').classList.add('active');
    playSound('lifeline');
  },

  /**
   * STEP 2: user picked a classmate. Show "calling..." animation first,
   * then their hint after a short delay (simulates the call connecting).
   */
  callClassmate(index) {
    if (!this.phonePending) return;
    const classmate = this.phonePending[index];
    this.phonePending = null;
    this.lifelines.phone = false;
    document.getElementById('ll-phone').classList.add('used');
    this.closeModal('modal-phone-picker');

    // Stage 2a: ringing screen
    const phoneEl = document.getElementById('phone-text');
    phoneEl.innerHTML =
      `<div class="phone-ringing">` +
        `<div class="phone-ring-icon">📞</div>` +
        `<div class="phone-ring-status">Calling ${classmate.name}<span class="phone-dots"><span>.</span><span>.</span><span>.</span></span></div>` +
      `</div>`;
    document.getElementById('modal-phone').classList.add('active');
    // Hide the CONTINUE button while ringing
    const continueBtn = document.querySelector('#modal-phone .btn');
    if (continueBtn) continueBtn.style.display = 'none';
    playSound('phoneRing');

    // Stage 2b: after 2.4s, show the classmate's answer
    setTimeout(() => {
      const q = QUESTIONS[this.currentLevel];
      const answerText = this.buildPhoneAnswer(classmate, q);
      phoneEl.innerHTML =
        `<div class="phone-caller">📞 ${classmate.name}:</div>` +
        `<div class="phone-reply">"Hi Eren! ${answerText}"</div>`;
      if (continueBtn) continueBtn.style.display = '';
      playSound('select');
    }, 2400);
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
    if (!this.soundOn) {
      if (typeof stopThinking === 'function') stopThinking();
      if (typeof stopSpeaking === 'function') stopSpeaking();
    }
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
