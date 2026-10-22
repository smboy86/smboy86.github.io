const blogList = document.querySelector('#blog-list');
const imageViewer = document.querySelector('.blog-image-viewer');
const indexUrl = new URL('./content/blog/index.json', document.baseURI);

imageViewer.querySelector('button').addEventListener('click', () => imageViewer.close());
imageViewer.addEventListener('click', (event) => {
  if (event.target === imageViewer) {
    const bounds = imageViewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) imageViewer.close();
  }
});

function prepareBlogMedia(body, sourceUrl) {
  body.querySelectorAll('img, video, source, a').forEach((element) => {
    const attribute = element.tagName === 'A' ? 'href' : 'src';
    const value = element.getAttribute(attribute);
    if (!value) return;
    const url = new URL(value, sourceUrl);
    const allowed = element.tagName === 'A'
      ? ['https:', 'http:', 'mailto:'].includes(url.protocol)
      : ['https:', 'http:'].includes(url.protocol);
    if (!allowed) {
      element.removeAttribute(attribute);
      return;
    }
    element.setAttribute(attribute, url.href);
    if (element.tagName === 'A') {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
  });
  body.querySelectorAll('video').forEach((video) => {
    video.controls = true;
    video.preload = 'none';
    if (video.hasAttribute('poster')) {
      const poster = new URL(video.getAttribute('poster'), sourceUrl);
      if (['https:', 'http:'].includes(poster.protocol)) video.poster = poster.href;
      else video.removeAttribute('poster');
    }
  });
  body.querySelectorAll('img').forEach((image) => {
    image.loading = 'lazy';
    image.decoding = 'async';
    if (image.closest('a')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'blog-image-button';
    button.setAttribute('aria-label', `${image.alt || '첨부 이미지'} 크게 보기`);
    image.replaceWith(button);
    button.append(image);
    button.addEventListener('click', () => {
      const preview = imageViewer.querySelector('img');
      preview.src = image.src;
      preview.alt = image.alt;
      imageViewer.querySelector('p').textContent = image.alt;
      imageViewer.showModal();
    });
  });
}

function createBlogEntry(post, index) {
  const sourceUrl = new URL(post.file, indexUrl);
  if (sourceUrl.origin !== indexUrl.origin ||
      !sourceUrl.pathname.startsWith(new URL('.', indexUrl).pathname) ||
      !sourceUrl.pathname.endsWith('.md')) throw new Error('잘못된 글 경로');

  const entry = document.createElement('article');
  entry.className = 'blog-entry';
  entry.innerHTML = `
    <h2 class="blog-entry-heading">
      <button class="blog-trigger" type="button" aria-expanded="false" aria-controls="blog-panel-${index}" id="blog-trigger-${index}">
        <span class="blog-title-group"><span class="blog-entry-meta"></span><span class="blog-title"></span></span>
        <span class="blog-subtitle"></span><span class="blog-toggle-icon" aria-hidden="true"></span>
      </button>
    </h2>
    <div class="blog-panel" id="blog-panel-${index}" role="region" aria-labelledby="blog-trigger-${index}" aria-hidden="true" inert>
      <div class="blog-panel-clip"><div class="blog-body"></div></div>
    </div>`;
  entry.querySelector('.blog-title').textContent = post.title;
  entry.querySelector('.blog-subtitle').textContent = post.subtitle;
  const meta = entry.querySelector('.blog-entry-meta');
  meta.textContent = post.preview ? '미리보기' : (post.date || 'NOTE');
  const trigger = entry.querySelector('.blog-trigger');
  const panel = entry.querySelector('.blog-panel');
  const body = entry.querySelector('.blog-body');
  let loaded = false;
  let loading = null;

  const load = () => {
    if (loaded || loading) return;
    body.textContent = '글을 불러오고 있습니다.';
    panel.setAttribute('aria-busy', 'true');
    loading = (async () => {
      try {
        const response = await fetch(sourceUrl);
        if (!response.ok) throw new Error('글 요청 실패');
        const markdown = (await response.text()).replace(/^\uFEFF/, '');
        body.innerHTML = DOMPurify.sanitize(marked.parse(markdown), {
          USE_PROFILES: { html: true },
          FORBID_TAGS: ['style', 'iframe'],
          FORBID_ATTR: ['style', 'autoplay'],
        });
        prepareBlogMedia(body, sourceUrl);
        loaded = true;
      } catch {
        body.textContent = '글을 불러오지 못했습니다. ';
        const retry = document.createElement('button');
        retry.className = 'blog-retry';
        retry.type = 'button';
        retry.textContent = '다시 시도';
        retry.addEventListener('click', load);
        body.append(retry);
      } finally {
        loading = null;
        panel.setAttribute('aria-busy', 'false');
      }
    })();
  };

  trigger.addEventListener('click', () => {
    const open = trigger.getAttribute('aria-expanded') !== 'true';
    trigger.setAttribute('aria-expanded', String(open));
    panel.setAttribute('aria-hidden', String(!open));
    panel.inert = !open;
    entry.classList.toggle('is-open', open);
    if (open) load();
    else body.querySelectorAll('video, audio').forEach((media) => media.pause());
  });
  return entry;
}

async function loadBlog() {
  blogList.setAttribute('aria-busy', 'true');
  try {
    if (!window.marked || !window.DOMPurify) throw new Error('렌더러 로드 실패');
    const response = await fetch(indexUrl);
    if (!response.ok) throw new Error('목록 요청 실패');
    const posts = await response.json();
    if (!Array.isArray(posts) || posts.some((post) => !post ||
        typeof post.title !== 'string' || typeof post.subtitle !== 'string' ||
        typeof post.file !== 'string')) throw new Error('잘못된 목록');
    const entries = posts.map(createBlogEntry);
    blogList.replaceChildren(...entries);
    if (!entries.length) blogList.textContent = '첫 번째 기록을 준비하고 있습니다.';
  } catch {
    blogList.textContent = '기록을 불러오지 못했습니다. ';
    const retry = document.createElement('button');
    retry.className = 'blog-retry';
    retry.type = 'button';
    retry.textContent = '다시 불러오기';
    retry.addEventListener('click', loadBlog);
    blogList.append(retry);
  } finally {
    blogList.setAttribute('aria-busy', 'false');
  }
}

loadBlog();
