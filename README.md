# 박성민 개발자 포트폴리오

GitHub Pages에서 바로 호스팅할 수 있는 정적 포트폴리오 초안입니다.

## 구성

- `index.html`: 포트폴리오 Overview
- `projects.html`: 대표 프로젝트
- `made-by-me.html`: 출시한 앱 6개의 히스토리와 스크린샷 슬라이드
- `assets/made-by-me/`: Google Play 스토어에 공개된 앱별 스크린샷
- `experience.html`: 경력 방향
- `dev-stack.html`: 기술 경험
- `workflow.html`: 업무 방식
- `contact.html`: 연락처
- `styles.css`: 반응형 레이아웃과 시각 디자인
- `script.js`: 프로젝트 필터
- `404.html`: GitHub Pages 오류 페이지
- `robots.txt`, `sitemap.xml`: 검색엔진 크롤링 안내
- `.nojekyll`: 정적 파일을 그대로 배포하기 위한 설정

별도 빌드 도구나 서버가 필요하지 않습니다. 외부 폰트는 Google Fonts를 사용하며, 네트워크가 제한된 환경에서는 시스템 폰트로 대체됩니다.

Made by Me는 Google Play의 최초 출시일을 기준으로 최신순으로 구성합니다. 서비스 소개와 회고 문구는 스토어 소개를 바탕으로 작성했으며, 회고는 작성자의 실제 경험에 맞춰 다듬을 초안입니다. 슬라이드는 버튼·방향키·스와이프로 조작하며 자동 재생하지 않습니다.

## GitHub Pages 배포

배포 저장소는 `smboy86/smboy86.github.io`, 배포 후보 브랜치는 `portfolio-2026`입니다.

1. 배포 저장소의 `Settings`를 엽니다.
2. `Pages` 메뉴에서 `Deploy from a branch`를 선택합니다.
3. Branch를 `portfolio-2026`, 폴더를 `/ (root)`로 선택합니다.
4. 저장 후 `https://smboy86.github.io/`에서 배포 결과를 확인합니다.

기존 `master` 브랜치는 2015년 홈페이지 보관 및 현재 라이브 상태 유지를 위해 변경하지 않습니다.

## 공개 전 확인할 내용

- 대표 프로젝트 상세 페이지 링크 교체
- 실제 GitHub 주소 추가
- 연락처와 이메일 공개 범위 확인
- NDA 프로젝트의 회사명·화면·데이터 공개 가능 여부 확인
- 프로젝트 기간과 담당 범위 최종 검수
