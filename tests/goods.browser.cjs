const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const base = process.env.LAST_CALL_BASE_URL || "http://127.0.0.1:4177";
const output = process.env.LAST_CALL_EVIDENCE_DIR || path.resolve(root, "../evidence");
const productionData = require("node:vm").runInNewContext(
  require("node:fs").readFileSync(path.join(root, "assets/goods-data.js"), "utf8") + ";window.LAST_CALL_GOODS",
  { window: {} }
);
const copyData = () => JSON.parse(JSON.stringify(productionData));

(async () => {
  await fs.mkdir(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ reducedMotion: "reduce" });
  let fixture = null;
  let loadedPhoto = false;
  const errors = [];
  const failures = [];
  await context.route("**/*", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.origin !== new URL(base).origin) return route.abort();
    if (requestUrl.pathname === "/assets/goods-data.js" && fixture) {
      return route.fulfill({ contentType: "text/javascript", body: `window.LAST_CALL_GOODS = ${JSON.stringify(fixture)};` });
    }
    if (requestUrl.pathname === "/img/goods/test-photo.png") {
      if (!loadedPhoto) return route.fulfill({ status: 404, body: "missing" });
      return route.fulfill({ contentType: "image/png", body: Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aPz8AAAAASUVORK5CYII=", "base64") });
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.url().startsWith(base) && response.status() >= 400 && !response.url().includes("/img/goods/test-photo.png")) failures.push(response.url());
  });
  const reload = async () => {
    await page.goto(base, { waitUntil: "networkidle" });
    await page.locator("#goods").scrollIntoViewIfNeeded();
  };
  const noPurchase = async () => {
    assert.equal(await page.locator("#goods a.goods-purchase").count(), 0);
    assert.equal(await page.locator("#goods button.goods-purchase:disabled").count(), 3);
  };
  const checks = [];
  try {
    for (const width of [1440, 390, 320, 768, 1024]) {
      await page.setViewportSize({ width, height: width === 1440 ? 1050 : 844 });
      await reload();
      assert.equal(await page.locator(".goods-card").count(), 3);
      await noPurchase();
      assert.equal(await page.locator(".goods-photo-placeholder").count(), 3);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `horizontal overflow at ${width}`);
      if (width > 760) {
        assert.ok(await page.evaluate(() => document.querySelector(".site-brand").getBoundingClientRect().right < document.querySelector("#siteNav").getBoundingClientRect().left), `header overlap at ${width}`);
      }
      assert.equal(await page.locator("#characters .cast-card").count(), 6);
      assert.equal(await page.locator("#galleryGrid button").count(), 7);
      assert.equal(await page.locator(".screening-item").count(), 2);
      assert.equal(await page.locator("#daysLeft").count(), 0);
      checks.push(`layout + preparing CTA + existing sections: ${width}px`);
      if (width === 1440) {
        await page.screenshot({ path: path.join(output, "goods-desktop.png") });
        await page.locator("#goods").screenshot({ path: path.join(output, "goods-desktop-section.png"), style: ".site-header,.progress,.to-top{visibility:hidden!important}" });
      }
      if (width === 390) {
        await page.locator("#menuButton").focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#menuButton").getAttribute("aria-expanded"), "true");
        await page.locator('#siteNav a[href="#goods"]').focus();
        await page.keyboard.press("Enter");
        assert.equal(await page.locator("#menuButton").getAttribute("aria-expanded"), "false");
        await page.screenshot({ path: path.join(output, "goods-mobile.png") });
        await page.locator("#goods").screenshot({ path: path.join(output, "goods-mobile-section.png"), style: ".site-header,.progress,.to-top{visibility:hidden!important}" });
        await page.locator("#menuButton").focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Escape");
        assert.equal(await page.locator("#menuButton").getAttribute("aria-expanded"), "false");
        checks.push("mobile menu: Enter navigation to goods, Escape closes");
      }
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await reload();
    await page.locator('#siteNav a[href="#goods"]').focus();
    await page.keyboard.press("Enter");
    assert.equal(new URL(page.url()).hash, "#goods");
    const before = page.url();
    await page.locator(".goods-purchase").first().evaluate((button) => button.click());
    assert.equal(page.url(), before);
    checks.push("desktop keyboard anchor + disabled CTA cannot navigate");

    fixture = copyData();
    fixture.storeOrigin = "https://lastcall-check.stores.jp";
    fixture.products[0].productUrl = "https://lastcall-check.stores.jp/items/test-item";
    await reload();
    await noPurchase();
    checks.push("URL configured while preparing: still disabled");
    fixture.products[0].status = "available";
    await reload();
    assert.equal(await page.locator("#goods a.goods-purchase").count(), 1);
    const purchase = page.locator("#goods a.goods-purchase");
    assert.equal(await purchase.getAttribute("href"), fixture.products[0].productUrl);
    assert.equal(await purchase.getAttribute("target"), "_blank");
    assert.equal(await purchase.getAttribute("rel"), "noopener noreferrer");
    assert.match(await purchase.getAttribute("aria-label"), /トートバッグ.*新しいタブ/);
    assert.match(await page.locator("#goods-tote-status").textContent(), /価格はSTORES/);
    await purchase.focus();
    await page.keyboard.press("Tab");
    assert.notEqual(await page.evaluate(() => document.activeElement?.textContent), "オンライン販売 準備中");
    // Inspect the valid URL but never navigate to the external store or place an order.
    checks.push("available + matching HTTPS item URL: link, external notice, missing-price fallback, keyboard focus");

    const invalidUrls = [null, "", "javascript:alert(1)", "http://lastcall-check.stores.jp/items/test-item", "https://other-check.stores.jp/items/test-item", "https://lastcall-check.stores.jp.evil.invalid/items/test-item", "https://lastcall-check.stores.jp/", "https://lastcall-check.stores.jp/items/", "https://lastcall-check.stores.jp/items/test-item?redirect=evil", "https://lastcall-check.stores.jp/items/test-item#redirect", "https://user:password@lastcall-check.stores.jp/items/test-item", "https://lastcall-check.stores.jp:444/items/test-item"];
    for (const url of invalidUrls) {
      fixture.products[0].productUrl = url;
      await reload();
      await noPurchase();
    }
    checks.push(`invalid / missing URLs blocked: ${invalidUrls.length} cases`);
    fixture.products[0].productUrl = "https://lastcall-check.stores.jp/items/test-item";
    for (const shop of [null, "", "http://lastcall-check.stores.jp", "https://lastcall-check.stores.jp/items/test-item", "https://user:password@lastcall-check.stores.jp", "https://lastcall-check.stores.jp?query=1"]) {
      fixture.storeOrigin = shop;
      await reload();
      await noPurchase();
    }
    checks.push("missing / invalid shop origin blocked: 6 cases");

    fixture = copyData();
    fixture.products[0].status = "sold-out";
    await reload();
    await noPurchase();
    assert.equal(await page.locator('[data-product="tote"] button').textContent(), "現在販売していません");
    checks.push("sold-out state: disabled, no false availability");

    fixture = copyData();
    fixture.products[0].photo = { src: "/img/goods/test-photo.png", alt: "検証用の写真" };
    loadedPhoto = true;
    await reload();
    await page.locator(".goods-photo").first().scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector(".goods-photo")?.naturalWidth > 0);
    assert.equal(await page.locator(".goods-photo").count(), 1);
    assert.equal(await page.locator(".goods-photo-placeholder").count(), 2);
    loadedPhoto = false;
    await reload();
    await page.waitForFunction(() => document.querySelectorAll(".goods-photo-placeholder").length === 3);
    fixture.products[0].photo = { src: "https://tracking.invalid/photo.png", alt: "photo" };
    await reload();
    assert.equal(await page.locator(".goods-photo-placeholder").count(), 3);
    checks.push("local photo replacement + missing image fallback + external image rejection");

    fixture = { products: null };
    await reload();
    assert.match(await page.locator("#goodsGrid").textContent(), /商品情報は準備中/);
    fixture = copyData();
    fixture.products[0].description = '<img src=x onerror="window.badInjection=true">';
    await reload();
    assert.equal(await page.evaluate(() => window.badInjection), undefined);
    assert.match(await page.locator('[data-product="tote"] .goods-product-description').textContent(), /<img/);
    checks.push("missing data notice + descriptions rendered as text");

    fixture = null;
    await reload();
    await page.locator("#galleryGrid button").first().scrollIntoViewIfNeeded();
    await page.locator("#galleryGrid button").first().click();
    assert.equal(await page.locator("#lightbox").isVisible(), true);
    await page.keyboard.press("Escape");
    assert.equal(await page.locator("#lightbox").isVisible(), false);
    await page.locator(".screening-item summary").first().focus();
    await page.keyboard.press("Enter");
    assert.ok(await page.locator(".screening-item").first().getAttribute("open") !== null);
    checks.push("existing gallery + Escape + keyboard screening accordion");

    const localLinks = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    for (const link of localLinks) assert.ok(await page.locator(link).count() > 0, `missing anchor ${link}`);
    for (const url of ["/index.html", "/thanks.html", "/news/all-screenings-completed.html", "/news/amakusa-screening.html", "/news/official-site-and-kumamoto-reservation.html", "/styles.css", "/script.js", "/assets/goods.css", "/assets/goods.js", "/assets/goods-data.js"]) {
      assert.equal((await context.request.get(base + url)).status(), 200, url);
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    checks.push("local links and news/assets: HTTP 200, anchors resolve, no page errors or local load failures");
    const result = { status: "passed", checks, screenshots: ["goods-desktop.png", "goods-desktop-section.png", "goods-mobile.png", "goods-mobile-section.png"], note: "External network blocked; no store navigation/order. Screenshot fonts use locally available fallbacks." };
    await fs.writeFile(path.join(output, "verification.json"), JSON.stringify(result, null, 2) + "\n");
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
})().catch((error) => { console.error(error); process.exitCode = 1; });
