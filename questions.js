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
    { question: "What is the capital of France?",
      answers: ["London", "Berlin", "Paris", "Madrid"], correct: 2 },
    { question: "How many months are there in a year?",
      answers: ["10", "11", "12", "13"], correct: 2 },
    { question: "Which of the following is NOT a planet?",
      answers: ["Mars", "Venus", "The Moon", "Saturn"], correct: 2 },
    { question: "Who painted the Mona Lisa?",
      answers: ["Pablo Picasso", "Leonardo da Vinci", "Vincent van Gogh", "Michelangelo"], correct: 1 },
    { question: "How many days are there in a week?",
      answers: ["5", "6", "7", "8"], correct: 2 },
    { question: "In which direction does the sun rise?",
      answers: ["West", "North", "East", "South"], correct: 2 },
    { question: "How many players from one team are on a soccer field at a time?",
      answers: ["9", "10", "11", "12"], correct: 2 },
    { question: "At what temperature does water freeze (in Celsius)?",
      answers: ["-10 °C", "0 °C", "5 °C", "10 °C"], correct: 1 },
    { question: "How many minutes are in an hour?",
      answers: ["30", "45", "60", "100"], correct: 2 },
    { question: "Which of these is NOT a continent?",
      answers: ["Europe", "Asia", "Pacific", "Africa"], correct: 2 },
    { question: "How many seasons are there in a year?",
      answers: ["2", "3", "4", "5"], correct: 2 },
    { question: "Which color of a traffic light means \"go\"?",
      answers: ["Red", "Yellow", "Green", "Blue"], correct: 2 },
    { question: "Which of the following is a fruit?",
      answers: ["Potato", "Carrot", "Tomato", "Onion"], correct: 2 },
    { question: "How many hours are there in one day?",
      answers: ["12", "18", "24", "36"], correct: 2 },
    { question: "What is the largest ocean on Earth?",
      answers: ["Atlantic", "Indian", "Pacific", "Arctic"], correct: 2 },
    { question: "How many legs does a spider have?",
      answers: ["6", "8", "10", "12"], correct: 1 },
    { question: "What is the official currency of the United States?",
      answers: ["Pound", "Euro", "Dollar", "Yen"], correct: 2 },
    { question: "Which animal is known as the \"King of the Jungle\"?",
      answers: ["Tiger", "Lion", "Elephant", "Bear"], correct: 1 },
    { question: "How many primary colors are there?",
      answers: ["2", "3", "4", "5"], correct: 1 },
    { question: "What color do you get by mixing blue and yellow?",
      answers: ["Purple", "Orange", "Green", "Brown"], correct: 2 }
  ],

  medium: [
    { question: "The mathematical constant Pi (π) is approximately equal to:",
      answers: ["2.71", "3.14", "1.41", "1.61"], correct: 1 },
    { question: "Who wrote the novel \"Crime and Punishment\"?",
      answers: ["Leo Tolstoy", "Anton Chekhov", "Fyodor Dostoevsky", "Alexander Pushkin"], correct: 2 },
    { question: "Which element does the symbol \"Au\" represent on the periodic table?",
      answers: ["Silver", "Gold", "Copper", "Aluminum"], correct: 1 },
    { question: "What is the longest bone in the human body?",
      answers: ["Tibia", "Femur", "Humerus", "Radius"], correct: 1 },
    { question: "Who wrote \"The Lord of the Rings\" trilogy?",
      answers: ["C. S. Lewis", "George R. R. Martin", "J. R. R. Tolkien", "J. K. Rowling"], correct: 2 },
    { question: "Which is the lightest element on the periodic table?",
      answers: ["Helium", "Oxygen", "Hydrogen", "Carbon"], correct: 2 },
    { question: "In which city is the Eiffel Tower located?",
      answers: ["London", "Rome", "Paris", "Berlin"], correct: 2 },
    { question: "Which is generally considered the longest river in the world?",
      answers: ["Amazon", "Yangtze", "Nile", "Mississippi"], correct: 2 },
    { question: "Which planet is known as the \"Red Planet\"?",
      answers: ["Venus", "Mars", "Jupiter", "Mercury"], correct: 1 },
    { question: "What is the chemical formula for water?",
      answers: ["H₂O", "CO₂", "O₂", "NaCl"], correct: 0 },
    { question: "How many rings are on the Olympic flag?",
      answers: ["3", "4", "5", "6"], correct: 2 },
    { question: "In which year did World War II end?",
      answers: ["1939", "1942", "1945", "1948"], correct: 2 },
    { question: "Who discovered the double-helix structure of DNA?",
      answers: ["Einstein and Bohr", "Watson and Crick", "Mendel and Darwin", "Pasteur and Curie"], correct: 1 },
    { question: "Which metal is liquid at room temperature?",
      answers: ["Iron", "Mercury", "Lead", "Tin"], correct: 1 },
    { question: "In which museum is the Mona Lisa displayed?",
      answers: ["British Museum", "Prado", "Louvre", "Uffizi"], correct: 2 },
    { question: "In which country was Beethoven born?",
      answers: ["Austria", "Germany", "Italy", "Poland"], correct: 1 },
    { question: "Which is the largest planet in our solar system?",
      answers: ["Saturn", "Neptune", "Jupiter", "Uranus"], correct: 2 },
    { question: "Which of the following is NOT a programming language?",
      answers: ["Python", "Java", "HTML", "Ruby"], correct: 2 },
    { question: "Which element is most abundant in the human body by mass?",
      answers: ["Carbon", "Hydrogen", "Oxygen", "Nitrogen"], correct: 2 },
    { question: "In which city is the Statue of Liberty located?",
      answers: ["Washington, D.C.", "Los Angeles", "New York", "Boston"], correct: 2 }
  ],

  hard: [
    { question: "In which year did Constantinople fall to the Ottoman Empire?",
      answers: ["1450", "1451", "1453", "1455"], correct: 2 },
    { question: "Which philosopher is famous for the quote \"Cogito, ergo sum\" (I think, therefore I am)?",
      answers: ["Socrates", "Plato", "Aristotle", "René Descartes"], correct: 3 },
    { question: "In which year did the Berlin Wall fall?",
      answers: ["1985", "1989", "1991", "1995"], correct: 1 },
    { question: "Who wrote the novel \"Don Quixote\"?",
      answers: ["Miguel de Cervantes", "Federico García Lorca", "Gabriel García Márquez", "Jorge Luis Borges"], correct: 0 },
    { question: "Which two elements did Marie Curie discover?",
      answers: ["Radium and Polonium", "Uranium and Thorium", "Cesium and Rubidium", "Actinium and Francium"], correct: 0 },
    { question: "Which particles are found in the nucleus of an atom?",
      answers: ["Only protons", "Protons and electrons", "Protons and neutrons", "Neutrons and electrons"], correct: 2 },
    { question: "Who is widely regarded as the world's first computer programmer?",
      answers: ["Alan Turing", "Grace Hopper", "Ada Lovelace", "Margaret Hamilton"], correct: 2 },
    { question: "In Einstein's famous formula E=mc², what does \"c\" represent?",
      answers: ["Gravitational constant", "Speed of light", "Mass constant", "Speed of sound"], correct: 1 },
    { question: "Who wrote the novel \"Les Misérables\"?",
      answers: ["Émile Zola", "Honoré de Balzac", "Victor Hugo", "Alexandre Dumas"], correct: 2 },
    { question: "In which year was the existence of the Higgs boson officially confirmed at CERN?",
      answers: ["2008", "2010", "2012", "2015"], correct: 2 },
    { question: "In which year was the Roman Empire formally divided into Eastern and Western halves?",
      answers: ["AD 285", "AD 313", "AD 395", "AD 476"], correct: 2 },
    { question: "Who wrote the philosophical work \"The Republic\"?",
      answers: ["Aristotle", "Plato", "Socrates", "Epicurus"], correct: 1 },
    { question: "Who is regarded as the father of quantum theory?",
      answers: ["Albert Einstein", "Niels Bohr", "Max Planck", "Werner Heisenberg"], correct: 2 },
    { question: "What is the smallest prime number?",
      answers: ["0", "1", "2", "3"], correct: 2 },
    { question: "Who wrote \"The Brothers Karamazov\"?",
      answers: ["Leo Tolstoy", "Anton Chekhov", "Fyodor Dostoevsky", "Maxim Gorky"], correct: 2 },
    { question: "How many elements are officially recognized in the periodic table?",
      answers: ["108", "112", "118", "124"], correct: 2 },
    { question: "In which year did Vincent van Gogh famously cut off part of his ear?",
      answers: ["1885", "1888", "1890", "1892"], correct: 1 },
    { question: "In which year were the first Nobel Prizes awarded?",
      answers: ["1895", "1901", "1910", "1920"], correct: 1 },
    { question: "Approximately what is the speed of light in a vacuum?",
      answers: ["150,000 km/s", "200,000 km/s", "300,000 km/s", "500,000 km/s"], correct: 2 },
    { question: "Which novel by George Orwell features the slogan \"Big Brother is watching you\"?",
      answers: ["Animal Farm", "1984", "Brave New World", "Fahrenheit 451"], correct: 1 }
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
