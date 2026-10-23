import manifest from "../.generated/images.json";
const base = import.meta.env.BASE_URL;
export function imageAttributes(
  path,
  sizes = "(max-width: 700px) calc(100vw - 40px), 600px",
) {
  const image = manifest[path];
  if (!image) return { src: base + path };
  return {
    src: base + image.variants.at(-1).path,
    srcSet: image.variants
      .map((v) => `${base}${v.path} ${v.width}w`)
      .join(", "),
    sizes,
    width: image.width,
    height: image.height,
    decoding: "async",
  };
}
export function optimizeArticleImages(html) {
  return html.replace(/<img\b[^>]*>/g, (tag) => {
    const source = tag.match(/\bsrc="([^"]+)"/);
    if (!source || !source[1].startsWith(base)) return tag;
    const path = source[1].slice(base.length);
    if (!manifest[path]) return tag;
    const attrs = imageAttributes(
      path,
      "(max-width: 700px) calc(100vw - 40px), 720px",
    );
    const clean = tag
      .replace(
        /\s(?:src|srcset|sizes|width|height|loading|decoding)="[^"]*"/gi,
        "",
      )
      .replace(/\s*\/?>$/, "");
    return (
      clean +
      " " +
      Object.entries({ ...attrs, loading: "lazy" })
        .map(
          ([key, value]) => `${key === "srcSet" ? "srcset" : key}="${value}"`,
        )
        .join(" ") +
      ">"
    );
  });
}
