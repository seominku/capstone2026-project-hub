window.PROJECT_DATA = {
  meta: {
    name: "잠들지 않는 숲",
    updated: "2026-08-01",
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
  unityAssets: {
    weapons: [
      { name: "한손검 1형", type: "ONE-HANDED", family: "longsword", detail: "빠른 연계에 맞춘 표준 한손검", image: "assets/unity/weapon-onehand-1.png", source: "PF_GS_OneHand_1_1.prefab" },
      { name: "한손검 3형", type: "ONE-HANDED", family: "longsword", detail: "넓은 칼날과 안정적인 무게 중심", image: "assets/unity/weapon-onehand-3.png", source: "PF_GS_OneHand_3_1.prefab" },
      { name: "대검 1형", type: "GREAT SWORD", family: "greatsword", detail: "무거운 기억의 마무리에 특화", image: "assets/unity/weapon-great-1.png", source: "PF_GS_Great_1_1.prefab" },
      { name: "대검 4형", type: "GREAT SWORD", family: "greatsword", detail: "긴 사거리와 강한 경직을 노리는 대검", image: "assets/unity/weapon-great-4.png", source: "PF_GS_Great_4_1.prefab" },
      { name: "황금 장식검", type: "UNIQUE", family: "longsword", detail: "높은 기본 피해의 희귀 장식검", image: "assets/unity/weapon-gold.png", source: "PF_Sword_Gold.prefab" },
      { name: "그림자 검", type: "UNLOCK", family: "longsword", detail: "속도와 돌진 기억을 잇는 경량 검", image: "assets/unity/weapon-shadow.png", source: "PF_Sword_Shadow.prefab" },
      { name: "서리 검", type: "UNLOCK", family: "greatsword", detail: "냉기 테마의 중량 무기", image: "assets/unity/weapon-frost.png", source: "PF_Sword_Frost.prefab" }
    ],
    armor: [
      { name: "기본 모험가 세트", type: "EQUIPPED SET", detail: "현재 플레이어 프리팹에 적용된 기본 외형", image: "assets/unity/armor-player-default.png", source: "Player.prefab" },
      { name: "황금 흉갑", type: "CHEST ARMOR", detail: "금빛 장식이 강조된 중갑 흉갑", image: "assets/unity/armor-golden.png", source: "Armor_Golden.fbx" },
      { name: "가죽 흉갑", type: "CHEST ARMOR", detail: "기동성을 우선한 경량 가죽 방어구", image: "assets/unity/armor-leather.png", source: "Armor_Leather.fbx" },
      { name: "금속 흉갑", type: "CHEST ARMOR", detail: "표준 방어 성능의 금속 흉갑", image: "assets/unity/armor-metal.png", source: "Armor_Metal2.fbx" }
    ],
    accessories: [
      { name: "핏빛 반지", type: "ACCESSORY · RING", detail: "공격적인 빌드를 위한 붉은 금속 반지", image: "assets/unity/accessory-blood-ring.png", source: "BloodRing.asset" },
      { name: "다이아몬드 반지", type: "ACCESSORY · RING", detail: "청색 보석을 세공한 장비 액세서리", image: "assets/unity/accessory-diamond-ring.png", source: "DiamondRing.asset" }
    ],
    memories: [
      { name: "섬광 베기", type: "가벼움 · 피해 3", detail: "빠른 시작", image: "assets/unity/memory-flash-slash.png", source: "ICON_SmallAttack.png" },
      { name: "질풍 이연격", type: "가벼움 · 피해 3", detail: "빠르게 두 번 베기", image: "assets/unity/memory-double-slash.png", source: "ICON_SmallAttack2.png" },
      { name: "찌르는 빛", type: "가벼움 · 피해 4", detail: "전방 찌르기", image: "assets/unity/memory-thrust-light.png", source: "ICON_SmallAttack3.png" },
      { name: "가로지르는 검", type: "보통 · 피해 5", detail: "교차 베기", image: "assets/unity/memory-cross-cut.png", source: "ICON_SmallAttack4.png" },
      { name: "낙하 일섬", type: "무거움 · 피해 8", detail: "마무리 · 대지", image: "assets/unity/memory-falling-light.png", source: "ICON_HeavyTurnAttack.png" },
      { name: "폭주하는 기억", type: "무거움 · 피해 12", detail: "마무리 · 전격 · 5연격", image: "assets/unity/memory-overdrive.png", source: "ICON_TripleAttack.png" }
    ],
    monsters: [
      { name: "구울", type: "GHOUL · 일반 · 근접", group: "surface", rank: "일반", detail: "거친 움직임으로 표층을 배회하는 뒤틀린 생물", image: "assets/unity/monster-ghoul.png", source: "GhoulEnemy.prefab" },
      { name: "고블린", type: "GOBLIN · 일반 · 근접", group: "surface", rank: "일반", detail: "숲 표층에서 가장 먼저 마주치는 기본 적", image: "assets/unity/monster-goblin.png", source: "GoblinEnemy.prefab" },
      { name: "골렘", type: "GOLEM · 네임드", group: "depths", rank: "네임드", detail: "HP 500 · 공격 30 · 슈퍼아머 6히트", image: "assets/unity/monster-golem.png", source: "GolemEnemy.prefab" },
      { name: "오우거", type: "OGRE · 네임드", group: "depths", rank: "네임드", detail: "HP 400 · 공격 35 · 슈퍼아머 5히트", image: "assets/unity/monster-ogre.png", source: "OgreEnemy.prefab" },
      { name: "오크", type: "ORC · 네임드 · 방패", group: "village", rank: "네임드", detail: "HP 300 · 정면 방어와 가드 브레이크", image: "assets/unity/monster-orc.png", source: "OrcEnemy.prefab" },
      { name: "스켈레톤 메이지", type: "SKELETON · 네임드", group: "depths", rank: "네임드", detail: "불·얼음·전기 중 하나를 무작위 시전", image: "assets/unity/monster-skeleton-mage.png", source: "Skeleton_MageEnemy.prefab" },
      { name: "스켈레톤 전사", type: "SKELETON · 일반 · 방패", group: "village", rank: "일반", detail: "정면 완전 방어 · 4회 가드 브레이크", image: "assets/unity/monster-skeleton-warrior.png", source: "Skeleton_WarriorEnemy.prefab" },
      { name: "트롤", type: "TROLL · 일반 · 대형", group: "depths", rank: "일반", detail: "깊은 곳을 지키는 육중한 근접 크리처", image: "assets/unity/monster-troll.png", source: "TrollEnemy.prefab" },
      { name: "좀비", type: "ZOMBIE · 일반 · 근접", group: "surface", rank: "일반", detail: "느린 걸음으로 전진하며 공간을 압박", image: "assets/unity/monster-zombie.png", source: "Zombie_MEnemy.prefab" }
    ]
  },
  game: {
    facts: [
      { value: "9", label: "이야기 장", detail: "3막 구조" },
      { value: "3", label: "무기 계열", detail: "단검 · 장검 · 대검" },
      { value: "22", label: "공격 기억", detail: "순서 조립형 콤보" },
      { value: "12", label: "몬스터", detail: "일반 8 · 네임드 4" },
      { value: "5", label: "등급", detail: "노말 → 레전더리" },
      { value: "3", label: "보스 페이즈", detail: "해방으로 향하는 전투" }
    ],
    pillars: [
      { index: "01", title: "콤보를 직접 조립한다", detail: "획득한 공격 기억을 슬롯에 배치한다. 같은 기억도 순서와 무기 궁합에 따라 피해와 리듬이 달라진다.", tone: "green" },
      { index: "02", title: "욕심과 속도를 저울질한다", detail: "엘리트와 보물을 더 찾으면 강해지지만, 오래 머물수록 검은 안개와 저주가 짙어진다.", tone: "amber" },
      { index: "03", title: "죽음이 이야기를 남긴다", detail: "골드는 잃고 레벨은 30%만 남는다. 기억의 보유·장착 순서와 선택 장비 최대 1개는 다음 반복으로 이어진다.", tone: "cyan" }
    ],
    loop: ["캠프", "탐색", "계약", "전투", "기억 조립", "더 깊이", "죽음 또는 해방"],
    story: [
      { act: "PROLOGUE", chapters: "캠프", title: "불려온 짐꾼", detail: "마을로 물자를 나르던 평범한 모험가가 숲길에서 잠든다. 눈을 뜨자 검은 안개가 돌아갈 길을 지우고, 거대한 뿌리가 땅을 찢고 솟아오른다.", place: "텐트 · 수레 · 무덤 4개", tone: "mist" },
      { act: "ACT I", chapters: "1~3장", title: "물든 숲", detail: "밝은 개활지와 뒤틀린 짐승 사이에서 먼저 지나간 누군가의 무기와 기억을 발견한다. 주인공은 그 흔적이 자신의 것임을 모른다.", place: "숲 개활지 · 짐승과 나무", tone: "green" },
      { act: "ACT II", chapters: "4~6장", title: "삼켜진 마을", detail: "오늘 아침 향하던 마을이 수십 년째 폐허였다는 사실이 드러난다. 시신은 없고, 여울목과 미로 아래에서 사람의 흔적이 짙어진다.", place: "폐허 마을 · 여울목 · 미로", tone: "amber" },
      { act: "ACT III", chapters: "7~9장", title: "뿌리 아래", detail: "뿌리가 뽑혀 나온 땅의 상처로 내려간다. 상대는 짐승에서 사람이었던 것으로 바뀌고, 가장 깊은 곳에서 늙은 수호자와 마주한다.", place: "심층 던전 · 원형 미로 · 마지막 장", tone: "violet" }
    ],
    novel: [
      { chapter: "서막", title: "검은 안개가 텐트를 에워쌌다", paragraphs: [
        "모험가는 해가 지기 전에 마을에 도착할 생각이었다. 수레에는 곡물 자루와 약병, 녹슨 농기구를 고칠 쇳조각이 실려 있었다. 이름난 용사도, 숲의 비밀을 쫓는 학자도 아닌 그는 그저 약속한 물자를 제때 가져다주는 사람이었다.",
        "그러나 밤이 내려앉자 길은 갑자기 끝났다. 텐트 밖으로 나온 그는 검은 안개가 나무 사이가 아니라 세상의 경계처럼 서 있는 것을 보았다. 안개에 손을 뻗을 때마다 차가운 벽이 밀어냈고, 수레를 돌리려 하자 땅속에서 솟은 거대한 뿌리가 돌아갈 길을 찢어 놓았다.",
        "텐트 곁에는 무덤이 네 개 있었다. 모두 오래된 것처럼 이끼가 끼어 있었지만 흙은 방금 덮은 듯 축축했다. 그는 묘비의 글자를 읽지 못했다. 비에 지워진 것이 아니라, 글씨가 자신의 손과 너무 닮아 눈이 뜻을 거부하는 것 같았다."
      ]},
      { chapter: "1장–3장", title: "물든 숲", paragraphs: [
        "아침은 오지 않았다. 안개 너머의 하늘은 밝아졌지만 숲은 밤의 색을 놓지 않았다. 고블린과 구울, 이름을 잃은 짐승들이 길가를 서성였고, 나무껍질 아래에서는 검은 핏줄 같은 것이 꿈틀거렸다.",
        "쓰러진 적의 곁에는 낯선 무기와 공격의 기억이 남았다. 검을 쥐자 몸이 먼저 움직였다. 한 번 베고, 몸을 낮춰 파고들고, 마지막 일격을 내리꽂는 순서를 손과 발이 알고 있었다. 배운 적 없는 동작이었다. 기억은 새로 얻은 지식이 아니라 오래전에 잃어버린 습관처럼 돌아왔다.",
        "숲은 그가 익숙해질 때마다 길을 바꾸었다. 전날 있던 개울이 사라지고 빈터 한가운데 뿌리의 벽이 생겼다. 그래도 텐트와 수레, 네 개의 무덤만은 움직이지 않았다. 그 변하지 않는 것들이 오히려 가장 불길했다."
      ]},
      { chapter: "4장–6장", title: "삼켜진 마을", paragraphs: [
        "물소리가 들리는 여울목부터 안개는 더 무거워졌다. 오래 머물수록 물은 불어나 발목을 삼켰고, 길가의 짐승 대신 녹슨 검을 든 뼈와 썩지 못한 사람들이 나타났다. 그들은 길을 막는 것이 아니라 그를 더 깊은 곳으로 몰아가는 것처럼 싸웠다.",
        "마침내 나무 사이로 지붕이 보였다. 그가 오늘 아침까지 물자를 전하려 했던 마을이었다. 하지만 우물은 말라 있었고 집의 들보에는 수십 년 묵은 균열이 가득했다. 밥 짓는 연기도, 기다리던 사람도, 시신조차 없었다. 마을 전체가 어느 날 한꺼번에 땅 아래로 끌려간 듯 비어 있었다.",
        "무너진 집에서 발견한 기록에는 마을을 지키는 수호자의 이야기가 적혀 있었다. 재난이 닥칠 때마다 뿌리가 벽이 되었고, 짐승이 내려올 때마다 숲이 길을 감췄다. 마지막 장에는 같은 문장이 여러 번 덧씌워져 있었다. ‘우리를 지키려는 힘이 우리를 놓아주지 않는다.’"
      ]},
      { chapter: "7장–9장", title: "뿌리 아래", paragraphs: [
        "마을 뒤편에서 뿌리 하나가 땅을 들어 올리고 있었다. 모험가가 가까이 다가가자 그것은 문처럼 갈라졌다. 아래로 이어지는 길은 동굴이 아니었다. 나무의 속, 거대한 생명의 상처 안으로 들어가는 통로였다.",
        "깊이 내려갈수록 벽에 박힌 물건들이 눈에 띄었다. 아이의 신발, 부러진 괭이, 마을 문장이 새겨진 방패. 수호자는 사람들을 버리지 않았다. 너무 오래, 너무 강하게 보호하려다 마을 전체를 자신의 안쪽으로 끌어안은 것이다. 그 안에서 사람은 뼈가 되고 흙이 되고, 끝내 숲을 지키는 괴물이 되었다.",
        "그제야 모험가는 자신이 숲을 지나온 것이 아니라 처음부터 수호자의 몸속을 걸어왔음을 알았다. 안개는 침입자를 가두기 위한 저주가 아니었다. 늙은 수호자의 몸에서 새어 나오는 고통이었고, 되풀이되는 길은 마지막 남은 의지가 후계자를 찾기 위해 만든 시험이었다."
      ]},
      { chapter: "마지막 장", title: "잠들지 않는 뿌리", paragraphs: [
        "가장 깊은 원형의 방에서 오래된 수호자가 눈을 떴다. 땅을 찢고 솟은 뿌리들은 팔처럼 휘둘렸고, 검은 안개가 호흡마다 쏟아졌다. 처음 두 번의 격돌에서 모험가는 통제되지 않는 힘의 파편과 싸웠다.",
        "마지막 순간, 수호자의 가슴에서 빛나는 코어가 드러났다. 방어가 무너진 것이 아니었다. 남아 있던 의지가 스스로 문을 연 것이었다. 칼끝이 코어에 닿자 숲 전체가 긴 숨을 내쉬었다. 그 일격은 살해가 아니라, 너무 오래 깨어 있던 존재에게 허락된 잠이었다."
      ]},
      { chapter: "종장", title: "물자를 내려놓는 사람", paragraphs: [
        "안개가 걷힌 뒤 모험가는 수레로 돌아왔다. 무덤은 다섯 개가 되어 있었다. 그는 묻지 않았다. 몇 번이나 이 길을 걸었는지, 몇 번이나 자신의 무덤을 만들었는지 이제는 알 것 같았기 때문이다.",
        "그는 빈 마을까지 수레를 끌고 가 약속한 물자를 한 집씩 나누어 내려놓았다. 받을 사람은 없었지만, 그 일만큼은 끝내고 싶었다. 마지막 자루를 내려놓았을 때 숲 아래에서 새 뿌리가 천천히 움직였다.",
        "모험가는 수호자가 있던 자리에 앉았다. 힘은 저주처럼 이어진 것이 아니라 누군가가 다음 사람을 위해 버티겠다고 선택한 약속으로 넘어왔다. 먼 훗날 또 다른 수레가 숲길에 들어오면, 이제 그가 안개와 길과 괴물 사이에서 후계자를 기다리게 될 것이다."
      ]},
      { chapter: "반복의 규칙", title: "숲은 장소를 기억하고, 사람은 몸으로 기억한다", paragraphs: [
        "죽음 뒤 숲은 장소를 다시 세우지만 완전히 같은 모양으로 만들지는 못한다. 흩어진 기억은 길 위에 놓이고, 모험가의 성장은 일부만 몸에 남는다. 골드는 사라져도 무덤과 상처, 손이 기억한 콤보의 순서는 다음 밤까지 이어진다.",
        "그러므로 반복은 실패의 취소가 아니다. 한 세대가 다음 세대에게 자리를 넘기는 연습이다. 더 어려운 숲에서 기다리는 보스는 이전 난이도에서 끝까지 살아남은 주인공이며, 여섯 번째 계승까지 이어지는 수호자들은 타락한 잔재가 아니라 누군가를 지키기 위해 남은 사람들이다."
      ]}
    ],
    clues: [
      { label: "기록자", detail: "동물이 흘린 기억을 다시 길에 놓고 은신처와 무덤을 만든다." },
      { label: "캠프의 무덤", detail: "첫 플레이부터 4개가 서 있고, 죽을 때마다 하나씩 늘어난다." },
      { label: "폐허 마을", detail: "오늘 도착한 목적지가 이미 수십 년째 폐허라는 시간의 어긋남." },
      { label: "코어 노출", detail: "보스의 방어가 무너지는 것이 아니라 남은 의지가 스스로 열어 주는 허락." }
    ],
    weaponFamilies: [
      { id: "dagger", name: "단검", role: "빠르게 흐름을 쌓는다", fit: "가벼운 기억 ×1.20", opposite: "무거운 기억 ×0.85", tone: "cyan" },
      { id: "longsword", name: "장검", role: "연계의 중심을 잡는다", fit: "보통 기억 ×1.20", opposite: "균형형", tone: "green" },
      { id: "greatsword", name: "대검", role: "쌓은 흐름을 끝낸다", fit: "무거운 기억 ×1.20", opposite: "가벼운 기억 ×0.85", tone: "amber" }
    ],
    weapons: [
      { id: "starter-dagger", name: "시작 단검", family: "dagger", type: "무료 지급 · 경량", damage: "10 고정", rarity: "STARTER", detail: "매 런 최소한의 기억 전투를 가능하게 하는 약한 기본 무기. 사망 장비 선택에서는 제외된다." },
      { id: "drop-dagger", name: "드랍 단검", family: "dagger", type: "해금 드랍 · 경량", damage: "20~30", rarity: "NORMAL+", detail: "가벼운 기억과 빠른 연타로 흐름을 안전하게 축적하는 파밍형 단검." },
      { id: "shadow-sword", name: "그림자 검", family: "longsword", type: "경량 한손검", damage: "30~45", rarity: "UNLOCK", detail: "단검의 속도감과 장검의 안정성을 잇는 경량 빌드용 무기." },
      { id: "blood-sword", name: "핏빛 검", family: "longsword", type: "경량 한손검", damage: "35~50", rarity: "UNLOCK", detail: "연속 공격과 돌진 기억을 중심으로 압박하는 공격적인 한손검." },
      { id: "knight-sword", name: "기사의 검", family: "longsword", type: "중량 한손검", damage: "65~85", rarity: "UNLOCK", detail: "보통 무게의 연계를 안정적으로 운용하고 마무리까지 이어 주는 표준 장검." },
      { id: "gold-sword", name: "황금 장식검", family: "longsword", type: "중량 한손검", damage: "70~90", rarity: "UNLOCK", detail: "높은 기본 피해와 균형 잡힌 콤보 운용을 노리는 장식 장검." },
      { id: "frost-greatsword", name: "서리 대검", family: "greatsword", type: "대검", damage: "85~105", rarity: "UNLOCK", detail: "무거운 기억과 마무리 피해에 집중하는 냉기 테마의 대검." },
      { id: "lava-greatsword", name: "용암 대검", family: "greatsword", type: "대검", damage: "95~115", rarity: "UNLOCK", detail: "가장 높은 피해 범위를 가진 화염 테마 대검. 느린 공격의 위험을 회피 캔슬로 보완한다." }
    ],
    memories: [
      { name: "섬광 베기", weight: "가벼움", damage: 3, trait: "빠른 시작", rarity: "NORMAL" },
      { name: "질풍 이연격", weight: "가벼움", damage: 3, trait: "빠르게 두 번 베기", rarity: "NORMAL" },
      { name: "찌르는 빛", weight: "가벼움", damage: 4, trait: "전방 찌르기", rarity: "NORMAL" },
      { name: "가로지르는 검", weight: "보통", damage: 5, trait: "교차 베기", rarity: "RARE" },
      { name: "낙하 일섬", weight: "무거움", damage: 8, trait: "마무리 · 대지", rarity: "RARE" },
      { name: "폭주하는 기억", weight: "무거움", damage: 12, trait: "마무리 · 전격 · 5연격", rarity: "UNIQUE" }
    ],
    depths: [
      { id: "surface", chapters: "1~3장", title: "물든 숲", detail: "짐승과 나무가 먼저 뒤틀린다", tone: "green" },
      { id: "village", chapters: "4~6장", title: "삼켜진 마을", detail: "뼈와 무기를 든 흔적이 나타난다", tone: "amber" },
      { id: "depths", chapters: "7~9장", title: "뿌리 아래", detail: "사람이었던 것과 흙·돌이 기다린다", tone: "violet" }
    ],
    monsters: [
      { name: "Goblin", ko: "고블린", group: "surface", role: "근접", rank: "일반", feature: "숲 표층의 기본 잡몹", status: "구현" },
      { name: "Ghoul", ko: "구울", group: "surface", role: "근접", rank: "일반", feature: "거친 움직임의 뒤틀린 생물", status: "구현" },
      { name: "Zombie M/F", ko: "좀비", group: "surface", role: "근접", rank: "일반", feature: "남녀형으로 구분된 느린 압박", status: "구현" },
      { name: "Skeleton Base", ko: "스켈레톤", group: "village", role: "근접", rank: "일반", feature: "뼈·검 사운드를 쓰는 표준 병사", status: "구현" },
      { name: "Skeleton Warrior", ko: "스켈레톤 전사", group: "village", role: "방패", rank: "일반", feature: "정면 완전 방어 · 4회 가드 브레이크", status: "구현" },
      { name: "Skeleton Archer", ko: "스켈레톤 아처", group: "village", role: "원거리", rank: "일반", feature: "화살 투사체로 공간을 압박", status: "구현" },
      { name: "Troll", ko: "트롤", group: "depths", role: "대형 근접", rank: "일반", feature: "깊은 곳의 육중한 크리처", status: "구현" },
      { name: "Golem", ko: "골렘", group: "depths", role: "근접", rank: "네임드", feature: "HP 500 · 공격 30 · 슈퍼아머 6히트", status: "구현" },
      { name: "Ogre", ko: "오우거", group: "depths", role: "근접", rank: "네임드", feature: "HP 400 · 공격 35 · 슈퍼아머 5히트", status: "구현" },
      { name: "Orc", ko: "오크", group: "village", role: "방패", rank: "네임드", feature: "HP 300 · 정면 방어와 가드 브레이크", status: "구현" },
      { name: "Skeleton Mage", ko: "스켈레톤 메이지", group: "depths", role: "원소 마법", rank: "네임드", feature: "불·얼음·전기 중 하나를 무작위 시전", status: "구현" }
    ],
    boss: {
      name: "잠들지 않는 뿌리",
      phases: [
        { phase: "PHASE 01", hp: "100~66%", title: "붙어서 흐름을 배운다", pattern: "느린 후려치기 · Punch · Slash · Smack", intent: "큰 빈틈 사이에서 가벼운 기억으로 흐름을 쌓는다.", tone: "green" },
        { phase: "PHASE 02", hp: "66~33%", title: "거리를 관리한다", pattern: "기본 근접 + 유도 투사체", intent: "락온을 유지하며 지형과 회피로 원거리 압박을 넘긴다.", tone: "amber" },
        { phase: "PHASE 03", hp: "33~0%", title: "허락된 코어에 마무리한다", pattern: "광역 뿌리 강타 · Step · Swing · 강화 슈퍼아머", intent: "회피 캔슬로 빠져나온 뒤 쌓아 둔 흐름을 무거운 마무리에 쏟는다.", tone: "violet" }
      ]
    }
  },
  feedbackSeed: [
    { id: "seed-1", title: "보스 모델은 뿌리 실루엣을 더 강조", detail: "트렌트보다 땅을 찢고 솟은 역전된 뿌리 형태가 핵심으로 보이면 좋겠습니다.", category: "아트", priority: "P1", status: "open", createdAt: "2026.07.31" },
    { id: "seed-2", title: "락온 스트레이프를 먼저 수정", detail: "보스전 제작 전에 좌우 이동과 후진 블렌드를 자연스럽게 맞춰야 합니다.", category: "게임플레이", priority: "P1", status: "in_progress", createdAt: "2026.07.31" }
  ]
};
