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
};

export const POEMS: Poem[] = [
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
    text: "Parh parh ilm te fāzil hoyā\nte kadī apne aap nūñ parhyā ee na",
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
