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
