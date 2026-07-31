# 적 AI — 유한 상태 기계(FSM)

| 항목 | 내용 |
|---|---|
| 문서 버전 | v1.1 |
| 최종 수정 | 2026-07-31 |
| 상태 | **구현완료** (문서는 현재 코드 기준 역작성) |
| 관련 코드 | `Assets/7.Script/Enemy/` · `Assets/7.Script/Enemy_dst/` |

---

## 1. 개요

**목적**
적이 플레이어를 발견 → 추격 → 공격 → 놓치면 수색 → 복귀하는 사이클을 만든다. 상태가 명시적으로 나뉘어 있어야 **어느 상태에서 버그가 났는지 특정**할 수 있다.

**핵심 경험**
멀리서 적이 이쪽을 알아채는 순간이 보이고, 도망치면 마지막으로 본 자리를 뒤지다 포기한다. → *"들켰다 / 따돌렸다"가 플레이어에게 읽혀야 한다.*

---

## 2. 범위

**포함**
- 6개 상태(Idle · Patrol · Chase · Search · Attack · Hit)와 전이 조건
- 시야 판정(거리 · 각도 · 장애물)
- 공격 쿨다운 · 포위 접근
- 슈퍼아머(경직 저항) 연동

**제외 (이번 범위 아님)**
- 원거리 적 전용 상태(카이팅·재장전) — `SkeletonArcher` / `Skeleton_Mage`는 현재 **`_AttackRange` 미설정(-)** 으로 근접 로직을 쓰지 않는다. 별도 명세 필요
- 그룹 AI(협공 신호, 지휘) — 현재는 개체별 독립 판단 + 각도 분산만 있다
- 후퇴 / 도주 상태
- 보스 AI — 페이즈 기반이라 별도 문서

---

## 3. 동작 흐름

```
[Awake] 6개 상태 인스턴스 생성
[Start] 필수 컴포넌트 검증 → 실패 시 로그 후 FSM 미가동
        ↓ 전부 통과
      Patrol 로 진입
[Update] 현재 상태의 Update() 1회 + 발소리 타이머
```

**시야 판정**은 `Update`가 아니라 **별도 코루틴**이 `_CheckInterval` 주기로 돈다 (근접 0.1초 / 원거리 0.3초). 3단계를 순서대로 통과해야 `CanSeePlayer = true`:

1. **거리** — `distance ≤ _SightRange`
2. **각도** — `Vector3.Angle(forward, toPlayer) ≤ _SightAngle × 3.5`
3. **장애물** — 플레이어까지 `_ObstacleLayer` 레이캐스트에 걸리지 않을 것

> ⚠️ **각도에 곱해지는 3.5는 코드 상수다.** `_SightAngle = 120`이면 실제 판정각은 **420°** — 즉 **전방위**가 된다(360° 초과분은 무의미). 근접 적은 사실상 시야각 제한이 없는 상태이고, 원거리 적(60 × 3.5 = 210°)만 뒤쪽이 사각이다. **의도된 값인지 확인 필요 → §8 미결**

**상태 전이표**

| 현재 상태 | 입력/조건 | 다음 상태 | 비고 |
|---|---|---|---|
| **Patrol** | `CanSeePlayer` | Chase | 순찰 중 발견 |
| Patrol | 순찰 지점 도달 | Patrol | `_WaitTime`(2s) 대기 후 다음 지점 |
| Patrol | 2.5초간 이동거리 < 2m | Patrol | **끼임 복구** — 목표 재선정 |
| **Idle** | `CanSeePlayer` | Chase | |
| **Chase** | `CanSeePlayer` **and** `dist ≤ _AttackRange` | Attack | 거리는 `LastKnownPosition` 기준 |
| Chase | `CanSeePlayer` **and** `dist > _AttackRange` | Chase | `SetDestination(포위 지점)` |
| Chase | `!CanSeePlayer` | Search | 놓침 |
| **Attack** | `!CanSeePlayer` | Search | |
| Attack | `dist > _AttackRange` | Chase | 벗어남 |
| Attack | `Time.time ≥ 마지막공격 + _AttackCooldown` | Attack | 공격 실행(상태 유지) |
| **Search** | `CanSeePlayer` | Chase | 재발견 |
| Search | 마지막 위치 도달 | Search | 주변 탐색 시작 |
| Search | 누적 `≥ _SearchDuration` | Patrol | **포기** |
| **Hit** | 피격(슈퍼아머 아님) | Hit | 경직 진입 |
| Hit | 경직 종료 **and** `CanSeePlayer` | Chase | |
| Hit | 경직 종료 **and** `!CanSeePlayer` | Idle | |

**포위 접근** — 여럿이 추격할 때 한 점에 뭉치지 않도록, 목표 주위 원둘레의 한 점을 향한다.
- 목표까지 **7m 초과**면 그냥 직진 (경로 계산 낭비 방지)
- 7m 이내면 각도 = `(인스턴스ID × 137) % 360`, 반경 = `max(_AttackRange × 0.85, 1.2)`
- *137을 쓰는 이유: 360과 서로소인 소수라 개체 수가 늘어도 각도가 겹치지 않고 고르게 퍼진다*

**슈퍼아머** — 콤보를 무한정 이어붙이지 못하게 하는 장치.
- 피격 `_HitsForSuperArmor`회 누적 → 슈퍼아머 ON, 카운터 리셋, `_SuperArmorDuration`초 유지
- 슈퍼아머 중에는 **경직(Hit 상태) 없음** — 맞아도 공격을 계속한다
- 특성 **「끈질김」** 이 발동 히트 수를 늘린다 (`TraitEffect.SuperArmorHits`, 3 → 4)
- 저주 **「불굴」** 은 `SetPermanentSuperArmor()` — 영구 ON, 타이머 무시

---

## 4. 데이터 정의

**개체 스탯** — `EnemyAttribute` (프리팹별 설정, 코드 기본값 없음)

| 항목명 | 타입 | 범위 | 설명 |
|---|---|---|---|
| `_MaxHp` | float | 75~500 | 최대 체력 |
| `_Damage` | float | 12~35 | 1회 공격 피해 |
| `_Level` | int | 1~5 | 표시·보정용 |
| `_ChaseSpeed` | float | 3.5~8 | 추격 시 `NavMeshAgent.speed` |
| `_SightRange` | float | 10 / 16 | 발견 거리 |
| `_SightAngle` | float | 60 / 120 | **실제 판정각은 ×3.5** (§3 참고) |
| `_CheckInterval` | float | 0.1 / 0.3 | 시야 검사 주기(초). 낮을수록 반응이 빠르고 비용이 큼 |
| `_SearchDuration` | float | 2 / 4 | 놓친 뒤 포기까지(초) |
| `_HitsForSuperArmor` | int | 3 | 슈퍼아머 발동 피격 수 |
| `_SuperArmorDuration` | float | 2 | 슈퍼아머 지속(초) |
| `_DeathAnimDuration` | float | 5 | 사망 애니메이션 |
| `_SinkDuration` / `_SinkDepth` | float | 3 / 2 | 시체 가라앉기(초/m) |
| `_DropRadius` | float | 0.8 | 전리품 산포 반경 |

**행동 파라미터** — `EnemyBrain`

| 항목명 | 타입 | 범위 | 설명 |
|---|---|---|---|
| `_AttackRange` | float | 1.3~2.8 | 공격 진입 거리. 몸집에 비례 |
| `_AttackCooldown` | float | 2 | 공격 간 최소 간격(초) |
| `_PatrolType` | enum | Point / RandomRange | 지정 지점 순회 / 반경 내 랜덤 |
| `_PatrolRange` | float | — | RandomRange일 때 반경 |
| `_PatrolPoint[]` | Transform[] | — | Point일 때 순회 지점 |

**실측값 (프리팹 13종)**

| 프리팹 | HP | 공격 | Lv | 추격 | 시야 | 각 | 주기 | 수색 | 공격범위 | 쿨 |
|---|---|---|---|---|---|---|---|---|---|---|
| Goblin / Ghoul / Skeleton_Base / Skeleton_Warrior / Troll / Zombie_F / Zombie_M | 100 | 15 | 1 | 8 | 10 | 120 | 0.1 | 2 | 1.3 | 2 |
| Skeletone | 75 | 25 | 2 | 5 | 10 | 120 | 0.1 | 2 | 1.3 | 2 |
| Orc | 300 | 25 | 5 | 7 | 10 | 120 | 0.1 | 2 | 2.4 | 2 |
| Ogre | 400 | 35 | 5 | 6 | 10 | 120 | 0.1 | 2 | 2.7 | 2 |
| **Golem** | **500** | 30 | 5 | 5 | 10 | 120 | 0.1 | 2 | **2.8** | 2 |
| SkeletonArcher | 80 | 12 | 1 | 3.5 | **16** | **60** | **0.3** | **4** | — | — |
| Skeleton_Mage | 200 | 30 | 5 | 6 | **16** | **60** | **0.3** | **4** | — | — |

> **읽는 법**: 근접 7종이 HP 100 / 공격 15 / 추격 8로 **완전히 동일**하다. 몸집만 다르고 스탯 차이가 없어 현재는 **체감상 같은 적**이다 → §8 미결.
> 원거리 2종은 시야가 넓고(16m) 반응이 느리며(0.3s) 오래 쫓는다(4s) — 뒤에서 견제하는 역할 분담이 수치에 드러난다.

---

## 5. 예외 처리

| 상황 | 처리 | 피드백 |
|---|---|---|
| `Player` 태그 오브젝트 없음 | `EnemySight.InitilizeComponent()` 실패 → `CanSeePlayer` 항상 false | `Debug.LogError("Player is not assigned")` |
| `EnemySight`/`NavMeshAgent`/`EnemyPatrol`/`Animator` 누락 | `Start()`에서 **early return → FSM 미가동** (적이 가만히 서 있음) | 각각 `Debug.LogError` |
| `_Weapon` 미할당 | 히트박스 없이 FSM은 정상 가동 (공격 모션만 나가고 피해 없음) | 없음 — **조용히 실패** ⚠️ |
| 애니메이션 루트가 순간 이동 | 전투 상태 전환 때 루트/에이전트 위치를 다시 맞추고 사망 sink와 생존 애니메이션을 분리 | 회귀 QA 필요 |
| 사망·비활성 뒤 발소리 잔류 | 이동·활성·생존 조건을 모두 만족할 때만 발소리 재생 | 즉시 정지 |
| 순찰 중 끼임 | 2.5초간 이동거리 < 2m면 목표 재선정 | 없음 |
| NavMesh 밖 스폰 | `SetDestination` 실패 → 제자리 | 없음 — **조용히 실패** ⚠️ |
| 슈퍼아머 중 피격 | 경직 무시, `_HitCount` 증가 안 함 | 푸른빛 |
| 공격 쿨다운 중 사거리 진입 | Attack 상태 유지, 공격만 스킵 | 없음 |
| 동시 발생 우선순위 | **시야 상실 > 거리 판정 > 쿨다운** (각 상태 `Update` 첫 줄이 시야 검사) | — |

---

## 6. UI / 연출

| 요소 | 표시 조건 | 갱신 시점 | 연출 |
|---|---|---|---|
| 적 체력바 | 플레이어와 `_ActiveHpbarDistance`(5m) 이내 | 피격 시 | 즉시 감소 |
| 고스트 HP | 피격 후 | 0.5초 대기 → 초당 0.8 비율 감소 | 주황(다크소울식 지연바) |
| 누적 데미지 | 피격 시 | 합산 표시, **1.2초** 미피격 시 초기화 | 노랑 14pt |
| 저주 이름 | 저주 걸린 개체 | 스폰 시 1회 | 체력바 위 13pt |
| 슈퍼아머 **임박** | 다음 한 대면 발동 | `OnSuperArmorImminent` | **노란 점멸** 0.12s × 3회 |
| 슈퍼아머 **발동** | ON | `OnSuperArmorChanged(true)` | **푸른빛** 유지 |
| 사운드 | 공격 / 피격 / 발소리 | 발소리는 실제 이동·활성·생존 중일 때만 클립 길이 간격 | 월드 위치 3D, 최대 12m 선형 감쇠 |
| 공격 스윙음 | 히트박스 활성 시점 | 애니메이션 이벤트 `EnableHitbox()` | 모션과 동기 |

> **2026-07-31 안정화:** 스켈레톤 소실/재등장, 적의 지면 침투, 공격 무기 트레일 이탈을 수정했다. 프리팹별 애니메이터·아바타·루트 설정 차이로 재발할 수 있으므로 근접/원거리/대형 적을 각각 2회 이상 상대하는 회귀 테스트를 남겨 둔다.

---

## 7. 의존 관계

- **선행 필요**: `NavMesh` 베이크(맵 생성기가 런타임 베이크) · `Player` 태그 · `Object` 레이어(지면)
- **참조 시스템**: `TraitManager`(끈질김) · `MonsterCurse`(불굴 등 8종) · `DifficultyManager`(시간 저주 스탯 보정) · `EnemyLootTable`(전리품·정수) · `RunStats`
- **영향받는 기능**: 전투 판정(슈퍼아머가 콤보 흐름을 끊음) · 배틀존 · 엘리트 스폰

---

## 8. 미결 사항

| 항목 | 내용 | 결정 기한 |
|---|---|---|
| 시야각 ×3.5 | `_SightAngle 120 × 3.5 = 420°` → 근접 적은 전방위 감지. 의도라면 상수를 지우고 각도를 360으로 두는 게 명확하다 | 밸런스 조정 시 |
| 근접 7종 동일 스탯 | HP 100 / 공격 15 / 추격 8이 전부 같다. 챕터별 로스터 분리 작업 때 차등화 | 챕터 테마 배치 |
| 원거리 2종 `_AttackRange` 미설정 | 근접 FSM을 그대로 쓰면 사거리 0으로 판정된다. 원거리 전용 상태 필요 | 콘텐츠 확장 |
| `_Weapon` 미할당 시 무음 실패 | 경고 로그 추가 여부 | 폴리싱 |

---

## 9. 변경 이력

| 날짜 | 버전 | 변경 내용 | 이유 |
|---|---|---|---|
| 2026-07-31 | v1.1 | 몬스터 루트 애니메이션 안정화, 무기 트레일 정합, 3D 발소리 생존/이동 조건과 회귀 QA 기준 추가 | 소실·지면 침투·허공 발소리 사용자 제보 반영 |
| 2026-07-28 | v1.0 | 최초 작성 (현재 코드 기준 역작성) | 기존 기획서에 FSM 언급이 2회뿐이라 상태 전이를 재현할 수 없었음 |
