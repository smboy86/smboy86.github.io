const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert=require('node:assert/strict');
const testUrl = process.env.BLOG_TEST_URL || 'http://127.0.0.1:8765/blog.html';
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(testUrl,{waitUntil:'networkidle'});
 await page.waitForSelector('.blog-entry');
 assert.equal(await page.locator('.blog-entry').count(),3);
 assert.equal(await page.locator('.docs-nav-item.is-current').innerText(),'06\nBlog');
 const triggers=page.locator('.blog-trigger');
 await triggers.nth(0).click();
 await page.waitForSelector('.blog-body h2');
 await page.waitForTimeout(380);
 assert.equal(await page.locator('.blog-panel').first().getAttribute('aria-hidden'),'false');
 const heights=await page.locator('.blog-panel').first().evaluate(el=>({height:el.getBoundingClientRect().height,scroll:el.scrollHeight}));
 assert(heights.height>100);
 await triggers.nth(1).click();await page.waitForSelector('.blog-image-button');
 await page.locator('.blog-image-button img').evaluate(img=>img.decode());
 assert((await page.locator('.blog-image-button img').getAttribute('src')).includes('/assets/made-by-me/pointme-1.webp'));
 assert.equal(await triggers.nth(0).getAttribute('aria-expanded'),'true');
 await page.locator('.blog-image-button').click();assert(await page.locator('dialog').evaluate(d=>d.open));
 await page.keyboard.press('Escape');assert(!await page.locator('dialog').evaluate(d=>d.open));
 await triggers.nth(0).focus();await page.keyboard.press('Enter');await page.waitForTimeout(380);
 assert.equal(await triggers.nth(0).getAttribute('aria-expanded'),'false');
 assert(await page.locator('.blog-panel').first().evaluate(el=>el.inert&&el.getBoundingClientRect().height<1));
 const widths=[];
 for(const width of [1440,1024,850,801,800,390,320]){
  await page.setViewportSize({width,height:1000});
  widths.push(await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,headerOverflow:document.querySelector('.header-inner').scrollWidth>document.querySelector('.header-inner').clientWidth})));
 }
 assert(!widths.some(x=>x.overflow||x.headerOverflow));
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.equal(await page.locator('.blog-panel').first().evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 // 본문 요청이 실패해도 같은 페이지에서 다시 읽을 수 있어야 합니다.
 await page.route('**/making.md',route=>route.fulfill({status:503,body:'offline'}));
 await page.reload({waitUntil:'networkidle'});await page.locator('.blog-trigger').first().click();
 await page.waitForSelector('.blog-body .blog-retry');
 await page.unroute('**/making.md');await page.locator('.blog-body .blog-retry').click();await page.waitForSelector('.blog-body h2');
 // 가져온 HTML의 정제, 미디어 경로, 영상 제어를 함께 확인합니다.
 await page.route('**/notes.md',route=>route.fulfill({contentType:'text/markdown',body:'# Imported note\n\n<img src="../../assets/made-by-me/knock-4.webp" onerror="window.pwned=true">\n\n<script>window.pwned=true</script><iframe src="https://example.com"></iframe>\n\n[bad](javascript:alert(1))\n\n<video autoplay controls poster="../../assets/made-by-me/knock-4.webp"><source src="./demo.mp4" type="video/mp4"></video>'}));
 await page.locator('.blog-trigger').nth(2).click();await page.waitForSelector('.blog-body video');
 const imported=await page.locator('.blog-body').nth(2).evaluate(body=>({script:!!body.querySelector('script'),iframe:!!body.querySelector('iframe'),onerror:!!body.querySelector('[onerror]'),unsafe:!!body.querySelector('[href^="javascript:"]'),autoplay:body.querySelector('video').autoplay,controls:body.querySelector('video').controls,preload:body.querySelector('video').preload,poster:body.querySelector('video').poster,source:body.querySelector('source').src,pwned:!!window.pwned}));
 assert(!imported.script&&!imported.iframe&&!imported.onerror&&!imported.unsafe&&!imported.autoplay&&!imported.pwned);
 assert(imported.controls&&imported.preload==='none');assert(imported.source.endsWith('/content/blog/demo.mp4'));assert(imported.poster.includes('/assets/made-by-me/knock-4.webp'));
 await page.locator('.blog-body video').evaluate(v=>{v.pause=()=>{v.dataset.paused='yes';};});
 await page.locator('.blog-trigger').nth(2).click();assert.equal(await page.locator('video').getAttribute('data-paused'),'yes');
 await page.route('**/content/blog/index.json',route=>route.fulfill({status:503,body:'offline'}));
 await page.reload({waitUntil:'networkidle'});await page.waitForSelector('#blog-list > .blog-retry');
 await page.unroute('**/content/blog/index.json');await page.locator('#blog-list > .blog-retry').click();await page.waitForSelector('.blog-entry');
 assert.equal(page.url(),testUrl);assert.equal(errors.length,0);
 console.log(JSON.stringify({entries:3,widths,imported,checks:'accordion keyboard/reduced-motion, multi-open, image zoom, relative media, HTML sanitizing, video pause, post/index retries, unchanged URL',errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
