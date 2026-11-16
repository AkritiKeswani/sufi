// A small curated gallery of Sufi / mystic verse — Rumi (English renderings),
// and Faiz Ahmad Faiz & Bulleh Shah (in transliteration). Kept server-side too,
// so the /api/explain and /api/recite routes only ever act on known poems (the
// client sends an id, never raw text). Line breaks in `text` are intentional
// and are rendered with `whitespace-pre-line`. `lang` hints recitation/meaning.
export type Poem = {
  id: string;
  text: string;
  author: string;
  lang: "en" | "ur" | "pa";
  // The verse in Urdu script (Nastaliq), when we have it. `text` then holds
  // the Roman transliteration, line for line.
  urdu?: string;
  // A plain-English rendering shown beneath the verse.
  translation?: string;
  // An optional hand-written reading. When present the app shows this instead
  // of asking /api/explain — our own words beat a generated gloss.
  meaning?: string;
};

export const POEMS: Poem[] = [
  // ── Mirza Ghalib ──────────────────────────────────────────────────────
  {
    id: "ghalib-khwahishen",
    urdu: "ہزاروں خواہشیں ایسی کہ ہر خواہش پہ دم نکلے\nبہت نکلے مرے ارمان لیکن پھر بھی کم نکلے",
    text: "hazāroñ ḳhvāhisheñ aisī ki har ḳhvāhish pe dam nikle\nbahut nikle mire armān lekin phir bhī kam nikle",
    translation:
      "A thousand desires, each one worth dying for.\nMany of my longings were fulfilled — and still, too few.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-dil-e-nadan",
    urdu: "دلِ ناداں تجھے ہوا کیا ہے\nآخر اس درد کی دوا کیا ہے",
    text: "dil-e-nādāñ tujhe huā kyā hai\nāḳhir is dard kī davā kyā hai",
    translation:
      "Foolish heart, what has come over you?\nWhat, in the end, is the cure for this ache?",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-nikamma",
    urdu: "عشق نے غالبؔ نکما کر دیا\nورنہ ہم بھی آدمی تھے کام کے",
    text: "ishq ne Ġhālib nikammā kar diyā\nvarna ham bhī ādmī the kaam ke",
    translation:
      "Love has made Ghalib good for nothing —\notherwise I, too, was a man of some use.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-jannat",
    urdu: "ہم کو معلوم ہے جنت کی حقیقت لیکن\nدل کے خوش رکھنے کو غالبؔ یہ خیال اچھا ہے",
    text: "ham ko mālūm hai jannat kī haqīqat lekin\ndil ke ḳhush rakhne ko Ġhālib ye ḳhayāl achchhā hai",
    translation:
      "I know the truth about paradise, but —\nto keep the heart happy, Ghalib, it is a pleasant thought.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-na-tha-kuchh",
    urdu: "نہ تھا کچھ تو خدا تھا، کچھ نہ ہوتا تو خدا ہوتا\nڈبویا مجھ کو ہونے نے، نہ ہوتا میں تو کیا ہوتا",
    text: "na thā kuchh to ḳhudā thā, kuchh na hotā to ḳhudā hotā\nḍuboyā mujh ko hone ne, na hotā maiñ to kyā hotā",
    translation:
      "When there was nothing, there was God; had there been nothing, there would be God.\nIt was existing that drowned me — had I not been, what would I have been?",
    author: "Mirza Ghalib",
    lang: "ur",
  },

  // ── Mir Taqi Mir ──────────────────────────────────────────────────────
  {
    id: "mir-patta-patta",
    urdu: "پتا پتا بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے",
    text: "pattā pattā būṭā būṭā haal hamārā jaane hai\njaane na jaane gul hī na jaane bāġh to saarā jaane hai",
    translation:
      "Every leaf, every shrub knows how it is with me.\nOnly the rose does not know — the whole garden knows.",
    author: "Mir Taqi Mir",
    lang: "ur",
  },
  {
    id: "mir-ibtida",
    urdu: "ابتدائے عشق ہے روتا ہے کیا\nآگے آگے دیکھیے ہوتا ہے کیا",
    text: "ibtidā-e-ishq hai rotā hai kyā\naage aage dekhiye hotā hai kyā",
    translation:
      "This is only love's beginning — why weep already?\nWait and see what lies further on.",
    author: "Mir Taqi Mir",
    lang: "ur",
  },

  // ── Momin Khan Momin ──────────────────────────────────────────────────
  {
    id: "momin-goya",
    urdu: "تم مرے پاس ہوتے ہو گویا\nجب کوئی دوسرا نہیں ہوتا",
    text: "tum mire paas hote ho goyā\njab koī dūsrā nahīñ hotā",
    translation:
      "It is as though you are beside me\nwhenever no one else is.",
    author: "Momin Khan Momin",
    lang: "ur",
  },

  // ── Rumi ──────────────────────────────────────────────────────────────
  {
    id: "field",
    text: "Out beyond ideas of wrongdoing\nand rightdoing, there is a field.\nI’ll meet you there.",
    author: "Rumi",
    lang: "en",
  },
  {
    id: "wound",
    text: "The wound is the place\nwhere the Light enters you.",
    author: "Rumi",
    lang: "en",
  },
  {
    id: "silence",
    text: "The quieter you become,\nthe more you are able to hear.",
    author: "Rumi",
    lang: "en",
  },
  {
    id: "prison",
    text: "Why do you stay in prison\nwhen the door is so wide open?",
    author: "Rumi",
    lang: "en",
  },

  // ── Faiz Ahmad Faiz ────────────────────────────────────────────────────
  {
    id: "faiz-dukh",
    text: "aur bhī dukh haiñ zamāne meñ mohabbat ke sivā\nrāhateñ aur bhī haiñ vasl kī rāhat ke sivā",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-gulon",
    text: "guloñ meñ rang bhare bād-e-nau-bahār chale\nchale bhī aao ki gulshan kā kārobār chale",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-dil",
    text: "dil nā-umīd to nahīñ nākām hī to hai\nlambī hai ġham kī shaam magar shaam hī to hai",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-qalam",
    text: "ham parvarish-e-lauh-o-qalam karte raheñge\njo dil pe guzartī hai raqam karte raheñge",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },

  // ── Bulleh Shah ────────────────────────────────────────────────────────
  {
    id: "bulleh-kaun",
    text: "Na maiñ momin vich masītāñ\nna maiñ vich kufr diyāñ rītāñ\nBulleyā! ki jaanā maiñ kaun",
    author: "Bulleh Shah",
    lang: "pa",
  },
  {
    id: "bulleh-parh",
    text: [
      "Ho parh parh ilm te faazil hoya",
      "Te kaday apnay aap nu parhya na",
      "Ho bhaj bhaj warna ay mandir maseeti",
      "Te kaday mann apnay wich wareya naa",
      "Ho larna ay roz shaitaan de naal",
      "Te kadi nafs apnay naal larya na",
      "Ho Bulleh Shah asmaani ud-deya pharonda ay",
      "Te jera ghar betha unoon pharya naee",
    ].join("\n"),
    author: "Bulleh Shah",
    lang: "pa",
  },
  {
    id: "bulleh-ishq",
    text: "Ranjhā Ranjhā kardī ni maiñ\naape Ranjhā hoī",
    author: "Bulleh Shah",
    lang: "pa",
  },

  // ── Javed Akhtar ───────────────────────────────────────────────────────
  {
    id: "javed-imarat",
    text: "ūñchī imāratoñ se makāñ merā ghir gayā\nkuchh log mere hisse kā sūraj bhī khā ga.e",
    author: "Javed Akhtar",
    lang: "ur",
  },
  {
    id: "javed-khwab",
    text: "kabhī jo ḳhvāb thā vo pā liyā hai\nmagar jo kho ga.ī vo chiiz kyā thī",
    author: "Javed Akhtar",
    lang: "ur",
  },
  {
    id: "javed-khuddari",
    text: "mujhe dushman se bhī ḳhuddārī kī ummīd rahtī hai\nkisī kā bhī ho sar qadmoñ meñ sar achchhā nahīñ lagtā",
    author: "Javed Akhtar",
    lang: "ur",
  },
];

export function getPoem(id: string): Poem | undefined {
  return POEMS.find((p) => p.id === id);
}
