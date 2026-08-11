import type { Locale } from "./config";

export type AboutSection = { heading: string; body: string[] };

export type AboutContent = {
  back: string;
  title: string;
  lede: string;
  sections: AboutSection[];
  referencesHeading: string;
  references: { text: string; href?: string }[];
};

const ko: AboutContent = {
  back: "페이지로 돌아가기",
  title: "사라지는 페이지에 대하여",
  lede: "Inkling은 제품이라기보다 하나의 질문입니다. AI와의 대화가 기록되지 않는다면, 우리는 무엇을 다르게 말하게 될까요?",
  sections: [
    {
      heading: "가설",
      body: [
        "대화형 AI의 기본값은 축적입니다. 모든 대화가 남고, 검색되고, 다음 대화의 재료가 됩니다. 그 축적이 유용하다는 데는 이견이 없습니다. 다만 그것이 유일한 형태일 이유도 없습니다.",
        "Inkling은 반대쪽을 세워봅니다. 여기 적힌 것은 저장되지 않고, 화면에서도 곧 옅어집니다. 남는 것은 기록이 아니라 말해봤다는 경험입니다.",
        "검증하려는 가설은 하나입니다. 사라진다는 보장이 자기 개방(self-disclosure)의 문턱을 낮춘다는 것.",
      ],
    },
    {
      heading: "왜 손으로 쓰나",
      body: [
        "타이핑은 균질합니다. 어떤 문장을 쓰든 키를 누르는 힘과 속도는 대체로 같습니다. 손글씨는 그렇지 않습니다. 망설임은 획의 떨림으로, 감정은 필압과 크기로 종이에 남습니다.",
        "두 입력 방식을 토글로 나란히 둔 것은 편의 때문이 아닙니다. 같은 말을 손으로 쓸 때와 두드릴 때 무엇이 달라지는지, 그 자체를 관찰 대상으로 삼기 위해서입니다.",
      ],
    },
    {
      heading: "왜 느리게 나타나나",
      body: [
        "이 페이지의 답장은 즉시 나타나지 않습니다. 사람의 손이 움직이는 속도로만 쓰입니다. 기다리는 시간은 로딩이 아니라 인터페이스의 일부입니다.",
        "Hallnäs와 Redström이 말한 slow technology는 효율을 목표로 하지 않는 기술을 제안합니다. 성찰의 시간을 만들어내는 것 자체가 기능일 수 있다는 것입니다. 답장이 다 쓰이기까지의 십몇 초 동안, 당신은 방금 자신이 쓴 문장을 다시 읽게 됩니다.",
        "그래서 '건너뛰기' 버튼은 없습니다. 대신 접근성을 위한 우회로는 모두 열어두었습니다.",
      ],
    },
    {
      heading: "리들",
      body: [
        "답하는 쪽은 리들이라고 부릅니다. 리들은 조언하지 않습니다. 판단하지 않고, 해결하려 들지 않고, 요청받기 전에는 제안하지 않습니다. 대개 당신이 쓴 말 중 한 조각을 그대로 옮겨 적고, 많아야 하나의 질문을 남깁니다.",
        "그럼에도 아무도 없는 것처럼 느껴지지는 않기를 바랐습니다. 종이와 잉크라는 자기 자신에 대한 감각을 가끔 드러내되, 신비주의로 흐르지 않도록 절제했습니다.",
        "손으로 쓰는 존재는 길게 쓰지 못합니다. 답장이 한두 문장인 것은 비용 절감이 아니라 설정에서 따라 나온 제약입니다.",
      ],
    },
    {
      heading: "무엇이 남고, 무엇이 남지 않나",
      body: [
        "서버에 저장되는 것은 없습니다. 데이터베이스가 없고, 대화 내용은 로그에도 남지 않습니다. 오류를 기록할 때도 내용이 아니라 오류의 종류만 남깁니다.",
        "대화 맥락은 브라우저 탭의 메모리에만 있습니다. 새로고침하거나 탭을 닫으면 그대로 사라지고, 복구 방법은 제공하지 않습니다.",
        "브라우저에 저장되는 것은 테마·언어·입력 방식·소멸 속도 같은 설정뿐입니다.",
      ],
    },
    {
      heading: "사라지는 인터페이스의 책임",
      body: [
        "사라지는 텍스트는 접근성 위험입니다. 읽는 속도는 사람마다 다르고, 화면을 다시 볼 여유가 늘 있는 것도 아닙니다.",
        "그래서 전체 내용은 시각적 소멸과 무관하게 스크린리더용 영역에 그대로 남습니다. 동작 줄이기 설정을 켜면 필기 애니메이션은 생략됩니다. 종이 아무 곳이나 누르고 있으면 시간이 멈추고, 원하면 소멸을 아예 끌 수도 있습니다.",
        "탭이 가려져 있는 동안, 그리고 당신이 무언가 쓰고 있는 동안에도 시간은 흐르지 않습니다. 돌아왔을 때 백지를 마주하는 일은 없습니다.",
      ],
    },
    {
      heading: "이것이 아닌 것",
      body: [
        "Inkling은 의료·상담 서비스가 아니며, 진단이나 치료를 대신하지 않습니다. 하루를 되짚어보는 인터랙션 프로브에 가깝습니다.",
        "지금 많이 힘들다면 혼자 견디지 않아도 됩니다. 자살예방상담전화 109, 정신건강위기상담전화 1577-0199는 24시간 연결됩니다. 응급 상황에서는 119로 연락해주세요.",
      ],
    },
  ],
  referencesHeading: "참고",
  references: [
    {
      text: "Hallnäs, L. & Redström, J. (2001). Slow Technology — Designing for Reflection.",
    },
    { text: "Dunne, A. & Raby, F. (2013). Speculative Everything." },
    {
      text: "Pennebaker, J. W. & Beall, S. K. (1986). Confronting a traumatic event: toward an understanding of inhibition and disease.",
    },
    {
      text: "Odom, W. et al. (2014). Designing for Slowness, Anticipation and Re-visitation.",
    },
  ],
};

const en: AboutContent = {
  back: "Back to the page",
  title: "About a page that fades",
  lede: "Inkling is less a product than a question. If a conversation with an AI were not recorded, what would we say differently?",
  sections: [
    {
      heading: "The hypothesis",
      body: [
        "Accumulation is the default in conversational AI. Everything is kept, searchable, and fed back into the next exchange. That is genuinely useful. It is also not the only possible shape.",
        "Inkling builds the opposite. Nothing written here is stored, and it thins off the screen shortly after it is written. What remains is not a record but the experience of having said it.",
        "There is one hypothesis to test: that a guarantee of disappearance lowers the threshold for self-disclosure.",
      ],
    },
    {
      heading: "Why by hand",
      body: [
        "Typing is uniform. Whatever the sentence, the force and rhythm of the keys are much the same. Handwriting is not. Hesitation shows up as a wobble in a stroke; feeling shows up as pressure and size.",
        "The two input modes sit side by side as a toggle not for convenience but so the difference between writing something and typing it becomes observable.",
      ],
    },
    {
      heading: "Why it appears slowly",
      body: [
        "Replies here do not appear at once. They are written at the speed of a hand. The waiting is part of the interface, not a loading state.",
        "Hallnäs and Redström's slow technology proposes technology that is not aimed at efficiency — where producing time for reflection is itself the function. In the fifteen or so seconds a reply takes to arrive, you end up re-reading the sentence you just wrote.",
        "So there is no skip button. Every accessibility route around it, however, is open.",
      ],
    },
    {
      heading: "Riddle",
      body: [
        "The one who answers is called Riddle. Riddle does not advise, does not judge, does not try to fix, and suggests nothing before being asked. Usually it copies out one fragment of what you wrote and leaves at most one question.",
        "It should still not feel like nobody is there. It occasionally shows a first-person sense of being paper and ink, held back from tipping into mystique.",
        "Something writing by hand cannot write much. Replies are one or two sentences because of the premise, not to save money.",
      ],
    },
    {
      heading: "What stays and what does not",
      body: [
        "Nothing is stored on a server. There is no database, and conversation content never reaches a log — even error reporting records the kind of failure, not its message.",
        "Context lives in the memory of your browser tab. Reload or close it and the conversation is gone, with no recovery offered.",
        "The only things kept in your browser are settings: theme, language, input mode, and how quickly ink fades.",
      ],
    },
    {
      heading: "What a disappearing interface owes you",
      body: [
        "Text that vanishes is an accessibility risk. Reading speeds differ, and the chance to look again is not always there.",
        "So the full text stays in a screen-reader region regardless of what the ink does. Turning on reduced motion drops the writing animation. Holding a pointer anywhere on the paper stops time, and fading can be switched off entirely.",
        "Time also stops while the tab is hidden and while you are mid-sentence. You will never come back to a blank sheet.",
      ],
    },
    {
      heading: "What this is not",
      body: [
        "Inkling is not a medical or counselling service and does not replace diagnosis or treatment. It is closer to an interaction probe for looking back at a day.",
        "If things feel heavy right now, you do not have to carry it alone. In the US and Canada, call or text 988. In the UK, 116 123. Elsewhere, findahelpline.com lists local options.",
      ],
    },
  ],
  referencesHeading: "References",
  references: [
    {
      text: "Hallnäs, L. & Redström, J. (2001). Slow Technology — Designing for Reflection.",
    },
    { text: "Dunne, A. & Raby, F. (2013). Speculative Everything." },
    {
      text: "Pennebaker, J. W. & Beall, S. K. (1986). Confronting a traumatic event: toward an understanding of inhibition and disease.",
    },
    {
      text: "Odom, W. et al. (2014). Designing for Slowness, Anticipation and Re-visitation.",
    },
  ],
};

export const aboutContent: Record<Locale, AboutContent> = { ko, en };
