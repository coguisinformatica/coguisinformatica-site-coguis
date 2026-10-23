import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory()
      ? files(`${dir}/${f.name}`)
      : f.name.endsWith(".html")
        ? [`${dir}/${f.name}`]
        : [],
  );
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.jsx");
  for (const file of files("dist")) {
    const relative = file.slice("dist/".length);
    const pathname = `${server.config.base}${relative === "index.html" ? "" : relative}`;
    const markup = renderToString(React.createElement(App, { pathname }));
    const html = readFileSync(file, "utf8");
    if (!html.includes('<div id="root"></div>'))
      throw new Error(`Root não encontrado: ${file}`);
    writeFileSync(
      file,
      html.replace(
        '<div id="root"></div>',
        () => `<div id="root">${markup}</div>`,
      ),
    );
    console.log(`HTML pré-renderizado: ${relative}`);
  }
} finally {
  await server.close();
}
