// Only channel and placement are measured: no phone, email, link text or message content.
export function installContactTracking(doc = document, win = window) {
  const listener = (event) => {
    const link = event.target?.closest?.("a[href]");
    if (!link || event.defaultPrevented || typeof win.gtag !== "function")
      return;
    let url;
    try {
      url = new URL(link.href, win.location.href);
    } catch {
      return;
    }
    const method =
      url.protocol === "tel:"
        ? "phone"
        : url.protocol === "mailto:"
          ? "email"
          : url.hostname === "wa.me" || url.hostname === "api.whatsapp.com"
            ? "whatsapp"
            : null;
    if (!method) return;
    const placement = link.closest("header")
      ? "header"
      : link.closest("footer")
        ? "footer"
        : link.closest("#contato")
          ? "contact"
          : link.closest("#servicos")
            ? "services"
            : link.closest(".prose")
              ? "article"
              : link.closest(".hero")
                ? "hero"
                : "content";
    win.gtag("event", "contact_click", {
      contact_method: method,
      placement,
      transport_type: "beacon",
    });
  };
  doc.addEventListener("click", listener);
  return () => doc.removeEventListener("click", listener);
}
