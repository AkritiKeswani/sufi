// The "Become a Shayar" vocabulary — the charged, Persian-coloured words the
// ghazal is built from. Kept server-side too, so /api/recite only ever speaks
// known words (the client sends a word id, never raw text).
export type Theme = "silence" | "longing" | "separation" | "heartbreak" | "love" | "soul";

export const THEMES: { id: Theme; label: string }[] = [
  { id: "silence", label: "Silence" },
  { id: "longing", label: "Longing" },
  { id: "separation", label: "Separation" },
  { id: "heartbreak", label: "Heartbreak" },
  { id: "love", label: "Love" },
  { id: "soul", label: "Soul" },
];

export type Word = {
  id: string;
  theme: Theme;
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
    theme: "silence",
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
    theme: "silence",
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
    theme: "silence",
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
    theme: "silence",
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
    id: "aarzoo",
    theme: "longing",
    translit: "ārzū",
    urdu: "آرزو",
    meaning: "A quiet, gentle wish held in the heart",
    example: {
      urdu: "تم سے ملنے کی آرزو ہے۔",
      translit: "tum se milne kī ārzū hai.",
      en: "I long to meet you.",
    },
    note: "Four longings: ārzū, tamannā, hasrat, tishnagī.",
  },
  {
    id: "tamanna",
    theme: "longing",
    translit: "tamannā",
    urdu: "تمنا",
    meaning: "A deep, persistent desire that doesn't let go",
    example: {
      urdu: "اس کی تمنا تھی کہ وہ شاعر بنے۔",
      translit: "us kī tamannā thī ki vo shā'ir bane.",
      en: "Her wish was to become a poet.",
    },
  },
  {
    id: "hasrat",
    theme: "longing",
    translit: "hasrat",
    urdu: "حسرت",
    meaning: "Longing for something you know you can never have",
    example: {
      urdu: "دل میں ایک حسرت رہ گئی۔",
      translit: "dil meñ ek hasrat rah ga.ī.",
      en: "One unfulfilled wish stayed in the heart.",
    },
    note: "ārzū still hopes; hasrat knows it will not be.",
  },
  {
    id: "tishnagi",
    theme: "longing",
    translit: "tishnagī",
    urdu: "تشنگی",
    meaning: "A thirst of the soul for someone who isn't there",
    example: {
      urdu: "تمہارے بغیر ایک تشنگی رہتی ہے۔",
      translit: "tumhāre baġhair ek tishnagī rahtī hai.",
      en: "Without you, a thirst remains.",
    },
  },
  {
    id: "tishna-lab",
    theme: "longing",
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
    id: "hijr",
    theme: "separation",
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
    id: "firaq",
    theme: "separation",
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
    id: "aah-o-bahar",
    theme: "separation",
    translit: "āh-o-bahār",
    urdu: "آہ و بہار",
    meaning: "Spring and sighs; love that blooms only to meet the winter of parting",
    example: {
      urdu: "یہ عشق بھی آہ و بہار نکلا۔",
      translit: "ye ishq bhī āh-o-bahār niklā.",
      en: "This love, too, turned to spring and sighs.",
    },
  },
  {
    id: "dil-shikastagi",
    theme: "heartbreak",
    translit: "dil-shikastagī",
    urdu: "دل شکستگی",
    meaning: "Heartbreak; the ache of a heart in pieces",
    example: {
      urdu: "اس کی آواز میں دل شکستگی تھی۔",
      translit: "us kī āvāz meñ dil-shikastagī thī.",
      en: "There was heartbreak in her voice.",
    },
  },
  {
    id: "dil-ujadna",
    theme: "heartbreak",
    translit: "dil ujaṛnā",
    urdu: "دل اجڑنا",
    meaning: "When your inner world falls to ruin",
    example: {
      urdu: "اس کے جانے سے دل اجڑ گیا۔",
      translit: "us ke jāne se dil ujaṛ gayā.",
      en: "When she left, my heart was laid waste.",
    },
  },
  {
    id: "chashm-e-nam",
    theme: "heartbreak",
    translit: "chashm-e-nam",
    urdu: "چشمِ نم",
    meaning: "Tear-wet eyes; a quiet sorrow that lingers in the gaze",
    example: {
      urdu: "وہ چشمِ نم سے مسکرائی۔",
      translit: "vo chashm-e-nam se muskurā.ī.",
      en: "She smiled with tear-wet eyes.",
    },
  },
  {
    id: "dard-e-dil",
    theme: "heartbreak",
    translit: "dard-e-dil",
    urdu: "دردِ دل",
    meaning: "Heartache; the cherished pain of loving someone deeply",
    example: {
      urdu: "دردِ دل کسے سنائیں؟",
      translit: "dard-e-dil kise sunā.eñ?",
      en: "To whom shall I tell my heartache?",
    },
  },
  {
    id: "khalish",
    theme: "heartbreak",
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
    id: "nadamat",
    theme: "heartbreak",
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
    id: "yaas",
    theme: "heartbreak",
    translit: "yās",
    urdu: "یاس",
    meaning: "Quiet hopelessness; expectation slowly fading until nothing is left",
    example: {
      urdu: "اس کی آنکھوں میں یاس اتر آئی۔",
      translit: "us kī āñkhoñ meñ yās utar ā.ī.",
      en: "Hopelessness settled in her eyes.",
    },
  },
  {
    id: "fana",
    theme: "heartbreak",
    translit: "fanā",
    urdu: "فنا",
    meaning: "Annihilation; the self dissolving completely, in loss or in love",
    example: {
      urdu: "صوفی عشق میں فنا ہو جاتا ہے۔",
      translit: "sūfī ishq meñ fanā ho jātā hai.",
      en: "The Sufi is dissolved in love.",
    },
    note: "A core Sufi idea: the self passing away into the Divine.",
  },
  {
    id: "kashish",
    theme: "love",
    translit: "kashish",
    urdu: "کشش",
    meaning: "An unspoken pull; an attraction that needs no reason",
    example: {
      urdu: "اس کی باتوں میں عجب کشش ہے۔",
      translit: "us kī bātoñ meñ ajab kashish hai.",
      en: "There is a strange pull in her words.",
    },
  },
  {
    id: "deedar",
    theme: "love",
    translit: "dīdār",
    urdu: "دیدار",
    meaning: "Seeing the beloved at last; a sight that heals a waiting heart",
    example: {
      urdu: "برسوں بعد اس کا دیدار ہوا۔",
      translit: "barsoñ baad us kā dīdār huā.",
      en: "After years, I finally saw her.",
    },
  },
  {
    id: "nigah-e-naz",
    theme: "love",
    translit: "nigāh-e-nāz",
    urdu: "نگاہِ ناز",
    meaning: "The beloved's coy glance; feigned indifference that undoes the lover",
    example: {
      urdu: "ایک نگاہِ ناز نے دل لے لیا۔",
      translit: "ek nigāh-e-nāz ne dil le liyā.",
      en: "One coy glance took my heart.",
    },
  },
  {
    id: "parwana",
    theme: "love",
    translit: "parvāna",
    urdu: "پروانہ",
    meaning: "The moth drawn into the candle's flame; love that gives everything",
    example: {
      urdu: "پروانہ شمع پر قربان ہو گیا۔",
      translit: "parvāna shamā par qurbān ho gayā.",
      en: "The moth gave itself to the flame.",
    },
    note: "The candle is shamā; together they are the ghazal's oldest image of love.",
  },
  {
    id: "junoon",
    theme: "love",
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
    id: "be-khudi",
    theme: "love",
    translit: "be-ḳhudī",
    urdu: "بے خودی",
    meaning: "Losing yourself; a trance where the beloved fills the whole mind",
    example: {
      urdu: "عشق کی بے خودی میں سب کچھ بھول گیا۔",
      translit: "ishq kī be-ḳhudī meñ sab kuchh bhūl gayā.",
      en: "In love's rapture, I forgot everything.",
    },
  },
  {
    id: "dhadkan-e-bechain",
    theme: "love",
    translit: "dhaṛkan-e-bechain",
    urdu: "دھڑکنِ بے چین",
    meaning: "A restless heartbeat; the flutter before the beloved appears",
    example: {
      urdu: "قدموں کی آہٹ سے دھڑکن بے چین ہو گئی۔",
      translit: "qadmoñ kī āhaṭ se dhaṛkan bechain ho ga.ī.",
      en: "At the sound of footsteps, my heart began to race.",
    },
  },
  {
    id: "mauj-e-khoon",
    theme: "love",
    translit: "mauj-e-ḳhūn",
    urdu: "موجِ خون",
    meaning: "A wave of blood; an overwhelming surge of grief or feeling",
    example: {
      urdu: "خبر سن کر موجِ خون اٹھی۔",
      translit: "ḳhabar sun kar mauj-e-ḳhūn uṭhī.",
      en: "Hearing the news, a surge rose through me.",
    },
  },
  {
    id: "sukoon",
    theme: "soul",
    translit: "sukūn",
    urdu: "سکون",
    meaning: "Deep peace; the calm that comes after true acceptance",
    example: {
      urdu: "تمہاری باتوں سے دل کو سکون ملتا ہے۔",
      translit: "tumhārī bātoñ se dil ko sukūn miltā hai.",
      en: "Your words bring my heart peace.",
    },
    note: "Not to be confused with sukūt, stillness.",
  },
  {
    id: "haqeeqat",
    theme: "soul",
    translit: "haqīqat",
    urdu: "حقیقت",
    meaning: "Truth; reality as it is, without decoration",
    example: {
      urdu: "حقیقت خواب سے زیادہ تلخ ہے۔",
      translit: "haqīqat ḳhvāb se zyāda talḳh hai.",
      en: "Reality is more bitter than the dream.",
    },
  },
  {
    id: "sahifa",
    theme: "soul",
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
    id: "jugni",
    theme: "soul",
    translit: "jugnī",
    urdu: "جگنی",
    meaning: "The soul's restless inner spark, from Punjabi Sufi folk song",
    example: {
      urdu: "دل کی جگنی پھر جاگ اٹھی۔",
      translit: "dil kī jugnī phir jāg uṭhī.",
      en: "The heart's spark woke again.",
    },
    note: "In folk songs, Jugni wanders the world as the seeking soul.",
  },
  {
    id: "qafas",
    theme: "soul",
    translit: "qafas",
    urdu: "قفس",
    meaning: "A cage; in poetry, whatever keeps the soul from what it loves",
    example: {
      urdu: "پرندہ قفس میں بھی گاتا رہا۔",
      translit: "parinda qafas meñ bhī gātā rahā.",
      en: "The bird kept singing even in its cage.",
    },
  },
];

export function getWord(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id);
}
