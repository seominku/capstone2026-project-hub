# ROOTBOUND Project Hub

Capstone2026의 세계관, 스토리, 무기, 기억, 몬스터, 보스와 프로젝트 현황, 체크리스트, 변경이력, 로컬 피드백을 한 화면에서 보는 정적 웹사이트입니다.

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
- 원본 문서: `docs/`
- 공유용 PDF: `pdf/`
- 공유 미리보기 이미지: `og.png`
- 피드백: 브라우저 `localStorage`의 `rootbound-project-feedback-v1`

프로젝트 원본 Markdown이 바뀌면 `data.js`의 지표·작업 요약과 `docs/` 복사본을 함께 갱신합니다.

> 피드백은 방문자별 브라우저에 저장되며 다른 사용자와 자동 공유되지 않습니다.
