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
       correct:  0,          // 0=A, 1=B, 2=C, 3=D
       source:   "optional" // shown under the question when the page has #question-source
     }
   ===================================================================== */

const QUESTION_POOL = {
  easy: [
    // === GLOSSARY ===
    { question: "Over how many years was the Qur'an revealed to the Prophet Muhammad (pbuh)?", answers: ["10 years", "15 years", "23 years", "30 years"], correct: 2, source: "Course glossary / syllabus" },
    { question: "What is the Arabic term for the doctrine that the Qur'an cannot be imitated due to its divine nature?", answers: ["Fiṭra", "Iʿjāz", "Murūʾa", "ʿAṣabiyyah"], correct: 1 },
    { question: "What does the term 'adab' most closely compare to in the Greek tradition?", answers: ["Logos", "Paideia", "Techne", "Polis"], correct: 1 },
    { question: "What is the meaning of 'fanāʾ' in Sufi terminology?", answers: ["Subsistence in God", "Annihilation of the ego", "Unity of Being", "Group solidarity"], correct: 1 },
    { question: "Through which angel was the Qur'an revealed to the Prophet Muhammad (pbuh)?", answers: ["Michael", "Raphael", "Israfil", "Gabriel"], correct: 3 },
    { question: "What does 'baqāʾ' mean in Sufi terminology?", answers: ["Annihilation of the self", "Subsistence in God", "Spiritual journey", "Divine love"], correct: 1 },
    { question: "The Zanj Rebellion (869–883 CE) lasted approximately how many years?", answers: ["5 years", "10 years", "15 years", "20 years"], correct: 2 },
    { question: "What is the term for attending parties without an invitation in medieval Islamic culture?", answers: ["Ẓarf", "Taṭfīl", "Murūʾa", "Adab"], correct: 1 },
    { question: "What does 'mathal' mean?", answers: ["A type of poetry", "An exemplum or parable", "A legal ruling", "A historical chronicle"], correct: 1 },
    { question: "Ibn Khaldūn's concept of 'ʿaṣabiyyah' refers to what?", answers: ["Religious piety", "Artistic refinement", "Group solidarity and social cohesion", "Military strategy"], correct: 2 },
    { question: "What is the term 'ḥikāya' associated with?", answers: ["Writing philosophical treatises", "Telling a tale orally with some performance", "Composing mystical poetry", "Interpreting dreams"], correct: 1 },
    { question: "The Shuʿūbiyya was a cultural conflict primarily between which two groups?", answers: ["Arabs and Turks", "Arabs and Persians", "Persians and Byzantines", "Arabs and Berbers"], correct: 1 },

    // === QUR'AN (Suras 1 & 12) ===
    { question: "How many verses does Sura Al-Fatihah (The Opening) contain?", answers: ["5", "6", "7", "10"], correct: 2 },
    { question: "In the Qur'an, Sura 12 tells the story of which prophet?", answers: ["Moses", "Abraham", "Joseph", "Noah"], correct: 2 },
    { question: "In the story of Joseph, how many stars did he dream about?", answers: ["Seven", "Nine", "Eleven", "Twelve"], correct: 2 },
    { question: "What did Joseph's brothers do with him after taking him away from their father?", answers: ["Sold him to merchants immediately", "Threw him into a well", "Left him in the desert", "Took him to Egypt"], correct: 1 },
    { question: "Who bought Joseph in Egypt?", answers: ["The king himself", "A merchant from Baghdad", "An Egyptian official (governor/al-Aziz)", "A priest of the temple"], correct: 2 },
    { question: "What did Joseph's brothers bring back to their father as false evidence?", answers: ["A broken sandal", "A torn robe", "His shirt stained with fake blood", "A lock of his hair"], correct: 2 },
    { question: "In Sura 12, what does Joseph ask to be put in charge of?", answers: ["The army", "The nation's storehouses", "The king's palace", "The judicial courts"], correct: 1 },
    { question: "What does Al-Fatihah ask God for in its final verses?", answers: ["Forgiveness of sins", "Guidance to the straight path", "Protection from enemies", "Wealth and prosperity"], correct: 1 },

    // === 1001 NIGHTS ===
    { question: "Who is the storyteller in One Thousand and One Nights?", answers: ["Dunyazad", "Shahrazad", "The vizier's wife", "The queen"], correct: 1 },
    { question: "What is the name of Shahrazad's younger sister?", answers: ["Fatima", "Dunyazad", "Zubayda", "Maryam"], correct: 1 },
    { question: "Why does King Shahriyar begin killing his brides?", answers: ["A prophecy told him to", "He discovered his wife's infidelity", "He was cursed by a jinni", "His vizier advised him"], correct: 1 },
    { question: "What is the name of Shahrazad's father?", answers: ["The king", "The vizier", "The merchant", "The fisherman"], correct: 1 },
    { question: "In the Tale of Tawaddud, what does Tawaddud demonstrate before the Caliph?", answers: ["Her singing ability", "Her mastery of many branches of knowledge", "Her skill at weaving", "Her beauty alone"], correct: 1 },
    { question: "Which Caliph appears in the Tale of Tawaddud?", answers: ["Al-Ma'mun", "Harun al-Rashid", "Umar ibn al-Khattab", "Al-Mutawakkil"], correct: 1 },
    { question: "In the frame tale, the two brother kings are named Shahriyar and who?", answers: ["Shahzaman", "Shahryar", "Sindbad", "Masud"], correct: 0 },
    { question: "What creature emerges from the sea in the frame tale of the Nights?", answers: ["A whale", "A serpent", "A jinni", "A dragon"], correct: 2 },

    // === KALILA WA-DIMNA ===
    { question: "Who is credited with translating Kalila wa-Dimna into Arabic?", answers: ["Al-Jahiz", "Ibn al-Muqaffaʿ", "Al-Farabi", "Ibn Rushd"], correct: 1 },
    { question: "Kalila wa-Dimna is originally derived from which tradition?", answers: ["Greek", "Persian/Indian (Panchatantra)", "Chinese", "Egyptian"], correct: 1 },
    { question: "What type of characters primarily populate the fables of Kalila wa-Dimna?", answers: ["Kings and queens", "Animals", "Angels and demons", "Merchants and sailors"], correct: 1 },

    // === IKHWAN AL-SAFA ===
    { question: "The Case of the Animals versus Man takes the form of what?", answers: ["A legal trial before the King of the Jinn", "A war between humans and animals", "A philosophical dialogue between two scholars", "A mystical vision"], correct: 0 },
    { question: "Who wrote The Case of the Animals versus Man?", answers: ["Ibn al-Muqaffaʿ", "The Ikhwān al-Ṣafāʾ (Brethren of Purity)", "Al-Farabi", "Ibn Khaldun"], correct: 1 },

    // === IBN TUFAYL ===
    { question: "What is the name of the protagonist in Ibn Ṭufayl's philosophical tale?", answers: ["Absal", "Salaman", "Hayy Ibn Yaqẓān", "Ibn Rushd"], correct: 2 },
    { question: "Where does Hayy Ibn Yaqẓān grow up?", answers: ["In a palace", "In a city", "On a deserted island", "In a monastery"], correct: 2 },

    // === CONFERENCE OF THE BIRDS ===
    { question: "Who wrote The Conference of the Birds?", answers: ["Rumi", "Farīd al-Dīn ʿAṭṭār", "Ibn ʿArabī", "Hafiz"], correct: 1 },
    { question: "What is the name of the mythical bird the birds seek in The Conference of the Birds?", answers: ["Phoenix", "Roc", "Simorgh", "Huma"], correct: 2 },
    { question: "Which bird leads the journey in The Conference of the Birds?", answers: ["The eagle", "The hoopoe", "The nightingale", "The falcon"], correct: 1 },

    // === IBN ARABI ===
    { question: "What is the title of Ibn ʿArabī's poetry collection studied in this course?", answers: ["The Bezels of Wisdom", "The Meccan Revelations", "The Translator of Desires (Tarjumān al-Ashwāq)", "The Book of Theophany"], correct: 2 },

    // === RUMI ===
    { question: "Rumi's full name includes the title Jalāl al-Dīn, which means what?", answers: ["Light of the world", "Glory of the faith", "Sword of God", "Pillar of knowledge"], correct: 1 },

    // === AL-FARABI ===
    { question: "Al-Fārābī's work studied in this course is titled what?", answers: ["The Incoherence of the Philosophers", "On the Perfect State", "The Book of Healing", "The Decisive Treatise"], correct: 1 },

    // === IBN KHALDUN ===
    { question: "What is Ibn Khaldūn's most famous work called?", answers: ["The Muqaddimah", "The Book of Optics", "The Canon of Medicine", "Kitab al-Aghani"], correct: 0 },

    // === PRINCESS FATIMA ===
    { question: "The Tale of Princess Fatima belongs to which literary genre?", answers: ["Mystical poetry", "The Arabic popular epic (sīra)", "Philosophical allegory", "Court prose (adab)"], correct: 1 },

    // === DOCTOR'S DINNER PARTY / PARTY CRASHING ===
    { question: "Who is the author of The Doctor's Dinner Party?", answers: ["Al-Khaṭīb al-Baghdādī", "Ibn Buṭlān", "Ibn al-Muqaffaʿ", "Al-Jahiz"], correct: 1 },
    { question: "Selections from The Art of Party Crashing is set in which city?", answers: ["Cairo", "Damascus", "Baghdad", "Cordoba"], correct: 2 },

    // === MORE EASY ===
    { question: "What is the title of the Qur'an's first sura?", answers: ["The Cow", "The Opening (Al-Fatihah)", "The Table", "The Light"], correct: 1 },
    { question: "In the Joseph story, what does the king dream about?", answers: ["Seven fat cows eaten by seven thin cows", "A burning bush", "A great flood", "Flying horses"], correct: 0 },
    { question: "What does Shahrazad do every night to postpone her execution?", answers: ["She sings", "She tells a story and stops at dawn on a cliffhanger", "She prays", "She escapes and returns"], correct: 1 },
    { question: "ʿAṭṭār's name means what in Persian?", answers: ["Poet", "Perfume seller/druggist", "Judge", "Warrior"], correct: 1 },
    { question: "Where was ʿAṭṭār born?", answers: ["Baghdad", "Cairo", "Neishapour (Nishapur), Iran", "Damascus"], correct: 2 },
    { question: "In the Ikhwān al-Ṣafāʾ, who judges the case between animals and humans?", answers: ["The Caliph", "The King of the Jinn", "The Prophet", "God directly"], correct: 1 },
    { question: "What does the hoopoe wear on his head in The Conference of the Birds?", answers: ["A golden crown", "Truth's crown, a feathered spray", "A helmet", "Nothing"], correct: 1 },
    { question: "What is inscribed on the hoopoe's beak in The Conference of the Birds?", answers: ["His name", "Bismillah (In the name of God)", "A map", "A prayer"], correct: 1 },
    { question: "Which prophet is the hoopoe associated with in The Conference of the Birds?", answers: ["Moses", "Jesus", "Solomon", "Abraham"], correct: 2 },
    { question: "In the Joseph story, who is Benjamin?", answers: ["Joseph's uncle", "Joseph's full brother (same mother)", "A servant", "The Egyptian king"], correct: 1 },
    { question: "The Muqaddimah is subtitled what?", answers: ["A Guide to Sufism", "An Introduction to History", "The Perfect State", "The Book of Animals"], correct: 1 },
    { question: "Rumi was originally from where before settling in Anatolia?", answers: ["Egypt", "Spain", "Balkh (present-day Afghanistan)", "Baghdad"], correct: 2 },
    { question: "What genre does the Tarjumān al-Ashwāq belong to?", answers: ["Legal treatise", "Love poetry", "Historical chronicle", "Scientific text"], correct: 1 },
    { question: "What is the Basmala?", answers: ["The call to prayer", "The formula 'In the name of God, the Merciful, the Compassionate' at the start of suras", "A type of fasting", "A pilgrimage ritual"], correct: 1 },
    { question: "In the Joseph story, who interprets the king's dream?", answers: ["The court advisors", "Joseph, from prison", "The governor's wife", "Benjamin"], correct: 1 },
    { question: "How does Jacob's sight get restored at the end of the Joseph story?", answers: ["Through medicine", "Joseph's shirt is placed over his face", "An angel heals him", "He prays and is healed instantly"], correct: 1 },
    { question: "What does the Arabic word 'sīra' refer to?", answers: ["A short lyric poem", "A popular epic or biography", "A legal contract", "A mystical prayer"], correct: 1 },
    { question: "The Brethren of Purity (Ikhwān al-Ṣafāʾ) were based in which city?", answers: ["Cairo", "Baghdad/Basra", "Damascus", "Cordoba"], correct: 1 },
    { question: "In the 1001 Nights, how does Shahriyar ultimately learn about his wife's betrayal?", answers: ["A servant tells him", "His brother Shahzaman witnesses it and eventually reveals it; Shahriyar then sees it himself", "He reads a letter", "A jinni shows him"], correct: 1 },
    { question: "What animal does the vizier's tale about the Donkey and the Ox warn about?", answers: ["The dangers of wolves", "The consequences of giving advice that backfires on the advisor", "The loyalty of dogs", "The wisdom of cats"], correct: 1 },
    { question: "What century did Ibn Khaldūn live in?", answers: ["10th century", "12th century", "14th century", "16th century"], correct: 2 },
    { question: "The 'Epistle 22' of the Ikhwān al-Ṣafāʾ is part of a larger collection called what?", answers: ["The Muqaddimah", "The Rasāʾil (Epistles) of the Brethren of Purity", "The Maqamat", "The Divan"], correct: 1 },
    { question: "In the Qur'anic Joseph story, what does Joseph say when his family finally reunites in Egypt?", answers: ["'I am the king now'", "'Welcome to Egypt: you will all be safe here, God willing'", "'You must pay for your crimes'", "'Leave me alone'"], correct: 1 },
    { question: "What is the original language of The Conference of the Birds?", answers: ["Arabic", "Turkish", "Persian", "Urdu"], correct: 2 },
  ],

  medium: [
    // === GLOSSARY ===
    { question: "According to the glossary, what distinguishes a 'qiṣṣa' from a 'ḥikāya'?", answers: ["Qiṣṣa is always fictional while ḥikāya is factual", "Qiṣṣa implies tracing a coherent, complex narrative while ḥikāya implies shorter oral telling", "Qiṣṣa is only used for Qur'anic stories while ḥikāya is only for the Nights", "They are synonyms"], correct: 1 },
    { question: "What was the political consequence of the Shuʿūbiyya movement for the Abbasid empire?", answers: ["It led to the collapse of the Abbasids", "The Abbasids fostered a more diverse, cosmopolitan, and inclusive empire", "The Abbasids adopted Persian as the official language", "It caused permanent separation of Arab and Persian territories"], correct: 1 },
    { question: "How does the glossary distinguish 'fiṭra' from 'human nature'?", answers: ["They are identical concepts", "Fiṭra is the uncorrupted pure divine soul, while human nature is a constructed shell shaped by external factors", "Fiṭra refers to the body, human nature to the mind", "Fiṭra applies only to prophets"], correct: 1 },
    { question: "What is the relationship between adab and ẓarf according to the glossary?", answers: ["They are opposites", "Ẓarf is a prerequisite for adab", "One who has adab also has ẓarf; ẓarf is refinement of both mind and appearance", "Adab is intellectual while ẓarf is purely physical"], correct: 2 },
    { question: "What does Ibn al-Muqaffaʿ mean by 'shuʿūb al-ḥadīth' (avenues of discourse)?", answers: ["The different dialects of Arabic", "Engaging with literature and allegory together generates new ideas and social harmony", "The branches of Islamic jurisprudence", "Trade routes that spread stories"], correct: 1 },
    { question: "According to the glossary, what happened to the concept of 'adab' after colonization?", answers: ["It was expanded to include Western literature", "It was reduced to mean only 'good manners' or 'literature as fiction'", "It was banned by colonial authorities", "It was preserved unchanged"], correct: 1 },
    { question: "According to the glossary, what is the relationship between fanāʾ and baqāʾ?", answers: ["They are unrelated concepts", "Fanāʾ (annihilation) precedes baqāʾ (subsistence in God)", "Baqāʾ must come first", "They are two names for the same experience"], correct: 1 },
    { question: "Why does the glossary argue that Ibn ʿArabī's waḥdat al-wujūd is not pantheism?", answers: ["Because he believed in multiple gods", "Because he sees only ONE Real (God) with everything else pointing back to God", "Because he rejected God entirely", "Because he limited God to heaven"], correct: 1 },

    // === QUR'AN ===
    { question: "In Abdel Haleem's translation, the Basmala of Sura 1 reads 'In the name of God, the Lord of Mercy, the Giver of Mercy.' How does Arberry render the same phrase?", answers: ["In the name of God, the Lord of Mercy, the Giver of Mercy", "In the Name of God, the Merciful, the Compassionate", "In the name of Allah, Most Gracious, Most Merciful", "By the name of God, Loving and Kind"], correct: 1 },
    { question: "How does Khalidi translate the Basmala compared to Arberry and Abdel Haleem?", answers: ["Identically to Arberry", "In the name of God, Merciful to all, Compassionate to each", "In the name of Allah, the Beneficent", "Identically to Abdel Haleem"], correct: 1 },
    { question: "In Sura 12, the Qur'an describes Joseph's story as what?", answers: ["The longest of stories", "The fairest/best of stories/narratives", "The saddest of tales", "The first of revelations"], correct: 1 },
    { question: "In the Joseph story, how does the governor's wife prove Joseph's beauty to the women of the city?", answers: ["She parades him through the streets", "She has him sing for them", "She invites them to a banquet and gives them knives; they cut their hands when they see him", "She shows them a portrait"], correct: 2 },
    { question: "What does Joseph request before agreeing to leave prison and meet the king?", answers: ["A pardon in writing", "That the king investigate the women who cut their hands and clear his name", "A guarantee of freedom", "Payment for his years of service"], correct: 1 },
    { question: "What is Jacob's repeated response when his sons deceive him (both about Joseph and later Benjamin)?", answers: ["He curses them", "He says 'Your souls have tempted you to some act. O seemly/sweet patience!'", "He disowns them immediately", "He sends soldiers after them"], correct: 1 },
    { question: "How does Joseph's shirt function as a motif in Sura 12?", answers: ["It appears only once", "It appears three times: stained with fake blood, torn from behind, and laid on Jacob's face to restore his sight", "It is a symbol of his wealth", "It represents his prophetic authority"], correct: 1 },
    { question: "What physical affliction does Jacob suffer from grief over Joseph?", answers: ["He goes deaf", "His hair turns white", "His eyes turn white (he loses his sight)", "He becomes paralyzed"], correct: 2 },
    { question: "In verse 12:3, the Qur'an calls the Joseph story 'aḥsan al-qaṣaṣ.' What does this phrase mean?", answers: ["The longest of tales", "The fairest/best of narratives", "The most ancient story", "The final revelation"], correct: 1 },
    { question: "How is Joseph's story in the Qur'an classified using the glossary term for narrative?", answers: ["Ḥikāya (tale)", "Mathal (parable)", "Qiṣṣa (traced/coherent story)", "Khutba (sermon)"], correct: 2 },

    // === 1001 NIGHTS ===
    { question: "What is the 'ransom frame' device in the Story of the Merchant and the Jinni?", answers: ["The merchant pays gold to save his life", "Three old men each tell a story to earn a third of the merchant's blood debt from the jinni", "The jinni demands three wishes", "The merchant's wife ransoms him"], correct: 1 },
    { question: "In the frame tale, how does Shahrazad describe her motivation for marrying Shahriyar?", answers: ["She wants to become queen", "She wants to liberate her people or die trying", "She is forced by her father", "She falls in love with the king"], correct: 1 },
    { question: "What role does Dunyazad play in Shahrazad's plan?", answers: ["She distracts the guards", "She asks Shahrazad to tell a story when the king has finished with her, triggering the nightly storytelling", "She poisons the king's food", "She writes down the stories"], correct: 1 },
    { question: "In the Tale of Tawaddud, what happens when the scholars cannot answer Tawaddud's questions?", answers: ["They are imprisoned", "They must forfeit their clothes to her", "They are banished from Baghdad", "They must pay her gold"], correct: 1 },
    { question: "How does the merchant in 'The Merchant and the Jinni' accidentally kill the jinni's son?", answers: ["By stepping on him", "By throwing date pits that struck the invisible child", "By poisoning a well", "By setting a fire"], correct: 1 },
    { question: "According to the Seale/Horta annotations, what is the significance of Shahrazad's description focusing on her intellect rather than beauty?", answers: ["It was a mistake by the scribe", "It establishes her as the first in a series of intelligent, resourceful heroines", "It reflects Muslim modesty conventions", "It was added by later editors"], correct: 1 },
    { question: "In the vizier's Tale of the Donkey and the Ox, what lesson does the donkey give the ox?", answers: ["To escape the farm", "To refuse food and pretend to be sick to avoid work", "To attack the farmer", "To accept one's fate"], correct: 1 },
    { question: "What happens to the donkey as a result of his own advice to the ox?", answers: ["He is rewarded", "He is freed", "He is put to the plow to do the ox's work instead", "Nothing changes for him"], correct: 2 },

    // === KALILA WA-DIMNA ===
    { question: "What is the broader purpose of the fables in Kalila wa-Dimna beyond entertainment?", answers: ["Military instruction", "To serve as mathals (parables) that promote discourse, reflection, and multiple levels of meaning", "Legal precedents", "Historical documentation"], correct: 1 },
    { question: "Ibn al-Muqaffaʿ's concept of 'shuʿūb al-ḥadīth' suggests that literature promotes what?", answers: ["Obedience to authority", "Intellectual reasoning and social harmony through communal discussion of meaning", "Military discipline", "Economic prosperity"], correct: 1 },

    // === IKHWAN AL-SAFA ===
    { question: "What is the central question of The Case of the Animals versus Man?", answers: ["Whether animals can speak", "Whether humans are justified in their domination and exploitation of animals", "Whether the jinn should rule the earth", "Whether vegetarianism is required by Islam"], correct: 1 },
    { question: "Which Qur'anic verse (6:38) is central to the Animals' case in the Ikhwān al-Ṣafāʾ text?", answers: ["'God is the light of the heavens and the earth'", "'There is no creature on earth or flying on wings that is not a community like you'", "'We have made you into nations and tribes so you may know one another'", "'God does not change the condition of a people until they change themselves'"], correct: 1 },
    { question: "In the Ikhwān al-Ṣafāʾ, which animal complains about being forced to carry heavy loads through dark defiles and arid plains?", answers: ["The horse", "The elephant", "The camel", "The mule"], correct: 2 },
    { question: "What do the animals argue about human claims of mercy toward them?", answers: ["They agree humans are merciful", "They present evidence of cruelty—slaughter, forced labor, chains—to disprove human claims of mercy", "They say humans are indifferent", "They praise human treatment"], correct: 1 },

    // === IBN TUFAYL ===
    { question: "What does Hayy Ibn Yaqẓān discover through unaided reason on his island?", answers: ["How to build cities", "The existence of God and philosophical truths about the universe", "How to domesticate animals", "The art of writing"], correct: 1 },
    { question: "Under which dynasty did Ibn Ṭufayl live and write?", answers: ["The Abbasids", "The Umayyads", "The Almohads", "The Fatimids"], correct: 2 },
    { question: "In Hayy Ibn Yaqẓān, what does Hayy's encounter with organized religion on a neighboring island reveal?", answers: ["That organized religion is superior to philosophy", "That the masses need symbols and laws because they cannot grasp truth directly through reason", "That philosophy is useless", "That all religions are false"], correct: 1 },

    // === CONFERENCE OF THE BIRDS ===
    { question: "How many valleys must the birds cross in The Conference of the Birds?", answers: ["Three", "Five", "Seven", "Twelve"], correct: 2 },
    { question: "What do the birds discover when they finally reach the Simorgh?", answers: ["A great king on a throne", "That the Simorgh is dead", "That they themselves are the Simorgh (si murgh = thirty birds)", "That the journey was a punishment"], correct: 2 },
    { question: "In The Conference of the Birds, what does the nightingale give as his excuse for not undertaking the journey?", answers: ["He is too old", "His love for the rose is sufficient", "He fears death", "He does not believe the Simorgh exists"], correct: 1 },

    // === IBN ARABI ===
    { question: "What is waḥdat al-wujūd (Unity of Being) as developed by Ibn ʿArabī's students?", answers: ["The belief in multiple gods", "Only God truly exists as the Real; all existence reflects the Divine", "The unity of all religions", "The material world is the only reality"], correct: 1 },

    // === AL-FARABI ===
    { question: "What does al-Fārābī describe in On the Perfect State?", answers: ["A history of the Abbasid caliphate", "An ideal political community led by a philosopher-ruler", "Military tactics for defending the state", "A mystical path to God"], correct: 1 },
    { question: "Al-Fārābī's political philosophy is most often compared to which Greek philosopher?", answers: ["Aristotle only", "Plato (the Republic)", "Heraclitus", "Epicurus"], correct: 1 },

    // === IBN KHALDUN ===
    { question: "According to Ibn Khaldūn, what causes the decline of ʿaṣabiyyah?", answers: ["Military defeats", "Luxury, selfishness, and loss of group solidarity", "Natural disasters", "Religious conversion"], correct: 1 },
    { question: "What approximate lifespan does Ibn Khaldūn assign to dynasties/empires?", answers: ["50 years", "80 years", "120 years", "200 years"], correct: 2 },

    // === PRINCESS FATIMA ===
    { question: "What makes Princess Fatima distinctive as an Arabic epic heroine?", answers: ["She is a poet", "She is a warrior woman who fights in battles", "She is a scholar of theology", "She is a merchant"], correct: 1 },

    // === PARTY CRASHING / DOCTOR'S DINNER PARTY ===
    { question: "What is the social function of taṭfīl (party crashing) according to the course materials?", answers: ["It was a criminal offense", "It offered amusement, networking, and companionship for the lonely", "It was a form of political protest", "It was restricted to the wealthy"], correct: 1 },

    // === MORE MEDIUM ===
    { question: "In the Qur'an's Joseph story, why does Joseph refuse to leave prison immediately when summoned by the king?", answers: ["He is afraid of the king", "He wants the women's case investigated first to clear his name", "He prefers prison life", "He does not trust the messenger"], correct: 1 },
    { question: "In The Conference of the Birds, the peacock's excuse for not journeying is tied to what?", answers: ["His love for the rose", "His attachment to paradise and desire to return to the Garden of Eden", "His fear of flying", "His old age"], correct: 1 },
    { question: "What literary technique does the frame tale of the 1001 Nights use to sustain the narrative?", answers: ["Flashbacks", "Embedded stories within stories (mise en abyme/Chinese box structure)", "Linear chronological narration", "Epistolary format"], correct: 1 },
    { question: "In the Ikhwān al-Ṣafāʾ, the horse complains about being forced into what?", answers: ["Carrying heavy loads of grain", "Battle, with swords in his face, lances at his chest, and arrows in his throat", "Plowing fields at night", "Racing for entertainment"], correct: 1 },
    { question: "The mule in the Ikhwān al-Ṣafāʾ cites Qur'an 43:13-14 about riding animals. What is the verse's original intent versus how the mule uses it?", answers: ["The verse commands animal abuse; the mule agrees", "The verse asks humans to recall God's grace when riding; the mule uses it to highlight human ingratitude and cruelty", "The verse forbids riding animals; the mule demands freedom", "The verse is about boats, not animals"], correct: 1 },
    { question: "What does the hoopoe's association with Solomon signify in The Conference of the Birds?", answers: ["That the hoopoe is a king", "That the hoopoe carries divine knowledge and has served a wise, prophetic ruler", "That Solomon created the Simorgh", "That the hoopoe is immortal"], correct: 1 },
    { question: "In Khalidi's translation, Sura 12:111 ends with what statement about the Qur'an's narratives?", answers: ["They are myths for entertainment", "'This is no tale being spun but a confirmation of what came before it, a clear explication of all things'", "They are historical records only", "They are prophecies of the future"], correct: 1 },
    { question: "In the vizier's tale of the Merchant and His Wife (1001 Nights), the rooster advises the merchant to do what?", answers: ["Divorce his wife", "Beat his wife with an oak branch until she stops demanding his secret", "Tell his wife the truth", "Leave the country"], correct: 1 },
    { question: "Arberry titles Sura 12 'Yusuf: Joseph' while Abdel Haleem calls it simply 'Joseph.' What does Khalidi title it?", answers: ["The Story of Joseph", "Joseph", "Yusuf", "The Narrative of Joseph"], correct: 1 },
    { question: "In the Joseph story, what stratagem does Joseph use to keep Benjamin with him in Egypt?", answers: ["He arrests Benjamin openly", "He places his drinking cup in Benjamin's saddlebag and has a herald accuse them of theft", "He asks Jacob's permission", "He tells Benjamin the truth immediately"], correct: 1 },
    { question: "What does the Simorgh's dwelling beyond Mount Qaf symbolize in The Conference of the Birds?", answers: ["A geographical location in China", "The transcendence of God, who is beyond the material world yet always near", "A political capital", "The afterlife only"], correct: 1 },
    { question: "In the 1001 Nights, the jinni keeps his captive bride locked in a chest with how many locks?", answers: ["Two", "Three", "Four", "Seven"], correct: 2 },
    { question: "What is the significance of the Simorgh's feather that fell in China, as described in The Conference of the Birds?", answers: ["It grants immortality", "It is a sign of the divine that inspired all people to form private images of the Simorgh, yet none captured the full truth", "It is a weapon", "It creates wealth"], correct: 1 },
    { question: "In Abdel Haleem's translation of Sura 12:21, God's purpose in establishing Joseph in Egypt is described as what?", answers: ["To punish the Egyptians", "To teach him dream interpretation; God always prevails in His purpose", "To make him wealthy", "To test the Pharaoh"], correct: 1 },
    { question: "What do the seven years of fat cows and seven years of thin cows represent in Joseph's interpretation?", answers: ["Wars and peace", "Seven years of agricultural plenty followed by seven years of famine", "Fourteen kings", "The phases of the moon"], correct: 1 },
    { question: "In the Ikhwān al-Ṣafāʾ, the elephant complains about what specific form of mistreatment?", answers: ["Being hunted for ivory", "Chains on feet, cables about neck, and being beaten with iron goads despite his great strength", "Being starved", "Being forced to race"], correct: 1 },
    { question: "The concept of 'iʿjāz' (inimitability) relates to the Qur'an's literary form in what way?", answers: ["The Qur'an is written in standard Arabic poetry", "It broke existing genres, being neither prose nor poetry while containing elements of both", "It follows the conventions of pre-Islamic odes", "It is written in rhyming couplets"], correct: 1 },
    { question: "In the 1001 Nights, after defeating multiple scholars in debate, what does Tawaddud also demonstrate mastery of?", answers: ["Cooking", "Chess, backgammon, and music (the lute)", "Architecture", "Swordsmanship"], correct: 1 },
    { question: "Hayy Ibn Yaqẓān's structure parallels the 'ages of man' concept found in which tradition?", answers: ["Chinese philosophy", "Hellenistic literature, with periodized stages of human development", "Norse mythology", "Buddhist scripture"], correct: 1 },
    { question: "Al-Fārābī's 'perfect state' requires a leader who combines which two qualities?", answers: ["Wealth and military power", "Philosophical wisdom and prophetic/revelatory insight", "Noble birth and physical strength", "Artistic talent and oratory"], correct: 1 },
  ],

  hard: [
    // === GLOSSARY ===
    { question: "According to the glossary, what does Ibn Khaldūn identify as the primary threat to ʿaṣabiyyah?", answers: ["Religious diversity", "Ethnic plurality", "Tyranny", "Foreign invasion"], correct: 2 },
    { question: "The glossary notes that poets like Ibn al-Rūmī and al-Maʿarrī expressed sympathy for the Zanj Rebellion in what manner?", answers: ["Through direct political manifestos", "Through subtle allegorical images to avoid the wrath of authorities", "By joining the rebellion", "By writing legal treatises"], correct: 1 },
    { question: "The glossary's definition of 'fiṭra' draws a distinction between what two elements?", answers: ["Body and mind", "The pure divine soul and the acquired human nature/behavior (self/shell)", "Reason and emotion", "Individual will and divine predestination"], correct: 1 },
    { question: "In the glossary's discussion of murūʾa, which is listed as a quality that taints one's murūʾa?", answers: ["Generosity", "Courage", "Harassing women", "Intelligence"], correct: 2 },
    { question: "The Shuʿūbī Persians called Arabs 'people of tribes' to imply what?", answers: ["That Arabs were more democratic", "That Arabs were less civilized than Persians, who called themselves 'people of nations'", "That Arabs had stronger military traditions", "That Arabs were more devout"], correct: 1 },
    { question: "The glossary compares ẓarf to which European cultural figure?", answers: ["The Renaissance man", "The Romantic-period dandy", "The Enlightenment philosophe", "The Victorian gentleman"], correct: 1 },
    { question: "The verb root q.ṣ.ṣ (qiṣṣa) originally refers to what activity?", answers: ["Reciting poetry aloud", "Tracing tracks in the desert", "Writing on parchment", "Memorizing sacred texts"], correct: 1 },
    { question: "The glossary uses which literary example to illustrate fanāʾ and baqāʾ?", answers: ["Sindbad's journey", "Shahrazad's storytelling", "The birds being absorbed into the Simorgh in The Conference of the Birds", "Joseph's dream interpretation"], correct: 2 },
    { question: "George Sand is mentioned in the glossary's discussion of ẓarf to illustrate what?", answers: ["That ẓarf was exclusively male", "That some dandies used appearance to subvert gender norms", "That European literature influenced Islamic refinement", "That ẓarf declined after the medieval period"], correct: 1 },
    { question: "According to the glossary, the Zanj Rebellion involved the enslavement of peoples from where to work in what region?", answers: ["Central Asia to work in Persia", "Africa to work the marshes in Iraq", "India to work in Egypt", "Anatolia to work in Syria"], correct: 1 },

    // === QUR'AN ===
    { question: "Abdel Haleem translates 'Rabb al-ʿālamīn' in Sura 1 as 'Lord of the Worlds.' How does Arberry render it?", answers: ["Lord of the Universe", "Lord of all Being", "Lord of Creation", "Lord of the Worlds"], correct: 1 },
    { question: "Khalidi renders 'Mālik yawm al-dīn' (1:4) as 'Lord of the Day of Judgement.' Arberry translates it as what?", answers: ["King of the Day of Reckoning", "Master of the Day of Doom", "Sovereign of Judgement Day", "Lord of the Day of Judgement"], correct: 1 },
    { question: "In Abdel Haleem's translation of Sura 12, verse 53, who says 'I do not pretend to be blameless, for man's very soul incites him to evil'?", answers: ["Joseph", "The governor's wife", "Jacob", "The king"], correct: 1 },
    { question: "In Arberry's translation of Sura 12:18, Jacob responds to his sons' lie with what phrase?", answers: ["'God will punish you'", "'No; but your spirits tempted you to do somewhat. But come, sweet patience!'", "'You are liars and I disown you'", "'Bring me proof of your claim'"], correct: 1 },
    { question: "The concluding verse of Sura 12 (12:111) describes the Qur'an's narratives as what?", answers: ["Entertainment for believers", "A confirmation of what came before, an explanation of all things, a guidance and mercy", "Historical records of the prophets", "Warnings of divine punishment only"], correct: 1 },
    { question: "In Khalidi's translation, verse 12:3 reads 'We narrate to you the fairest of narratives.' How does Arberry render the same verse?", answers: ["We tell you the best of stories", "We will relate to thee the fairest of stories", "We reveal to you the most beautiful tale", "We recount for you the noblest narrative"], correct: 1 },
    { question: "What is the significance of the word 'qamīṣ' (shirt) appearing three times in Sura 12?", answers: ["It has no special significance", "It serves as a structural device connecting betrayal (fake blood), vindication (torn from behind), and restoration (healing Jacob's sight)", "It symbolizes Joseph's wealth", "It represents his prophetic mantle"], correct: 1 },
    { question: "In verse 12:31, the women who see Joseph exclaim a phrase. What do they say across the translations?", answers: ["'He is a prophet!'", "'God forbid! He is no mortal/human; he is a noble angel'", "'He is the most beautiful man in Egypt'", "'He must be the king's son'"], correct: 1 },
    { question: "Abdel Haleem notes in his annotation to Sura 1 that the verb in verse 7 ('those who incur anger') is deliberately NOT attributed to God. Why is this significant?", answers: ["It is a scribal error", "It avoids directly attributing anger to God, maintaining a distinction in divine attributes", "It refers to human anger only", "It is a later editorial addition"], correct: 1 },

    // === 1001 NIGHTS ===
    { question: "According to the Seale/Horta annotations, how does the jinni's captive bride's collection of 98 rings function in the frame tale?", answers: ["As treasure", "As proof that no amount of control—even supernatural—can contain a woman's agency or desires", "As currency for trade", "As magical talismans"], correct: 1 },
    { question: "The Seale/Horta edition notes that Burton inflated the number of the captive bride's rings to 570. Why?", answers: ["For historical accuracy", "He preferred the humor in the exaggerated number of lovers", "It was in his source manuscript", "To match a Persian version"], correct: 1 },
    { question: "According to the annotations, Shahrazad's goal is described not merely as personal survival but as what?", answers: ["Becoming queen permanently", "Liberating her people from the king's tyrannical campaign of murder", "Collecting stories for posterity", "Proving women's intellectual superiority"], correct: 1 },
    { question: "What does Jerome Clinton's interpretation (cited in annotations) suggest about Shahriyar's wife and the jinni's captive bride?", answers: ["They are the same person", "Both may be women coveted as precious objects and imprisoned, whose rebellion is their only assertion of agency", "They represent different religions", "They symbolize different seasons"], correct: 1 },
    { question: "In the Tale of Tawaddud, what is the answer to Tawaddud's riddle about the button and the button-loop?", answers: ["It describes a sword and sheath", "It describes an object that is round, pregnant without child, copulating without a yard, and resting in corners of noble mansions", "It describes a pearl in an oyster", "It describes the moon and sun"], correct: 1 },
    { question: "According to the annotations, Samuel Taylor Coleridge acknowledged that 'The Rime of the Ancient Mariner' was deeply indebted to which Nights story?", answers: ["The Tale of Sindbad", "The Story of the Merchant and the Jinni", "The Tale of Tawaddud", "The Fisherman and the Jinni"], correct: 1 },
    { question: "In the rooster's advice in the Tale of the Merchant and His Wife, what does the rooster call the merchant?", answers: ["A wise man", "A prophet", "A fool who cannot manage his one wife", "A saint"], correct: 2 },

    // === IKHWAN AL-SAFA ===
    { question: "In the Ikhwān al-Ṣafāʾ, the pig's speech reveals what about his status across religions?", answers: ["All religions honor him equally", "Muslims loathe him, Christians/Romans eat his meat in sacrifices, Jews detest him, and Armenians treat him like cattle", "Only Muslims accept him", "He is sacred in all traditions"], correct: 1 },
    { question: "The Ikhwān al-Ṣafāʾ use the comparison of a gnat to an elephant to argue what?", answers: ["That larger animals are more important", "That the gnat is more marvellously built and more elegantly designed despite its tiny size, and is deadlier", "That elephants are the pinnacle of creation", "That size determines divine favor"], correct: 1 },
    { question: "The Ikhwān al-Ṣafāʾ's anti-anthropocentrism draws on which philosophical tradition?", answers: ["Stoicism", "Epicureanism", "Neoplatonism, arguing that all beings have intrinsic worth and are created for their own sake", "Cynicism"], correct: 2 },
    { question: "What Qur'anic verse does the mule cite about humans' obligation to animals in the Ikhwān text?", answers: ["Verse about fasting", "'That you may sit solid on their backs and recall the grace of your Lord' (43:13-14)", "The verse of the Throne", "The verse of Light"], correct: 1 },

    // === IBN TUFAYL ===
    { question: "Ibn Ṭufayl's Hayy Ibn Yaqẓān presents three forms of religion. What are they?", answers: ["Judaism, Christianity, Islam", "Rational religion, mass/evangelical religion, and mystic religion", "Sunni, Shia, Sufi", "Polytheism, monotheism, atheism"], correct: 1 },
    { question: "The Almohad dynasty under which Ibn Ṭufayl wrote was founded by Ibn Tumart, who was inspired by which Eastern theologian?", answers: ["Ibn Rushd (Averroes)", "Al-Ghazālī", "Al-Farabi", "Ibn Sina"], correct: 1 },
    { question: "In Hayy Ibn Yaqẓān, what does the mystic's question 'Do you need a candle to see the sun?' signify?", answers: ["That education is unnecessary", "That God is so manifest that no intermediary (reason or revelation) is needed to know Him", "That the physical world is an illusion", "That candles are forbidden"], correct: 1 },

    // === CONFERENCE OF THE BIRDS ===
    { question: "The wordplay 'si murgh' (thirty birds) = 'Simorgh' at the end of The Conference of the Birds illustrates which Sufi concept?", answers: ["ʿAṣabiyyah", "Waḥdat al-wujūd", "Fanāʾ and baqāʾ—the birds are annihilated as individuals and subsist as the Divine", "Taṭfīl"], correct: 2 },
    { question: "In The Conference of the Birds, each bird's excuse for not journeying represents what?", answers: ["Historical events", "Different nafs (ego/self) attachments that prevent spiritual progress", "Different Islamic sects", "Different nationalities"], correct: 1 },
    { question: "The seven valleys in The Conference of the Birds—Quest, Love, Knowledge, Detachment, Unity, Bewilderment, and Poverty/Annihilation—represent what?", answers: ["Stages of political development", "Stages of the Sufi spiritual journey toward God", "The seven heavens", "The seven days of creation"], correct: 1 },

    // === IBN ARABI ===
    { question: "In the Tarjumān al-Ashwāq, Ibn ʿArabī's love poetry operates on what dual level?", answers: ["Political and economic", "Literal romantic love and mystical/divine love simultaneously", "Historical and fictional", "Comedic and tragic"], correct: 1 },

    // === AL-FARABI ===
    { question: "Al-Fārābī's concept of the philosopher-ruler in On the Perfect State synthesizes which two traditions?", answers: ["Indian and Chinese philosophy", "Platonic political philosophy and Islamic prophetic leadership", "Stoic ethics and Roman law", "Aristotelian logic and Persian monarchy"], correct: 1 },

    // === IBN KHALDUN ===
    { question: "According to the glossary, the argument is made that ʿaṣabiyyah can exist within plurality if what condition is met?", answers: ["If the population is ethnically homogeneous", "If the ruler is just, because the drive is to 'continue succeeding'", "If the empire is small", "If there is a common language"], correct: 1 },
    { question: "Ibn Khaldūn's cyclical theory of history describes dynasties moving through which pattern?", answers: ["Expansion, stagnation, revival", "Nomadic vigor and solidarity → conquest → luxury and decline → collapse", "Democracy, oligarchy, tyranny", "Religious zeal, secularism, reformation"], correct: 1 },
    { question: "Ibn Khaldūn argues that the decline of a dynasty begins when its members shift their focus from what to what?", answers: ["From religion to philosophy", "From group solidarity and purpose to individual luxury, pleasure, and selfishness", "From agriculture to trade", "From poetry to prose"], correct: 1 },

    // === CROSS-TEXTUAL ===
    { question: "Which two texts on the syllabus most directly address the ethical relationship between humans and animals?", answers: ["The Muqaddimah and On the Perfect State", "Kalila wa-Dimna and The Case of the Animals versus Man (Ikhwān al-Ṣafāʾ)", "The Conference of the Birds and Tarjumān al-Ashwāq", "The 1001 Nights and Princess Fatima"], correct: 1 },
    { question: "The concept of the 'mathal' (parable) as generative and open to infinite readings connects which two works most directly?", answers: ["Rumi's poetry and al-Farabi's treatise", "The Qur'an and Kalila wa-Dimna, both of which use allegorical parables", "The 1001 Nights and Ibn Khaldun", "The Conference of the Birds and Princess Fatima"], correct: 1 },
    { question: "Both Hayy Ibn Yaqẓān and The Conference of the Birds explore the idea of reaching divine truth. How do their methods differ?", answers: ["Both use the same method", "Hayy reaches God through solitary rational contemplation; the birds reach God through a communal spiritual journey and annihilation of the ego", "Hayy uses prayer; the birds use warfare", "There is no thematic connection"], correct: 1 },
    { question: "The Sufi concepts of fanāʾ/baqāʾ (Conference of the Birds) and waḥdat al-wujūd (Ibn ʿArabī) share what fundamental insight?", answers: ["That the material world is permanent", "That individual selfhood must dissolve to reveal the underlying unity of all being in God", "That reason alone leads to God", "That political power is the path to the Divine"], correct: 1 },
    { question: "The tale of Shahrazad in the 1001 Nights and the tale of Tawaddud both feature women whose primary weapon is what?", answers: ["Physical beauty", "Military skill", "Intellect, knowledge, and the mastery of storytelling/discourse", "Wealth and political connections"], correct: 2 },
    { question: "Adab, murūʾa, and ẓarf together constitute what, according to the course framework?", answers: ["A legal code", "An integrated ethical and aesthetic ideal for the cultivation of the complete human being", "A religious creed", "A political ideology"], correct: 1 },
    { question: "Ibn al-Muqaffaʿ's 'shuʿūb al-ḥadīth,' Shahrazad's storytelling, and the mathal tradition all share what common principle?", answers: ["That stories are only for children", "That narrative and discourse are generative—they produce new understanding, social harmony, and even save lives", "That literature should be censored", "That only poetry matters"], correct: 1 },

    // === MORE HARD ===
    { question: "In the Ikhwān al-Ṣafāʾ, the argument that 'a slight to the work is an affront to its Maker' implies what ethical principle?", answers: ["That humans own all of creation", "That harming any creature insults God, since all beings are God's creation and have intrinsic worth", "That only humans reflect God", "That animals should worship humans"], correct: 1 },
    { question: "ʿAṭṭār was reportedly tried for heresy late in his life. What aspect of The Conference of the Birds might explain this?", answers: ["Its promotion of polytheism", "Its suggestion that individual selfhood must be annihilated to merge with God, which could be seen as denying orthodox theology", "Its criticism of poetry", "Its praise of the Mongols"], correct: 1 },
    { question: "In the annotations to the Seale/Horta Nights, Shahrazad is described by Ros Ballaster as what kind of figure?", answers: ["A romantic heroine", "A 'heroine of state' who risks her life to restore the health of her kingdom", "A comedic character", "A passive victim"], correct: 1 },
    { question: "The Ikhwān al-Ṣafāʾ reject Stoic anthropocentrism. The Stoic view held that animals exist for what purpose?", answers: ["Their own sake", "Solely for human use—pigs to keep meat fresh, horses to carry men to war", "To glorify God independently", "As equals to humans"], correct: 1 },
    { question: "In the Tale of Tawaddud, Tawaddud lists the seven gates of Hell. What does this demonstrate about her character?", answers: ["Her fear of punishment", "Her encyclopedic command of Islamic theology, showing knowledge across all disciplines", "Her desire to frighten the scholars", "Her personal piety only"], correct: 1 },
    { question: "According to the Seale/Horta annotations, Marina Warner describes the sisterly relationship of Shahrazad and Dunyazad as what?", answers: ["A political alliance", "The fullest metaphor for love against death, expressed through the alliance of girls against men in power", "A rivalry", "An economic partnership"], correct: 1 },
    { question: "The hoopoe's statement 'Do not imagine that the Way is short; vast seas and deserts lie before His court' functions as what in the poem's structure?", answers: ["Comic relief", "A warning that prepares the birds (and reader) for the difficulty of the spiritual journey, establishing the epic scale", "A geographical description", "An invitation to rest"], correct: 1 },
    { question: "In the Qur'anic Joseph story, the phrase 'the soul ever urges to evil' (12:53) in Khalidi's translation articulates what Islamic psychological concept?", answers: ["That all souls are permanently evil", "The concept of al-nafs al-ammāra bi'l-sū' (the self that commands evil), the ego's tendency toward wrong unless God shows mercy", "That evil does not exist", "That only prophets have good souls"], correct: 1 },
    { question: "The three Qur'an translations studied show different approaches to 'al-Raḥmān al-Raḥīm.' What fundamental translation challenge does this reveal?", answers: ["That Arabic has no adjectives", "That a single Arabic root (r-ḥ-m, mercy) generates two divine attributes with different intensities, requiring translators to find distinct English pairs", "That the translators disagree on God's nature", "That the Arabic text is corrupt"], correct: 1 },
    { question: "In the 1001 Nights, Paul Auster's interpretation (cited in annotations) argues that the old men in the Merchant and Jinni story do NOT try to argue the merchant's innocence. Instead, they aim to do what?", answers: ["Bribe the jinni", "Turn the jinni away from thoughts of death through delight, renewing his feeling for life through storytelling", "Physically overpower the jinni", "Pray for divine intervention"], correct: 1 },
    { question: "The Ikhwān al-Ṣafāʾ argue that even death serves a purpose in God's plan. This view synthesizes which philosophical traditions?", answers: ["Epicurean and Skeptic", "Aristotelian natural philosophy (individuals perish but species endure) with Neoplatonic teleology and Muʿtazilite justice", "Stoic and Cynic", "Platonic and Confucian"], correct: 1 },
    { question: "In The Conference of the Birds, the Simorgh first appeared to mortal sight in China and dropped a feather. The saying 'Seek knowledge, unto China seek it out' is attributed to whom?", answers: ["ʿAṭṭār himself", "The Prophet Muhammad (as a hadith)", "Solomon", "Plato"], correct: 1 },
    { question: "Comparing the three translations of Sura 1:5, Arberry writes 'Thee only we serve; to Thee alone we pray for succour.' Abdel Haleem writes 'It is You we worship; it is You we ask for help.' What shift does Abdel Haleem's translation reflect?", answers: ["A less accurate translation", "A move from archaic English (Thee/Thou) to modern English (You), making the text more accessible to contemporary readers", "A different Arabic source text", "A Shia interpretation"], correct: 1 },
    { question: "In the 1001 Nights frame tale, Shahzaman's recovery upon witnessing his brother's wife's betrayal illustrates what psychological principle?", answers: ["Denial", "Comparative suffering—knowing someone of higher status shares your misfortune provides relief", "Amnesia", "Divine healing"], correct: 1 },
    { question: "The Ikhwān al-Ṣafāʾ's eschatology ultimately resolves the animals' case how?", answers: ["Animals win complete freedom", "Humans are punished", "The case remains unresolved; but human superiority is only justified by the possibility of spiritual ascent, not by inherent right", "Animals are declared equal to humans in all respects"], correct: 2 },
    { question: "Ibn Khaldūn's theory that Bedouin societies possess stronger ʿaṣabiyyah than urban ones parallels which tension in the course?", answers: ["The tension between poetry and prose", "The tension between nature/authenticity (fiṭra) and the corruptions of civilization/luxury", "The tension between Sunni and Shia", "The tension between Arabic and Persian"], correct: 1 },
    { question: "The Seale/Horta annotations note that Jack Zipes sees details like freeing slaves and distributing property in the Nights as serving what function?", answers: ["Pure entertainment", "Socializing audiences in Muslim customs and laws", "Historical documentation", "Subverting Islamic norms"], correct: 1 },
    { question: "In Khalidi's translation, Joseph's prayer in 12:101 ends with 'Let me die a Muslim and make me join the company of the virtuous.' How does Arberry render the same request?", answers: ["Let me die in Islam and join the believers", "O receive me to Thee in true submission, and join me with the righteous", "Make me die as one who surrenders and unite me with the good", "Let my death be in faith and place me among the pious"], correct: 1 },
    { question: "The concept of murūʾa being 'gender-neutral in premodern sources' challenges what common modern assumption?", answers: ["That premodern societies were more advanced than modern ones", "That virtue-ethics in Islamic tradition were exclusively masculine ('chivalry'), when in fact murūʾa encompasses universal human excellence", "That women were excluded from all aspects of culture", "That gender was irrelevant in premodern societies"], correct: 1 },
  ]
};

const CLASSIC_PRIZES = [
  100, 200, 500, 1000, 2000,
  3000, 5000, 7500, 15000, 30000,
  60000, 125000, 250000, 500000, 1000000
];

/** Safe milestone indices when playing the classic 15-question ladder. */
const CLASSIC_SAFE_LEVELS = [4, 9];

/** Current ladder payouts (same length as QUESTIONS). Mutated when mode changes. */
let PRIZES = CLASSIC_PRIZES.slice();

/** Indices in PRIZES that are guaranteed levels for wrong-answer bailout. */
let SAFE_LEVELS = CLASSIC_SAFE_LEVELS.slice();

const CURRENCY = '$';

/** Pool size exposed for the UI (welcome screen counts). */
const BANK_QUESTION_COUNT =
  QUESTION_POOL.easy.length + QUESTION_POOL.medium.length + QUESTION_POOL.hard.length;

/** 'classic' = 15 random (5/5/5). 'study' = entire bank shuffled into one mega run. */
let GAME_MODE = 'classic';

/* The active ordered list for the current game session. */
let QUESTIONS = [];

const LEVEL_TIER_BY_INDEX = [];
for (let i = 0; i < 5; i++) LEVEL_TIER_BY_INDEX.push('easy');
for (let i = 0; i < 5; i++) LEVEL_TIER_BY_INDEX.push('medium');
for (let i = 0; i < 5; i++) LEVEL_TIER_BY_INDEX.push('hard');

function cloneQuestion(q) {
  const o = {
    question: q.question,
    answers: q.answers.slice(),
    correct: q.correct
  };
  if (q.source) o.source = q.source;
  return o;
}

function questionFingerprint(q) {
  return q.question + '\0' + String(q.correct);
}

/** Smooth curve up to one million dollars for marathon runs. */
function generatePrizeSteps(n) {
  const min = 100;
  const max = 1_000_000;
  if (n <= 0) return [];
  if (n === 1) return [max];
  return Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    const curved = Math.pow(t, 1.35);
    const step = min + (max - min) * curved;
    return Math.round(step / 50) * 50;
  });
}

/** Milestone checkpoints for study mode (~⅓ and ~⅔ through the ladder). */
function milestoneIndicesForRoundCount(n) {
  if (n < 8) {
    const mid = Math.max(2, Math.min(n - 2, Math.floor(n / 2)));
    const low = Math.max(1, Math.floor(mid / 2));
    return [...new Set([low, mid].filter(i => i < n && i >= 1))].sort((x, y) => x - y);
  }
  const a = Math.floor(n / 3) - 1;
  const b = Math.floor((2 * n) / 3) - 1;
  return [...new Set([a, b])].filter(i => i >= 0 && i < n).sort((x, y) => x - y);
}

/**
 * Prepares QUESTIONS plus PRIZES/SAFE_LEVELS for the chosen format.
 * @param {'classic'|'study'} mode
 */
function buildQuestionSet(mode = 'classic') {
  GAME_MODE = mode === 'study' ? 'study' : 'classic';

  if (GAME_MODE === 'study') {
    const bank = [...QUESTION_POOL.easy, ...QUESTION_POOL.medium, ...QUESTION_POOL.hard].map(cloneQuestion);
    shuffle(bank);
    QUESTIONS = bank;
    PRIZES = generatePrizeSteps(QUESTIONS.length);
    SAFE_LEVELS = milestoneIndicesForRoundCount(QUESTIONS.length);
    return;
  }

  const easy = pickN(QUESTION_POOL.easy, 5);
  const medium = pickN(QUESTION_POOL.medium, 5);
  const hard = pickN(QUESTION_POOL.hard, 5);
  QUESTIONS = [...easy, ...medium, ...hard];
  PRIZES = CLASSIC_PRIZES.slice();
  SAFE_LEVELS = CLASSIC_SAFE_LEVELS.slice();
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

/** Switch lifeline: another item from the tier (classic) or from the wider bank (study). */
function pickAlternativeQuestion(levelIndex, currentQuestion) {
  const curKey = questionFingerprint(currentQuestion);

  if (GAME_MODE === 'study') {
    const source = [...QUESTION_POOL.easy, ...QUESTION_POOL.medium, ...QUESTION_POOL.hard];
    const pool = source.filter(q => questionFingerprint(q) !== curKey);
    if (pool.length === 0) return null;
    shuffle(pool);
    const pick = pool[0];
    return cloneQuestion(pick);
  }

  const tier = LEVEL_TIER_BY_INDEX[levelIndex] || 'medium';
  const source = QUESTION_POOL[tier] || [];
  const pool = source.filter(q => questionFingerprint(q) !== curKey);
  let pick;
  if (pool.length > 0) {
    shuffle(pool);
    pick = pool[0];
  } else if (source.length > 0) {
    pick = source[Math.floor(Math.random() * source.length)];
  } else {
    return null;
  }
  return cloneQuestion(pick);
}
