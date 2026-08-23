window.PROJECT_SYSTEMS = {
  updatedAt: "2026.08.24",
  categories: [
    { id: "combat", name: "전투 · 기억", description: "공격 기억을 조립하고 흐름을 쌓아 마무리하는 핵심 전투", tone: "green" },
    { id: "growth", name: "장비 · 성장", description: "장비 파밍, 등급, 강화와 영구 해금이 만드는 성장 구조", tone: "amber" },
    { id: "run", name: "런 · 계승", description: "계약 선택부터 죽음, 저장, 다음 세대로 이어지는 로그라이트 규칙", tone: "cyan" },
    { id: "world", name: "월드 · 맵", description: "9개 장과 절차 생성, 여울목 유체, 탐험 정보 시스템", tone: "mist" },
    { id: "enemy", name: "적 · 난이도", description: "적 AI, 네임드, 저주와 마지막 보스가 만드는 대응의 층", tone: "violet" },
    { id: "interface", name: "조작 · 표현", description: "입력, 카메라, UI, 사운드와 드랍 연출을 묶은 플레이 경험", tone: "blue" }
  ],
  sources: [
    { label: "전체 시스템 기획서", path: "docs/상세기획서.md" },
    { label: "맵 생성 명세", path: "docs/spec/01_절차적맵생성.md" },
    { label: "전투·흐름 명세", path: "docs/spec/02_전투판정_흐름시스템.md" },
    { label: "적 AI 명세", path: "docs/spec/03_적AI_FSM.md" },
    { label: "세이브·죽음 명세", path: "docs/spec/04_세이브_죽음규칙.md" }
  ],
  items: [
    {
      id: "memory-combo", group: "combat", title: "기억 조립 콤보", kicker: "CORE COMBAT", status: "구현 완료", statusKey: "done",
      summary: "공격 모션 하나가 기억 하나다. 보유 기억을 슬롯에 직접 배치한 순서대로 좌클릭 콤보가 실행된다.",
      metrics: [{ label: "기억", value: "22종" }, { label: "슬롯", value: "2→4칸" }, { label: "중첩", value: "+5 피해" }],
      rules: ["새 기억은 보유함에만 들어가며 자동 장착되지 않는다.", "슬롯은 기본 2칸, 레벨 6과 12에서 한 칸씩 열린다.", "사망 뒤에도 보유 기억과 장착 순서를 유지하고 승리·세대 교체 시 초기화한다.", "AnimatorOverrideController가 슬롯 순서에 맞춰 실제 공격 모션을 교체한다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "flow", group: "combat", title: "흐름(Flow)과 연계 태그", kicker: "COMBO GRAMMAR", status: "구현 완료", statusKey: "done",
      summary: "명중을 이어 배율을 쌓고 상승·돌진·마무리 태그를 올바른 순서로 연결하는 콤보 퍼즐이다.",
      metrics: [{ label: "배율", value: "×1.0~1.8" }, { label: "유지", value: "1.5초" }, { label: "태그", value: "3종" }],
      rules: ["가벼움 +0.08, 보통 +0.14, 무거움 +0.25만큼 명중 시 흐름이 오른다.", "상승 다음 타는 피해 ×1.30, 돌진→마무리는 흐름 +0.20이다.", "허공 스윙은 쌓이지 않고 맨손·피격·마무리 명중은 흐름을 끝낸다.", "회피 중에는 유지 시간이 멈춰 무거운 기억을 다시 이어갈 수 있다."],
      source: "docs/spec/02_전투판정_흐름시스템.md"
    },
    {
      id: "weapon-synergy", group: "combat", title: "무기 시너지 · 공격 스텝 · 그립", kicker: "WEAPON HANDLING", status: "구현 완료", statusKey: "done",
      summary: "무기 계열마다 잘 맞는 기억 무게가 다르고, 공격 진입과 그립·히트박스·트레일이 같은 기준으로 움직인다.",
      metrics: [{ label: "궁합", value: "×1.20" }, { label: "역궁합", value: "×0.85" }, { label: "물리 무기", value: "15종" }],
      rules: ["경량은 가벼움, 표준은 보통, 중량은 무거운 기억과 잘 맞는다.", "첫 타는 5m 안의 대상에게 약 2m 접근하고 1.2m 앞에서 멈춘다.", "락온 중에는 Q로 고정한 대상에게만 회전·돌진한다.", "무기 기본 그립과 기억별 그립을 합성해 메시·히트박스·트레일 이탈을 막는다.", "현재 모든 플레이어 공격은 기억별 기본 배속을 보존한 채 최종 재생 속도에 공통 ×2를 적용한다."],
      source: "docs/spec/02_전투판정_흐름시스템.md"
    },
    {
      id: "elements-combatfeel", group: "combat", title: "속성 · 상태이상 · 타격감", kicker: "COMBAT FEEL", status: "구현 완료", statusKey: "done",
      summary: "화염·냉기·대지·전격 기억이 상태이상과 전용 충격 효과를 만들고 명중 순간의 감각을 강화한다.",
      metrics: [{ label: "속성", value: "4종" }, { label: "피해 표시", value: "1.2초 합산" }, { label: "히트스톱", value: "약 0.06초" }],
      rules: ["화염은 지속 피해, 냉기는 둔화, 대지는 경직, 전격은 직격 피해를 강화한다.", "피해량 비례 히트스톱과 선택형 카메라 셰이크를 적용한다.", "속성별 Impact VFX와 애니메이션 이벤트 기반 스윙음이 타격 시점에 맞는다.", "적 체력바 아래 누적 피해가 표시되고 1.2초 동안 공격이 없으면 초기화된다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "player-slash-vfx", group: "combat", title: "플레이어 참격 · 공격 방향", kicker: "SLASH PRESENTATION", status: "구현·검증 완료", statusKey: "done",
      summary: "남청색 브러시 리본과 아이보리 코어를 공격 정면에 고정하고, 각 타격의 기울기만 기억 데이터에서 직접 조절한다.",
      metrics: [{ label: "크기", value: "5.1" }, { label: "재생", value: "0.60초" }, { label: "셀", value: "512px" }],
      rules: ["위치는 플레이어 정면 오프셋 (0, 1.0, 0.9)에 고정하고 효과 평면의 +Z가 공격 정면을 향한다.", "AttackCombo는 EnableHitbox 순서별 Local Euler와 Mirror X를 Inspector에 노출해 다단 공격을 개별 튜닝한다.", "Rear·Body·Core·Debris 네 시트는 4×3, 12프레임, 셀 512의 고해상도 재래스터화 결과를 사용한다.", "Loop·그림자·판정은 없고 같은 인스턴스의 Play→Stop→Play에서 렌더러와 파티클 초기화를 검증했다."],
      source: "docs/VFX_CONTEXT.md"
    },
    {
      id: "equipment-catalog", group: "growth", title: "무기 · 방어구 · 악세서리", kicker: "EQUIPMENT", status: "구현 완료", statusKey: "done",
      summary: "무기와 6부위 방어구, 반지를 실제 모델·파트 외형과 연결해 파밍과 커스터마이징을 분리했다.",
      metrics: [{ label: "무기", value: "16종" }, { label: "방어구", value: "300종" }, { label: "반지", value: "2종" }],
      rules: ["방어구는 갑옷·투구·장갑·하의·신발·벨트 6부위다.", "획득 시 공격·방어·체력 수치가 범위 안에서 무작위 결정된다.", "착용 장비는 스탯을 담당하고 외형은 해금된 파트 중 따로 선택한다.", "무료 시작 단검은 공격력 10이며 드랍 단검 20~30과 별도 취급한다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "grade-affix", group: "growth", title: "등급 · 접사 · 고유 효과", kicker: "LOOT DEPTH", status: "구현 완료", statusKey: "done",
      summary: "등급이 색상뿐 아니라 접사 개수, 강화 상한과 레전더리 고유 효과를 결정한다.",
      metrics: [{ label: "등급", value: "5단계" }, { label: "접사", value: "8종" }, { label: "고유 효과", value: "4종" }],
      rules: ["Normal→Rare→Epic→Unique→Legendary 순이며 흰·파랑·보라·노랑·하늘색으로 표시한다.", "접사는 0/1/2/3/3개, 강화 상한은 +3/+4/+5/+6/+7이다.", "레전더리는 불굴·화염의 여운·정수 공명·수확 중 부위에 맞는 효과 하나를 얻는다.", "접사와 고유 효과까지 SavedItem에 저장돼 지킨 장비의 개성이 유지된다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "gold-level-trait", group: "growth", title: "골드 · 레벨 · 특성", kicker: "RUN GROWTH", status: "구현 완료", statusKey: "done",
      summary: "경험치 대신 골드를 레벨·강화·포션에 투자하며, 레벨은 자동 스탯과 콤보 슬롯·특성을 연다.",
      metrics: [{ label: "레벨 비용", value: "100×1.25ⁿ" }, { label: "스탯", value: "+8/+5/+5" }, { label: "특성", value: "5레벨마다" }],
      rules: ["골드는 몬스터·보물·엘리트에게 얻고 죽으면 모두 잃는다.", "화톳불에서 골드를 내면 체력 +8, 공격 +5, 방어 +5가 함께 오른다.", "레벨 6·12에 콤보 슬롯이 열리고 5레벨마다 특성 3개 중 하나를 고른다.", "플레이어 레벨에 맞춰 적을 자동 강화하지 않으며 적은 깊이와 저주로만 강해진다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "essence-unlock", group: "growth", title: "숲의 정수 · 장비 해금", kicker: "META PROGRESSION", status: "구현 완료", statusKey: "done",
      summary: "죽어도 남는 정수로 드랍 풀과 커스터마이징 외형을 동시에 넓히는 영구 성장이다.",
      metrics: [{ label: "용도", value: "장비 해금" }, { label: "사망", value: "유지" }, { label: "성장 성격", value: "선택지 확장" }],
      rules: ["해금 전 장비는 드랍 풀과 외형 선택지에 나타나지 않는다.", "형태를 해금하면 해당 파트의 모든 색을 커스터마이징에서 사용할 수 있다.", "정수와 ItemID 기반 해금 목록은 세이브에 영구 저장된다.", "영구 스탯을 쌓는 대신 다음 런에 나올 수 있는 선택의 폭을 넓힌다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "potion-enhance", group: "growth", title: "포션 · 장비 강화", kicker: "SURVIVAL INVESTMENT", status: "구현 완료", statusKey: "done",
      summary: "포션은 이번 런의 생존 수단이고 강화는 장비 보존 여부와 영구 포션 성장 사이의 투자 판단을 만든다.",
      metrics: [{ label: "기본 회복", value: "최대 HP 40%" }, { label: "포션 강화", value: "최대 65%" }, { label: "몬스터 드랍", value: "20%" }],
      rules: ["F키로 마시며 사용 중에는 공격할 수 없다.", "포션 강화는 단계당 +5%p, 최대 +5이며 죽어도 유지된다.", "장비 강화는 단계당 +12%이고 등급별 상한을 따른다.", "죽을 때 포션과 재료는 장비 유지 후보에서 제외되고 모두 사라진다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "contract-cards", group: "run", title: "갈림길 카드 · 계약", kicker: "RISK & REWARD", status: "구현 완료", statusKey: "done",
      summary: "목적지는 무작위로 먼저 정해지고, 플레이어는 같은 목적지로 향하는 두 개의 보상·페널티 거래 중 하나를 고른다.",
      metrics: [{ label: "선택", value: "카드 2장" }, { label: "계약", value: "4종" }, { label: "기본 등장", value: "60%" }],
      rules: ["굶주린 길은 적 공격 +30% 대신 기억, 서두르는 저주는 저주 가속 대신 골드 +50%다.", "유리 몸은 받는 피해 +50% 대신 기억, 침묵의 숲은 지도를 막고 엘리트를 보장한다.", "계약은 선택 즉시 수락되고 한 런 동안 누적된다.", "카드 선택 중에는 시간이 멈추지만 화면 전환 애니메이션은 계속 움직인다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "death-inheritance", group: "run", title: "죽음 · 기억 · 장비 계승", kicker: "DEATH CONTRACT", status: "구현 완료", statusKey: "done",
      summary: "죽음은 무엇을 잃고 무엇을 다음 반복에 넘길지 선택하게 하는 로그라이트의 핵심 계약이다.",
      metrics: [{ label: "레벨", value: "30% 계승" }, { label: "골드", value: "전부 소실" }, { label: "장비", value: "최대 1개" }],
      rules: ["장비는 최대 하나를 고르거나 아무것도 지키지 않고 진행할 수 있다.", "무료 시작 단검과 포션·재료는 선택 후보에서 제외된다.", "보유 기억과 장착 순서, 숲의 정수와 해금은 유지된다.", "챕터·저주·특성·계약은 초기화되고 무료 단검은 매 런 다시 지급된다."],
      source: "docs/spec/04_세이브_죽음규칙.md"
    },
    {
      id: "save-load", group: "run", title: "세이브 · 로드", kicker: "PERSISTENCE", status: "보완 필요", statusKey: "partial",
      summary: "JSON 단일 슬롯에 영구 성장과 장비 롤 결과, 죽음 흔적을 저장한다. 배포 전 버전 마이그레이션이 필요하다.",
      metrics: [{ label: "슬롯", value: "1개" }, { label: "형식", value: "JSON" }, { label: "미결", value: "버전 이전" }],
      rules: ["사망 처리 완료, 보스 승리, 유품 회수 시 명시적으로 저장한다.", "장비는 등급·랜덤 수치·강화·접사·고유 효과까지 직렬화한다.", "손상된 파일은 새 데이터로 대체해 게임 진행을 막지 않는다.", "Version 필드는 있으나 아직 읽지 않아 배포 전 백업·마이그레이션이 필요하다."],
      source: "docs/spec/04_세이브_죽음규칙.md"
    },
    {
      id: "ghost-grave", group: "run", title: "유품 · 캠프 묘지 · 기록자", kicker: "DEATH ECHO", status: "부분 구현", statusKey: "partial",
      summary: "지난 죽음의 위치에는 유품이 남고 캠프에는 묘비가 쌓인다. 기록자 동물과 시작 무덤 네 기는 스토리 반영 대기다.",
      metrics: [{ label: "유품", value: "최근 1개" }, { label: "묘비", value: "최대 20개" }, { label: "회수", value: "E키" }],
      rules: ["같은 맵·챕터에서 죽은 위치에 봇짐과 푸른 흔적이 나타난다.", "회수하면 당시 기억 하나를 되찾고 없으면 골드 50을 받는다.", "캠프 사망은 유품으로 기록하지 않으며 묘비는 누적 사망 수를 반영한다.", "새 세이브 시작 무덤 4개와 기록자 동물 배치는 아직 남아 있다."],
      source: "docs/상세스토리.md"
    },
    {
      id: "rest-forge", group: "run", title: "휴식층 · 기억 제련소", kicker: "BUILD REFINEMENT", status: "부분 구현", statusKey: "partial",
      summary: "전투층 3개와 6개를 넘긴 뒤 이전 세대의 은신처에서 기억을 버리거나 합성해 빌드를 정제한다.",
      metrics: [{ label: "진입", value: "3·6클리어" }, { label: "버리기", value: "무료" }, { label: "제련", value: "300G" }],
      rules: ["보유 기억 하나의 전체 스택을 버려 보상 풀을 좁힐 수 있다.", "같은 등급 기억 2개를 한 단계 높은 무작위 기억 하나로 합성한다.", "회복샘과 무한 저장 모닥불은 구현되어 있다.", "휴식층 장비 강화는 예정이며 캠프 대장간 강화는 이미 동작한다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "chapter-flow", group: "world", title: "9개 장 · 맵 진행", kicker: "WORLD STRUCTURE", status: "부분 구현", statusKey: "partial",
      summary: "물든 숲, 삼켜진 마을, 뿌리 아래의 세 막을 1장부터 9장까지 서로 다른 공간 밀도로 내려간다.",
      metrics: [{ label: "전투 장", value: "1~9장" }, { label: "맵", value: "6종" }, { label: "휴식", value: "2회" }],
      rules: ["1~3장은 숲 개활지, 4~6장은 여울목·미로·폐허 마을, 7~9장은 원형 미로·BSP 던전이다.", "빛이 줄고 공간이 좁아지며 적의 정체가 짐승에서 사람이었던 것으로 변한다.", "카드가 장을 건너뛰는 것은 같은 이야기의 다른 판본이라는 설정으로 설명한다.", "B1~B9 표기를 1장~9장으로 바꾸는 작업과 일부 스토리 동선 배치가 남아 있다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "procedural-generation", group: "world", title: "절차적 맵 생성", kicker: "PROCEDURAL WORLD", status: "QA 필요", statusKey: "qa",
      summary: "숲·마을·여울목·BSP 던전·원형 미로를 생성하고 지형, 프롭, 스폰, NavMesh 순서로 완성한다.",
      metrics: [{ label: "생성기", value: "4종+" }, { label: "숲", value: "195×100m" }, { label: "BSP", value: "2~5층" }],
      rules: ["지형을 먼저 만들고 프롭을 접지한 뒤 스폰과 NavMesh를 배치한다.", "포아송 간격, 물 잠김 검사와 경사 보정으로 겹침·부유·침투를 줄인다.", "BSP 방은 위험 액체·보물·파괴 프롭·WFC 인테리어를 조합한다.", "생성 시드 기록, 스폰→출구 경로 검증과 실패 폴백은 배포 전 필수다."],
      source: "docs/spec/01_절차적맵생성.md"
    },
    {
      id: "dungeon-modular-authoring", group: "world", title: "던전 모듈 · Blender 편집", kicker: "MODULAR ENVIRONMENT", status: "편집 흐름 준비", statusKey: "partial",
      summary: "Unity의 저폴리 던전 프롭을 Blender에서 비파괴적으로 조절해 방 크기에 맞는 바닥·계단·아치 변형을 제작하는 흐름이다.",
      metrics: [{ label: "가져온 모듈", value: "6종" }, { label: "바닥", value: "타일 비율 유지" }, { label: "아치", value: "폭·높이 분리" }],
      rules: ["Throne_01, Column_05/06, Wall_03/34, Ground_13을 편집 기준 모듈로 사용한다.", "Ground_13은 단순 비균일 스케일 대신 벽돌 비율을 유지하며 면적을 늘리고 앞 계단도 별도로 조절한다.", "Wall_34 아치는 폭과 높이를 바꿔도 벽돌이 찌그러지지 않게 하고 생긴 빈 공간은 벽돌 반복으로 메운다.", "현재는 Blender 제작·검수 단계이며 최종 Unity 프리팹 교체는 별도 적용 확인이 필요하다."],
      source: "docs/프로젝트_현황.md"
    },
    {
      id: "river-fluid", group: "world", title: "여울목 · GPU 유체", kicker: "RIVER CROSSING", status: "부분 구현", statusKey: "partial",
      summary: "강·호수·폭포가 연결된 여울목에서 얕은 물 방정식 기반 GPU 유체가 흐르고 지형과 배치를 함께 제한한다.",
      metrics: [{ label: "필드", value: "165×140m" }, { label: "유체 격자", value: "256" }, { label: "초기 수심", value: "1.3m" }],
      rules: ["강은 호수로 연결되고 배수·유입·관성 값으로 흐름을 조절한다.", "나무와 스폰은 예상 수위보다 높게 배치해 나중에 잠기지 않게 한다.", "다리 스팬과 피벗을 자동 보정해 통행 가능성을 확보했다.", "스토리 전조와 연결되는 단계별 범람·수위 상승 연출은 후순위 작업이다."],
      source: "docs/spec/01_절차적맵생성.md"
    },
    {
      id: "navigation-map", group: "world", title: "미니맵 · 전체 지도 · Fog of War", kicker: "EXPLORATION UI", status: "구현 완료", statusKey: "done",
      summary: "탐험한 공간만 밝히는 미니맵과 M 전체 지도가 절차 생성 월드의 방향 감각을 보조한다.",
      metrics: [{ label: "전체 지도", value: "M" }, { label: "탐색", value: "Fog of War" }, { label: "계약", value: "봉인 가능" }],
      rules: ["미니맵 카메라는 맵 범위를 벗어나지 않도록 클램프된다.", "맵 밖은 검게 처리하고 탐험한 구역만 기록한다.", "침묵의 숲 계약을 고르면 미니맵과 전체 지도가 함께 봉인된다.", "챕터 진입 배너와 층별 앰비언스가 공간 전환을 알린다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "enemy-fsm", group: "enemy", title: "적 AI · FSM", kicker: "ENEMY BRAIN", status: "QA 필요", statusKey: "qa",
      summary: "Idle·Patrol·Chase·Search·Attack·Hit 여섯 상태가 발견, 추격, 수색과 경직을 명시적으로 처리한다.",
      metrics: [{ label: "상태", value: "6개" }, { label: "근접 감지", value: "0.1초" }, { label: "원거리 감지", value: "0.3초" }],
      rules: ["거리·각도·장애물 검사를 모두 통과해야 플레이어를 발견한다.", "놓치면 마지막 위치를 수색하다 시간이 지나면 순찰로 돌아간다.", "여럿이 추격할 때 인스턴스별 각도로 분산해 한 점에 겹치지 않는다.", "시야각 ×3.5, 근접 7종 동일 스탯과 원거리 전용 상태는 추후 정리가 필요하다."],
      source: "docs/spec/03_적AI_FSM.md"
    },
    {
      id: "monster-roster", group: "enemy", title: "일반 몬스터 · 네임드 · 드랍", kicker: "BESTIARY", status: "QA 필요", statusKey: "qa",
      summary: "일반 8종과 네임드 4종이 근접·원거리·마법·브루트 역할을 나누고 장비·골드·포션을 드랍한다.",
      metrics: [{ label: "일반", value: "8종" }, { label: "네임드", value: "4종" }, { label: "네임드 골드", value: "120G" }],
      rules: ["일반 적은 Goblin·Ghoul·Zombie·Skeleton·Troll·Archer 계열이다.", "Golem·Ogre·Orc·Skeleton Mage는 큰 체력과 보상, 다른 슈퍼아머 기준을 가진다.", "일반은 골드와 장비, 포션 20%를 롤하고 네임드는 드랍 확률이 3배다.", "등급·포션 체감 확률과 네임드 기억 확정 보상은 반복 샘플링이 필요하다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "enemy-defense", group: "enemy", title: "방패 · 슈퍼아머 · 원소 마법", kicker: "COUNTERPLAY", status: "구현 완료", statusKey: "done",
      summary: "정면 방어, 경직 저항과 원소 투사체가 콤보만 반복하지 않고 위치와 타이밍을 바꾸게 만든다.",
      metrics: [{ label: "가드 파괴", value: "4회" }, { label: "기본 슈퍼아머", value: "3히트" }, { label: "마법 속성", value: "3종" }],
      rules: ["방패 적은 정면 피해를 막고 측후면에서는 정상 피해를 받는다.", "4번 막으면 3초 가드 브레이크와 받는 피해 ×1.5가 적용된다.", "슈퍼아머 직전은 노란 점멸, 발동 중에는 푸른빛으로 표시한다.", "마법사의 불·얼음·전기 투사체는 지형에 막히고 목표 3m 앞에서 유도를 끊는다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "curse-hard", group: "enemy", title: "시간 저주 · 하드 6단계", kicker: "ESCALATION", status: "구현 완료", statusKey: "done",
      summary: "오래 머물수록 적이 강화되고 개별 몬스터 저주가 붙으며, 클리어할수록 다음 하드 단계가 영구 해금된다.",
      metrics: [{ label: "시간 틱", value: "5분" }, { label: "몬스터 저주", value: "8종" }, { label: "하드", value: "6단계" }],
      rules: ["Normal은 5분마다 최대 6틱, Easy는 시간 강화가 없다.", "강인·신속·흉포·불굴·강골·공명·원소 무기·약화의 일격이 스폰 때 붙는다.", "높은 하드는 초기 스탯, 시간 강화와 이중 저주 확률이 함께 오른다.", "저주 단계는 보라 비네트·포그 변색·심장박동으로 즉시 드러난다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "boss", group: "enemy", title: "보스 — 잠들지 않는 뿌리", kicker: "FINAL ENCOUNTER", status: "제작 대기", statusKey: "planned",
      summary: "반고정형 나무 정령이 3페이즈 동안 근접, 투사체와 광역 뿌리 강타로 흐름·회피·락온을 함께 검증한다.",
      metrics: [{ label: "페이즈", value: "3개" }, { label: "이동", value: "반고정" }, { label: "현재", value: "모델 대기" }],
      rules: ["한자리에 뿌리내리고 플레이어 쪽으로 회전하며 페이즈 전환 때 지하 이동한다.", "1페이즈는 근접, 2페이즈는 투사체, 3페이즈는 광역 강타와 강화 슈퍼아머다.", "코어 노출은 방어가 무너지는 것이 아니라 끝을 허락하는 서사 장면이다.", "모델·리깅·BossController·실제 사망 이벤트와 엔딩 연결이 남아 있다."],
      source: "docs/보스_설계_프롬프트.md"
    },
    {
      id: "input-lockon", group: "interface", title: "조작 · 회피 · Q 락온", kicker: "PLAYER CONTROL", status: "수정 필요", statusKey: "qa",
      summary: "키보드·마우스 조작과 방향 회피, 대상 고정 공격이 구현됐으며 락온 스트레이프 이동은 보정이 남아 있다.",
      metrics: [{ label: "공격", value: "좌클릭" }, { label: "회피", value: "Space" }, { label: "락온", value: "Q" }],
      rules: ["WASD 이동, E 상호작용, F 포션, Tab 인벤토리, M 지도를 사용한다.", "회피 중 완전 무적이며 공격 도중 캔슬해도 흐름이 유지된다.", "10m 안에서 카메라 정면의 적을 우선 고정하고 15m 이탈·사망 시 해제한다.", "락온 중 A/D 원형 횡이동과 S 후진의 실제 벡터·애니메이션 정합이 수정 대기다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "ui-onboarding", group: "interface", title: "관리 화면 · HUD · 메뉴 · 온보딩", kicker: "UI / UX", status: "구현 완료 · 회귀 QA", statusKey: "qa",
      summary: "캐릭터 관리부터 전투 HUD, 지도, 사망과 캠프 귀환까지 같은 나무 프레임 테마와 입력 규칙으로 연결한다.",
      metrics: [{ label: "기준", value: "1920×1080" }, { label: "언어", value: "한국어" }, { label: "최신 콘솔", value: "0 / 0" }],
      rules: ["인벤토리 장비는 부위 슬롯에 드래그해 장착·해제하고 장착 슬롯도 클릭해 상세 정보를 본다.", "기억 구성은 보유함·선택 정보·장착 슬롯으로 나뉘며 배치 순서가 실제 콤보 순서다.", "HP·적 HP·미니맵·골드·정수·포션·흐름·상태 칩은 배경과 아이콘으로 구분한다.", "사망 후 캠프와 커스터마이징 미리보기 카메라는 복구됐으며 다중 해상도 전체 런 회귀 QA가 남아 있다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "audio", group: "interface", title: "앰비언스 · 전투 · 3D 발소리", kicker: "AUDIO", status: "청각 QA", statusKey: "qa",
      summary: "챕터별 환경음, 전투 피드백과 몬스터 계열별 3D 사운드가 구현됐고 실제 헤드폰 믹싱 검증이 남아 있다.",
      metrics: [{ label: "앰비언스", value: "3구간" }, { label: "감쇠", value: "최대 12m" }, { label: "몬스터 음색", value: "4계열" }],
      rules: ["1~3장은 바람·새, 4~6장은 적막, 7~9장은 낮은 드론으로 전환된다.", "스켈레톤·크리처·브루트·마법사 계열을 음색과 피치로 구분한다.", "몬스터 발소리는 실제 이동·활성·생존 중에만 월드 위치에서 재생된다.", "최종 음원 교체와 헤드폰별 위치·거리·잔류음 검증이 필요하다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "drop-vfx", group: "interface", title: "3D 장비 드랍 · 등급 VFX", kicker: "LOOT PRESENTATION", status: "QA 필요", statusKey: "qa",
      summary: "아이콘 대신 실제 장비 모델을 세워 보여 주고 등급별 바닥 라이트·원형·광기둥으로 희귀도를 읽게 한다.",
      metrics: [{ label: "에픽", value: "보라 원형" }, { label: "유니크", value: "노랑 기둥" }, { label: "레전더리", value: "하늘색 기둥" }],
      rules: ["무기 모델은 Y축 약 1.2m에서 부유·회전하고 방어구와 VFX는 지면에 고정한다.", "유니크·레전더리 빔은 바닥 원, 코어, 수직 streak, mote와 회전 나선으로 구성된다.", "투명도를 낮추고 VFXEasyMakerAura를 제거해 모델을 가리지 않는다.", "실제 맵 조명에서 10m 거리 가독성과 드랍 확률을 다시 검증해야 한다."],
      source: "docs/상세기획서.md"
    },
    {
      id: "arena-tools", group: "interface", title: "아레나 개발 도구 · QA", kicker: "DEVELOPMENT TOOLS", status: "구현 완료", statusKey: "done",
      summary: "전투 시험장에서 몬스터와 장비 드랍을 즉시 재현하고 패널 조작 중 카메라 입력을 안전하게 차단한다.",
      metrics: [{ label: "몬스터 패널", value: "F2" }, { label: "장비 패널", value: "F3" }, { label: "스폰", value: "플레이어 위치" }],
      rules: ["F2는 몬스터 시험장, F3는 전체 장비 드랍 패널을 연다.", "선택한 장비는 현재 플레이어 위치에 실제 월드 픽업으로 생성된다.", "패널이 열리면 커서를 풀고 카메라 Look을 막으며 닫으면 이전 상태로 복귀한다.", "사망 2회차·몬스터 애니메이션·사운드·전리품·드랍 VFX 회귀 테스트에 사용한다."],
      source: "docs/개발_체크리스트.md"
    }
  ]
};
