import { readFileSync, writeFileSync, readdirSync } from "node:fs";
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const site = readJson("src/content/site.json");
const articles = readJson("src/content/articles.json");
const categories = readJson("src/content/categories.json");
const absolute = (path) => new URL(path, site.url).href;
const escape = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const files = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((f) =>
    f.isDirectory()
      ? files(`${dir}/${f.name}`)
      : f.name.endsWith(".html")
        ? [`${dir}/${f.name}`]
        : [],
  );
const organization = {
  "@type": "Organization",
  "@id": absolute("#organization"),
  name: site.name,
  url: site.url,
  logo: { "@type": "ImageObject", url: absolute(site.logo) },
  telephone: site.telephone,
  email: site.email,
  sameAs: [...site.social, site.googleMaps].filter(Boolean),
};
const website = {
  "@type": "WebSite",
  "@id": absolute("#website"),
  url: site.url,
  name: site.name,
  inLanguage: "pt-BR",
  publisher: { "@id": absolute("#organization") },
};
const sitemap = [];
for (const path of ["index.html", ...files("blog")]) {
  const source = readFileSync(path, "utf8");
  const home = path === "index.html";
  const article = articles.find((a) => path === `blog/artigos/${a.slug}.html`);
  const category = categories.find(
    ([slug]) => path === `blog/categorias/${slug}.html`,
  );
  const template = path.startsWith("blog/templates/");
  const indexable =
    !template &&
    (!category || articles.some((a) => a.category === category[0]));
  const title = home
    ? "Assistência técnica e soluções digitais | Coguis Informática"
    : article
      ? `${article.title} | Blog da Coguis`
      : category
        ? `${category[1]} | Blog da Coguis Informática`
        : template
          ? "Modelo editorial | Coguis Informática"
          : "Dicas de tecnologia, manutenção e presença digital | Blog da Coguis";
  const description = home
    ? "Manutenção de computadores e notebooks, upgrades, backup e criação de sites. Conheça a Coguis Informática e fale com nossa equipe pelo WhatsApp."
    : article
      ? article.summary
      : category
        ? `Conteúdos sobre ${category[1].toLowerCase()} no Blog da Coguis Informática. Tecnologia explicada de forma simples para o seu dia a dia.`
        : "Aprenda sobre manutenção de notebooks, segurança e presença digital com os conteúdos da Coguis Informática. Explore os artigos e dicas do nosso blog.";
  const url = home ? site.url : absolute(path);
  const image = absolute(article?.image || "images/coguisDeMochila2.png");
  const breadcrumbs = [{ name: "Início", item: site.url }];
  if (!home)
    breadcrumbs.push({ name: "Blog", item: absolute("blog/index.html") });
  if (article || category)
    breadcrumbs.push({ name: article?.title || category[1], item: url });
  const graph = [
    organization,
    website,
    {
      "@type": home || article ? "WebPage" : "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: title,
      description,
      inLanguage: "pt-BR",
      isPartOf: { "@id": absolute("#website") },
      about: { "@id": absolute("#organization") },
    },
  ];
  if (article)
    graph.push({
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: article.title,
      description,
      image: [image],
      inLanguage: "pt-BR",
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      author: { "@id": absolute("#organization") },
      publisher: { "@id": absolute("#organization") },
      mainEntityOfPage: { "@id": `${url}#webpage` },
    });
  if (!home && !template)
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        ...b,
      })),
    });
  // Keep the existing Analytics integration, without generating identifiers or account verification tokens.
  const analytics =
    home || path === "blog/index.html"
      ? [...source.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/g)]
          .map((m) => m[0])
          .filter(
            (s) =>
              s.includes("googletagmanager.com/gtag/js") ||
              s.includes("gtag('config'"),
          )
      : [];
  const tags = [
    '<meta charset="UTF-8"/>',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
    '<meta name="theme-color" content="#09090c"/>',
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}"/>`,
    `<meta name="robots" content="${indexable ? "index, follow, max-image-preview:large" : "noindex, follow"}"/>`,
    `<link rel="canonical" href="${escape(url)}"/>`,
    ...Object.entries({
      "og:type": article ? "article" : "website",
      "og:locale": "pt_BR",
      "og:site_name": site.name,
      "og:title": title,
      "og:description": description,
      "og:url": url,
      "og:image": image,
      "og:image:alt": article?.title || "Mascote da Coguis Informática",
    }).map(
      ([key, value]) => `<meta property="${key}" content="${escape(value)}"/>`,
    ),
    '<meta name="twitter:card" content="summary_large_image"/>',
    ...Object.entries({
      "twitter:title": title,
      "twitter:description": description,
      "twitter:image": image,
    }).map(
      ([key, value]) => `<meta name="${key}" content="${escape(value)}"/>`,
    ),
    `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replaceAll("<", "\\u003c")}</script>`,
    ...analytics,
  ];
  writeFileSync(
    path,
    `<!doctype html>\n<html lang="pt-BR">\n<head>\n${tags.join("\n")}\n</head>\n<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>\n</html>\n`,
  );
  if (indexable) sitemap.push(url);
}
writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n")}\n</urlset>\n`,
);
writeFileSync(
  "robots.txt",
  `User-agent: *\nAllow: /\nSitemap: ${absolute("sitemap.xml")}\n`,
);
console.log(
  `SEO: metadados gerados; ${sitemap.length} URLs indexáveis no sitemap.`,
);
