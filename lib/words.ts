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
    id: "khamoshi",
    translit: "khāmoshī",
    urdu: "خاموشی",
    meaning: "Silence; simply the absence of speech",
    example: {
      urdu: "کمرے میں خاموشی تھی۔",
      translit: "kamre meñ khāmoshī thī.",
      en: "The room was silent.",
    },
    note: "Urdu has many silences: khāmoshī, chup, sannāṭā, sukūt.",
  },
  {
    id: "chup",
    translit: "chup",
    urdu: "چپ",
    meaning: "Silence kept on purpose; words held back",
    example: {
      urdu: "وہ کچھ کہنا چاہتی تھی، پھر چپ رہی۔",
      translit: "vo kuchh kahnā chāhtī thī, phir chup rahī.",
      en: "She wanted to say something, then kept quiet.",
    },
  },
  {
    id: "sannata",
    translit: "sannāṭā",
    urdu: "سناٹا",
    meaning: "A heavy, total stillness, like an empty house at night",
    example: {
      urdu: "سب چلے گئے، گھر میں سناٹا چھا گیا۔",
      translit: "sab chale ga.e, ghar meñ sannāṭā chhā gayā.",
      en: "Everyone left, and a hush fell over the house.",
    },
  },
  {
    id: "sukoot",
    translit: "sukūt",
    urdu: "سکوت",
    meaning: "A solemn, sacred stillness that needs no words",
    example: {
      urdu: "درگاہ پر عجب سکوت تھا۔",
      translit: "dargāh par ajab sukūt thā.",
      en: "A strange stillness lay over the shrine.",
    },
  },
  {
    id: "sahifa",
    translit: "sahīfa",
    urdu: "صحیفہ",
    meaning: "A scroll, letter or holy text; in poetry, words written with reverence",
    example: {
      urdu: "تمہارا خط میرے لیے صحیفہ ہے۔",
      translit: "tumhārā ḳhat mere liye sahīfa hai.",
      en: "Your letter is scripture to me.",
    },
  },
  {
    id: "junoon",
    translit: "junūn",
    urdu: "جنون",
    meaning: "Passionate madness; love or devotion beyond all reason",
    example: {
      urdu: "اسے شاعری کا جنون ہے۔",
      translit: "use shāyarī kā junūn hai.",
      en: "She is wild about poetry.",
    },
  },
  {
    id: "tishna-lab",
    translit: "tishna-lab",
    urdu: "تشنہ لب",
    meaning: "Thirsty-lipped; a heart whose longing is never quenched",
    example: {
      urdu: "برسوں بعد بھی دل تشنہ لب ہے۔",
      translit: "barsoñ baad bhī dil tishna-lab hai.",
      en: "Even after years, the heart is still thirsting.",
    },
  },
  {
    id: "nadamat",
    translit: "nadāmat",
    urdu: "ندامت",
    meaning: "Remorse; regret that comes with clear self-awareness",
    example: {
      urdu: "اس کی آنکھوں میں ندامت تھی۔",
      translit: "us kī āñkhoñ meñ nadāmat thī.",
      en: "There was remorse in his eyes.",
    },
  },
  {
    id: "hijr",
    translit: "hijr",
    urdu: "ہجر",
    meaning: "Separation from the beloved; a distance that becomes part of you",
    example: {
      urdu: "ہجر کی رات بہت لمبی ہوتی ہے۔",
      translit: "hijr kī rāt bahut lambī hotī hai.",
      en: "The night of separation is very long.",
    },
    note: "One of the ghazal's two poles; its opposite is visāl, union.",
  },
  {
    id: "khalish",
    translit: "ḳhalish",
    urdu: "خلش",
    meaning: "A lingering ache; a quiet pain that stays after healing begins",
    example: {
      urdu: "دل میں ایک خلش اب بھی باقی ہے۔",
      translit: "dil meñ ek ḳhalish ab bhī bāqī hai.",
      en: "A faint ache still lingers in the heart.",
    },
  },
  {
    id: "firaq",
    translit: "firāq",
    urdu: "فراق",
    meaning: "Parting; the daily ache of missing someone once always near",
    example: {
      urdu: "فراق میں ہر دن لمبا لگتا ہے۔",
      translit: "firāq meñ har din lambā lagtā hai.",
      en: "In parting, every day feels long.",
    },
  },
  {
    id: "kashish",
    translit: "kashish",
    urdu: "کشش",
    meaning: "An unspoken pull; an attraction that needs no reason",
    example: {
      urdu: "اس کی باتوں میں عجب کشش ہے۔",
      translit: "us kī bātoñ meñ ajab kashish hai.",
      en: "There is a strange pull in her words.",
    },
  },
];

export function getWord(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id);
}
