type FlagMap = {
  [key: string]: string;
};

export const flags: FlagMap = {
  sv: "se", // Swedish -> Sweden
  da: "dk", // Danish -> Denmark
  en: "gb", // English -> United Kingdom
  uk: "ua", // Ukrainian -> Ukraine
  sq: "al", // Albanian -> Albania
  nb: "no", // Norwegian Bokmål -> Norway
  nn: "no", // Norwegian Nynorsk -> Norway
  zh: "cn", // Chinese -> China
  el: "gr", // Greek -> Greece
  ga: "ie", // Irish -> Ireland
  ar: "sa", // Arabic -> Saudi Arabia
  fa: "ir", // Persian (Farsi) -> Iran
  he: "il", // Hebrew -> Israel
  hi: "in", // Hindi -> India
  ko: "kr", // Korean -> South Korea
  ja: "jp", // Japanese -> Japan
  mn: "mn", // Mongolian -> Mongolia
  th: "th", // Thai -> Thailand
  vi: "vn", // Vietnamese -> Vietnam
  et: "ee", // Estonian -> Estonia
  lv: "lv", // Latvian -> Latvia
  lt: "lt", // Lithuanian -> Lithuania
  be: "by", // Belarusian -> Belarus
  bg: "bg", // Bulgarian -> Bulgaria
  mk: "mk", // Macedonian -> North Macedonia
  sr: "rs", // Serbian -> Serbia
  hr: "hr", // Croatian -> Croatia
  sl: "si", // Slovenian -> Slovenia
  bs: "ba", // Bosnian -> Bosnia and Herzegovina
  cs: "cz", // Czech -> Czech Republic
  sk: "sk", // Slovak -> Slovakia
  hu: "hu", // Hungarian -> Hungary
  ro: "ro", // Romanian -> Romania
  // Add more as required
};

export const translate = (lang: string): string => {
  if (flags[lang]) return flags[lang];
  return lang;
};
