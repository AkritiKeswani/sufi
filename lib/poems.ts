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
    text: "hazaron khvahishein aisi ki har khvahish pe dam nikle\nbahut nikle mire arman lekin phir bhi kam nikle",
    translation:
      "A thousand desires, each one worth dying for.\nMany of my longings were fulfilled — and still, too few.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-dil-e-nadan",
    urdu: "دلِ ناداں تجھے ہوا کیا ہے\nآخر اس درد کی دوا کیا ہے",
    text: "dil-e-nadan tujhe hua kya hai\nakhir is dard ki dava kya hai",
    translation:
      "Foolish heart, what has come over you?\nWhat, in the end, is the cure for this ache?",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-nikamma",
    urdu: "عشق نے غالبؔ نکما کر دیا\nورنہ ہم بھی آدمی تھے کام کے",
    text: "ishq ne Ġhalib nikamma kar diya\nvarna ham bhi admi the kaam ke",
    translation:
      "Love has made Ghalib good for nothing —\notherwise I, too, was a man of some use.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-jannat",
    urdu: "ہم کو معلوم ہے جنت کی حقیقت لیکن\nدل کے خوش رکھنے کو غالبؔ یہ خیال اچھا ہے",
    text: "ham ko malum hai jannat ki haqiqat lekin\ndil ke khush rakhne ko Ġhalib ye khayal achchha hai",
    translation:
      "I know the truth about paradise, but —\nto keep the heart happy, Ghalib, it is a pleasant thought.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-na-tha-kuchh",
    urdu: "نہ تھا کچھ تو خدا تھا، کچھ نہ ہوتا تو خدا ہوتا\nڈبویا مجھ کو ہونے نے، نہ ہوتا میں تو کیا ہوتا",
    text: "na tha kuchh to khuda tha, kuchh na hota to khuda hota\nduboya mujh ko hone ne, na hota main to kya hota",
    translation:
      "When there was nothing, there was God; had there been nothing, there would be God.\nIt was existing that drowned me — had I not been, what would I have been?",
    author: "Mirza Ghalib",
    lang: "ur",
  },

  // ── Mir Taqi Mir ──────────────────────────────────────────────────────
  {
    id: "mir-patta-patta",
    urdu: "پتا پتا بوٹا بوٹا حال ہمارا جانے ہے\nجانے نہ جانے گل ہی نہ جانے باغ تو سارا جانے ہے",
    text: "patta patta buta buta haal hamara jaane hai\njaane na jaane gul hi na jaane bagh to saara jaane hai",
    translation:
      "Every leaf, every shrub knows how it is with me.\nOnly the rose does not know — the whole garden knows.",
    author: "Mir Taqi Mir",
    lang: "ur",
  },
  {
    id: "mir-ibtida",
    urdu: "ابتدائے عشق ہے روتا ہے کیا\nآگے آگے دیکھیے ہوتا ہے کیا",
    text: "ibtida-e-ishq hai rota hai kya\naage aage dekhiye hota hai kya",
    translation:
      "This is only love's beginning — why weep already?\nWait and see what lies further on.",
    author: "Mir Taqi Mir",
    lang: "ur",
  },

  // ── Momin Khan Momin ──────────────────────────────────────────────────
  {
    id: "momin-goya",
    urdu: "تم مرے پاس ہوتے ہو گویا\nجب کوئی دوسرا نہیں ہوتا",
    text: "tum mire paas hote ho goya\njab koi dusra nahin hota",
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
    text: "aur bhi dukh hain zamane mein mohabbat ke siva\nrahatein aur bhi hain vasl ki rahat ke siva",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-gulon",
    text: "gulon mein rang bhare bad-e-nau-bahar chale\nchale bhi aao ki gulshan ka karobar chale",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-dil",
    text: "dil na-umid to nahin nakam hi to hai\nlambi hai gham ki shaam magar shaam hi to hai",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },
  {
    id: "faiz-qalam",
    text: "ham parvarish-e-lauh-o-qalam karte raheinge\njo dil pe guzarti hai raqam karte raheinge",
    author: "Faiz Ahmad Faiz",
    lang: "ur",
  },

  // ── Bulleh Shah ────────────────────────────────────────────────────────
  {
    id: "bulleh-kaun",
    text: "Na main momin vich masitan\nna main vich kufr diyan ritan\nBulleya! ki jaana main kaun",
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
    text: "Ranjha Ranjha kardi ni main\naape Ranjha hoi",
    author: "Bulleh Shah",
    lang: "pa",
  },

  // ── More classical couplets ───────────────────────────────────────────
  {
    id: "ghalib-raunaq",
    urdu: "ان کے دیکھے سے جو آ جاتی ہے منہ پر رونق\nوہ سمجھتے ہیں کہ بیمار کا حال اچھا ہے",
    text: "un ke dekhe se jo aa jaati hai munh par raunaq\nvo samajhte hain ki bimar ka haal achchha hai",
    translation:
      "One look from her and colour floods my face;\nso she thinks the patient must be doing well.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-lahu",
    urdu: "رگوں میں دوڑتے پھرنے کے ہم نہیں قائل\nجب آنکھ ہی سے نہ ٹپکا تو پھر لہو کیا ہے",
    text: "ragon mein daudte phirne ke ham nahin qaail\njab aankh hi se na tapka to phir lahu kya hai",
    translation:
      "I am not convinced by blood that only runs through veins;\nif it never fell from the eye, what kind of blood is that?",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-qudrat",
    urdu: "وہ آئیں گھر میں ہمارے خدا کی قدرت ہے\nکبھی ہم ان کو کبھی اپنے گھر کو دیکھتے ہیں",
    text: "vo aaye ghar mein hamare khuda ki qudrat hai\nkabhi ham un ko kabhi apne ghar ko dekhte hain",
    translation:
      "That she came to my home is a miracle of God;\nI keep looking at her, then at my home, in wonder.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "ghalib-haq",
    urdu: "جان دی دی ہوئی اسی کی تھی\nحق تو یوں ہے کہ حق ادا نہ ہوا",
    text: "jaan di, di hui usi ki thi\nhaq to yun hai ki haq ada na hua",
    translation:
      "I gave my life, but that life was His gift to begin with;\nthe truth is, the debt was never really paid.",
    author: "Mirza Ghalib",
    lang: "ur",
  },
  {
    id: "mir-but-kade",
    urdu: "اب تو جاتے ہیں بت کدے سے میرؔ\nپھر ملیں گے اگر خدا لایا",
    text: "ab to jaate hain but-kade se 'mir'\nphir milenge agar khuda laaya",
    translation:
      "Mir is leaving the temple of idols for now;\nwe'll meet again, if God brings us back.",
    author: "Mir Taqi Mir",
    lang: "ur",
  },
  {
    id: "akbar-badnam",
    urdu: "ہم آہ بھی کرتے ہیں تو ہو جاتے ہیں بدنام\nوہ قتل بھی کرتے ہیں تو چرچا نہیں ہوتا",
    text: "ham aah bhi karte hain to ho jaate hain badnaam\nvo qatl bhi karte hain to charcha nahin hota",
    translation:
      "If I so much as sigh, I am disgraced;\nshe can commit murder and no one says a word.",
    author: "Akbar Allahabadi",
    lang: "ur",
  },
  {
    id: "nasikh-zinda-dili",
    urdu: "زندگی زندہ دلی کا ہے نام\nمردہ دل خاک جیا کرتے ہیں",
    text: "zindagi zinda-dili ka hai naam\nmurda-dil khaak jiya karte hain",
    translation:
      "Life is just another name for a lively heart;\nthose with dead hearts hardly live at all.",
    author: "Imam Bakhsh Nasikh",
    lang: "ur",
  },
  {
    id: "bismil-sarfaroshi",
    urdu: "سرفروشی کی تمنا اب ہمارے دل میں ہے\nدیکھنا ہے زور کتنا بازوئے قاتل میں ہے",
    text: "sarfaroshi ki tamanna ab hamare dil mein hai\ndekhna hai zor kitna baazu-e-qaatil mein hai",
    translation:
      "The longing to give my life now fills my heart;\nlet's see how much strength the killer's arm holds.",
    author: "Bismil Azimabadi",
    lang: "ur",
  },

  // ── Javed Akhtar ───────────────────────────────────────────────────────
  {
    id: "javed-imarat",
    text: "unchi imaraton se makan mera ghir gaya\nkuchh log mere hisse ka suraj bhi kha gaye",
    author: "Javed Akhtar",
    lang: "ur",
  },
  {
    id: "javed-khwab",
    text: "kabhi jo khvab tha vo pa liya hai\nmagar jo kho gayi vo chiiz kya thi",
    author: "Javed Akhtar",
    lang: "ur",
  },
  {
    id: "javed-khuddari",
    text: "mujhe dushman se bhi khuddari ki ummid rahti hai\nkisi ka bhi ho sar qadmon mein sar achchha nahin lagta",
    author: "Javed Akhtar",
    lang: "ur",
  },
];

export function getPoem(id: string): Poem | undefined {
  return POEMS.find((p) => p.id === id);
}
