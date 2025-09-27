"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Lang = "en" | "ur"

interface I18nContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: string) => string
}

const I18N_STORAGE_KEY = "app_lang"

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Header
    role: "Role",
    teach: "Teach",
    learn: "Learn",
    mode: "Mode",
    chat: "Chat",
    settings: "Settings",
    about: "About",
    model: "Model",
    of: "of",

    // FeatureTabs
    online_search: "Online Search",
    visualize: "Visualize",
    make_quiz: "Make Quiz",
    take_quiz: "Take Quiz",
    make_roadmap: "Make Roadmap",
    activate_features_hint: "Click to activate features",

    // QuizTab (teacher)
    quiz_creator: "Quiz Creator",
    quiz_creator_desc: "Generate interactive quizzes to test your students' understanding.",
    create_new_quiz: "Create New Quiz",
    create_new_quiz_desc: "Specify a topic and we'll generate relevant questions",
    quiz_topic: "Quiz topic",
    quiz_topic_ph: "e.g., algebra basics, world history, biology...",
    generating_quiz: "Generating quiz...",
    generating_for: "Creating questions for",
    ui_demo_note: "UI Demo - No actual quiz generation",
    ui_demo_desc: "In the full version, this will generate custom quiz questions based on your specified topic using AI.",
    ready_to_create: "Ready to create",
    enter_topic_to_generate: "Enter a topic to generate quiz questions",
    generate_quiz_btn: "Generate Quiz",

    // QuizTab (learner)
    practice_quiz: "Practice Quiz",
    practice_quiz_desc: "Test your knowledge with interactive quizzes.",
    sample_quiz: "Sample Quiz",
    try_sample_quiz: "Try this sample quiz to see how the feature works",
    question: "Question",
    progress: "Progress",
    next_question: "Next Question",
    finish_quiz: "Finish Quiz",
    quiz_complete: "Quiz Complete!",
    quiz_complete_desc: "Great job finishing the sample quiz. In the full version, you'd see your detailed results here.",
    retake_quiz: "Retake Quiz",
    ready_to_start: "Ready to start?",
    sample_quiz_intro: "This sample quiz will demonstrate the quiz-taking experience.",
    start_sample_quiz: "Start Sample Quiz",
  },
  ur: {
    // Header
    role: "کردار",
    teach: "استاد",
    learn: "طالب علم",
    mode: "موڈ",
    chat: "چیٹ",
    settings: "سیٹنگز",
    about: "متعلق",
    model: "ماڈل",
    of: "میں سے",

    // FeatureTabs
    online_search: "آن لائن تلاش",
    visualize: "وضاحت کریں",
    make_quiz: "کوئز بنائیں",
    take_quiz: "کوئز دیں",
    make_roadmap: "روڈمیپ بنائیں",
    activate_features_hint: "فیچر فعال کرنے کے لیے کلک کریں",

    // QuizTab (teacher)
    quiz_creator: "کوئز بنانے والا",
    quiz_creator_desc: "اپنے طلباء کی سمجھ جانچنے کے لیے انٹرایکٹو کوئز بنائیں۔",
    create_new_quiz: "نیا کوئز بنائیں",
    create_new_quiz_desc: "موضوع بتائیں اور ہم متعلقہ سوالات تیار کریں گے",
    quiz_topic: "کوئز کا موضوع",
    quiz_topic_ph: "مثلاً، الجبرا کی بنیادی باتیں، عالمی تاریخ، حیاتیات...",
    generating_quiz: "کوئز تیار ہو رہا ہے...",
    generating_for: "سوالات تیار ہو رہے ہیں برائے",
    ui_demo_note: "یو آئی ڈیمو - ابھی حقیقی جنریشن نہیں",
    ui_demo_desc: "مکمل ورژن میں، آپ کے موضوع کی بنیاد پر AI سوالات بنائے گا۔",
    ready_to_create: "تیار بنانے کے لیے",
    enter_topic_to_generate: "کوئز کے سوالات بنانے کے لیے موضوع درج کریں",
    generate_quiz_btn: "کوئز بنائیں",

    // QuizTab (learner)
    practice_quiz: "مشقی کوئز",
    practice_quiz_desc: "انٹرایکٹو کوئز کے ذریعے اپنی معلومات جانچیں۔",
    sample_quiz: "نمونہ کوئز",
    try_sample_quiz: "اس فیچر کو دیکھنے کے لیے نمونہ کوئز آزمائیں",
    question: "سوال",
    progress: "ترقی",
    next_question: "اگلا سوال",
    finish_quiz: "کوئز ختم کریں",
    quiz_complete: "کوئز مکمل!",
    quiz_complete_desc: "شاندار! مکمل ورژن میں آپ کی تفصیلی نتائج یہاں دکھائے جائیں گے۔",
    retake_quiz: "کوئز دوبارہ دیں",
    ready_to_start: "شروع کرنے کے لیے تیار؟",
    sample_quiz_intro: "یہ نمونہ کوئز آپ کو کوئز دینے کا تجربہ دکھائے گا۔",
    start_sample_quiz: "نمونہ کوئز شروع کریں",
  },
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem(I18N_STORAGE_KEY) as Lang | null) : null
    if (saved === "en" || saved === "ur") setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    if (typeof window !== "undefined") localStorage.setItem(I18N_STORAGE_KEY, l)
  }

  const t = useMemo(() => {
    return (key: string) => translations[lang]?.[key] ?? translations.en[key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t }), [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used within I18nProvider")
  return ctx
}