import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
let server, browser, page;
const origin =
  "http://127.0.0.1:4174" +
  (process.env.TEST_BASE_PATH || "").replace(/\/$/, "");
before(async () => {
  server = spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      "4174",
      "--strictPort",
    ],
    { stdio: "ignore" },
  );
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin + "/")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  assert.ok(ready, "Production preview must start");
  browser = await chromium.launch({
    executablePath:
      process.env.CHROMIUM_PATH ||
      (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined),
    args: ["--no-sandbox"],
  });
  page = await browser.newPage();
  await page.route("**/*", (route) =>
    route.request().url().startsWith("http://127.0.0.1:4174/")
      ? route.continue()
      : route.abort(),
  );
});
after(async () => {
  await browser?.close();
  server?.kill();
});
test("all public pages render without broken loaded resources or runtime errors", async () => {
  const failures = [],
    errors = [];
  page.on("response", (r) => {
    if (r.status() >= 400) failures.push(`${r.status()} ${r.url()}`);
  });
  page.on("pageerror", (e) => errors.push(e.message));
  const paths = [
    "/",
    "/blog/index.html",
    "/blog/artigos/notebook-esquentando.html",
    "/blog/artigos/o-que-e-presenca-digital.html",
    ...[
      "manutencao",
      "presenca-digital",
      "dicas",
      "seguranca",
      "tecnologia-explicada",
      "bastidores-do-coguis",
      "meu-site-de-estudos",
    ].map((c) => `/blog/categorias/${c}.html`),
  ];
  for (const path of paths) {
    assert.equal((await page.goto(origin + path)).status(), 200);
    await page.locator("h1").waitFor();
    assert.ok((await page.locator("h1").innerText()).trim());
    await page.evaluate(async () => {
      for (const img of document.images) img.loading = "eager";
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    assert.deepEqual(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.filter((i) => !i.naturalWidth).map((i) => i.src),
        ),
      [],
      path,
    );
    assert.equal(await page.locator("h1").count(), 1);
  }
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
});
test("mobile navigation, FAQ and responsive layout work", async () => {
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin + "/");
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `No horizontal overflow at ${width}px`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await toggle.click();
  await page.getByRole("link", { name: "O que fazemos" }).click();
  assert.equal(
    await page.locator(".menu-toggle").getAttribute("aria-expanded"),
    "false",
  );
  await page.locator("summary").first().click();
  assert.equal(await page.locator("details").first().getAttribute("open"), "");
  assert.ok(
    (
      await page.locator(".hero-buttons a").first().getAttribute("href")
    ).includes("wa.me/5511960281070"),
  );
});
test("blog search and category empty states work, articles retain full text", async () => {
  await page.goto(origin + "/blog/index.html");
  assert.equal(await page.locator(".article-card").count(), 2);
  await page.getByRole("searchbox").fill("notebook");
  assert.equal(await page.locator(".article-card").count(), 1);
  await page.getByRole("searchbox").fill("zzzzzz");
  await page.getByText("Nenhum conteúdo encontrado.").waitFor();
  await page.goto(origin + "/blog/categorias/manutencao.html");
  assert.equal(await page.locator(".article-card").count(), 1);
  await page.goto(origin + "/blog/categorias/dicas.html");
  await page.getByText("Novas ideias estão chegando.").waitFor();
  await page.goto(origin + "/blog/artigos/notebook-esquentando.html");
  assert.ok((await page.locator(".prose").innerText()).length > 5000);
});

test("production HTML exposes content and consistent SEO without JavaScript", async () => {
  const { readFileSync, existsSync } = await import("node:fs");
  const site = JSON.parse(readFileSync("src/content/site.json", "utf8"));
  const xml = readFileSync("dist/sitemap.xml", "utf8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  assert.equal(urls.length, 6);
  assert.equal(new Set(urls).size, urls.length);
  assert.ok(
    readFileSync("dist/robots.txt", "utf8").includes(
      `Sitemap: ${site.url}sitemap.xml`,
    ),
  );
  for (const url of urls) {
    const path = url.slice(site.url.length) || "index.html";
    const response = await fetch(
      origin + "/" + (path === "index.html" ? "" : path),
    );
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /<h1[\s>]/);
    assert.match(html, /<div id="root">[\s\S]*Coguis/);
    assert.ok(html.includes(`href="${url}"`), `canonical ${path}`);
    assert.match(
      html,
      /name="robots" content="index, follow, max-image-preview:large"/,
    );
    const schemas = [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ];
    assert.equal(schemas.length, 1, "A single generated schema graph");
    const graph = JSON.parse(schemas[0][1])["@graph"];
    const organization = graph.find((n) => n["@type"] === "LocalBusiness");
    assert.equal(organization.name, site.name);
    assert.equal(organization.telephone, site.telephone);
    assert.equal(organization.address.streetAddress, "Rua Guarizinho, 242");
    assert.equal(organization.address.postalCode, "02530-010");
    assert.equal(organization.address.addressLocality, "São Paulo");
    assert.equal(organization.areaServed.name, "São Paulo");
    assert.equal(organization.hasMap, site.googleMaps);
    assert.deepEqual(
      organization.openingHoursSpecification.map((hours) => [
        hours.opens,
        hours.closes,
      ]),
      [
        ["08:00", "18:00"],
        ["09:00", "13:00"],
      ],
    );
    assert.equal(organization.openingHoursSpecification[0].dayOfWeek.length, 5);
    assert.deepEqual(organization.openingHoursSpecification[1].dayOfWeek, [
      "https://schema.org/Saturday",
    ]);
    assert.equal(
      organization.aggregateRating,
      undefined,
      "Do not fabricate ratings",
    );
    const posting = graph.find((n) => n["@type"] === "BlogPosting");
    if (posting) {
      assert.ok(existsSync("dist/" + posting.image[0].slice(site.url.length)));
      assert.match(posting.datePublished, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(html.includes('class="prose"'));
    }
  }
  for (const path of [
    "blog/categorias/dicas.html",
    "blog/templates/article-template.html",
  ]) {
    assert.match(
      readFileSync(`dist/${path}`, "utf8"),
      /name="robots" content="noindex, follow"/,
    );
    assert.ok(!urls.includes(site.url + path));
  }
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  try {
    const staticPage = await noJs.newPage();
    await staticPage.goto(origin + "/");
    assert.ok(
      (await staticPage.locator("h1").innerText()).includes("Tecnologia"),
    );
    assert.ok(
      (
        await staticPage
          .getByRole("link", { name: /Fale com a Coguis/ })
          .getAttribute("href")
      ).includes("wa.me/"),
    );
    await staticPage
      .getByRole("heading", { name: "Horário de atendimento" })
      .waitFor();
    assert.ok(
      (await staticPage.locator(".business-details").innerText()).includes(
        "08h00 às 18h00",
      ),
    );
    assert.ok(
      (await staticPage.locator(".business-details").innerText()).includes(
        "Domingo: fechado",
      ),
    );
    assert.ok(
      (
        await staticPage
          .getByRole("link", { name: "Agendar atendimento pelo WhatsApp" })
          .getAttribute("href")
      ).includes("wa.me/5511960281070?text="),
    );
    await staticPage.goto(origin + "/blog/artigos/notebook-esquentando.html");
    assert.ok((await staticPage.locator(".prose").innerText()).length > 5000);
  } finally {
    await noJs.close();
  }
});

test("responsive images preserve originals and use much smaller WebP resources", async () => {
  const { readFileSync, statSync, existsSync } = await import("node:fs");
  const manifest = JSON.parse(readFileSync(".generated/images.json", "utf8"));
  let originals = 0,
    optimized = 0;
  for (const [source, image] of Object.entries(manifest)) {
    assert.ok(existsSync(source));
    originals += statSync(source).size;
    for (const variant of image.variants) {
      assert.ok(existsSync(`dist/${variant.path}`));
      assert.ok(variant.width <= image.width);
    }
    optimized += statSync(`dist/${image.variants.at(-1).path}`).size;
  }
  assert.ok(
    optimized < originals * 0.25,
    "Largest responsive variants should reduce source bytes by at least 75%",
  );
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
  });
  try {
    const p = await mobile.newPage();
    await p.route("**/*", (r) =>
      r.request().url().startsWith("http://127.0.0.1:4174/")
        ? r.continue()
        : r.abort(),
    );
    await p.goto(origin + "/");
    await p.locator(".mascot").evaluate((img) => img.decode());
    assert.match(
      await p.locator(".mascot").evaluate((img) => img.currentSrc),
      /-480\.webp$/,
    );
    for (const path of [
      "/",
      "/blog/artigos/notebook-esquentando.html",
      "/blog/artigos/o-que-e-presenca-digital.html",
    ]) {
      await p.goto(origin + path);
      const images = await p
        .locator("main img")
        .evaluateAll((imgs) =>
          imgs.map((img) => ({
            src: img.getAttribute("src"),
            srcset: img.getAttribute("srcset"),
            width: img.getAttribute("width"),
            height: img.getAttribute("height"),
          })),
        );
      assert.ok(images.length > 0);
      assert.ok(
        images.every(
          (i) =>
            i.src.endsWith(".webp") &&
            i.srcset &&
            Number(i.width) > 0 &&
            Number(i.height) > 0,
        ),
      );
    }
  } finally {
    await mobile.close();
  }
});

test("contact clicks measure channel and placement without message or destination data", async () => {
  await page.goto(origin + "/");
  await page.evaluate(() => {
    window.contactEvents = [];
    window.gtag = (...args) => window.contactEvents.push(args);
    // Registered after the application listener so the event is measured before navigation is cancelled.
    document.addEventListener("click", (e) => {
      if (e.target.closest("a")) e.preventDefault();
    });
  });
  await page.locator(".hero-buttons a").first().click();
  await page
    .getByRole("link", { name: "Agendar atendimento pelo WhatsApp" })
    .click();
  await page.locator('footer a[href^="tel:"]').click();
  await page.locator('footer a[href^="mailto:"]').click();
  const events = await page.evaluate(() => window.contactEvents);
  assert.deepEqual(
    events.map((e) => [e[0], e[1], e[2].contact_method, e[2].placement]),
    [
      ["event", "contact_click", "whatsapp", "hero"],
      ["event", "contact_click", "whatsapp", "contact"],
      ["event", "contact_click", "phone", "footer"],
      ["event", "contact_click", "email", "footer"],
    ],
  );
  for (const event of events)
    assert.deepEqual(Object.keys(event[2]).sort(), [
      "contact_method",
      "placement",
      "transport_type",
    ]);
  await page.locator('footer a[href$="blog/index.html"]').click();
  assert.equal((await page.evaluate(() => window.contactEvents)).length, 4);
  await page.evaluate(() => {
    window.gtag = undefined;
  });
  await page.locator(".hero-buttons a").first().click();
  assert.equal((await page.evaluate(() => window.contactEvents)).length, 4);
});
