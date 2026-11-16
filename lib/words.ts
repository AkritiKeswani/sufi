// The "Become a Shayar" vocabulary — the charged, Persian-coloured words the
// ghazal is built from. Kept server-side too, so /api/recite only ever speaks
// known words (the client sends a word id, never raw text).
export type Word = {
  id: string;
  // The word in Roman letters — what the card leads with.
  translit: string;
  // The word in Urdu script, when we have it.
  urdu?: string;
  meaning: string;
  // An optional short sentence that puts the word to work.
  example?: { urdu?: string; translit: string; en: string };
  // An optional line on usage, register or nuance.
  note?: string;
};

export const WORDS: Word[] = [
  {
    id: "hijr",
    urdu: "ہجر",
    translit: "hijr",
    meaning: "Separation from the beloved",
    example: {
      urdu: "ہجر کی رات بہت لمبی ہوتی ہے۔",
      translit: "hijr kī rāt bahut lambī hotī hai.",
      en: "The night of separation is very long.",
    },
    note: "One of the ghazal's two poles; its opposite is “visāl”.",
  },
  {
    id: "visal",
    urdu: "وصال",
    translit: "visāl",
    meaning: "Union with the beloved",
    example: {
      urdu: "وصال کی گھڑی قریب ہے۔",
      translit: "visāl kī ghaṛī qarīb hai.",
      en: "The hour of union is near.",
    },
    note: "Also said “vasl”. In Sufi verse, union with the divine.",
  },
  {
    id: "firaq",
    urdu: "فراق",
    translit: "firāq",
    meaning: "Parting; the grief of being apart",
    example: {
      urdu: "فراق میں دل اداس رہتا ہے۔",
      translit: "firāq meñ dil udās rahtā hai.",
      en: "In parting, the heart stays sad.",
    },
  },
  {
    id: "tanhai",
    urdu: "تنہائی",
    translit: "tanhāī",
    meaning: "Solitude, loneliness",
    example: {
      urdu: "شام کی تنہائی میں تم یاد آتے ہو۔",
      translit: "shām kī tanhāī meñ tum yād āte ho.",
      en: "In the evening's solitude, I think of you.",
    },
  },
  {
    id: "aarzoo",
    urdu: "آرزو",
    translit: "ārzū",
    meaning: "Longing, deep desire",
    example: {
      urdu: "تم سے ملنے کی آرزو ہے۔",
      translit: "tum se milne kī ārzū hai.",
      en: "I long to meet you.",
    },
  },
  {
    id: "hasrat",
    urdu: "حسرت",
    translit: "hasrat",
    meaning: "Unfulfilled longing; wistful regret",
    example: {
      urdu: "دل میں ایک حسرت رہ گئی۔",
      translit: "dil meñ ek hasrat rah gaī.",
      en: "One unfulfilled wish stayed in the heart.",
    },
    note: "“ārzū” still hopes; “hasrat” knows it will not be.",
  },
  {
    id: "justuju",
    urdu: "جستجو",
    translit: "justujū",
    meaning: "Quest, tireless search",
    example: {
      urdu: "سچ کی جستجو کبھی ختم نہیں ہوتی۔",
      translit: "sach kī justujū kabhī ḳhatm nahīñ hotī.",
      en: "The search for truth never ends.",
    },
  },
  {
    id: "taqdeer",
    urdu: "تقدیر",
    translit: "taqdīr",
    meaning: "Destiny, fate",
    example: {
      urdu: "تقدیر کا لکھا کون بدل سکتا ہے؟",
      translit: "taqdīr kā likhā kaun badal saktā hai?",
      en: "Who can change what fate has written?",
    },
  },
  {
    id: "khudi",
    urdu: "خودی",
    translit: "ḳhudī",
    meaning: "Selfhood; the awakened self",
    example: {
      urdu: "اپنی خودی کو پہچانو۔",
      translit: "apnī ḳhudī ko pahchāno.",
      en: "Recognise your own self.",
    },
    note: "Iqbal turned this word from “ego” into dignity and self-realisation.",
  },
  {
    id: "bekhudi",
    urdu: "بے خودی",
    translit: "be-ḳhudī",
    meaning: "Rapture; being beside oneself",
    example: {
      urdu: "عشق کی بے خودی میں سب کچھ بھول گیا۔",
      translit: "ishq kī be-ḳhudī meñ sab kuchh bhūl gayā.",
      en: "In love's rapture, I forgot everything.",
    },
    note: "Literally “self-less-ness” — the mirror image of “ḳhudī”.",
  },
  {
    id: "tasavvur",
    urdu: "تصوّر",
    translit: "tasavvur",
    meaning: "Imagination; the image held in the mind",
    example: {
      urdu: "تمہارا تصوّر ہر وقت ساتھ رہتا ہے۔",
      translit: "tumhārā tasavvur har vaqt sāth rahtā hai.",
      en: "The thought of you is with me always.",
    },
  },
  {
    id: "kainat",
    urdu: "کائنات",
    translit: "kāināt",
    meaning: "The universe, all of creation",
    example: {
      urdu: "کائنات کا ہر ذرّہ روشن ہے۔",
      translit: "kāināt kā har zarra raushan hai.",
      en: "Every particle of the universe is alight.",
    },
  },
];

export function getWord(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id);
}
