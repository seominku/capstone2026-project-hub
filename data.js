window.PROJECT_DATA = {
  meta: {
    name: "잠들지 않는 숲",
    updated: "2026-07-31",
    scene: "Arena",
    unity: "6.3.10f1",
    total: 122,
    done: 91,
    todo: 27,
    cut: 4,
    errors: 0,
    warnings: 1
  },
  metrics: [
    { label: "완료 작업", value: "91", detail: "Unity 체크리스트", tone: "green", icon: "✓" },
    { label: "대기 작업", value: "27", detail: "P0~P5 전체", tone: "amber", icon: "↗" },
    { label: "콘솔 오류", value: "0", detail: "경고 1건", tone: "cyan", icon: "◇" },
    { label: "문서 원본", value: "12", detail: "Markdown 동기화", tone: "violet", icon: "▤" }
  ],
  tasks: [
    { id: "story-chapter-label", title: "챕터 표기 통일", detail: "B1~B9를 1장~9장으로 교체", priority: "P0", status: "todo", tag: "스토리", risk: true },
    { id: "story-camp-exit-root", title: "캠프 출구 · 7장 뿌리", detail: "첫 동선을 지상으로, 뿌리를 심층 진입점으로", priority: "P0", status: "todo", tag: "스토리", risk: true },
    { id: "lockon-strafe-fix", title: "락온 스트레이프 수정", detail: "A/D 원형 횡이동, S 후진과 애니메이션 블렌드 정합", priority: "P1", status: "todo", tag: "전투", risk: true },
    { id: "boss-model", title: "보스 모델 · 리깅", detail: "잠들지 않는 뿌리의 반고정형 본체와 코어 구조", priority: "P0", status: "todo", tag: "보스", risk: true },
    { id: "regression-death-second-run", title: "사망 2회차 회귀 테스트", detail: "장비 인식, 기억 순서, 입력 상태, 포션을 연속 검증", priority: "P0", status: "todo", tag: "QA", risk: true },
    { id: "equipment-drop-presentation", title: "3D 등급 드랍 표현", detail: "에픽 원형 · 유니크 노랑 · 레전더리 하늘색 기둥", priority: "P2", status: "done", tag: "VFX" },
    { id: "weapon-grip-normalization", title: "무기 15종 그립 정비", detail: "칼날·히트박스·트레일 기준 통합", priority: "P2", status: "done", tag: "전투" },
    { id: "death-memory-starter", title: "죽음·기억·시작 단검", detail: "최대 1개/미선택, 기억 순서 유지, 단검 재지급", priority: "P0", status: "done", tag: "세이브" }
  ],
  roadmap: [
    { date: "07.31", title: "핵심 시스템", state: "done", detail: "전투 · 죽음 · 계약 · 맵" },
    { date: "08 초", title: "스토리 반영", state: "active", detail: "5종 + 스트레이프" },
    { date: "08~09", title: "보스 제작", state: "next", detail: "모델 · 3페이즈" },
    { date: "09 말", title: "전체 QA", state: "next", detail: "2회 런 · 사운드" },
    { date: "10", title: "최종 빌드", state: "next", detail: "발표 · 시연" }
  ],
  qa: [
    { id: "lockon-strafe-fix", title: "락온 후 스트레이프 이동", status: "수정 필요", severity: "P1", tone: "danger" },
    { id: "regression-monster-animation", title: "몬스터 소실·지면 침투 회귀", status: "검증 대기", severity: "P1", tone: "amber" },
    { id: "regression-audio-headphones", title: "몬스터 3D 발소리 헤드폰 QA", status: "청취 대기", severity: "P2", tone: "amber" },
    { id: "warn-pushdoor-panel", title: "Wall_12_Door_01 패널 경고", status: "경고 1건", severity: "P4", tone: "neutral" },
    { id: "regression-drop-readability", title: "등급 드랍 원거리 가독성", status: "실맵 QA", severity: "P2", tone: "cyan" }
  ],
  changes: [
    { time: "22:37", group: "DOCUMENT", title: "프로젝트 문서 전체 동기화", detail: "현황·체크리스트·변경이력 신설, spec 01~04 갱신", tone: "violet" },
    { time: "21:50", group: "COMBAT", title: "무기 15종 그립·칼날 방향 정비", detail: "GoldSword 파지 위치와 비대칭 칼날 방향 보정", tone: "green" },
    { time: "20:42", group: "VFX", title: "장비 등급 드랍 표현 완성", detail: "지면 기둥·원형·나선 레이어, 무기만 부유", tone: "cyan" },
    { time: "18:20", group: "INPUT", title: "Q 락온과 기억 돌진 대상 통일", detail: "스트레이프 이동은 별도 수정 항목으로 분리", tone: "amber" },
    { time: "16:10", group: "SAVE", title: "사망 2회차 기억 순서 유지", detail: "SmallAttack 폴백과 시작 단검 규칙 수정", tone: "green" }
  ],
  documents: [
    { title: "프로젝트 현황", description: "현재 완성도, 위험, 다음 순서", type: "STATUS", path: "docs/프로젝트_현황.md", accent: "green" },
    { title: "개발 체크리스트", description: "작업 ID와 완료 조건", type: "CHECKLIST", path: "docs/개발_체크리스트.md", accent: "amber" },
    { title: "변경이력", description: "최근 구현·버그 수정 기록", type: "CHANGELOG", path: "docs/변경이력.md", accent: "violet" },
    { title: "1페이지 기획서", description: "컨셉과 핵심 규칙", type: "CONCEPT", path: "docs/기획서.md", accent: "cyan" },
    { title: "상세기획서", description: "전체 시스템·콘텐츠 구성", type: "SYSTEM", path: "docs/상세기획서.md", accent: "green" },
    { title: "상세스토리", description: "수호자, 안개, 세대 교체", type: "STORY", path: "docs/상세스토리.md", accent: "amber" },
    { title: "구현 명세 01~04", description: "맵·전투·AI·죽음 규칙", type: "SPEC", path: "pdf/구현명세서.pdf", accent: "violet" },
    { title: "현황·체크리스트 PDF", description: "공유용 최신 고정본", type: "PDF", path: "pdf/Capstone2026_프로젝트현황_체크리스트_2026-07-31.pdf", accent: "cyan" }
  ],
  feedbackSeed: [
    { id: "seed-1", title: "보스 모델은 뿌리 실루엣을 더 강조", detail: "트렌트보다 땅을 찢고 솟은 역전된 뿌리 형태가 핵심으로 보이면 좋겠습니다.", category: "아트", priority: "P1", status: "open", createdAt: "2026.07.31" },
    { id: "seed-2", title: "락온 스트레이프를 먼저 수정", detail: "보스전 제작 전에 좌우 이동과 후진 블렌드를 자연스럽게 맞춰야 합니다.", category: "게임플레이", priority: "P1", status: "in_progress", createdAt: "2026.07.31" }
  ]
};
