/* =====================================================================
   QUESTIONS, PRIZES & SHARED UTILITIES
   =====================================================================

   To add a new question, simply append an object to the relevant tier
   in QUESTION_POOL. Each game randomly picks 5 from each tier
   (5 easy + 5 medium + 5 hard = 15 total) so every play is unique.

   Question format:
     {
       question: "Question text",
       answers:  ["A", "B", "C", "D"],
       correct:  0   // 0=A, 1=B, 2=C, 3=D
     }
   ===================================================================== */

const QUESTION_POOL = {
  easy: [
    { question: "Over how many years was the Qur'an revealed to the Prophet Muhammad (pbuh)?", answers: ["10 years", "15 years", "23 years", "30 years"], correct: 2 },
    { question: "What is the Arabic term for the doctrine that the Qur'an cannot be imitated due to its divine nature?", answers: ["Fiṭra", "Iʿjāz", "Murūʾa", "ʿAṣabiyyah"], correct: 1 },
    { question: "What does the term 'adab' most closely compare to in the Greek tradition?", answers: ["Logos", "Paideia", "Techne", "Polis"], correct: 1 },
    { question: "What is the meaning of 'fanāʾ' in Sufi terminology?", answers: ["Subsistence in God", "Annihilation of the ego", "Unity of Being", "Group solidarity"], correct: 1 },
    { question: "Through which angel was the Qur'an revealed to the Prophet Muhammad (pbuh)?", answers: ["Michael", "Raphael", "Israfil", "Gabriel"], correct: 3 },
    { question: "What does 'baqāʾ' mean in Sufi terminology?", answers: ["Annihilation of the self", "Subsistence in God", "Spiritual journey", "Divine love"], correct: 1 },
    { question: "The Zanj Rebellion (869–883 CE) lasted approximately how many years?", answers: ["5 years", "10 years", "15 years", "20 years"], correct: 2 },
    { question: "What is the term for attending parties without an invitation in medieval Islamic culture?", answers: ["Ẓarf", "Taṭfīl", "Murūʾa", "Adab"], correct: 1 },
    { question: "What does 'mathal' mean?", answers: ["A type of poetry", "An exemplum or parable", "A legal ruling", "A historical chronicle"], correct: 1 },
    { question: "Ibn Khaldūn's concept of 'ʿaṣabiyyah' refers to what?", answers: ["Religious piety", "Artistic refinement", "Group solidarity and social cohesion", "Military strategy"], correct: 2 },
  ],
  medium: [
    { question: "According to the glossary, what distinguishes a 'qiṣṣa' from a 'ḥikāya'?", answers: ["Qiṣṣa is always fictional while ḥikāya is factual", "Qiṣṣa implies tracing a coherent, complex narrative while ḥikāya implies shorter oral telling", "Qiṣṣa is only used for Qur'anic stories while ḥikāya is only for the Nights", "Qiṣṣa is written prose while ḥikāya is always poetry"], correct: 1 },
    { question: "What was the political consequence of the Shuʿūbiyya movement for the Abbasid empire?", answers: ["It led to the collapse of the Abbasids", "The Abbasids fostered a more diverse, cosmopolitan, and inclusive empire", "The Abbasids adopted Persian as the official language", "It caused the permanent separation of Arab and Persian territories"], correct: 1 },
    { question: "How does the glossary distinguish 'fiṭra' from 'human nature'?", answers: ["Fiṭra refers to the body while human nature refers to the mind", "Fiṭra is the uncorrupted pure divine soul, while human nature is a constructed shell shaped by external factors", "They are identical concepts with different etymologies", "Fiṭra applies only to prophets while human nature applies to everyone"], correct: 1 },
    { question: "Why does the glossary describe the Qur'an's inimitability (iʿjāz) as a 'paradigm shift'?", answers: ["Because it introduced a new alphabet to Arabic", "Because it broke existing genres, being neither prose nor poetry yet containing elements of both, and transformed culture", "Because it was the first text written in Arabic", "Because it replaced all previous religious texts"], correct: 1 },
    { question: "According to the glossary, what is the relationship between adab and ẓarf?", answers: ["They are opposites", "Ẓarf is a prerequisite for adab", "One who has adab also has ẓarf; ẓarf is refinement of both mind and appearance", "Adab is intellectual while ẓarf is purely physical"], correct: 2 },
    { question: "What does Ibn al-Muqaffaʿ mean by 'shuʿūb al-ḥadīth' (avenues of discourse)?", answers: ["The different dialects of Arabic", "The idea that engaging with literature and allegory together generates new ideas and social harmony", "The branches of Islamic jurisprudence", "The trade routes that spread stories across the empire"], correct: 1 },
    { question: "According to the glossary, what happened to the concept of 'adab' after colonization?", answers: ["It was expanded to include Western literature", "It was reduced to mean only 'good manners' or 'literature as fiction,' losing its cultural gravitas", "It was banned by colonial authorities", "It was preserved unchanged in all Islamic cultures"], correct: 1 },
    { question: "In what way is 'murūʾa' described as gender-neutral in premodern sources?", answers: ["It applied only to women warriors", "It referred to the culmination of all human virtues regardless of gender, though modern readings often restrict it to males", "It was a legal category applying equally to men and women", "It described virtues specific to children"], correct: 1 },
    { question: "According to the glossary, what is the relationship between fanāʾ and baqāʾ?", answers: ["They are unrelated concepts from different traditions", "Fanāʾ (annihilation of the ego) precedes baqāʾ (subsistence in God); one must be annihilated before subsisting through the Divine", "Baqāʾ must come first to enable fanāʾ", "They are two names for the same experience"], correct: 1 },
    { question: "Why does the glossary argue that Ibn ʿArabī's waḥdat al-wujūd is not pantheism?", answers: ["Because he believed in multiple gods", "Because he sees only ONE Real (God) with everything else pointing back to God, rather than equating creation with God", "Because he rejected the concept of God entirely", "Because he limited God's existence to heaven only"], correct: 1 },
  ],
  hard: [
    { question: "According to the glossary, what does Ibn Khaldūn identify as the primary threat to ʿaṣabiyyah?", answers: ["Religious diversity", "Ethnic plurality", "Tyranny", "Foreign invasion"], correct: 2 },
    { question: "The glossary notes that poets like Ibn al-Rūmī and al-Maʿarrī expressed sympathy for the Zanj Rebellion in what manner?", answers: ["Through direct political manifestos", "Through subtle allegorical images to avoid the wrath of authorities", "By joining the rebellion as soldiers", "By writing legal treatises against slavery"], correct: 1 },
    { question: "According to the glossary, Ibn Khaldūn sets what approximate expiry date for empires/polities?", answers: ["50 years", "80 years", "120 years", "200 years"], correct: 2 },
    { question: "The glossary's definition of 'fiṭra' draws a distinction between what two elements of the human person?", answers: ["Body and mind", "The pure divine soul and the acquired human nature/behavior (self/shell)", "Reason and emotion", "Individual will and divine predestination"], correct: 1 },
    { question: "In the glossary's discussion of murūʾa, which of the following is listed as a quality that taints one's murūʾa?", answers: ["Generosity", "Courage", "Harassing women", "Intelligence"], correct: 2 },
    { question: "The Shuʿūbī Persians called Arabs 'people of tribes' to imply what?", answers: ["That Arabs were more democratic", "That Arabs were less civilized than Persians, who called themselves 'people of nations'", "That Arabs had stronger military traditions", "That Arabs were more religiously devout"], correct: 1 },
    { question: "The glossary compares ẓarf to which European cultural figure?", answers: ["The Renaissance man", "The Romantic-period dandy", "The Enlightenment philosophe", "The Victorian gentleman"], correct: 1 },
    { question: "According to the glossary, the verb root q.ṣ.ṣ (qiṣṣa) originally refers to what activity?", answers: ["Reciting poetry aloud", "Tracing tracks in the desert", "Writing on parchment", "Memorizing sacred texts"], correct: 1 },
    { question: "The glossary uses which literary example to illustrate the concept of fanāʾ and baqāʾ?", answers: ["The journey of Sindbad", "Shahrazad's storytelling in the Nights", "The birds being absorbed into the Simorgh in The Conference of the Birds", "Joseph's dream interpretation in the Qur'an"], correct: 2 },
    { question: "According to the glossary, George Sand is mentioned in the discussion of ẓarf to illustrate what point?", answers: ["That ẓarf was exclusively a male concept", "That some dandies used appearance to subvert gender norms, showing ẓarf's broader cultural resonance", "That European literature influenced Islamic concepts of refinement", "That ẓarf declined after the medieval period"], correct: 1 },
  ]
};

const PRIZES = [
  100, 200, 500, 1000, 2000,
  3000, 5000, 7500, 15000, 30000,
  60000, 125000, 250000, 500000, 1000000
];

const SAFE_LEVELS = [4, 9]; // 5th and 10th questions are safe milestones
const CURRENCY = '$';

/* The active 15-question set for the current game (rebuilt at every start). */
let QUESTIONS = [];

function buildQuestionSet() {
  const easy = pickN(QUESTION_POOL.easy, 5);
  const medium = pickN(QUESTION_POOL.medium, 5);
  const hard = pickN(QUESTION_POOL.hard, 5);
  QUESTIONS = [...easy, ...medium, ...hard];
}

function pickN(arr, n) {
  const copy = arr.slice();
  shuffle(copy);
  return copy.slice(0, n);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatMoney(amount) {
  return CURRENCY + amount.toLocaleString('en-US');
}
