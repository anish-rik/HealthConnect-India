export type LangCode = "en" | "kn" | "bn" | "hi" | "ta" | "te" | "ml";

export const LANGUAGES: { code: LangCode; label: string; htmlLang: string }[] = [
  { code: "en", label: "English", htmlLang: "en" },
  { code: "kn", label: "ಕನ್ನಡ", htmlLang: "kn" },
  { code: "bn", label: "বাংলা", htmlLang: "bn" },
  { code: "hi", label: "हिन्दी", htmlLang: "hi" },
  { code: "ta", label: "தமிழ்", htmlLang: "ta" },
  { code: "te", label: "తెలుగు", htmlLang: "te" },
  { code: "ml", label: "മലയാളം", htmlLang: "ml" },
];

export type Dict = {
  nav: { home: string; records: string; appointments: string; help: string; cta: string };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    trust1: string;
    trust2: string;
    trust3: string;
    mockTitle: string;
    mockSubtitle: string;
    mockItem1: string;
    mockItem2: string;
    mockItem3: string;
  };
  how: {
    eyebrow: string;
    heading: string;
    s1Title: string; s1Text: string;
    s2Title: string; s2Text: string;
    s3Title: string; s3Text: string;
  };
  features: {
    heading: string;
    f1Title: string; f1Text: string;
    f2Title: string; f2Text: string;
    f3Title: string; f3Text: string;
    f4Title: string; f4Text: string;
  };
  trust: {
    heading: string;
    body: string;
    badge1: string;
    badge2: string;
    badge3: string;
    note: string;
  };
  personas: {
    heading: string;
    p1Name: string; p1Loc: string; p1Quote: string;
    p2Name: string; p2Loc: string; p2Quote: string;
    p3Name: string; p3Loc: string; p3Quote: string;
  };
  footer: {
    tagline: string;
    colLinks: string;
    about: string;
    features: string;
    abhaHelp: string;
    accessibility: string;
    privacy: string;
    by: string;
    bottom: string;
    languageLabel: string;
  };
  a11y: { openMenu: string; closeMenu: string; selectLanguage: string; startScreenReading: string; stopScreenReading: string };
};

export const translations: Record<LangCode, Dict> = {
  en: {
    nav: { home: "Home", records: "My Records", appointments: "Appointments", help: "Help & Support", cta: "Link ABHA ID" },
    hero: {
      title: "Your Health Records, Finally in Your Hands.",
      subtitle: "HealthConnect links with your ABHA ID to show your medical history, prescriptions, and lab reports — in your language, simply.",
      ctaPrimary: "Get Started with ABHA ID",
      ctaSecondary: "What is ABHA? Learn More",
      trust1: "No data stored without your consent",
      trust2: "Built on Govt. of India's ABDM",
      trust3: "Available in 7 Indian languages",
      mockTitle: "My Health Records",
      mockSubtitle: "Last updated today",
      mockItem1: "Blood Test Report",
      mockItem2: "Prescription — Dr. Mehta",
      mockItem3: "Visit Summary",
    },
    how: {
      eyebrow: "SIMPLE. STEP BY STEP.",
      heading: "Three steps to your complete health picture",
      s1Title: "Link Your ABHA ID",
      s1Text: "Use your 14-digit ABHA number or scan your QR code to connect your health account.",
      s2Title: "See All Your Records",
      s2Text: "View your prescriptions, lab reports, and visit history from different hospitals in one place.",
      s3Title: "You Control the Sharing",
      s3Text: "Choose which doctor or hospital can view your records. Approve or revoke access anytime.",
    },
    features: {
      heading: "Built for patients who deserve clarity",
      f1Title: "Read in Your Language",
      f1Text: "Medical information becomes easier to follow in the language you know best.",
      f2Title: "Your Health, Over Time",
      f2Text: "See visits, diagnoses, and medicines in a simple timeline instead of confusing records.",
      f3Title: "Consent You Understand",
      f3Text: "Clear consent cards show who can see your records, what they can access, and for how long.",
      f4Title: "Made for India's Languages",
      f4Text: "Switch between English, Kannada, Bengali, Hindi, Tamil, Telugu, and Malayalam with one tap.",
    },
    trust: {
      heading: "Powered by India's National Health Stack",
      body: "HealthConnect is a patient interface layer built on top of ABDM. We do not create a new health ID — we help you use the one you already have.",
      badge1: "ABHA Compatible",
      badge2: "ABDM Compliant",
      badge3: "Student Research Project — Not a Medical Service",
      note: "This is a college IDT lab project. HealthConnect does not store clinical data independently.",
    },
    personas: {
      heading: "Who is this for?",
      p1Name: "Ramesh Uncle, 68", p1Loc: "Nagpur",
      p1Quote: "I always forgot which medicines the doctor gave me last time. Now I just show my phone.",
      p2Name: "Priya, 26", p2Loc: "Chennai",
      p2Quote: "My lab reports were always on paper. Now I can share them with any doctor in seconds.",
      p3Name: "Suresh, 41", p3Loc: "Uttar Pradesh",
      p3Quote: "Earlier I kept losing papers. Now my records are easier to find and understand.",
    },
    footer: {
      tagline: "Patient-first. Privacy-first.",
      colLinks: "Quick Links",
      about: "About", features: "Features", abhaHelp: "ABHA Help", accessibility: "Accessibility", privacy: "Privacy Policy",
      by: "A project by Neon Vector",
      bottom: "© 2025 HealthConnect India. Built on ABDM. Not a medical service.",
      languageLabel: "Language",
    },
    a11y: { openMenu: "Open menu", closeMenu: "Close menu", selectLanguage: "Select language", startScreenReading: "Start screen reading", stopScreenReading: "Stop screen reading" },
  },
  hi: {
    nav: { home: "होम", records: "मेरे रिकॉर्ड", appointments: "अपॉइंटमेंट", help: "सहायता", cta: "ABHA ID जोड़ें" },
    hero: {
      title: "आपके स्वास्थ्य रिकॉर्ड, अब आपके हाथ में।",
      subtitle: "HealthConnect आपकी ABHA ID से जुड़कर आपका मेडिकल इतिहास, पर्चे और लैब रिपोर्ट आपकी भाषा में, सरलता से दिखाता है।",
      ctaPrimary: "ABHA ID से शुरू करें",
      ctaSecondary: "ABHA क्या है? जानें",
      trust1: "आपकी सहमति के बिना कोई डेटा संग्रहीत नहीं",
      trust2: "भारत सरकार के ABDM पर आधारित",
      trust3: "7 भारतीय भाषाओं में उपलब्ध",
      mockTitle: "मेरे स्वास्थ्य रिकॉर्ड",
      mockSubtitle: "आज अपडेट किया गया",
      mockItem1: "रक्त जांच रिपोर्ट",
      mockItem2: "पर्चा — डॉ. मेहता",
      mockItem3: "विज़िट सारांश",
    },
    how: {
      eyebrow: "सरल। कदम दर कदम।",
      heading: "अपनी पूरी स्वास्थ्य तस्वीर तक तीन कदम",
      s1Title: "अपनी ABHA ID जोड़ें",
      s1Text: "अपने 14 अंकों के ABHA नंबर या QR कोड को स्कैन करके अपना स्वास्थ्य खाता जोड़ें।",
      s2Title: "अपने सभी रिकॉर्ड देखें",
      s2Text: "विभिन्न अस्पतालों से अपने पर्चे, लैब रिपोर्ट और विज़िट इतिहास एक ही जगह देखें।",
      s3Title: "साझा करना आप तय करें",
      s3Text: "चुनें कि कौन सा डॉक्टर या अस्पताल आपके रिकॉर्ड देख सकता है। पहुँच कभी भी दें या रद्द करें।",
    },
    features: {
      heading: "उन मरीज़ों के लिए जिन्हें स्पष्टता चाहिए",
      f1Title: "अपनी भाषा में पढ़ें",
      f1Text: "जिस भाषा को आप सबसे अच्छे से जानते हैं उसमें मेडिकल जानकारी समझना आसान हो जाता है।",
      f2Title: "समय के साथ आपका स्वास्थ्य",
      f2Text: "उलझन भरे रिकॉर्ड के बजाय विज़िट, निदान और दवाइयाँ एक सरल टाइमलाइन में देखें।",
      f3Title: "सहमति जिसे आप समझें",
      f3Text: "स्पष्ट सहमति कार्ड दिखाते हैं कि कौन आपके रिकॉर्ड देख सकता है, क्या देख सकता है, और कब तक।",
      f4Title: "भारत की भाषाओं के लिए बना",
      f4Text: "एक टैप में अंग्रेज़ी, कन्नड़, बंगाली, हिन्दी, तमिल, तेलुगु और मलयालम के बीच बदलें।",
    },
    trust: {
      heading: "भारत के राष्ट्रीय स्वास्थ्य स्टैक से संचालित",
      body: "HealthConnect ABDM के ऊपर बनी एक मरीज़ इंटरफ़ेस परत है। हम कोई नई स्वास्थ्य ID नहीं बनाते — हम आपकी मौजूदा ID का उपयोग करने में मदद करते हैं।",
      badge1: "ABHA संगत",
      badge2: "ABDM अनुपालक",
      badge3: "छात्र शोध परियोजना — चिकित्सा सेवा नहीं",
      note: "यह एक कॉलेज IDT लैब परियोजना है। HealthConnect स्वतंत्र रूप से क्लिनिकल डेटा संग्रहीत नहीं करता।",
    },
    personas: {
      heading: "यह किसके लिए है?",
      p1Name: "रमेश अंकल, 68", p1Loc: "नागपुर",
      p1Quote: "मैं हमेशा भूल जाता था कि पिछली बार डॉक्टर ने कौन सी दवाइयाँ दी थीं। अब बस फोन दिखा देता हूँ।",
      p2Name: "प्रिया, 26", p2Loc: "चेन्नई",
      p2Quote: "मेरी लैब रिपोर्ट हमेशा कागज़ पर रहती थीं। अब मैं उन्हें किसी भी डॉक्टर के साथ सेकंडों में साझा कर सकती हूँ।",
      p3Name: "सुरेश, 41", p3Loc: "उत्तर प्रदेश",
      p3Quote: "पहले मेरे कागज़ खो जाते थे। अब मेरे रिकॉर्ड ढूँढना और समझना आसान है।",
    },
    footer: {
      tagline: "मरीज़ पहले। गोपनीयता पहले।",
      colLinks: "त्वरित लिंक",
      about: "हमारे बारे में", features: "विशेषताएँ", abhaHelp: "ABHA सहायता", accessibility: "सुगम्यता", privacy: "गोपनीयता नीति",
      by: "Neon Vector द्वारा एक परियोजना",
      bottom: "© 2025 HealthConnect India. ABDM पर निर्मित। चिकित्सा सेवा नहीं।",
      languageLabel: "भाषा",
    },
    a11y: { openMenu: "मेनू खोलें", closeMenu: "मेनू बंद करें", selectLanguage: "भाषा चुनें", startScreenReading: "स्क्रीन रीडिंग शुरू करें", stopScreenReading: "स्क्रीन रीडिंग बंद करें" },
  },
  kn: {
    nav: { home: "ಮುಖಪುಟ", records: "ನನ್ನ ದಾಖಲೆಗಳು", appointments: "ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್‌ಗಳು", help: "ಸಹಾಯ", cta: "ABHA ID ಜೋಡಿಸಿ" },
    hero: {
      title: "ನಿಮ್ಮ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು, ಅಂತಿಮವಾಗಿ ನಿಮ್ಮ ಕೈಯಲ್ಲಿ.",
      subtitle: "HealthConnect ನಿಮ್ಮ ABHA ID ಗೆ ಸಂಪರ್ಕಿಸಿ ನಿಮ್ಮ ವೈದ್ಯಕೀಯ ಇತಿಹಾಸ, ಔಷಧಿ ಚೀಟಿಗಳು ಮತ್ತು ಲ್ಯಾಬ್ ವರದಿಗಳನ್ನು ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಸರಳವಾಗಿ ತೋರಿಸುತ್ತದೆ.",
      ctaPrimary: "ABHA ID ಯೊಂದಿಗೆ ಪ್ರಾರಂಭಿಸಿ",
      ctaSecondary: "ABHA ಎಂದರೇನು? ತಿಳಿಯಿರಿ",
      trust1: "ನಿಮ್ಮ ಒಪ್ಪಿಗೆ ಇಲ್ಲದೆ ಯಾವುದೇ ಡೇಟಾ ಸಂಗ್ರಹಿಸಲಾಗುವುದಿಲ್ಲ",
      trust2: "ಭಾರತ ಸರ್ಕಾರದ ABDM ಮೇಲೆ ನಿರ್ಮಿಸಲಾಗಿದೆ",
      trust3: "7 ಭಾರತೀಯ ಭಾಷೆಗಳಲ್ಲಿ ಲಭ್ಯ",
      mockTitle: "ನನ್ನ ಆರೋಗ್ಯ ದಾಖಲೆಗಳು",
      mockSubtitle: "ಇಂದು ನವೀಕರಿಸಲಾಗಿದೆ",
      mockItem1: "ರಕ್ತ ಪರೀಕ್ಷೆ ವರದಿ",
      mockItem2: "ಔಷಧಿ ಚೀಟಿ — ಡಾ. ಮೆಹ್ತಾ",
      mockItem3: "ಭೇಟಿ ಸಾರಾಂಶ",
    },
    how: {
      eyebrow: "ಸರಳ. ಹಂತ ಹಂತವಾಗಿ.",
      heading: "ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಆರೋಗ್ಯ ಚಿತ್ರಕ್ಕೆ ಮೂರು ಹಂತಗಳು",
      s1Title: "ನಿಮ್ಮ ABHA ID ಜೋಡಿಸಿ",
      s1Text: "ನಿಮ್ಮ 14-ಅಂಕಿಯ ABHA ಸಂಖ್ಯೆ ಅಥವಾ QR ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡಿ ನಿಮ್ಮ ಆರೋಗ್ಯ ಖಾತೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ.",
      s2Title: "ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ನೋಡಿ",
      s2Text: "ವಿವಿಧ ಆಸ್ಪತ್ರೆಗಳ ಔಷಧಿ ಚೀಟಿಗಳು, ಲ್ಯಾಬ್ ವರದಿಗಳು ಮತ್ತು ಭೇಟಿಯ ಇತಿಹಾಸವನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ನೋಡಿ.",
      s3Title: "ಹಂಚಿಕೆ ನೀವೇ ನಿಯಂತ್ರಿಸಿ",
      s3Text: "ಯಾವ ವೈದ್ಯ ಅಥವಾ ಆಸ್ಪತ್ರೆ ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ನೋಡಬಹುದು ಎಂದು ಆಯ್ಕೆಮಾಡಿ. ಯಾವಾಗ ಬೇಕಾದರೂ ಪ್ರವೇಶ ನೀಡಿ ಅಥವಾ ರದ್ದುಗೊಳಿಸಿ.",
    },
    features: {
      heading: "ಸ್ಪಷ್ಟತೆಗೆ ಅರ್ಹರಾದ ರೋಗಿಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
      f1Title: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಓದಿ",
      f1Text: "ನೀವು ಚೆನ್ನಾಗಿ ತಿಳಿದಿರುವ ಭಾಷೆಯಲ್ಲಿ ವೈದ್ಯಕೀಯ ಮಾಹಿತಿಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಸುಲಭವಾಗುತ್ತದೆ.",
      f2Title: "ಸಮಯದೊಂದಿಗೆ ನಿಮ್ಮ ಆರೋಗ್ಯ",
      f2Text: "ಗೊಂದಲದ ದಾಖಲೆಗಳ ಬದಲು ಭೇಟಿಗಳು, ರೋಗನಿರ್ಣಯಗಳು ಮತ್ತು ಔಷಧಿಗಳನ್ನು ಸರಳ ಸಮಯರೇಖೆಯಲ್ಲಿ ನೋಡಿ.",
      f3Title: "ನೀವು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವ ಒಪ್ಪಿಗೆ",
      f3Text: "ಯಾರು ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ನೋಡಬಹುದು, ಏನು ನೋಡಬಹುದು, ಎಷ್ಟು ಸಮಯ ಎಂಬುದನ್ನು ಸ್ಪಷ್ಟ ಒಪ್ಪಿಗೆ ಕಾರ್ಡ್‌ಗಳು ತೋರಿಸುತ್ತವೆ.",
      f4Title: "ಭಾರತದ ಭಾಷೆಗಳಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ",
      f4Text: "ಒಂದೇ ಟ್ಯಾಪ್‌ನಲ್ಲಿ ಇಂಗ್ಲಿಷ್, ಕನ್ನಡ, ಬಂಗಾಳಿ, ಹಿಂದಿ, ತಮಿಳು, ತೆಲುಗು ಮತ್ತು ಮಲಯಾಳಂ ನಡುವೆ ಬದಲಿಸಿ.",
    },
    trust: {
      heading: "ಭಾರತದ ರಾಷ್ಟ್ರೀಯ ಆರೋಗ್ಯ ಸ್ಟಾಕ್‌ನಿಂದ ಚಾಲಿತ",
      body: "HealthConnect ABDM ಮೇಲೆ ನಿರ್ಮಿಸಲಾದ ರೋಗಿ ಇಂಟರ್‌ಫೇಸ್ ಪದರವಾಗಿದೆ. ನಾವು ಹೊಸ ಆರೋಗ್ಯ ID ಸೃಷ್ಟಿಸುವುದಿಲ್ಲ — ನಿಮ್ಮ ಬಳಿ ಈಗಾಗಲೇ ಇರುವದನ್ನು ಬಳಸಲು ನೆರವಾಗುತ್ತೇವೆ.",
      badge1: "ABHA ಹೊಂದಾಣಿಕೆ",
      badge2: "ABDM ಅನುಸರಣೆ",
      badge3: "ವಿದ್ಯಾರ್ಥಿ ಸಂಶೋಧನೆ — ವೈದ್ಯಕೀಯ ಸೇವೆಯಲ್ಲ",
      note: "ಇದು ಕಾಲೇಜು IDT ಲ್ಯಾಬ್ ಯೋಜನೆಯಾಗಿದೆ. HealthConnect ಸ್ವತಂತ್ರವಾಗಿ ಕ್ಲಿನಿಕಲ್ ಡೇಟಾ ಸಂಗ್ರಹಿಸುವುದಿಲ್ಲ.",
    },
    personas: {
      heading: "ಇದು ಯಾರಿಗಾಗಿ?",
      p1Name: "ರಮೇಶ್ ಅಂಕಲ್, 68", p1Loc: "ನಾಗಪುರ",
      p1Quote: "ಕಳೆದ ಬಾರಿ ವೈದ್ಯರು ಯಾವ ಔಷಧಿ ಕೊಟ್ಟಿದ್ದರು ಎಂದು ನಾನು ಯಾವಾಗಲೂ ಮರೆಯುತ್ತಿದ್ದೆ. ಈಗ ನಾನು ಫೋನ್ ತೋರಿಸುತ್ತೇನೆ.",
      p2Name: "ಪ್ರಿಯಾ, 26", p2Loc: "ಚೆನ್ನೈ",
      p2Quote: "ನನ್ನ ಲ್ಯಾಬ್ ವರದಿಗಳು ಯಾವಾಗಲೂ ಕಾಗದದ ಮೇಲೆ ಇದ್ದವು. ಈಗ ಯಾವುದೇ ವೈದ್ಯರಿಗೆ ಸೆಕೆಂಡುಗಳಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಬಹುದು.",
      p3Name: "ಸುರೇಶ್, 41", p3Loc: "ಉತ್ತರ ಪ್ರದೇಶ",
      p3Quote: "ಮೊದಲು ಕಾಗದಗಳು ಕಳೆದುಹೋಗುತ್ತಿದ್ದವು. ಈಗ ನನ್ನ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕುವುದು ಮತ್ತು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು ಸುಲಭ.",
    },
    footer: {
      tagline: "ರೋಗಿ ಮೊದಲು. ಗೌಪ್ಯತೆ ಮೊದಲು.",
      colLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
      about: "ನಮ್ಮ ಬಗ್ಗೆ", features: "ವೈಶಿಷ್ಟ್ಯಗಳು", abhaHelp: "ABHA ಸಹಾಯ", accessibility: "ಸುಲಭ ಪ್ರವೇಶ", privacy: "ಗೌಪ್ಯತೆ ನೀತಿ",
      by: "Neon Vector ಯೋಜನೆ",
      bottom: "© 2025 HealthConnect India. ABDM ಮೇಲೆ ನಿರ್ಮಿಸಲಾಗಿದೆ. ವೈದ್ಯಕೀಯ ಸೇವೆಯಲ್ಲ.",
      languageLabel: "ಭಾಷೆ",
    },
    a11y: { openMenu: "ಮೆನು ತೆರೆಯಿರಿ", closeMenu: "ಮೆನು ಮುಚ್ಚಿ", selectLanguage: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ", startScreenReading: "ಪರದೆ ಓದುವುದನ್ನು ಪ್ರಾರಂಭಿಸಿ", stopScreenReading: "ಪರದೆ ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಿ" },
  },
  bn: {
    nav: { home: "হোম", records: "আমার রেকর্ড", appointments: "অ্যাপয়েন্টমেন্ট", help: "সহায়তা", cta: "ABHA ID যুক্ত করুন" },
    hero: {
      title: "আপনার স্বাস্থ্য রেকর্ড, অবশেষে আপনার হাতে।",
      subtitle: "HealthConnect আপনার ABHA ID-এর সাথে যুক্ত হয়ে আপনার চিকিৎসা ইতিহাস, প্রেসক্রিপশন এবং ল্যাব রিপোর্ট আপনার ভাষায় সহজে দেখায়।",
      ctaPrimary: "ABHA ID দিয়ে শুরু করুন",
      ctaSecondary: "ABHA কী? জানুন",
      trust1: "আপনার সম্মতি ছাড়া কোনো ডেটা সংরক্ষণ করা হয় না",
      trust2: "ভারত সরকারের ABDM-এর উপর নির্মিত",
      trust3: "৭টি ভারতীয় ভাষায় উপলব্ধ",
      mockTitle: "আমার স্বাস্থ্য রেকর্ড",
      mockSubtitle: "আজ আপডেট করা হয়েছে",
      mockItem1: "রক্ত পরীক্ষার রিপোর্ট",
      mockItem2: "প্রেসক্রিপশন — ডা. মেহতা",
      mockItem3: "ভিজিট সারাংশ",
    },
    how: {
      eyebrow: "সহজ। ধাপে ধাপে।",
      heading: "আপনার সম্পূর্ণ স্বাস্থ্য চিত্রের জন্য তিনটি ধাপ",
      s1Title: "আপনার ABHA ID যুক্ত করুন",
      s1Text: "আপনার ১৪-সংখ্যার ABHA নম্বর ব্যবহার করুন বা QR কোড স্ক্যান করে আপনার স্বাস্থ্য অ্যাকাউন্ট সংযুক্ত করুন।",
      s2Title: "সব রেকর্ড দেখুন",
      s2Text: "বিভিন্ন হাসপাতালের প্রেসক্রিপশন, ল্যাব রিপোর্ট এবং ভিজিট ইতিহাস এক জায়গায় দেখুন।",
      s3Title: "শেয়ারিং আপনি নিয়ন্ত্রণ করেন",
      s3Text: "কোন ডাক্তার বা হাসপাতাল আপনার রেকর্ড দেখতে পারবে তা বেছে নিন। যেকোনো সময় অ্যাক্সেস দিন বা প্রত্যাহার করুন।",
    },
    features: {
      heading: "যে রোগীরা স্পষ্টতা পাওয়ার যোগ্য তাদের জন্য তৈরি",
      f1Title: "আপনার ভাষায় পড়ুন",
      f1Text: "যে ভাষাটি আপনি ভালো জানেন সেই ভাষায় চিকিৎসা তথ্য বোঝা সহজ হয়ে যায়।",
      f2Title: "সময়ের সাথে আপনার স্বাস্থ্য",
      f2Text: "বিভ্রান্তিকর রেকর্ডের পরিবর্তে ভিজিট, রোগ নির্ণয় এবং ওষুধ একটি সহজ টাইমলাইনে দেখুন।",
      f3Title: "আপনি বুঝবেন এমন সম্মতি",
      f3Text: "স্পষ্ট সম্মতি কার্ড দেখায় কে আপনার রেকর্ড দেখতে পারবে, কী দেখতে পারবে এবং কতক্ষণ।",
      f4Title: "ভারতের ভাষাগুলির জন্য তৈরি",
      f4Text: "এক ট্যাপে ইংরেজি, কন্নড়, বাংলা, হিন্দি, তামিল, তেলুগু এবং মালয়ালমের মধ্যে পরিবর্তন করুন।",
    },
    trust: {
      heading: "ভারতের জাতীয় স্বাস্থ্য স্ট্যাক দ্বারা চালিত",
      body: "HealthConnect ABDM-এর উপর নির্মিত একটি রোগী ইন্টারফেস স্তর। আমরা নতুন স্বাস্থ্য ID তৈরি করি না — আপনার বিদ্যমান ID ব্যবহারে সাহায্য করি।",
      badge1: "ABHA সামঞ্জস্যপূর্ণ",
      badge2: "ABDM সম্মত",
      badge3: "ছাত্র গবেষণা প্রকল্প — চিকিৎসা সেবা নয়",
      note: "এটি একটি কলেজ IDT ল্যাব প্রকল্প। HealthConnect স্বাধীনভাবে ক্লিনিকাল ডেটা সংরক্ষণ করে না।",
    },
    personas: {
      heading: "এটি কার জন্য?",
      p1Name: "রমেশ আঙ্কেল, ৬৮", p1Loc: "নাগপুর",
      p1Quote: "গতবার ডাক্তার কোন ওষুধ দিয়েছিলেন তা আমি সবসময় ভুলে যেতাম। এখন শুধু ফোন দেখাই।",
      p2Name: "প্রিয়া, ২৬", p2Loc: "চেন্নাই",
      p2Quote: "আমার ল্যাব রিপোর্ট সবসময় কাগজে থাকত। এখন যেকোনো ডাক্তারের সাথে সেকেন্ডে শেয়ার করতে পারি।",
      p3Name: "সুরেশ, ৪১", p3Loc: "উত্তর প্রদেশ",
      p3Quote: "আগে কাগজ হারাতাম। এখন আমার রেকর্ড খুঁজে পাওয়া এবং বোঝা সহজ।",
    },
    footer: {
      tagline: "রোগী প্রথমে। গোপনীয়তা প্রথমে।",
      colLinks: "দ্রুত লিঙ্ক",
      about: "সম্পর্কে", features: "বৈশিষ্ট্য", abhaHelp: "ABHA সহায়তা", accessibility: "অ্যাক্সেসিবিলিটি", privacy: "গোপনীয়তা নীতি",
      by: "Neon Vector-এর একটি প্রকল্প",
      bottom: "© ২০২৫ HealthConnect India. ABDM-এর উপর নির্মিত। চিকিৎসা সেবা নয়।",
      languageLabel: "ভাষা",
    },
    a11y: { openMenu: "মেনু খুলুন", closeMenu: "মেনু বন্ধ করুন", selectLanguage: "ভাষা নির্বাচন করুন", startScreenReading: "স্ক্রিন রিডিং শুরু করুন", stopScreenReading: "স্ক্রিন রিডিং বন্ধ করুন" },
  },
  ta: {
    nav: { home: "முகப்பு", records: "என் பதிவுகள்", appointments: "சந்திப்புகள்", help: "உதவி", cta: "ABHA ID இணைக்கவும்" },
    hero: {
      title: "உங்கள் சுகாதார பதிவுகள், இறுதியாக உங்கள் கையில்.",
      subtitle: "HealthConnect உங்கள் ABHA ID உடன் இணைந்து உங்கள் மருத்துவ வரலாறு, மருந்துச்சீட்டுகள் மற்றும் ஆய்வக அறிக்கைகளை உங்கள் மொழியில் எளிமையாக காட்டுகிறது.",
      ctaPrimary: "ABHA ID மூலம் தொடங்குங்கள்",
      ctaSecondary: "ABHA என்றால் என்ன? அறியுங்கள்",
      trust1: "உங்கள் ஒப்புதல் இல்லாமல் தரவு சேமிக்கப்படாது",
      trust2: "இந்திய அரசின் ABDM-இல் கட்டப்பட்டது",
      trust3: "7 இந்திய மொழிகளில் கிடைக்கிறது",
      mockTitle: "என் சுகாதார பதிவுகள்",
      mockSubtitle: "இன்று புதுப்பிக்கப்பட்டது",
      mockItem1: "இரத்த பரிசோதனை அறிக்கை",
      mockItem2: "மருந்துச்சீட்டு — டாக்டர் மேத்தா",
      mockItem3: "வருகை சுருக்கம்",
    },
    how: {
      eyebrow: "எளிது. படிப்படியாக.",
      heading: "உங்கள் முழுமையான சுகாதார படத்திற்கு மூன்று படிகள்",
      s1Title: "உங்கள் ABHA ID இணைக்கவும்",
      s1Text: "உங்கள் 14-இலக்க ABHA எண் அல்லது QR குறியீட்டை ஸ்கேன் செய்து உங்கள் சுகாதார கணக்கை இணைக்கவும்.",
      s2Title: "அனைத்து பதிவுகளையும் பாருங்கள்",
      s2Text: "வெவ்வேறு மருத்துவமனைகளின் மருந்துச்சீட்டுகள், ஆய்வக அறிக்கைகள் மற்றும் வருகை வரலாற்றை ஒரே இடத்தில் பாருங்கள்.",
      s3Title: "பகிர்வை நீங்கள் கட்டுப்படுத்துங்கள்",
      s3Text: "எந்த மருத்துவர் அல்லது மருத்துவமனை உங்கள் பதிவுகளை பார்க்கலாம் என்பதை தேர்ந்தெடுக்கவும். எப்போது வேண்டுமானாலும் அணுகலை வழங்கலாம் அல்லது ரத்து செய்யலாம்.",
    },
    features: {
      heading: "தெளிவை தகுதியான நோயாளிகளுக்காக கட்டப்பட்டது",
      f1Title: "உங்கள் மொழியில் படியுங்கள்",
      f1Text: "நீங்கள் நன்கு அறிந்த மொழியில் மருத்துவ தகவல் புரிந்துகொள்வது எளிதாகிறது.",
      f2Title: "காலத்தோடு உங்கள் சுகாதாரம்",
      f2Text: "குழப்பமான பதிவுகளுக்கு பதிலாக வருகைகள், நோயறிதல்கள் மற்றும் மருந்துகளை எளிய காலவரிசையில் பாருங்கள்.",
      f3Title: "நீங்கள் புரிந்துகொள்ளும் ஒப்புதல்",
      f3Text: "யார் உங்கள் பதிவுகளை பார்க்கலாம், என்ன பார்க்கலாம், எவ்வளவு காலம் என்பதை தெளிவான ஒப்புதல் அட்டைகள் காட்டுகின்றன.",
      f4Title: "இந்தியாவின் மொழிகளுக்காக உருவாக்கப்பட்டது",
      f4Text: "ஒரே தட்டலில் ஆங்கிலம், கன்னடம், வங்காளம், இந்தி, தமிழ், தெலுங்கு மற்றும் மலையாளம் இடையே மாறுங்கள்.",
    },
    trust: {
      heading: "இந்தியாவின் தேசிய சுகாதார ஸ்டாக்கால் இயக்கப்படுகிறது",
      body: "HealthConnect என்பது ABDM-இன் மேல் கட்டப்பட்ட ஒரு நோயாளி இடைமுக அடுக்கு. நாங்கள் புதிய சுகாதார ID உருவாக்கவில்லை — உங்களிடம் ஏற்கனவே உள்ளதை பயன்படுத்த உதவுகிறோம்.",
      badge1: "ABHA இணக்கமான",
      badge2: "ABDM இணக்கமான",
      badge3: "மாணவர் ஆராய்ச்சி — மருத்துவ சேவை அல்ல",
      note: "இது ஒரு கல்லூரி IDT ஆய்வக திட்டம். HealthConnect மருத்துவ தரவை சுயாதீனமாக சேமிக்கவில்லை.",
    },
    personas: {
      heading: "இது யாருக்காக?",
      p1Name: "ரமேஷ் மாமா, 68", p1Loc: "நாக்பூர்",
      p1Quote: "கடந்த முறை மருத்துவர் எந்த மருந்து கொடுத்தார் என்பதை எப்போதும் மறந்துவிடுவேன். இப்போது வெறும் தொலைபேசியை காட்டுகிறேன்.",
      p2Name: "பிரியா, 26", p2Loc: "சென்னை",
      p2Quote: "என் ஆய்வக அறிக்கைகள் எப்போதும் காகிதத்தில் இருந்தன. இப்போது எந்த மருத்துவருடனும் வினாடிகளில் பகிரலாம்.",
      p3Name: "சுரேஷ், 41", p3Loc: "உத்தர பிரதேசம்",
      p3Quote: "முன்பு காகிதங்கள் தொலைந்துபோகும். இப்போது என் பதிவுகளை கண்டுபிடிப்பதும் புரிந்துகொள்வதும் எளிது.",
    },
    footer: {
      tagline: "நோயாளி முதலில். தனியுரிமை முதலில்.",
      colLinks: "விரைவு இணைப்புகள்",
      about: "எங்களைப் பற்றி", features: "அம்சங்கள்", abhaHelp: "ABHA உதவி", accessibility: "அணுகல்", privacy: "தனியுரிமை கொள்கை",
      by: "Neon Vector உருவாக்கிய திட்டம்",
      bottom: "© 2025 HealthConnect India. ABDM-இல் கட்டப்பட்டது. மருத்துவ சேவை அல்ல.",
      languageLabel: "மொழி",
    },
    a11y: { openMenu: "மெனுவைத் திற", closeMenu: "மெனுவை மூடு", selectLanguage: "மொழியைத் தேர்ந்தெடு", startScreenReading: "திரை வாசிப்பைத் தொடங்கு", stopScreenReading: "திரை வாசிப்பை நிறுத்து" },
  },
  te: {
    nav: { home: "హోమ్", records: "నా రికార్డులు", appointments: "అపాయింట్‌మెంట్‌లు", help: "సహాయం", cta: "ABHA ID లింక్ చేయండి" },
    hero: {
      title: "మీ ఆరోగ్య రికార్డులు, చివరికి మీ చేతిలో.",
      subtitle: "HealthConnect మీ ABHA IDతో అనుసంధానమై మీ వైద్య చరిత్ర, మందుల చీటీలు మరియు ల్యాబ్ నివేదికలను మీ భాషలో సరళంగా చూపుతుంది.",
      ctaPrimary: "ABHA IDతో ప్రారంభించండి",
      ctaSecondary: "ABHA అంటే ఏమిటి? తెలుసుకోండి",
      trust1: "మీ సమ్మతి లేకుండా ఎటువంటి డేటా నిల్వ చేయబడదు",
      trust2: "భారత ప్రభుత్వ ABDMపై నిర్మించబడింది",
      trust3: "7 భారతీయ భాషలలో అందుబాటులో",
      mockTitle: "నా ఆరోగ్య రికార్డులు",
      mockSubtitle: "ఈరోజు నవీకరించబడింది",
      mockItem1: "రక్త పరీక్ష నివేదిక",
      mockItem2: "మందుల చీటీ — డా. మెహతా",
      mockItem3: "సందర్శన సారాంశం",
    },
    how: {
      eyebrow: "సరళం. అడుగు అడుగుగా.",
      heading: "మీ సంపూర్ణ ఆరోగ్య చిత్రానికి మూడు అడుగులు",
      s1Title: "మీ ABHA ID లింక్ చేయండి",
      s1Text: "మీ 14-అంకెల ABHA నంబర్ లేదా QR కోడ్‌ను స్కాన్ చేసి మీ ఆరోగ్య ఖాతాను కనెక్ట్ చేయండి.",
      s2Title: "అన్ని రికార్డులను చూడండి",
      s2Text: "వేర్వేరు ఆసుపత్రుల నుండి మీ మందుల చీటీలు, ల్యాబ్ నివేదికలు మరియు సందర్శన చరిత్రను ఒకే చోట చూడండి.",
      s3Title: "షేరింగ్ మీరే నియంత్రిస్తారు",
      s3Text: "ఏ వైద్యుడు లేదా ఆసుపత్రి మీ రికార్డులను చూడగలదో ఎంచుకోండి. ఎప్పుడైనా ప్రాప్యత ఇవ్వండి లేదా రద్దు చేయండి.",
    },
    features: {
      heading: "స్పష్టతకు అర్హులైన రోగుల కోసం నిర్మించబడింది",
      f1Title: "మీ భాషలో చదవండి",
      f1Text: "మీకు బాగా తెలిసిన భాషలో వైద్య సమాచారం అర్థం చేసుకోవడం సులభం అవుతుంది.",
      f2Title: "కాలంతో మీ ఆరోగ్యం",
      f2Text: "గందరగోళ రికార్డులకు బదులుగా సందర్శనలు, నిర్ధారణలు మరియు మందులను సరళమైన టైమ్‌లైన్‌లో చూడండి.",
      f3Title: "మీరు అర్థం చేసుకునే సమ్మతి",
      f3Text: "ఎవరు మీ రికార్డులను చూడగలరు, ఏమి చూడగలరు, ఎంతకాలం అనేది స్పష్టమైన సమ్మతి కార్డులు చూపుతాయి.",
      f4Title: "భారతదేశ భాషల కోసం రూపొందించబడింది",
      f4Text: "ఒక్క ట్యాప్‌తో ఇంగ్లీష్, కన్నడ, బెంగాలీ, హిందీ, తమిళం, తెలుగు మరియు మలయాళం మధ్య మారండి.",
    },
    trust: {
      heading: "భారతదేశ జాతీయ ఆరోగ్య స్టాక్‌తో శక్తినిచ్చబడింది",
      body: "HealthConnect ABDM పైన నిర్మించబడిన రోగి ఇంటర్‌ఫేస్ పొర. మేము కొత్త ఆరోగ్య IDని సృష్టించము — మీకు ఇప్పటికే ఉన్నదాన్ని ఉపయోగించడంలో సహాయం చేస్తాము.",
      badge1: "ABHA అనుకూలం",
      badge2: "ABDM అనుగుణం",
      badge3: "విద్యార్థి పరిశోధన — వైద్య సేవ కాదు",
      note: "ఇది కళాశాల IDT ల్యాబ్ ప్రాజెక్ట్. HealthConnect స్వతంత్రంగా క్లినికల్ డేటాను నిల్వ చేయదు.",
    },
    personas: {
      heading: "ఇది ఎవరి కోసం?",
      p1Name: "రమేష్ అంకుల్, 68", p1Loc: "నాగపూర్",
      p1Quote: "గత సారి డాక్టర్ ఏ మందులు ఇచ్చారో నేను ఎల్లప్పుడూ మర్చిపోతాను. ఇప్పుడు ఫోన్ చూపిస్తాను.",
      p2Name: "ప్రియ, 26", p2Loc: "చెన్నై",
      p2Quote: "నా ల్యాబ్ నివేదికలు ఎల్లప్పుడూ కాగితంపై ఉండేవి. ఇప్పుడు ఏ వైద్యుడితోనైనా సెకన్లలో పంచుకోగలను.",
      p3Name: "సురేష్, 41", p3Loc: "ఉత్తర ప్రదేశ్",
      p3Quote: "ఇంతకు ముందు కాగితాలు పోతాయి. ఇప్పుడు నా రికార్డులు కనుగొనడం మరియు అర్థం చేసుకోవడం సులభం.",
    },
    footer: {
      tagline: "రోగి మొదట. గోప్యత మొదట.",
      colLinks: "త్వరిత లింక్‌లు",
      about: "మా గురించి", features: "ఫీచర్లు", abhaHelp: "ABHA సహాయం", accessibility: "ప్రాప్యత", privacy: "గోప్యతా విధానం",
      by: "Neon Vector ప్రాజెక్ట్",
      bottom: "© 2025 HealthConnect India. ABDMపై నిర్మించబడింది. వైద్య సేవ కాదు.",
      languageLabel: "భాష",
    },
    a11y: { openMenu: "మెనూ తెరవండి", closeMenu: "మెనూ మూసివేయండి", selectLanguage: "భాష ఎంచుకోండి", startScreenReading: "స్క్రీన్ రీడింగ్ ప్రారంభించండి", stopScreenReading: "స్క్రీన్ రీడింగ్ ఆపండి" },
  },
  ml: {
    nav: { home: "ഹോം", records: "എന്റെ രേഖകൾ", appointments: "അപ്പോയിന്റ്‌മെന്റുകൾ", help: "സഹായം", cta: "ABHA ID ലിങ്ക് ചെയ്യുക" },
    hero: {
      title: "നിങ്ങളുടെ ആരോഗ്യ രേഖകൾ, ഒടുവിൽ നിങ്ങളുടെ കൈകളിൽ.",
      subtitle: "HealthConnect നിങ്ങളുടെ ABHA IDയുമായി ബന്ധിപ്പിച്ച് നിങ്ങളുടെ ചികിത്സാ ചരിത്രം, കുറിപ്പടികൾ, ലാബ് റിപ്പോർട്ടുകൾ എന്നിവ നിങ്ങളുടെ ഭാഷയിൽ ലളിതമായി കാണിക്കുന്നു.",
      ctaPrimary: "ABHA ID ഉപയോഗിച്ച് തുടങ്ങുക",
      ctaSecondary: "ABHA എന്താണ്? അറിയുക",
      trust1: "നിങ്ങളുടെ സമ്മതമില്ലാതെ ഡാറ്റ സംഭരിക്കില്ല",
      trust2: "ഇന്ത്യ സർക്കാരിന്റെ ABDMൽ നിർമ്മിച്ചത്",
      trust3: "7 ഇന്ത്യൻ ഭാഷകളിൽ ലഭ്യം",
      mockTitle: "എന്റെ ആരോഗ്യ രേഖകൾ",
      mockSubtitle: "ഇന്ന് അപ്ഡേറ്റ് ചെയ്തു",
      mockItem1: "രക്തപരിശോധന റിപ്പോർട്ട്",
      mockItem2: "കുറിപ്പടി — ഡോ. മേത്ത",
      mockItem3: "സന്ദർശന സംഗ്രഹം",
    },
    how: {
      eyebrow: "ലളിതം. പടി പടിയായി.",
      heading: "നിങ്ങളുടെ പൂർണ്ണ ആരോഗ്യ ചിത്രത്തിലേക്ക് മൂന്ന് പടികൾ",
      s1Title: "നിങ്ങളുടെ ABHA ID ലിങ്ക് ചെയ്യുക",
      s1Text: "നിങ്ങളുടെ 14-അക്ക ABHA നമ്പർ അല്ലെങ്കിൽ QR കോഡ് സ്കാൻ ചെയ്ത് ആരോഗ്യ അക്കൗണ്ട് ബന്ധിപ്പിക്കുക.",
      s2Title: "എല്ലാ രേഖകളും കാണുക",
      s2Text: "വ്യത്യസ്ത ആശുപത്രികളിലെ കുറിപ്പടികൾ, ലാബ് റിപ്പോർട്ടുകൾ, സന്ദർശന ചരിത്രം എന്നിവ ഒരിടത്ത് കാണുക.",
      s3Title: "പങ്കിടൽ നിങ്ങൾ നിയന്ത്രിക്കുന്നു",
      s3Text: "ഏത് ഡോക്ടർക്കോ ആശുപത്രിക്കോ നിങ്ങളുടെ രേഖകൾ കാണാൻ കഴിയണമെന്ന് തിരഞ്ഞെടുക്കുക. എപ്പോൾ വേണമെങ്കിലും അനുമതി നൽകാം അല്ലെങ്കിൽ പിൻവലിക്കാം.",
    },
    features: {
      heading: "വ്യക്തത അർഹിക്കുന്ന രോഗികൾക്കായി നിർമ്മിച്ചത്",
      f1Title: "നിങ്ങളുടെ ഭാഷയിൽ വായിക്കുക",
      f1Text: "നിങ്ങൾക്ക് നന്നായി അറിയാവുന്ന ഭാഷയിൽ ചികിത്സാ വിവരങ്ങൾ മനസ്സിലാക്കാൻ എളുപ്പമാകുന്നു.",
      f2Title: "കാലത്തിനൊപ്പം നിങ്ങളുടെ ആരോഗ്യം",
      f2Text: "ആശയക്കുഴപ്പമുള്ള രേഖകൾക്ക് പകരം സന്ദർശനങ്ങൾ, രോഗനിർണ്ണയങ്ങൾ, മരുന്നുകൾ ലളിതമായ ടൈംലൈനിൽ കാണുക.",
      f3Title: "നിങ്ങൾ മനസ്സിലാക്കുന്ന സമ്മതം",
      f3Text: "നിങ്ങളുടെ രേഖകൾ ആർക്ക് കാണാം, എന്ത് കാണാം, എത്രകാലം എന്ന് വ്യക്തമായ സമ്മത കാർഡുകൾ കാണിക്കുന്നു.",
      f4Title: "ഇന്ത്യയുടെ ഭാഷകൾക്കായി നിർമ്മിച്ചത്",
      f4Text: "ഒറ്റ ടാപ്പിൽ ഇംഗ്ലീഷ്, കന്നഡ, ബംഗാളി, ഹിന്ദി, തമിഴ്, തെലുങ്ക്, മലയാളം എന്നിവയ്ക്കിടയിൽ മാറുക.",
    },
    trust: {
      heading: "ഇന്ത്യയുടെ ദേശീയ ആരോഗ്യ സ്റ്റാക്കിനാൽ പ്രവർത്തിക്കുന്നു",
      body: "HealthConnect ABDMന് മുകളിൽ നിർമ്മിച്ച ഒരു രോഗി ഇന്റർഫേസ് പാളിയാണ്. ഞങ്ങൾ പുതിയ ആരോഗ്യ ID ഉണ്ടാക്കുന്നില്ല — നിങ്ങൾക്ക് ഇതിനകം ഉള്ളത് ഉപയോഗിക്കാൻ സഹായിക്കുന്നു.",
      badge1: "ABHA അനുയോജ്യം",
      badge2: "ABDM അനുവർത്തനം",
      badge3: "വിദ്യാർത്ഥി ഗവേഷണം — ചികിത്സാ സേവനമല്ല",
      note: "ഇതൊരു കോളേജ് IDT ലാബ് പ്രോജക്റ്റാണ്. HealthConnect സ്വതന്ത്രമായി ക്ലിനിക്കൽ ഡാറ്റ സംഭരിക്കുന്നില്ല.",
    },
    personas: {
      heading: "ഇത് ആർക്കുവേണ്ടി?",
      p1Name: "രമേശ് അങ്കിൾ, 68", p1Loc: "നാഗ്പൂർ",
      p1Quote: "കഴിഞ്ഞ തവണ ഡോക്ടർ ഏത് മരുന്നാണ് തന്നതെന്ന് ഞാൻ എപ്പോഴും മറന്നുപോകുമായിരുന്നു. ഇപ്പോൾ ഫോൺ കാണിക്കും.",
      p2Name: "പ്രിയ, 26", p2Loc: "ചെന്നൈ",
      p2Quote: "എന്റെ ലാബ് റിപ്പോർട്ടുകൾ എപ്പോഴും കടലാസിലായിരുന്നു. ഇപ്പോൾ ഏത് ഡോക്ടറുമായും സെക്കൻഡുകൾക്കുള്ളിൽ പങ്കിടാം.",
      p3Name: "സുരേഷ്, 41", p3Loc: "ഉത്തർപ്രദേശ്",
      p3Quote: "നേരത്തെ കടലാസുകൾ നഷ്ടപ്പെടുമായിരുന്നു. ഇപ്പോൾ എന്റെ രേഖകൾ കണ്ടെത്താനും മനസ്സിലാക്കാനും എളുപ്പമാണ്.",
    },
    footer: {
      tagline: "രോഗി ആദ്യം. സ്വകാര്യത ആദ്യം.",
      colLinks: "ദ്രുത ലിങ്കുകൾ",
      about: "കുറിച്ച്", features: "സവിശേഷതകൾ", abhaHelp: "ABHA സഹായം", accessibility: "പ്രവേശനക്ഷമത", privacy: "സ്വകാര്യതാ നയം",
      by: "Neon Vector-ന്റെ പ്രോജക്റ്റ്",
      bottom: "© 2025 HealthConnect India. ABDMൽ നിർമ്മിച്ചത്. ചികിത്സാ സേവനമല്ല.",
      languageLabel: "ഭാഷ",
    },
    a11y: { openMenu: "മെനു തുറക്കുക", closeMenu: "മെനു അടയ്ക്കുക", selectLanguage: "ഭാഷ തിരഞ്ഞെടുക്കുക", startScreenReading: "സ്ക്രീൻ റീഡിംഗ് ആരംഭിക്കുക", stopScreenReading: "സ്ക്രീൻ റീഡിംഗ് നിർത്തുക" },
  },
};
