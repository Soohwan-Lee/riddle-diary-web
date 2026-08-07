import type { Locale } from "./config";

/**
 * Every user-facing string lives here. `ko` defines the shape; `en` must match
 * it exactly, so a missing translation is a type error rather than a blank UI.
 */
const ko = {
  app: {
    name: "Inkling",
    tagline: "적고, 놓아주는 페이지",
  },

  chrome: {
    modeLabel: "입력 방식",
    modeHand: "손글씨",
    modeType: "타이핑",
    themeLabel: "화면 테마",
    themeLight: "라이트",
    themeDark: "다크",
    themeSystem: "시스템",
    localeLabel: "언어",
    settings: "설정",
    close: "닫기",
    about: "이 프로젝트에 대하여",
  },

  page: {
    firstLine: "오늘, 어땠어요?",
    notice: "여기 적은 것은 저장되지 않고, 곧 사라집니다.",
    writing: "쓰는 중",
  },

  composer: {
    placeholder: "여기에 오늘을 적어보세요",
    hint: "Enter 줄바꿈 · Ctrl+Enter 로 건네기",
    hintMac: "Enter 줄바꿈 · ⌘+Enter 로 건네기",
    send: "건네기",
    empty: "아직 아무것도 적히지 않았어요",
  },

  hand: {
    pen: "펜",
    eraser: "지우개",
    undo: "되돌리기",
    clear: "모두 지우기",
    send: "건네기",
    canvasLabel: "손글씨 영역",
    fingerHint: "손가락으로도 쓸 수 있어요",
    penOnlyHint: "스타일러스로 써주세요",
    reading: "글씨를 읽는 중",
    pointerOnly:
      "손글씨는 마우스나 펜이 필요합니다. 키보드로 적으시려면 상단에서 타이핑 모드로 바꿔주세요.",
  },

  settings: {
    title: "설정",
    paceLabel: "사라지는 속도",
    paceShort: "짧게",
    paceNormal: "기본",
    paceLong: "길게",
    paceNever: "사라지지 않게",
    paceHint: "다 쓰고 나서 이만큼 머문 뒤 옅어집니다.",
    writingSpeedLabel: "AI가 쓰는 속도",
    speedSlow: "느리게",
    speedNormal: "기본",
    speedBrisk: "조금 빠르게",
    fingerLabel: "손가락 필기 허용",
    fingerHint: "끄면 스타일러스로만 쓸 수 있습니다.",
    reducedMotionNote: "동작 줄이기가 켜져 있어 필기 애니메이션은 생략됩니다.",
    clearPage: "페이지 비우기",
    clearPageHint: "지금 남아 있는 글씨와 대화 기억을 모두 지웁니다.",
    helpTitle: "도움이 필요할 때",
  },

  crisis: {
    intro:
      "지금 많이 힘들다면, 혼자 견디지 않아도 됩니다. 아래는 24시간 연결되는 곳들이에요.",
    kr: "자살예방상담전화 109 · 정신건강위기상담전화 1577-0199 (한국)",
    intl: "988 (미국·캐나다) · 116 123 (영국)",
    directory: "그 밖의 지역: findahelpline.com",
    disclaimer:
      "Inkling은 의료·상담 서비스가 아닙니다. 응급 상황에서는 지역 응급번호로 연락해주세요.",
  },

  errors: {
    generic: "지금은 잉크가 나오지 않아요.",
    rateLimited: "잠깐 쉬었다 이어가요.",
    tooLong: "한 번에 적기엔 조금 길어요.",
    unreadable: "이 부분은 잘 안 읽혀요. 다시 적어줄래요?",
    offline: "연결이 끊겼어요.",
    retry: "다시 시도",
  },

  a11y: {
    transcript: "대화 기록",
    transcriptHint:
      "화면의 글씨는 사라지지만, 이 영역에는 전체 내용이 남습니다.",
    holdToKeep: "누르고 있으면 사라지지 않습니다",
    userSaid: "내가 쓴 글",
    aiSaid: "페이지가 쓴 글",
    skipToComposer: "입력 영역으로 건너뛰기",
  },
} as const;

export type Dictionary = typeof ko;

/** Recursively widens the literal types of `ko` so `en` can hold other strings. */
type Translation<T> = {
  [K in keyof T]: T[K] extends string ? string : Translation<T[K]>;
};

const en: Translation<Dictionary> = {
  app: {
    name: "Inkling",
    tagline: "A page that writes back — and lets go",
  },

  chrome: {
    modeLabel: "Input mode",
    modeHand: "Handwriting",
    modeType: "Typing",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    themeSystem: "System",
    localeLabel: "Language",
    settings: "Settings",
    close: "Close",
    about: "About this project",
  },

  page: {
    firstLine: "How was today?",
    notice: "Nothing here is saved. It will fade shortly.",
    writing: "Writing",
  },

  composer: {
    placeholder: "Write today here",
    hint: "Enter for a new line · Ctrl+Enter to hand it over",
    hintMac: "Enter for a new line · ⌘+Enter to hand it over",
    send: "Hand it over",
    empty: "Nothing written yet",
  },

  hand: {
    pen: "Pen",
    eraser: "Eraser",
    undo: "Undo",
    clear: "Clear all",
    send: "Hand it over",
    canvasLabel: "Handwriting area",
    fingerHint: "You can write with your finger too",
    penOnlyHint: "Please write with a stylus",
    reading: "Reading your handwriting",
    pointerOnly:
      "Handwriting needs a mouse or a pen. To write with a keyboard, switch to typing mode at the top of the page.",
  },

  settings: {
    title: "Settings",
    paceLabel: "How quickly it fades",
    paceShort: "Short",
    paceNormal: "Default",
    paceLong: "Long",
    paceNever: "Never fade",
    paceHint: "Ink rests this long after it is written, then thins out.",
    writingSpeedLabel: "How fast the page writes",
    speedSlow: "Slower",
    speedNormal: "Default",
    speedBrisk: "A little faster",
    fingerLabel: "Allow finger drawing",
    fingerHint: "When off, only a stylus can write.",
    reducedMotionNote:
      "Reduced motion is on, so handwriting appears without animating.",
    clearPage: "Empty the page",
    clearPageHint: "Erases the remaining ink and everything the page remembers.",
    helpTitle: "If you need support",
  },

  crisis: {
    intro:
      "If things feel heavy right now, you do not have to carry it alone. These lines are open around the clock.",
    kr: "Suicide Prevention 109 · Mental Health Crisis 1577-0199 (Korea)",
    intl: "988 (US/Canada) · 116 123 (UK)",
    directory: "Elsewhere: findahelpline.com",
    disclaimer:
      "Inkling is not a medical or counselling service. In an emergency, contact your local emergency number.",
  },

  errors: {
    generic: "The ink is not flowing right now.",
    rateLimited: "Let's rest a moment before continuing.",
    tooLong: "That is a little long for one page.",
    unreadable: "I cannot quite read this part. Would you write it again?",
    offline: "The connection dropped.",
    retry: "Try again",
  },

  a11y: {
    transcript: "Conversation transcript",
    transcriptHint:
      "The ink on the page fades, but the full text stays in this region.",
    holdToKeep: "Hold to stop it from fading",
    userSaid: "What you wrote",
    aiSaid: "What the page wrote",
    skipToComposer: "Skip to the writing area",
  },
};

export const dictionaries: Record<Locale, Translation<Dictionary>> = { ko, en };

export function getDictionary(locale: Locale): Translation<Dictionary> {
  return dictionaries[locale];
}
