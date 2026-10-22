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
- `blog.html`: 페이지 이동 없이 읽는 아코디언형 기록
- `content/blog/index.json`: Blog 제목·소제목·본문 파일 목록 (작성 순서대로 표시)
- `content/blog/*.md`: Blog 본문과 Notion에서 내보낸 Markdown
- `contact.html`: 연락처
- `styles.css`: 반응형 레이아웃과 시각 디자인
- `script.js`: 프로젝트 필터
- `404.html`: GitHub Pages 오류 페이지
- `robots.txt`, `sitemap.xml`: 검색엔진 크롤링 안내
- `.nojekyll`: 정적 파일을 그대로 배포하기 위한 설정

별도 빌드 도구나 서버가 필요하지 않습니다. 외부 폰트는 Google Fonts를 사용하며, 네트워크가 제한된 환경에서는 시스템 폰트로 대체됩니다.

Made by Me는 Google Play의 최초 출시일을 기준으로 최신순으로 구성합니다. 서비스 소개와 회고 문구는 스토어 소개를 바탕으로 작성했으며, 회고는 작성자의 실제 경험에 맞춰 다듬을 초안입니다. 슬라이드는 버튼·방향키·스와이프로 조작하며 자동 재생하지 않습니다.

## Blog 작성

글마다 Markdown 파일 하나를 `content/blog/`에 추가하고 `index.json`에 아래 항목을 등록합니다. 본문은 제목을 눌렀을 때 불러오며, 여러 글을 동시에 펼쳐도 페이지를 이동하지 않습니다. 현재 글 3개는 `preview: true`로 표시한 레이아웃 예시입니다.

```json
{
  "title": "글 제목",
  "subtitle": "한 줄 소제목",
  "date": "2026.10.22",
  "file": "my-note.md"
}
```

본문은 일반 Markdown으로 작성합니다. 제목과 소제목은 목록에서 표시하므로 본문에는 같은 제목을 반복하지 않아도 됩니다. Notion은 `Markdown & CSV` 형식으로 내보낸 뒤 MD와 첨부 폴더를 같은 상대 경로로 함께 복사합니다. 실시간 동기화는 하지 않습니다. 참고: [Notion 내보내기 안내](https://www.notion.com/help/export-your-content).

- 이미지: `![이미지 설명](./my-note/screen.webp)`처럼 글 파일 기준 상대 경로를 사용합니다. 본문 안에 비율을 유지해 표시하고, 클릭하면 크게 볼 수 있습니다. 이미지 설명은 확대 화면에도 표시됩니다.
- 짧은 영상: 아래처럼 MP4와 대표 이미지를 함께 둡니다. 자동 재생하지 않고, 닫힌 글의 영상은 일시 정지합니다.
- 긴 영상: YouTube 등 영상 서비스에 올린 뒤 일반 링크와 대표 이미지를 넣는 방식을 권장합니다. 외부 임베드와 Notion 전용 블록은 자동 변환하지 않습니다.

```html
<video controls playsinline preload="none" poster="./my-note/poster.webp">
  <source src="./my-note/demo.mp4" type="video/mp4" />
  <a href="./my-note/demo.mp4">영상 보기</a>
</video>
```

미디어 파일을 배포 저장소에 함께 포함해야 합니다. 외부 이미지·영상의 주소는 영구적으로 공개 접근이 가능할 때만 사용하세요. Markdown의 HTML은 로컬에 포함한 Marked·DOMPurify로 렌더링·정제하며, iframe·스크립트·자동 재생은 허용하지 않습니다. 로컬 검토는 `python3 -m http.server 8765` 실행 후 `http://localhost:8765/blog.html`에서 진행합니다.

Blog 회귀 검사는 Chrome과 Playwright가 설치된 환경에서 로컬 서버를 켠 뒤 `node tests/blog.test.cjs`로 실행합니다. 별도 위치에 설치했다면 `PLAYWRIGHT_MODULE`에 해당 모듈 경로를 지정합니다. 아코디언·키보드·이미지 확대·미디어 경로·HTML 정제·요청 실패 후 재시도를 검사합니다. `BLOG_TEST_URL`로 검사 주소를 바꿀 수 있으며, 테스트는 네트워크 응답을 가로채므로 원본 글을 변경하지 않습니다.

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
