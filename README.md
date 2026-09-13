# ROOTBOUND Project Hub

Capstone2026의 세계관, 스토리, 시스템, UI/UX, 무기, 기억, 몬스터, 보스와 프로젝트 현황, 체크리스트, 변경이력, 로컬 피드백을 파트별로 보는 정적 웹사이트입니다. 첫 화면은 `GAME BIBLE`이며, 상단 메뉴로 각 파트를 전환합니다.

## 공개 사이트

- GitHub Pages: https://seominku.github.io/capstone2026-project-hub/
- GitHub 저장소: https://github.com/seominku/capstone2026-project-hub

## 실행

- 가장 간단한 방법: `index.html`을 더블클릭합니다.
- 문서 링크와 브라우저 호환성을 가장 안정적으로 확인하려면 이 폴더에서 로컬 HTTP 서버를 실행합니다.
  - PowerShell: `python -m http.server 4173`
  - 브라우저: `http://127.0.0.1:4173`

## 데이터 갱신

- 화면용 요약 데이터: `data.js`
- 게임 바이블 데이터: `data.js`의 `game`
- UI/UX 화면: `index.html`의 `#ui-ux`, 캡처는 `assets/ui/`
- 원본 문서: `docs/`
- 공유용 PDF: `pdf/`
- 공유 미리보기 이미지: `og.png`
- 세계관·보스 콘셉트 이미지: `assets/concept/`
- Unity 프리팹 캡처: `assets/unity/` (몬스터 9종, 무기 7종, 기본 방어구 1종)
- UI/UX 캡처: `assets/ui/`
- 전투 VFX 검증 캡처: `assets/vfx/`
- 피드백: 브라우저 `localStorage`의 `rootbound-project-feedback-v1`

프로젝트 원본 Markdown이 바뀌면 `data.js`의 지표·작업 요약과 `docs/` 복사본 및 공유 PDF를 함께 갱신합니다. 최신 웹 동기화는 **2026-09-14**입니다. 기존 몬스터 공격·피격 넉백·늑대 도약·기억 보정, 락온/보스 구현과 UI 진행 단계를 반영했습니다. 공통 공격 2배와 추가 참격은 현재 미사용이며 과거 변경 기록과 구분합니다.

UI 진행은 `data.js.uiProgress`를 기준으로 개발 현황과 UI/UX 화면에 함께 표시합니다. 기능 구현 13개, 전체 흐름/해상도 QA와 최종 아트 작업을 분리합니다. UI 이미지는 08-09 캡처이며 최근 촬영처럼 표시하지 않습니다. 이번 전투 캡처는 `assets/combat/`에 있습니다. 피드백 저장/전송 구조는 이번 작업에서 변경하지 않았습니다.

> 피드백은 방문자별 브라우저에 저장되며 다른 사용자와 자동 공유되지 않습니다.
