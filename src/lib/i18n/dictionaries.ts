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
    firstLineMorning: "좋은 아침이에요. 오늘은 어땠어요?",
    firstLineAfternoon: "오후네요. 오늘 하루는 어땠어요?",
    firstLineEvening: "저녁이네요. 오늘은 어땠어요?",
    firstLineNight: "늦은 밤이네요. 오늘은 어땠어요?",
    notice: "여기 적은 것은 저장되지 않고, 곧 사라집니다.",
    writing: "쓰는 중",
    thinking: "리들이 읽는 중",
  },

  intro: {
    title: "처음이신가요",
    write: "오늘 있었던 일을 적어 건네면, 리들이 손글씨로 답합니다.",
    fade: "주고받은 글은 저장되지 않고, 다 읽을 즈음 종이에서 사라집니다.",
    hold: "사라지는 걸 멈추고 싶으면 종이를 누르고 계세요.",
    dismiss: "알겠어요",
    again: "설정에서 다시 볼 수 있어요",
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
    autoHint: "손을 멈추면 리들이 가져갑니다",
    manualHint: "다 썼으면 오른쪽 버튼으로 건네주세요",
    notYet: "아직요",
    reading: "글씨를 읽는 중",
    pointerOnly:
      "손글씨는 마우스나 펜이 필요합니다. 키보드로 적으시려면 상단에서 타이핑 모드로 바꿔주세요.",
  },

  settings: {
    title: "설정",
    pageModeLabel: "페이지가 넘어가는 방식",
    pageModeBlank: "빈 페이지",
    pageModeKeep: "쌓아두기",
    pageModeBlankHint:
      "건넨 글은 바로 종이에 스며들고, 답장은 다 읽을 즈음 사라집니다. 늘 빈 페이지에서 씁니다.",
    pageModeKeepHint:
      "주고받은 글이 함께 머물다가, 아래에서 정한 시간이 지나면 함께 사라집니다.",
    pageModeNeverNote:
      "‘사라지지 않게’가 켜져 있어 지금은 두 방식 모두 쌓아두기로 동작합니다.",
    handTitle: "손글씨",
    handUserLabel: "내 손글씨",
    handAiLabel: "리들의 손글씨",
    handPen: "볼펜",
    handQuill: "펜촉",
    handBrush: "붓펜",
    handPrint: "또박또박",
    handSample: "오늘, 어땠어요?",
    paceLabel: "사라지는 속도",
    paceShort: "짧게",
    paceNormal: "기본",
    paceLong: "길게",
    paceNever: "사라지지 않게",
    paceHint: "다 쓰고 나서 이만큼 머문 뒤 옅어집니다.",
    paceHintBlank: "빈 페이지 모드에서는 답장을 읽을 시간의 배율이 됩니다.",
    writingSpeedLabel: "리들이 쓰는 속도",
    speedSlow: "느리게",
    speedNormal: "기본",
    speedBrisk: "조금 빠르게",
    fingerLabel: "손가락 필기 허용",
    fingerHint: "끄면 스타일러스로만 쓸 수 있습니다.",
    autoHandoffLabel: "멈추면 자동으로 건네기",
    autoHandoffHint: "손글씨를 쓰다 4초간 멈추면 리들이 가져갑니다. 끄면 버튼으로만 건네집니다.",
    reducedMotionNote: "동작 줄이기가 켜져 있어 필기 애니메이션은 생략됩니다.",
    introLabel: "처음 안내",
    introHint: "여기가 어떤 곳인지 알려주는 세 줄을 다시 띄웁니다.",
    introShow: "다시 보기",
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
    aiSaid: "리들이 쓴 글",
    skipToComposer: "입력 영역으로 건너뛰기",
    /** `{name}` is filled from `glyphs` below. */
    drawing: "({name} 그림)",
  },

  /** What Riddle drew, for the reader who cannot see it. */
  glyphs: {
    sun: "해",
    moon: "달",
    star: "별",
    cloud: "구름",
    rain: "비",
    snow: "눈",
    lightning: "번개",
    rainbow: "무지개",
    wind: "바람",
    leaf: "나뭇잎",
    sprout: "새싹",
    tree: "나무",
    flower: "꽃",
    mountain: "산",
    wave: "물결",
    drop: "물방울",
    boat: "배",
    bird: "새",
    feather: "깃털",
    cup: "찻잔",
    candle: "촛불",
    key: "열쇠",
    window: "창문",
    bridge: "다리",
    heart: "하트",
    spiral: "소용돌이",
    arrow: "화살표",
    knot: "매듭",
    clock: "시계",
    hourglass: "모래시계",
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
    firstLineMorning: "Morning. How is your day going?",
    firstLineAfternoon: "Afternoon. How has today been?",
    firstLineEvening: "Evening. How was today?",
    firstLineNight: "It's late. How was today?",
    notice: "Nothing here is saved. It will fade shortly.",
    writing: "Writing",
    thinking: "Riddle is reading",
  },

  intro: {
    title: "First time here",
    write: "Write down your day and hand it over. Riddle answers by hand.",
    fade: "Nothing is saved. Both of you leave the paper about the time you finish reading.",
    hold: "Press and hold the paper to stop anything from fading.",
    dismiss: "Got it",
    again: "You can read this again from settings",
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
    autoHint: "Stop writing and Riddle takes it",
    manualHint: "Hand it over with the button when you are done",
    notYet: "Not yet",
    reading: "Reading your handwriting",
    pointerOnly:
      "Handwriting needs a mouse or a pen. To write with a keyboard, switch to typing mode at the top of the page.",
  },

  settings: {
    title: "Settings",
    pageModeLabel: "How the page turns",
    pageModeBlank: "Blank page",
    pageModeKeep: "Keep the exchange",
    pageModeBlankHint:
      "What you hand over sinks in at once, and the reply goes about the time you finish reading it. You always write on an empty sheet.",
    pageModeKeepHint:
      "The exchange stays together, and leaves together once the dwell below is up.",
    pageModeNeverNote:
      "“Never fade” is on, so both settings currently keep the exchange.",
    handTitle: "Handwriting",
    handUserLabel: "Your hand",
    handAiLabel: "Riddle's hand",
    handPen: "Ballpoint",
    handQuill: "Nib",
    handBrush: "Brush",
    handPrint: "Print",
    handSample: "How was today?",
    paceLabel: "How quickly it fades",
    paceShort: "Short",
    paceNormal: "Default",
    paceLong: "Long",
    paceNever: "Never fade",
    paceHint: "Ink rests this long after it is written, then thins out.",
    paceHintBlank: "In blank-page mode this scales how long you get to read.",
    writingSpeedLabel: "How fast Riddle writes",
    speedSlow: "Slower",
    speedNormal: "Default",
    speedBrisk: "A little faster",
    fingerLabel: "Allow finger drawing",
    fingerHint: "When off, only a stylus can write.",
    autoHandoffLabel: "Hand over when the pen stops",
    autoHandoffHint:
      "Four seconds of stillness and Riddle takes your handwriting. Turn it off to hand over only with the button.",
    reducedMotionNote:
      "Reduced motion is on, so handwriting appears without animating.",
    introLabel: "The opening note",
    introShow: "Show it again",
    introHint: "Brings back the three lines about what this place is.",
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
    aiSaid: "What Riddle wrote",
    skipToComposer: "Skip to the writing area",
    drawing: "(a drawing of {name})",
  },

  glyphs: {
    sun: "the sun",
    moon: "the moon",
    star: "a star",
    cloud: "a cloud",
    rain: "rain",
    snow: "snow",
    lightning: "lightning",
    rainbow: "a rainbow",
    wind: "wind",
    leaf: "a leaf",
    sprout: "a sprout",
    tree: "a tree",
    flower: "a flower",
    mountain: "a mountain",
    wave: "a wave",
    drop: "a drop of water",
    boat: "a boat",
    bird: "a bird",
    feather: "a feather",
    cup: "a cup",
    candle: "a candle",
    key: "a key",
    window: "a window",
    bridge: "a bridge",
    heart: "a heart",
    spiral: "a spiral",
    arrow: "an arrow",
    knot: "a knot",
    clock: "a clock",
    hourglass: "an hourglass",
  },
};

export const dictionaries: Record<Locale, Translation<Dictionary>> = { ko, en };

export function getDictionary(locale: Locale): Translation<Dictionary> {
  return dictionaries[locale];
}
