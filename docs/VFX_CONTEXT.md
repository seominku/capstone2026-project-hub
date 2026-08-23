# Capstone2026 VFX 제작 컨텍스트

> 최종 갱신: 2026-08-10  
> 대상 프로젝트: `D:\Unity\Capstone2026`  
> 저작 도구: `C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker`  
> 기준 Unity: 6000.3.10f1 / URP 17.3.0  
> 이 문서는 새 Codex 세션이 가장 먼저 읽는 VFX 작업 기준서다.

## 1. 문서의 목적과 적용 우선순위

이 프로젝트의 신규 VFX는 다음 원칙으로 제작한다.

1. **VFXEasyMaker(VFX Forge)에서 룩과 타이밍을 설계한다.**
2. **JSON을 원본으로 보존하고 Unity용 JSON·스프라이트시트로 이관한다.**
3. **Unity에서는 URP용 머티리얼, 실제 3D 배치, 재생 수명, 풀링을 확정한다.**
4. **최종 게임 자산은 자기완결적인 프리팹으로 만든다.** 런타임이 웹 툴에 의존하면 안 된다.

규칙이 충돌할 때의 우선순위는 다음과 같다.

1. 프로젝트 루트 `CLAUDE.md`
2. 이 문서 `Docs/VFX_CONTEXT.md`
3. `Assets/VFXForge/README.md`
4. VFXEasyMaker의 `SCHEMA.md`, `mcp/README.md`
5. 외부 에셋의 예제와 기존 레거시 자산

이 문서에서 경로 또는 수치 옆에 **확인 필요**라고 적힌 것은 추측해 확정하지 말고 Unity Editor에서 확인한다.

### 1.1 문서 동기화 규칙

이 문서는 일회성 인계 문서가 아니라 VFX 작업의 현재 기준서다. 앞으로 VFX와 관련된 내용이 추가되거나 변경되면 **같은 작업에서 이 파일도 반드시 함께 수정한다.**

- 제작 방식, 레이어 구성, 타이밍 또는 수치가 바뀌면 해당 기준과 예시를 갱신한다.
- 폴더 구조, 네이밍, 셰이더, 머티리얼, 파티클, 풀링 규칙이 바뀌면 관련 섹션과 체크리스트를 함께 갱신한다.
- 새 VFX 프리셋이나 Unity 프리팹을 만들면 식별자, 저장 경로, 레이어 분류, 주의사항을 추가한다.
- 새 참고 자료를 사용하면 URL과 그 자료에서 참고한 요소를 기록한다.
- 계획만 세운 항목과 실제 프로젝트에 반영된 항목을 구분한다. 완료되지 않은 작업을 현재 상태로 기록하지 않는다.
- 문서를 수정할 때 상단 `최종 갱신` 날짜를 실제 수정일로 맞춘다.
- 작업 완료 보고에 VFX 자산과 이 문서의 변경 경로를 모두 포함한다.

다른 Codex 세션도 VFX 변경을 완료했다고 보고하기 전에 `Docs/VFX_CONTEXT.md`의 동기화 여부를 확인해야 한다.

---

## 2. 이번 세션에서 확정한 제작 방향

### 2.1 기본 방식: Blender 메시가 아닌 2.5D 레이어 조립

명조(Wuthering Waves) 스타일의 검격은 기본적으로 Blender에서 단일 3D 메시 하나를 만드는 방식이 아니라, 다음 요소를 겹치는 **2.5D 레이어 방식**으로 제작한다.

- 넓고 어두운 후면 스미어
- 불투명한 색상 몸체
- 몸체 안쪽을 잘라내는 어두운 네거티브 스페이스
- 카메라 쪽의 얇고 밝은 절단 코어
- 한 단계 뒤의 가는 잔광
- 늦게 찢기는 각진 파편
- 진행 방향으로 튀는 소량의 불티

이 방식은 색, 폭, 타이밍, 깊이를 빠르게 수정할 수 있고 카메라 이동 시 레이어가 분리되어 보인다. Blender는 다음 경우에만 사용한다.

- 카메라가 검격 주변을 크게 회전하고 실제 메시 실루엣이 반드시 유지되어야 할 때
- 칼날 궤적이 캐릭터나 지형을 감싸며 명확한 3D 교차를 해야 할 때
- 절차적 Unity 메시나 여러 평면으로는 필요한 찢김·비틀림 실루엣을 만들 수 없을 때

그 외에는 VFXEasyMaker + Unity 메시/쿼드/ParticleSystem 조립을 우선한다.

### 2.2 목표 룩

목표는 사실적 볼류메트릭 이펙트가 아니라 **애니메이션식 하드 밴딩 + 제한된 발광**이다.

- 문서 스타일: `style: "cel"`
- 시각적 스텝: `stepFps: 12`
- 넓은 면은 `normal/alpha` 블렌드로 색을 보존한다.
- Additive는 백색 코어, 얇은 잔광, 불티처럼 면적이 작은 부분에만 쓴다.
- 넓은 색상 면을 Additive로 겹쳐 흰색으로 포화시키지 않는다.
- 끝이 완벽히 매끈한 초승달보다, 폭 변화·짧은 파편·불균일한 꼬리가 있는 리본 실루엣을 선호한다.
- 블룸은 절단선과 불티를 받쳐 주는 수준으로 사용한다. 블룸이 형태를 대신하면 안 된다.
- 색수차와 방사형 블러는 기본 프리셋에 넣지 않는다. 저해상도 합성과 결합했을 때 형태가 흐려지는 문제가 확인됐다.

### 2.3 화면 임팩트의 소유권

VFXEasyMaker 프리셋의 `impact` 값은 타이밍 힌트로 볼 수 있지만 Unity 임포터가 읽지 않는다. 카메라 흔들림, 화면 플래시, 히트스톱은 최종 VFX 프리팹 내부 기능으로 넣지 않는다.

- VFX 프리팹: 시각 효과만 담당
- 전투/카메라 시스템: 흔들림, 플래시, 히트스톱 담당
- 둘의 동기화: 애니메이션 이벤트 또는 기존 전투 이벤트에서 같은 타이밍으로 호출

현재 `crescent25d` 원본에는 `t=0.10`, `shake=0.18`, `flash=0.12`, `hitstop=2` 힌트가 있으나, 이것을 프리팹이 직접 실행하면 안 된다.

---

## 3. 기준 프리셋: 층광 초승 참격

### 3.1 원본 식별자

- VFXEasyMaker 키: `crescent25d`
- 표시 이름: `층광 초승 참격`
- 카테고리: `전투`
- 공간: `3d`
- 1회성: `true`
- 전체 문서 길이: `1.15s`
- 스타일: `cel`
- 스텝 프레임: `12fps`
- 기본 단위 변환: `unitScale = 0.01` (`100px = 1 Unity unit`)
- 원본 위치: `VFXEasyMaker/VFXForge.html`의 `PRESETS`
- 포맷 설명: `VFXEasyMaker/SCHEMA.md`의 `crescent25d` 항목

### 3.2 레이어 계약

Unity 계층에서는 아래 순서를 유지한다. `L00`, `L10` 등의 번호는 Hierarchy 정렬과 렌더 순서를 동시에 읽기 쉽게 하기 위한 것이다.

| 순서 | Unity 자식 이름 | 원본 이름/타입 | 시작 | 종료 | 역할 | 블렌드 |
|---|---|---|---:|---:|---|---|
| 00 | `L00_RearSmear` | `main` / ribbon | 0.000 | 0.580 | 가장 뒤의 넓은 잔상 | Normal 권장 |
| 10 | `L10_Body` | `초승달 몸체` / ribbon | 0.025 | 0.560 | 셀 밴드 본체 | Normal |
| 20 | `L20_VoidCut` | `속 비움` / ribbon | 0.030 | 0.550 | 내부 네거티브 스페이스 | Normal |
| 30 | `L30_WhiteCore` | `백색 절단선` / ribbon | 0.040 | 0.520 | 가장 밝은 절단선 | Additive |
| 40 | `L40_InnerGlow` | `안쪽 잔광` / ribbon | 0.070 | 0.620 | 깊이 단서와 후행광 | Additive |
| 50 | `L50_Shards` | `칼날 파편` / shards | 0.110 | 0.780 | 늦게 찢기는 각진 조각 | Normal |
| 60 | `L60_Sparks` | `칼끝 불티` / particle | 0.100 | 0.920 | 칼끝 진행 방향 불티 | Additive |

### 3.3 핵심 형상 수치

아래 px 값은 VFXEasyMaker 원본값이다. Unity에서 직접 메시를 만들 때 `× 0.01`로 변환한다.

| 레이어 | 반경 | 폭 | 호 시작/끝 | 원본 회전 `x,y,z` | 원본 위치 `x3,y3,z3` | Unity 위치 예시 |
|---|---:|---:|---|---|---|---|
| RearSmear | 170px | 72px | 202° → 344° | -5, 9, -28 | -70, -30, -20 | -0.70, -0.30, -0.20 |
| Body | 174px | 58px | 204° → 344° | -3, 6, -28 | -65, -32, -2 | -0.65, -0.32, -0.02 |
| VoidCut | 153px | 23px | 207° → 341° | -3, 5, -28 | -65, -32, 3 | -0.65, -0.32, 0.03 |
| WhiteCore | 190px | 8px | 205° → 343° | -1, 3, -28 | -62, -34, 14 | -0.62, -0.34, 0.14 |
| InnerGlow | 132px | 5px | 214° → 334° | 4, -5, -25 | -72, -26, -12 | -0.72, -0.26, -0.12 |

Unity 좌표는 효과 루트의 로컬 좌표로 사용한다. 실제 무기 길이와 카메라 거리에 따라 루트 스케일만 조정하고, 레이어 간 상대 깊이 비율은 유지한다.

### 3.4 색과 재질 역할

- RearSmear: 어두운 보라 계열. 넓지만 낮은 밝기.
- Body: 외곽 `(30,24,94)`, 중간 `(116,98,245)`, 코어 `(196,224,255)`에 대응하는 3단 셀 밴드.
- VoidCut: 거의 검정에 가까운 남청 `(7,10,24)`.
- WhiteCore: 흰색에서 청백색으로 감쇠. 넓히지 않는다.
- InnerGlow: 청록 `(124,255,244)`에서 청보라 `(56,92,210)`로 감쇠.
- Shards: 회청색에서 어두운 보라색으로 감쇠.
- Sparks: 청백색에서 보라색으로 감쇠.

### 3.5 파편과 불티 수치

`L50_Shards`:

- 개수: 7
- 길이: 38px (`0.38u`)
- 폭: 5px (`0.05u`)
- 내부 반경: 140px (`1.40u`)
- 호 범위: 204° → 344°
- 비틀림/지터: 높게(`jitter 0.82`), 평면 분포
- 시작을 0.11초까지 늦춰 본체보다 뒤에 터지게 한다.

`L60_Sparks`:

- Burst: 42
- 수명: 0.22~0.58초
- 속도: 90~280px/s → `0.9~2.8u/s`
- 중력: 90px/s² → 약 `0.9u/s²` 아래 방향
- Drag: 1.8
- Trail: 원본 5, 폭 0.8
- 시작 크기: 7px. 현재 임포터는 반지름형 글로우 보정을 위해 `×2`하므로 약 `0.14u`로 생성한다.
- 크기 곡선: `7 → 3 → 0`
- 알파 곡선: `1 → 0.9 → 0`

### 3.6 실제 적용: 플레이어 일반 공격 참격

2026-08-10에 FXTags 레퍼런스를 기준으로 기존 `crescent25d` 단일 합성 시트를 전면 교체했다. 프로젝트 저작 키는 `playerattackslash_vfxeasymaker_source`, 표시 버전은 **Player Attack Slash - FXTags Brush Ribbon v2**, schema는 `version: 1`이다.

- 상태: **FXTags 리디자인 프리팹 제작·단독 재생/풀 재사용, Inspector 입력용 커스텀 회전 API 및 타격별 게임플레이 연결 완료**.
- 최종 프리팹: `Assets/6.PreFab/VFX/PF_VFX_PlayerAttackSlash.prefab`
- 저작 꾸러미: `Assets/VFXForge/Effects/PlayerAttackSlash/`
- 원본/Unity 변환: `playerattackslash_vfxeasymaker_source.json`, `UnityExport/Player_Attack_Slash_-_FXTags_Brush_Ribbon_v2.unity.json`
- 전용 재생 컴포넌트: `Assets/7.Script/Effects/PlayerAttackSlashVFX.cs`
- 저작 원본은 11레이어다. 리본·파편 10레이어는 역할별 12프레임 4×3 시트 네 장(`Rear Alpha`, `Body Alpha`, `Core Additive`, `Debris Alpha`)으로 굽고, 지원 파티클 1레이어는 Unity ParticleSystem 기반 `Sparks Additive`로 구현한다. 넓은 면에는 Additive를 사용하지 않는다.
- 색은 어두운 남청 후면 스미어, 단일 저채도 청색~청백 본체, 얇은 아이보리 코어로 제한한다. 색상 시퀀스와 hue 회전, 다색 띠, 충격파 판은 사용하지 않는다.
- 타임라인은 예광 `0.00~0.09s`, 본체/코어 가독 피크 `0.06~0.14s`, 본체 대부분 소멸 `0.20~0.35s`, 파편/짧은 불티 `0.45~0.60s`, 전체 `PlaybackDuration = 0.60s`다. 루프는 모두 Off다.
- 시트는 `_SheetTransform` MaterialPropertyBlock으로 한 셀만 샘플한다. Alpha 셰이더는 투명 검정 RGB/미세 alpha 픽셀을 discard해 사각 시트 밴드가 나타나지 않는다.
- 프리팹은 중앙 피벗의 로컬 `XY` 평면이고 `Root_ArcLayers` 고정 보정 회전은 `(0,0,0)`이다. 최종 계약은 **로컬 `+X` = 스윙 진행 접선, 로컬 `+Y` = 반경/칼날축, 로컬 `+Z` = 플레이어·공격 정면/평면 노멀**이다.
- 참격 위치는 계속 `player position + right×offset.x + up×offset.y + attackForward×offset.z`의 동일 정면 중심을 사용한다. 최종 확대 계약은 로컬 오프셋 `(0,1.0,0.9)`, 균일 루트 스케일 `5.1`(`1.7 × 3`), 프리웜 풀 `3`이다. 크기는 호출 루트에서만 적용하며 프리팹 내부 메시·시트·자식 스케일은 변경하지 않는다.
- 일반 공격 호환용 `TryCreateFacingPlaneRotation()`은 유지한다. `TripleAttack`은 칼끝 순간 추정값 대신 `ApplyDirectionProfile(profile, facingForward)`에 명시적 프로필을 전달한다. 이 API는 위치를 바꾸지 않고 로컬 `+Z`를 공격 정면에 고정한다. `HorizontalForward`는 local `+X`가 플레이어 오른쪽인 수평 정방향, `HorizontalReverse`는 같은 루트 회전에서 `Root_ArcLayers.localScale.x=-1`인 수평 역방향, `VerticalDown`은 local `+X`가 월드 아래쪽인 수직 하강이다. 풀에서 대여한 비활성 인스턴스에 프로필과 정면을 적용한 뒤 `SetActive(true)`로 재생한다.
- 사용자가 타격별 회전을 Inspector에서 직접 조정할 때는 `ApplyCustomRotation(facingForward, worldUp, localEuler, mirrorX)`을 사용한다. 회전 합성 순서는 `Quaternion.LookRotation(correctedForward, correctedUp) * Quaternion.Euler(localEuler)`이며 입력 Euler를 자동 추정하거나 재보정하지 않는다. 위치는 변경하지 않는다. `mirrorX`는 회전과 독립적으로 `Root_ArcLayers`의 기준 스케일에서 `+X/-X`를 매 호출 다시 적용하므로 풀 재사용 시 이전 미러가 남지 않는다. 호출 뒤 게임플레이 코드가 `transform.rotation`을 다시 기록하면 Inspector 값이 사라지므로 회전의 최종 소유권은 이 호출에 둔다.
- `Stop()`은 네 MeshRenderer를 비활성화하고 ParticleSystem을 `StopEmittingAndClear`한다. 같은 인스턴스에서 `Play → Stop → Play` 검증 결과 Renderer 잔재 없음, 파티클 `0`, 두 번째 재생 정상이다.
- 프리팹에는 Collider, Rigidbody, Light, 판정, 동적 라이트, 그림자, 카메라 빌보드가 없다. 깊이는 역할별 `z=0.00~0.03`의 얕은 분리만 사용한다.
- 대표 VFXForge 프레임: `ReviewFXTagsV2/frame_00_t0.02.png`, `frame_01_t0.10.png`, `frame_02_t0.25.png`, `frame_03_t0.55.png`
- 실제 Game View: 기존 단독 검증 `Validation/Captures/slash_horizontal_final_v4.png`, `slash_vertical_final_v4.png`, `slash_decay_028_final_v2.png`. 명시적 3타 프로필 검증은 `slash_profile_hit1_horizontal_forward_v1.png`, `slash_profile_hit2_horizontal_reverse_v1.png`, `slash_profile_hit3_vertical_down_v1.png`이다. 커스텀 Inspector Euler 검증은 `slash_custom_euler_000_v1.png`, `slash_custom_euler_180_v1.png`, `slash_custom_euler_270_v1.png`이며 각각 실제 루트 Euler Z `0°/180°/270°`로 렌더됐다.
- 3배 확대 Game View 검증은 `slash_scale_compare_1p7_vs_5p1_close_v1.png`, `slash_scale_5p1_peak_framed_v1.png`, `slash_scale_5p1_particles_t030_v1.png`이다. 동일 `t=0.10s` 결합 MeshRenderer Bounds는 `6.80 → 20.40`으로 X/Y/Z 모두 정확히 `3.00배`였고, 네 시트 렌더러는 모두 `_SheetTransform=(0.25,0.333,0.50,0.667)`의 동일 단일 셀을 유지했다. `5.1`에서도 local `+Z` 정면 dot `1`, `Duration=0.60s`, 파티클 생존 및 같은 인스턴스의 `Play → Stop → Play` 초기화를 확인했다.
- 스케일 `5.1` 확대 품질 보강으로 역할별 네 시트를 기존 셀 `256×256`/시트 `1024×768`에서 셀 `512×512`/시트 `2048×1536`으로 재베이크했다. 기존 논리 256 좌표·카메라·피벗·절차 도형을 유지하고 Canvas backing store/device pixel ratio만 2배로 둔 재래스터화이며, 완성 PNG 단순 업스케일은 아니다. 파일명과 Unity GUID는 유지했다.
- 고해상도 시트의 최종 임포트는 Default, sRGB On, Alpha From Input/Alpha Is Transparency On, Max Size 2048, RGBA32 Uncompressed, Bilinear, Clamp, Mipmap Off, Aniso 1, Readable Off다. raw GPU surface는 `12 MiB/장`, 네 장 `48 MiB`다. mip On은 약 `16 MiB/장`, 네 장 `64 MiB`였고 스케일 5.1의 1920×1080 A/B 픽셀이 완전히 동일해 Off를 선택했다. 셀 768은 mip 없는 네 장도 `108 MiB`라 512 대비 2.25배이며 선명도 이득 필요성이 없어 제외했다.
- 동일 카메라·`t=0.10s`·스케일 `5.1`의 저해상도/고해상도 화면 threshold-16 bounds는 정규화 폭 `0.3760→0.3792(+0.85%)`, 높이 `0.4074→0.4065(-0.22%)`, 밝기 중심 이동 `X +0.11%p/Y -0.05%p`로 실루엣·피벗 허용 오차 1~2%를 통과했다. A/B는 `slash_hd_before_cell256_scale5p1_t010_1920x1080_v1.png`, `slash_hd_after_cell512_supersample2x_mipoff_scale5p1_t010_1920x1080_v1.png`, 나란히 비교 `slash_hd_compare_before256_left_after512_right_3840x1080_v1.png`, 확대 비교 `slash_hd_compare_before256_left_after512_right_crop_v1.png`이다.
- 갱신 시트의 타격별 회귀는 1920×1080에서 실제 루트 Euler Z `0°/180°/270°`를 다시 캡처했으며, 수평 정방향/수평 역방향/수직 하강이 구분됐다. 같은 인스턴스의 `Play → Stop → Play`는 Renderer `On→Off→On`, 파티클 `2→0→2`, mirror 복구를 통과했고, 그림자·Collider·Rigidbody·Light·루프가 없으며 ForestPath 씬은 clean 상태를 유지했다. 캡처는 `slash_hd_direction_hit1_000_scale5p1_t010_1920x1080_v1.png`, `slash_hd_direction_hit2_180_scale5p1_t010_1920x1080_v1.png`, `slash_hd_direction_hit3_270_scale5p1_t010_1920x1080_v1.png`, `slash_hd_final_particles_scale5p1_t030_1920x1080_v1.png`이다.
- Unity 6000.3.10f1 최종 컴파일/재생 후 Console error/warning `0/0`. 검증 로그는 `Validation/validation_report.txt`에 남긴다.
- 게임플레이 통합 완료: `AttackCombo._SlashVFXOverrides`가 한 클립 내부의 `EnableHitbox` 순서별 `Local Euler X/Y/Z`와 `Mirror X`를 Inspector에 노출하고, `PlayerCombat`은 공격 시작마다 내부 타격 인덱스를 초기화해 해당 값을 `ApplyCustomRotation()`에 전달한다. 현재 타격별 직렬화 회전값은 `TripleAttack.asset` Inspector에서 직접 관리하며, 웹 문서는 특정 Euler 값을 고정 기준으로 두지 않는다. 배열이 비어 있거나 타격 인덱스가 범위를 벗어난 다른 공격은 기존 칼끝 자동 추정을 유지한다. 런타임 통합 검증에서 입력 Euler와 실제 루트 Euler가 세 타격 모두 일치했고, 로컬 위치는 모두 `(0,1,0.9)`, 위치 오차 `0`, 정면 dot `1`이었다. `_AttackSlashLifetime`의 코드 기본값과 `Assets/2.Player/Player.prefab` 직렬화 값은 모두 `0.62s`이며, `PlaybackDuration = 0.60s` 뒤 0.02초 여유를 두고 풀로 반환한다.

현재 프리팹은 실제 카메라에서 플레이어 중앙을 가리지 않도록 플레이어보다 앞쪽에 놓이는 정면 고정 2.5D 방식이다. 공격별 위치와 평면 노멀은 플레이어 정면에 고정하고 화면상 기울기만 계산한다.

---

## 4. 저작 및 이관 워크플로

### 4.1 VFXEasyMaker에서 제작

도구 루트:

```text
C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker
```

로컬 실행:

```powershell
cd "C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker"
python -m http.server 8123
```

브라우저에서 `http://localhost:8123/VFXForge.html`을 연다.

저작 규칙:

- 새 프리셋은 `VFXForge.html`의 `PRESETS`에 추가한다.
- 포맷 필드를 추가하거나 의미를 바꾸면 `SCHEMA.md`도 같이 갱신한다.
- 결정론적 결과가 필요하므로 렌더 경로에서 `Math.random()`을 사용하지 않는다.
- 새 레이어는 `soft:{on:false}`부터 시작한다. 블러가 꼭 필요한 후면 스미어에만 낮은 값으로 켠다.
- 큰 실루엣의 outline은 최대 2~3개 레이어에만 사용한다.
- 파티클에 outline을 걸지 않는다.
- `extraLayers` 배열 순서가 기본 합성 순서다.

### 4.2 Unity 호환성 검사

먼저 임포터가 무엇을 읽고 무엇을 버리는지 확인한다.

```powershell
node mcp/vfxforge-mcp.mjs call check_unity '{\"key\":\"crescent25d\"}'
```

2026-08-09 검사 결과:

- 전체 7레이어
- Unity ParticleSystem으로 직접 이전: 1개(`칼끝 불티`)
- 시트 또는 Unity 메시로 별도 구현: 6개(리본 5개 + 파편 1개)
- Unity 임포터가 무시: `post`, `ground`, `palette`, `impact`, `style`, 각 레이어의 `x3/y3/z3`, `plane`, `rot`, 셀 표현 일부

따라서 `check_unity` 결과를 보지 않고 JSON만 임포터에 넣으면 완성된 참격이 나오지 않는다.

### 4.3 꾸러미 내보내기

일반 이펙트:

```powershell
node mcp/vfxforge-mcp.mjs call export_bundle '{\"key\":\"crescent25d\",\"outDir\":\"out/crescent25d\",\"frames\":14,\"cell\":256,\"ascii\":true}'
```

`14 frames`는 1.15초 문서를 12fps 셀 룩으로 샘플링한 시작값이다. 최종 프레임 수와 메타 fps는 결과를 눈으로 확인하고 조정한다.

분리 실행이 필요할 때:

```powershell
node mcp/vfxforge-mcp.mjs call export_unity '{\"key\":\"crescent25d\",\"outDir\":\"out/crescent25d\"}'
node mcp/vfxforge-mcp.mjs call bake_sheet '{\"key\":\"crescent25d\",\"onlyUnsupported\":true,\"frames\":14,\"cell\":256,\"out\":\"out/crescent25d/crescent25d_sheet.png\"}'
node mcp/vfxforge-mcp.mjs call render_frames '{\"key\":\"crescent25d\",\"times\":[0.10,0.25,0.45,0.75],\"outDir\":\"out/crescent25d/review\"}'
```

### 4.4 단일 시트와 2.5D의 차이

`onlyUnsupported:true`로 6개 레이어를 한 장의 시트에 합치면 현재 카메라에서 보이는 2D 합성 결과는 보존되지만, Unity 카메라가 움직일 때 레이어 사이의 시차는 사라진다.

사용 기준:

- **카메라가 거의 고정된 빠른 구현**: 합성 시트 1장 + `VFXForgeSheetPlayer(Quad)`
- **이번 세션의 기본 최종 방식**: Body/Void/Core/InnerGlow를 별도 메시 또는 별도 시트 평면으로 유지하고 로컬 Z·회전을 다르게 배치
- **큰 카메라 회전**: Unity에서 호 메시를 생성하거나 Blender 메시 사용 검토

`VFXForgeSheetPlayer`의 Quad 모드는 같은 GameObject에 `VFXForgeBillboard`를 자동 추가하고 매 프레임 회전을 카메라 방향으로 덮어쓴다. 2.5D 로컬 회전을 보존할 때는 다음 중 하나를 사용한다.

1. 카메라를 향하는 Root를 하나 두고, SheetPlayer 자식의 `VFXForgeBillboard`를 제거/비활성화한 뒤 자식 로컬 회전을 준다.
2. SheetPlayer 대신 직접 쿼드 MeshRenderer와 시트 UV 애니메이션을 사용한다.
3. 리본을 Unity 호 메시로 구현한다.

자식마다 Billboard를 켜면 모든 평면이 다시 카메라 평행이 되어 2.5D 기울기가 사라진다.

---

## 5. Unity 프로젝트 폴더 구조

프로젝트 루트의 `CLAUDE.md`에 따라 내 작업물과 외부 에셋스토어 폴더를 섞지 않는다. 기존 외부 에셋 폴더를 이동하거나 이름을 바꾸지 않는다.

### 5.1 현재 사용 중인 구조

```text
Assets/
├─ VFXForge/
│  ├─ VFXForgeImporter.cs
│  ├─ VFXForgeSheetPlayer.cs
│  ├─ SH_DropAuraRibbonAdditive.shader
│  ├─ SH_DropAuraGrayscaleAdditive.shader
│  └─ Effects/
│     ├─ <EffectName>/
│     │  ├─ README.md
│     │  ├─ <key>_vfxeasymaker_source.json   # 있으면 저작 원본
│     │  ├─ <key>.unity.json                 # ParticleSystem 이관용
│     │  ├─ <key>_sheet.png                  # 미지원 도형 레이어
│     │  └─ <key>_sheet.json                 # 프레임/격자/블렌드 메타
│     ├─ GolemSlam/
│     ├─ LegendaryDrop/
│     ├─ PlayerAttackSlash/
│     └─ DropAuraReference/
│
├─ 6.PreFab/VFX/
│  ├─ PF_GolemSlamImpact.prefab
│  ├─ PF_LegendaryDropAura.prefab
│  ├─ PF_VFX_PlayerAttackSlash.prefab
│  └─ MESH_Drop*.asset
│
├─ Prefabs/VFX/                  # 기존/레거시 마법탄 VFX; 대규모 이동 금지
│  ├─ Fire/
│  ├─ Ice/
│  └─ Electric/
│
└─ Resources/VFXForge/          # texture.file 자동 탐색이 필요할 때만 생성
   └─ <exported flipbook PNG>
```

### 5.2 신규 VFX의 저장 규칙

- VFXEasyMaker의 내보내기 꾸러미와 재생 메타: `Assets/VFXForge/Effects/<EffectPascalName>/`
- 공용 VFXForge 임포터/플레이어/공용 셰이더: `Assets/VFXForge/`
- 최종 게임용 프리팹과 전용 메시: `Assets/6.PreFab/VFX/`
- 자동 텍스처 이름 검색이 필요할 때만: `Assets/Resources/VFXForge/`
- 외부 레퍼런스나 에셋스토어 VFX: 원래 외부 폴더에 그대로 보존

기존 구조를 `_Project` 구조로 재편하거나 `Assets/Prefabs/VFX`를 한꺼번에 옮기지 않는다.

### 5.3 `crescent25d` 권장 결과물

```text
Assets/VFXForge/Effects/Crescent25D/
├─ README.md
├─ crescent25d_vfxeasymaker_source.json
├─ crescent25d.unity.json
├─ crescent25d_sheet.png
└─ crescent25d_sheet.json

Assets/6.PreFab/VFX/
├─ PF_VFX_Crescent25D.prefab
├─ MESH_VFX_Crescent25D_Body.asset
├─ MESH_VFX_Crescent25D_Void.asset
├─ MESH_VFX_Crescent25D_Core.asset
└─ MESH_VFX_Crescent25D_Inner.asset
```

필요한 머티리얼을 별도 파일로 저장한다면 `Assets/6.PreFab/VFX/Materials/`을 사용하되, 새 폴더를 만들기 전에 기존 팀 규칙과 충돌하지 않는지 확인한다.

---

## 6. 네이밍 규칙

### 6.1 Unity 자산

신규 자산은 다음 접두사를 사용한다. 기존 자산은 대량 이름 변경하지 않는다.

| 종류 | 접두사 | 예시 |
|---|---|---|
| Prefab | `PF_` | `PF_VFX_Crescent25D` |
| Material | `MAT_` | `MAT_VFX_Crescent25D_Core_Add` |
| Shader | `SH_` | `SH_VFX_Ribbon_Additive` |
| Shader Graph | `SG_` | `SG_VFX_CrescentRibbon` |
| Texture/Flipbook | `TEX_` | `TEX_VFX_Crescent25D_Sheet` |
| Mesh | `MESH_` | `MESH_VFX_Crescent25D_Body` |
| Visual Effect Graph | `VFX_` | `VFX_Crescent25D_Sparks` |
| ScriptableObject 데이터 | `SO_` | `SO_VFX_Crescent25D_Config` |

현재 레거시 폴더에는 `M_` 머티리얼 이름이 있으나, 신규 프로젝트 자산은 루트 규칙에 맞춰 `MAT_`를 사용한다.

### 6.2 GameObject와 레이어

- 프리팹 루트: 자산 이름에서 `PF_`만 제거한 `VFX_Crescent25D`
- 자식: `L<두 자리 순서>_<역할>`
- 역할 이름: 영문 PascalCase
- 예: `L00_RearSmear`, `L10_Body`, `L20_VoidCut`, `L30_WhiteCore`
- 보조 오브젝트: `Socket_SlashOrigin`, `Root_Billboard`, `Root_WorldParticles`

숫자 간격을 10씩 두어 중간 레이어를 나중에 넣을 수 있게 한다.

### 6.3 VFXEasyMaker와 내보내기 파일

- 프리셋 키: 영문 소문자, 공백 없음. 기존 키 스타일을 따른다. 예: `crescent25d`
- 표시 이름과 레이어 이름: 한글 가능
- 내보내기 파일: MCP가 만든 `<key>...` 이름을 유지한다.
- `Resources` 자동 검색을 쓸 때는 `texture.file`과 실제 파일명이 정확히 같아야 한다.
- 생성 파일을 Unity식 접두사로 바꿀 경우 자동 검색에 기대지 말고 Inspector에서 명시적으로 연결한다.

---

## 7. URP와 셰이더 설정

### 7.1 확인된 프로젝트 상태

- Unity `6000.3.10f1`
- URP/Core/ShaderGraph/VFX Graph `17.3.0`
- Graphics 기본 Render Pipeline: `Assets/OtherAsset/URP-Asset.asset`
- 해당 URP Asset:
  - Depth Texture: 켜짐
  - Opaque Texture: 켜짐
  - HDR: 켜짐
  - Render Scale: 1.0
  - MSAA: 1
  - SRP Batcher: 켜짐
  - 기본 Renderer: Forward, Renderer Feature 없음
- `Assets/OtherAsset/GlobalBloomProfile.asset`은 현재 컴포넌트가 없는 빈 프로필이다.
- `Assets/1.Scenes/MyMoney.unity`에는 별도의 Global Volume이 있고 다른 프로필을 참조한다.

**확인 필요:** `QualitySettings`의 현재 인덱스는 Ultra(5)이지만 Ultra의 커스텀 Render Pipeline GUID가 프로젝트 Assets에서 해석되지 않았다. 실제 실행 품질에서 `URP-Asset.asset`이 사용되는지 Unity Editor의 Project Settings > Quality에서 확인한다. VFX가 특정 품질 하나에서만 보이도록 만들면 안 된다.

### 7.2 공통 셰이더 상태

리본, 시트, 파티클용 Unlit 투명 셰이더의 기본값:

```text
Render Pipeline : Universal
Surface         : Transparent
Lighting        : Unlit
ZWrite          : Off
Cast Shadows    : Off
Receive Shadows : Off
Cull            : Off (양면 리본/쿼드)
Alpha Clip      : Off (특별한 하드 마스크가 필요할 때만 On)
```

Blend 규칙:

- Body/Void/Smoke: Alpha 또는 Normal
- WhiteCore/InnerGlow/Sparks: Additive
- Premultiply는 사용 텍스처의 RGB/Alpha 제작 방식이 맞을 때만 사용

### 7.3 프로젝트 내 공용 셰이더 예시

`SH_DropAuraRibbonAdditive.shader`:

- `Blend One One`
- `ZWrite Off`
- `Cull Off`
- Queue `Transparent+20`
- HDR `_BaseColor`
- `_Intensity` 기본 1.25, 범위 0~5
- `_EdgeSoftness` 기본 0.18
- `_EndSoftness` 기본 0.035

`SH_DropAuraGrayscaleAdditive.shader`:

- `Blend One One`
- `ZWrite Off`
- `Cull Off`
- Queue `Transparent+25`
- 시트의 최대 RGB와 Alpha를 마스크로 사용
- HDR `_BaseColor`
- `_Intensity` 기본 2, 범위 0~8

이 셰이더들은 참고 구현이다. 넓은 보라 Body에 그대로 Additive 셰이더를 적용하지 않는다.

### 7.4 2.5D 렌더 순서

깊이와 투명 정렬이 카메라 각도에 따라 튀지 않도록 다음 순서를 명시한다.

| 레이어 | 권장 Queue/Sorting Order |
|---|---:|
| RearSmear | Transparent+10 / 0 |
| Body | Transparent+15 / 10 |
| VoidCut | Transparent+18 / 20 |
| WhiteCore | Transparent+20 / 30 |
| InnerGlow | Transparent+22 / 40 |
| Shards | Transparent+24 / 50 |
| Sparks | Transparent+25 / 60 |

Material Queue와 Renderer Sorting Order를 동시에 과도하게 분산하지 않는다. 우선 로컬 Z와 Sorting Order로 해결하고, Queue는 셰이더 패스 그룹을 나눌 때만 쓴다.

### 7.5 블룸

블룸은 URP Volume에서 설정한다. 웹 프리셋의 `post.bloom` 값은 직접 이관되지 않는다.

시작점:

- HDR 켜짐 확인
- Bloom Intensity: 0.6~0.9 범위에서 시작
- Threshold: 0.6 전후에서 시작
- 넓은 Body가 아니라 WhiteCore와 Sparks가 먼저 bloom을 일으키도록 HDR 색/Intensity 조정

프로젝트의 `GlobalBloomProfile.asset`은 현재 비어 있으므로, 기존 씬의 Volume 프로필을 확인하거나 VFX 검수용 프로필을 별도로 만든다. 기존 씬 포스트프로세싱을 임의로 덮어쓰지 않는다.

---

## 8. ParticleSystem 제작 규칙

### 8.1 레이어 분리

ParticleSystem 하나가 여러 역할을 동시에 맡지 않는다.

- Sparks: 짧고 밝은 직선 불티
- Shards: 면적 있는 각진 파편
- Dust/Smoke: Alpha 블렌드, 느린 감쇠
- Embers: 작은 Additive 점광
- Trail: 필요한 파티클에만 적용

색이나 수명만 다른 역할을 한 ParticleSystem에 섞으면 튜닝과 품질 저하가 어렵다.

### 8.2 공간과 수명

- 무기 궤적 메시/평면: Local space
- 캐릭터에서 분리되어 날아가는 파편/불티: World space 권장
- 캐릭터를 따라야 하는 짧은 코어: Local space 가능
- 1회성 공격 VFX: Loop Off
- 지속 오라만 Loop On
- 자주 생성되는 공격 효과는 `Destroy()` 반복 대신 풀링을 우선한다.
- 풀링 사용 시 모든 ParticleSystem을 `StopEmittingAndClear`하고 트레일도 지운 뒤 재생한다.

### 8.3 Burst와 밀도

- 검격 Sparks 기준 Burst 42에서 시작한다.
- 화면을 가리는 파티클 수보다 실루엣을 읽게 하는 방향성과 간격이 중요하다.
- 파편 5~9개, 핵심 불티 20~45개 정도에서 먼저 튜닝한다.
- Rate Over Time은 지속 오라에만 사용한다. 1회성 타격을 Rate로 흉내 내지 않는다.
- 파티클 최대 개수는 실제 Burst의 2~4배 정도로 제한한다. 임포터 기본 `4000`을 최종값으로 그대로 두지 않는다.

### 8.4 크기와 알파

- 생성 직후 읽히고 끝에서 0으로 닫히는 곡선을 기본으로 한다.
- Additive 불티가 알파 0이 되기 전에 크기 0으로 닫히도록 해 끝 프레임 번쩍임을 방지한다.
- 큰 소프트 스프라이트는 오버드로 비용이 크므로 필요한 수량만 사용한다.
- 셀 룩의 큰 면은 ParticleSystem billboard보다 메시/시트를 우선한다.

### 8.5 Noise, Drag, Gravity

- Noise는 작은 보조 움직임이다. 검격의 주 실루엣을 Noise로 만들지 않는다.
- 임포터 매핑:
  - Noise strength = 원본 turbulence strength `× unitScale × 6`
  - Noise frequency = 원본 scale `× 0.1`
  - Drag = 원본 drag를 dampen/limit velocity로 근사
  - 원본 +gravity는 Unity World -Y 힘으로 변환
- 검격 Sparks의 진행 방향이 먼저 읽히고, Gravity/Noise는 그 다음에 보여야 한다.

### 8.6 Trail

- Trail은 모든 파티클이 아니라 길쭉한 Sparks에만 사용한다.
- Trail Material의 블렌드는 해당 파티클과 맞춘다.
- 풀에서 재사용하기 전 Trail을 Clear한다.
- 카메라가 가까울 때 Trail 폭이 본체 절단선보다 굵어지지 않게 한다.

### 8.7 현재 임포터의 중요한 함정

`VFXForgeImporter.BuildLayer()`는 현재 모든 생성 ParticleSystem에 다음 값을 준다.

- `main.loop = true`
- `main.playOnAwake = true`
- `main.maxParticles = 4000`
- `simulationSpace = Local`
- Burst 반복 간격 `1.25s`

따라서 `crescent25d`처럼 1회성 프리셋은 임포트 후 반드시 다음을 수정한다.

```text
Loop             = Off
Play On Awake    = 필요에 따라 Off
Max Particles    = 실제 Burst에 맞게 축소
Simulation Space = Sparks/Shards는 World 검토
Stop Action      = 풀링이면 Callback/Disable, 일회 폐기면 Destroy
```

VFXForgeImporter는 **변환/검수용 브리지**로 보고, 최종 프리팹에서 런타임 Build에 의존하지 않는 것을 권장한다.

---

## 9. 스프라이트시트와 텍스처 설정

### 9.1 임포트 설정

`*_sheet.png` 권장 Import Settings:

```text
Texture Type          : Default 또는 Sprite (사용 컴포넌트에 맞춤)
Alpha Source          : Input Texture Alpha
Alpha Is Transparency : On
sRGB                  : On (색상 VFX)
Wrap Mode             : Clamp
Filter Mode           : Bilinear; 픽셀 계단을 의도하면 Point 검토
Generate Mip Maps     : 기본 Off, 월드에서 크기 변화가 크면 On 비교
Compression           : 검수 중 None, 최종 플랫폼에서 품질 비교 후 압축
```

시트는 왼쪽 위에서 오른쪽으로 진행하고 다음 줄로 내려간다. `VFXForgeSheetPlayer`가 Unity UV의 Y축을 뒤집어 처리한다.

### 9.2 SheetPlayer 사용

- `Mode.Quad`: 쿼드 1장, 가장 가벼움, 자동 Billboard
- `Mode.Particle`: ParticleSystem + TextureSheetAnimation
- `unitScale = 0.01`
- 1회성: `forceLoop = false`
- 풀링 사용 시 `destroyOnEnd = false`, 완료 이벤트/상태로 반환
- 단순 폐기형 테스트만 `destroyOnEnd = true`
- 프로젝트 표준 머티리얼이 있으면 `materialOverride`를 반드시 지정

메타 격자가 실제 프레임보다 클 때 빈 셀이 번쩍이지 않도록 현재 플레이어는 `frameOverTime`을 제한한다.

### 9.3 색 번짐과 가장자리

- Alpha가 0인 픽셀의 RGB에 밝은 색이 남으면 Bilinear에서 테두리가 생길 수 있다.
- 셀 Body는 알파 경계에 충분한 padding을 둔다.
- Additive 코어는 검은 배경 RGB와 자연스럽게 섞이도록 제작한다.
- 한 장의 시트에 너무 큰 빈 여백을 넣지 않는다.

---

## 10. 최종 프리팹 조립 규칙

권장 계층:

```text
VFX_Crescent25D
├─ Root_ArcLayers
│  ├─ L00_RearSmear
│  ├─ L10_Body
│  ├─ L20_VoidCut
│  ├─ L30_WhiteCore
│  └─ L40_InnerGlow
├─ Root_WorldParticles
│  ├─ L50_Shards
│  └─ L60_Sparks
└─ VFXLifetime 또는 기존 풀링 수명 컴포넌트
```

조립 규칙:

- Root 원점은 검격의 회전 중심 또는 무기 소켓에 둔다.
- ArcLayers만 공격 방향에 맞춰 회전한다.
- 파편과 불티는 스폰 순간 World로 분리되는지 확인한다.
- Renderer의 Cast/Receive Shadows를 끈다.
- Collider, Rigidbody, Light는 명확한 게임플레이 요구가 없으면 넣지 않는다.
- VFX는 데미지 판정을 소유하지 않는다. 전투 판정과 시각 효과는 이벤트로 동기화한다.
- 프리팹 내부에서 `Camera.main`을 반복 탐색하거나 `GameObject.Find`를 쓰지 않는다.
- 카메라 참조가 필요하면 스폰 시스템에서 주입한다.
- 자주 쓰는 참격은 풀에 미리 준비한다.

재생 타임라인:

```text
0.000  RearSmear 시작
0.025  Body 시작
0.030  VoidCut 시작
0.040  WhiteCore 시작
0.070  InnerGlow 시작
0.100  Sparks + 전투 시스템의 임팩트 힌트
0.110  Shards 시작
0.520  WhiteCore 종료
0.620  InnerGlow 종료
0.780  Shards 종료
0.920  Sparks 종료
1.150  프리팹 수명 종료/풀 반환
```

---

## 11. 성능 규칙

VFXEasyMaker 프리뷰에서 비용이 큰 순서:

1. 레이어 블러 `soft`
2. 큰 실루엣의 `outline`
3. `mask`
4. 블룸과 큰 소프트 스프라이트 오버드로

Unity에서도 같은 시각적 원인이 GPU 오버드로로 이어진다.

- 2.5D 참격의 큰 투명 레이어는 4~5장 안에서 먼저 완성한다.
- 동일 면적의 Additive 레이어를 여러 장 겹치지 않는다.
- 모바일/저사양 품질에서는 후면 스미어, InnerGlow, Sparks 수량을 단계적으로 줄인다.
- Soft Particle은 QualitySettings에서 저품질 단계에 꺼져 있으므로 필수 실루엣을 Soft Particle에 의존하지 않는다.
- VFX Graph는 대량 GPU 파티클이 실제로 필요할 때만 사용한다. 40개 안팎의 Sparks에는 ParticleSystem이 단순하다.
- 한 프리팹의 모든 시스템에 `maxParticles=4000`을 두지 않는다.
- Scene View만 보지 말고 Game View의 실제 카메라와 목표 해상도에서 확인한다.

권장 품질 축소 순서:

1. Sparks 수량 42 → 24 → 12
2. Shards 7 → 5 → 3
3. RearSmear echo/블러 축소
4. InnerGlow 제거
5. 시트 해상도 256 → 192/128

Body, VoidCut, WhiteCore는 최저 품질에서도 유지한다.

---

## 12. 검수 체크리스트

### 12.1 저작 단계

- [ ] `style:cel`, `stepFps:12`인가?
- [ ] 큰 면은 Normal, 얇은 코어만 Additive인가?
- [ ] WhiteCore가 Body보다 두껍지 않은가?
- [ ] 시작/중간/끝 프레임에서 실루엣이 읽히는가?
- [ ] 0.10초 부근에서 공격 방향이 즉시 보이는가?
- [ ] 블룸을 꺼도 참격 형태가 읽히는가?
- [ ] `soft`, `outline`, `mask`가 필요한 레이어에만 켜져 있는가?

### 12.2 이관 단계

- [ ] `check_unity`를 실행했는가?
- [ ] 원본 JSON과 Unity용 JSON을 둘 다 보존했는가?
- [ ] 미지원 레이어를 시트 또는 Unity 메시로 구현했는가?
- [ ] `x3/y3/z3`, `rot`가 Unity Transform에 반영됐는가?
- [ ] 시트 PNG의 Alpha Is Transparency가 켜졌는가?
- [ ] SheetPlayer의 Loop/Destroy 정책이 풀링 방식과 맞는가?

### 12.3 Unity 단계

- [ ] 모든 1회성 ParticleSystem의 Loop가 꺼졌는가?
- [ ] World/Local Simulation Space가 역할에 맞는가?
- [ ] Cast/Receive Shadows가 꺼졌는가?
- [ ] 투명 정렬이 카메라 각도에 따라 뒤집히지 않는가?
- [ ] HDR/Bloom이 없는 상태와 있는 상태를 모두 확인했는가?
- [ ] Low/Medium/High 품질에서 핵심 실루엣이 유지되는가?
- [ ] 여러 번 연속 재생했을 때 트레일과 파티클이 이전 재생에서 남지 않는가?
- [ ] 풀 반환 시 모든 시스템과 렌더러 상태가 초기화되는가?
- [ ] Console 오류/경고가 없는가?

### 12.4 게임플레이 동기화

- [ ] 실제 칼날 애니메이션 방향과 호 방향이 맞는가?
- [ ] 데미지 판정 시각과 WhiteCore 최대 밝기가 맞는가?
- [ ] 카메라 흔들림/플래시/히트스톱은 VFX 프리팹 밖에서 호출되는가?
- [ ] 공격이 취소되거나 캐릭터가 죽었을 때 VFX가 안전하게 중단되는가?

---

## 13. 참고 자료

### 13.1 로컬 문서와 코드

- `Assets/VFXForge/README.md` — Unity 임포터 사용법과 매핑 표
- `Assets/VFXForge/VFXForgeImporter.cs` — JSON → ParticleSystem 실제 매핑
- `Assets/VFXForge/VFXForgeSheetPlayer.cs` — 시트 재생, Billboard, 자동 머티리얼
- `Assets/VFXForge/SH_DropAuraRibbonAdditive.shader` — URP Additive 리본 참고
- `Assets/VFXForge/SH_DropAuraGrayscaleAdditive.shader` — 그레이스케일 시트 컬러링 참고
- `C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker\SCHEMA.md` — schema v1 및 `crescent25d`
- `C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker\mcp\README.md` — 이관 CLI/MCP
- `C:\Users\rnals\OneDrive\바탕 화면\VFXEasyMaker\VFXForge_인계문서.md` — 성능/폴백/검증 함정

### 13.2 시각 레퍼런스

- FXTags 메인: <https://fxtags.com/>
- 명조 청색 초승·리본형 참격: <https://fxtags.com/3wtbq8n8/>
- 명조 다중 궤적·파편·충격파형 참격: <https://fxtags.com/raq1o653/>

확인 당시 FXTags에서 Wuthering Waves 항목은 Player 146 + Monster 32개였고, 그중 `Slash·Swing` 태그는 67개였다. 레퍼런스는 다음 관찰에 사용한다.

- 넓은 색 리본과 얇은 백색 코어의 면적 차이
- 호의 시작·끝 taper
- 본체보다 늦게 발생하는 파편과 잔상
- 여러 깊이와 각도로 겹치는 궤적
- 색상별 Additive 사용 범위

게임 영상을 텍스처로 캡처하거나 원본 자산을 복사하지 않는다. 형태, 타이밍, 레이어 구성만 분석해 자체 제작한다.

---

## 14. 새 Codex 세션용 실행 순서

새 세션은 다음 순서로 작업한다.

1. 프로젝트 루트 `CLAUDE.md`와 이 문서를 읽는다.
2. 기존 `Assets/VFXForge/Effects/<EffectName>`과 `Assets/6.PreFab/VFX`를 확인한다.
3. VFXEasyMaker에서 프리셋을 수정하거나 복제한다.
4. 대표 시각 `0.10, 0.25, 0.45, 0.75s`를 렌더해 비교한다.
5. `check_unity`를 실행해 직접 이관/시트 대상을 확인한다.
6. `export_bundle`로 꾸러미를 만든다.
7. Unity의 `Assets/VFXForge/Effects/<EffectName>`에 원본과 꾸러미를 보존한다.
8. `Assets/6.PreFab/VFX/PF_VFX_<EffectName>.prefab`을 조립한다.
9. Loop, Simulation Space, material blend, sorting, pooling을 수동 검수한다.
10. 실제 전투 애니메이션과 함께 Low/Medium/High 품질에서 확인한다.

작업 완료 보고에는 최소한 다음을 포함한다.

- 변경한 파일 경로
- 사용한 프리셋 키와 버전/날짜
- 레이어 수와 직접 이관/시트/메시 분류
- 대표 프레임 또는 Game View 스크린샷
- Console 오류 여부
- 남은 수동 설정 또는 **확인 필요** 항목

---

## 15. 알려진 제한과 다음 개선점

- VFXForgeImporter는 `ribbon`, `shards`, `slash`, `beam`, `lightning`, `shockwave` 등의 비파티클 레이어를 직접 만들지 못한다.
- 임포터는 `rot`, `x3/y3/z3`, `style`, `ramp`, `outline`, `echo`, `impact`, `post`를 Unity에 반영하지 않는다.
- 임포터의 ParticleSystem 기본 Loop/MaxParticles는 1회성 게임 VFX에 맞지 않아 수동 수정이 필요하다.
- SheetPlayer Quad의 Billboard가 자식 회전을 덮어쓰므로 2.5D 레이어에는 별도 Root 또는 직접 쿼드 재생이 필요하다.
- `GlobalBloomProfile.asset`은 비어 있다. 프로젝트 공용 Bloom 정책은 아직 확정된 것으로 간주하지 않는다.
- QualitySettings의 Ultra Render Pipeline 참조는 Unity Editor에서 확인이 필요하다.
- 최종 `PF_VFX_Crescent25D`와 전용 리본 메시/시트는 아직 이 문서 작성 시점에 프로젝트에 생성됐다고 가정하지 않는다. 생성 전에는 기존 파일을 덮어쓰지 않는다.

이 제한을 해결하는 코드 변경이 여러 파일에 걸치면 프로젝트 규칙에 따라 먼저 범위와 영향을 설명하고 사용자 확인을 받는다.
