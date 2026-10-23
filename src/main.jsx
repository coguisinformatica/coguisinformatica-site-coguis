import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Monitor,
  Cpu,
  ShieldCheck,
  Code2,
  Truck,
  Check,
  MessageCircle,
  ChevronDown,
  Sparkles,
  Zap,
  HeartHandshake,
} from "lucide-react";
import articles from "./content/articles.json";
import "./styles.css";

const base = import.meta.env.BASE_URL;
const asset = (path) => `${base}${path}`;
const whatsapp = "https://wa.me/5511960281070";
const categories = [
  ["manutencao", "Manutenção"],
  ["presenca-digital", "Presença digital"],
  ["dicas", "Dicas"],
  ["seguranca", "Segurança"],
  ["tecnologia-explicada", "Tecnologia explicada"],
  ["bastidores-do-coguis", "Bastidores da Coguis"],
  ["meu-site-de-estudos", "Meu site de estudos"],
];
const services = [
  {
    icon: Monitor,
    title: "Seu computador, de volta ao jogo.",
    text: "Manutenção de computadores e notebooks, diagnóstico e reparos. A gente resolve a parte complicada.",
    tag: "MANUTENÇÃO & SUPORTE",
    image: "coguisManutencaoSuporte2.png",
    wide: true,
  },
  {
    icon: Cpu,
    title: "Mais velocidade. Menos espera.",
    text: "Upgrade de SSD e memória RAM para dar uma nova vida ao seu equipamento.",
    tag: "UPGRADES",
    image: "coguisUpgradesMelhorias2.png",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados em boas mãos.",
    text: "Remoção de vírus, backup e cuidado com a sua privacidade em cada etapa.",
    tag: "SEGURANÇA DIGITAL",
  },
  {
    icon: Code2,
    title: "Sua ideia merece estar online.",
    text: "Sites modernos e presença digital para conectar sua empresa com novas possibilidades.",
    tag: "DESENVOLVIMENTO WEB",
  },
];
function Button({ children, href = whatsapp, secondary = false, ...props }) {
  return (
    <a
      href={href}
      className={`button ${secondary ? "button-secondary" : "button-primary"}`}
      {...props}
    >
      {children}
      <ArrowUpRight size={17} />
    </a>
  );
}
function Brand() {
  return (
    <a href={base} className="brand" aria-label="Coguis Informática — início">
      <svg
        className="brand-mark"
        width="38"
        height="40"
        viewBox="0 0 38 40"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 23C4 3 34 3 34 23H4Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M14 24v10c0 4 10 4 10 0V24M9 19c1-5 4-8 8-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 16h2m5 2h1"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span>
        coguis<span className="brand-dot">.</span>
        <small>INFORMÁTICA</small>
      </span>
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="navigation"
          className={open ? "nav nav-open" : "nav"}
          aria-label="Navegação principal"
        >
          <a onClick={() => setOpen(false)} href={`${base}#servicos`}>
            O que fazemos
          </a>
          <a onClick={() => setOpen(false)} href={`${base}#sobre`}>
            A Coguis
          </a>
          <a onClick={() => setOpen(false)} href={`${base}blog/index.html`}>
            Nosso blog <span className="nav-dot" />
          </a>
          <a className="nav-contact" href={whatsapp}>
            Vamos conversar <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
function Eyebrow({ children }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  );
}
function ArticleCard({ article }) {
  return (
    <a
      className="article-card group"
      href={asset(`blog/artigos/${article.slug}.html`)}
    >
      <div className="article-image">
        <img src={asset(article.image)} alt="" loading="lazy" />
        <span>
          <ArrowUpRight size={22} />
        </span>
      </div>
      <p className="card-meta">
        {categories.find((c) => c[0] === article.category)?.[1]} <span>•</span>{" "}
        Blog da Coguis
      </p>
      <h3>{article.title}</h3>
      <p className="text-sm text-zinc-400 mt-3 leading-relaxed">
        {article.summary}
      </p>
    </a>
  );
}
function Home() {
  return (
    <>
      <section className="hero shell" id="inicio">
        <div className="hero-copy">
          <div className="availability">
            <span /> Seu próximo upgrade começa aqui
          </div>
          <h1>
            Tecnologia
            <br />
            sem complicação.
            <br />
            <span>De verdade.</span>
          </h1>
          <p>
            Seu computador precisa de um cuidado.
            <br className="hidden md:block" /> Sua empresa, de um próximo passo.
            <br className="hidden md:block" /> A Coguis está aqui para os dois.
          </p>
          <div className="hero-buttons">
            <Button>Fale com a Coguis</Button>
            <a className="text-link" href="#servicos">
              Conheça as soluções <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-note">
            <ShieldCheck size={16} />
            <span>Atendimento humano. Cuidado com seus dados.</span>
          </div>
        </div>
        <div className="hero-art">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <img
            className="mascot"
            src={asset("images/coguisDeMochila2.png")}
            alt="Coguis, nosso mascote cogumelo, de mochila e pronto para ajudar"
            fetchPriority="high"
          />
          <div className="art-label">
            <span className="status-light" /> SEU PARCEIRO EM TECNOLOGIA
          </div>
          <div className="floating-tag">
            <Zap size={16} />
            <span>Um upgrade na sua rotina.</span>
          </div>
          <span className="art-coordinate">COGUIS® — TECH WITH CARE</span>
        </div>
      </section>
      <div className="trust-strip">
        <div className="shell flex flex-wrap justify-between gap-5">
          <span>
            <HeartHandshake />
            Gente cuidando de gente
          </span>
          <span>
            <ShieldCheck />
            Privacidade em primeiro lugar
          </span>
          <span>
            <Truck />
            Busca e entrega em São Paulo
          </span>
          <span>
            <Code2 />
            Do hardware ao digital
          </span>
        </div>
      </div>
      <section className="section shell" id="servicos">
        <div className="section-top">
          <div>
            <Eyebrow>O QUE FAZEMOS</Eyebrow>
            <h2>
              Um problema a menos.
              <br />
              <span>Um mundo de possibilidades.</span>
            </h2>
          </div>
          <p>
            Da manutenção ao seu próximo site.
            <br />
            Soluções reais, explicadas de um jeito simples.
          </p>
        </div>
        <div className="services-grid">
          {services.map(({ icon: Icon, ...s }, i) => (
            <a
              href={`${whatsapp}?text=${encodeURIComponent(`Olá, Coguis! Gostaria de saber mais sobre ${s.tag.toLowerCase()}.`)}`}
              className={`service-card service-${i}`}
              key={s.tag}
            >
              <div className="service-top">
                <span className="icon-box">
                  <Icon size={23} />
                </span>
                <ArrowUpRight className="service-arrow" size={22} />
              </div>
              <p className="service-tag">{s.tag}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              {s.image && (
                <img src={asset(`images/${s.image}`)} alt="" loading="lazy" />
              )}
            </a>
          ))}
        </div>
      </section>
      <section className="section shell about" id="sobre">
        <div className="about-image">
          <img
            src={asset("images/coguisPrivacidadeConfianca2.png")}
            alt="Mascote Coguis com um escudo, representando o cuidado com seus dados"
            loading="lazy"
          />
          <span className="image-caption">
            <ShieldCheck size={18} /> Confiança se constrói no cuidado.
          </span>
        </div>
        <div>
          <Eyebrow>PODE CHAMAR DE PARCEIRA</Eyebrow>
          <h2>
            Por trás da tecnologia,
            <br />
            <span>tem gente de verdade.</span>
          </h2>
          <p className="section-description">
            Nada de termos complicados ou soluções que você não precisa. Aqui, a
            gente escuta, explica e encontra o melhor caminho junto com você.
          </p>
          <ul className="check-list">
            {[
              "Diagnóstico claro e orçamento antes do serviço",
              "Seus arquivos e sua privacidade respeitados",
              "Busca e entrega para facilitar a sua rotina",
            ].map((t) => (
              <li key={t}>
                <span>
                  <Check size={15} />
                </span>
                {t}
              </li>
            ))}
          </ul>
          <a className="text-link text-violet-300" href={whatsapp}>
            Conheça a Coguis de perto <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
      <section className="section shell process">
        <Eyebrow>SIMPLES DO PRIMEIRO OI À ENTREGA</Eyebrow>
        <h2>
          A gente resolve.
          <br />
          <span>Você segue em frente.</span>
        </h2>
        <div className="process-grid">
          {[
            [
              "01",
              "Conta pra gente",
              "Chame no WhatsApp e conte o que você precisa. Sem compromisso, sem complicação.",
            ],
            [
              "02",
              "Entenda a solução",
              "Avaliamos o cenário e explicamos o diagnóstico, as opções e o orçamento.",
            ],
            [
              "03",
              "Pode deixar com a Coguis",
              "Com sua aprovação, cuidamos de tudo. E combinamos a melhor forma de entrega.",
            ],
          ].map(([n, title, text]) => (
            <div key={n}>
              <span className="step-number">
                {n}
                <ArrowRight size={20} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section shell" id="blog">
        <div className="section-top">
          <div>
            <Eyebrow>UM POUCO DE CONHECIMENTO</Eyebrow>
            <h2>
              Tecnologia também
              <br />
              <span>é para entender.</span>
            </h2>
          </div>
          <a className="text-link" href={asset("blog/index.html")}>
            Explore o blog <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="article-grid">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
      <section className="section shell faq">
        <Eyebrow>ANTES DE CHAMAR</Eyebrow>
        <h2>
          Sem dúvidas.<span> Sem complicação.</span>
        </h2>
        {[
          [
            "Vocês fazem busca e entrega?",
            "Sim! Oferecemos busca e entrega de equipamentos em São Paulo. Consulte a disponibilidade para sua região e as condições pelo WhatsApp.",
          ],
          [
            "Preciso aprovar o orçamento antes?",
            "Sim. Explicamos o diagnóstico e o orçamento antes de realizar o serviço. Você decide com clareza.",
          ],
          [
            "A Coguis também desenvolve sites?",
            "Sim! Criamos sites institucionais e soluções de presença digital. Vamos conversar para entender o que faz sentido para sua empresa.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <ChevronDown size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
function Blog({ category }) {
  const [query, setQuery] = useState("");
  const visible = articles.filter(
    (a) =>
      (!category || a.category === category) &&
      `${a.title} ${a.summary}`.toLowerCase().includes(query.toLowerCase()),
  );
  const name = categories.find((c) => c[0] === category)?.[1];
  return (
    <section className="shell section blog-page">
      <Eyebrow>BLOG DA COGUIS</Eyebrow>
      <h1>
        {name || "Um upgrade no"}
        {!name && (
          <>
            <br />
            <span>seu conhecimento.</span>
          </>
        )}
      </h1>
      <p className="section-description">
        Tecnologia explicada com cuidado. Dicas, ideias e soluções para o seu
        dia a dia.
      </p>
      <label className="search-label" htmlFor="search">
        Encontre um conteúdo
      </label>
      <input
        id="search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Busque por notebook, presença digital…"
      />
      <div className="category-tabs">
        <a
          className={!category ? "active" : ""}
          href={asset("blog/index.html")}
        >
          Todos
        </a>
        {categories.map(([slug, label]) => (
          <a
            key={slug}
            className={category === slug ? "active" : ""}
            href={asset(`blog/categorias/${slug}.html`)}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="article-grid">
        {visible.map((a) => (
          <ArticleCard key={a.slug} article={a} />
        ))}
      </div>
      {!visible.length && (
        <div className="empty-state">
          <Sparkles />
          <h2>
            {query
              ? "Nenhum conteúdo encontrado."
              : "Novas ideias estão chegando."}
          </h2>
          <p>
            {query
              ? "Tente buscar por outro assunto ou limpe sua busca."
              : "Enquanto isso, explore os artigos já publicados no blog."}
          </p>
          <a className="text-link" href={asset("blog/index.html")}>
            Ver todos os artigos <ArrowRight size={18} />
          </a>
        </div>
      )}
    </section>
  );
}
function Article({ article }) {
  const body = article.body
    .replaceAll("../../images/", asset("images/"))
    .replaceAll("../categorias/", asset("blog/categorias/"))
    .replaceAll("../artigos/", asset("blog/artigos/"))
    .replaceAll("../../index.html", base);
  return (
    <article className="shell section article-page">
      <a className="text-link" href={asset("blog/index.html")}>
        ← Voltar ao blog
      </a>
      <Eyebrow>
        {categories.find((c) => c[0] === article.category)?.[1]}
      </Eyebrow>
      <h1>{article.title}</h1>
      <p className="section-description">{article.summary}</p>
      <p className="card-meta">Por Coguis Informática</p>
      <img
        className="article-cover"
        src={asset(article.image)}
        alt={article.title}
      />
      <div className="prose" dangerouslySetInnerHTML={{ __html: body }} />
    </article>
  );
}
function Contact() {
  return (
    <section className="shell contact-section" id="contato">
      <div className="contact-glow" />
      <Eyebrow>VAMOS RESOLVER ISSO JUNTOS?</Eyebrow>
      <h2>
        O próximo passo
        <br />
        começa com um <span>oi.</span>
      </h2>
      <p>Um computador melhor. Uma ideia online. Uma rotina mais leve.</p>
      <Button>Oi, Coguis! Vamos conversar</Button>
      <span className="contact-footnote">
        <MessageCircle size={14} /> Direto no WhatsApp. De pessoa para pessoa.
      </span>
    </section>
  );
}
function Footer() {
  return (
    <footer className="shell">
      <div className="footer-top">
        <div>
          <Brand />
          <p>Tecnologia que vai até você.</p>
        </div>
        <div className="footer-links">
          <a href={`${base}#servicos`}>Soluções</a>
          <a href={`${base}#sobre`}>A Coguis</a>
          <a href={asset("blog/index.html")}>Blog</a>
          <a
            href="https://www.instagram.com/coguisinformatica/"
            aria-label="Instagram da Coguis"
          >
            Instagram ↗
          </a>
          <a
            href="https://github.com/coguisinformatica"
            aria-label="GitHub da Coguis"
          >
            GitHub ↗
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Coguis Informática. Todos os direitos
          reservados.
        </span>
        <span>
          Feito com cuidado. E um pouco de roxo.{" "}
          <span className="text-violet-400">✦</span>
        </span>
      </div>
    </footer>
  );
}
function App() {
  const path = decodeURI(window.location.pathname).replace(base, "");
  const slug = path.split("/").pop()?.replace(".html", "");
  const article = path.includes("blog/artigos/")
    ? articles.find((a) => a.slug === slug)
    : null;
  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo-principal">
        {article ? (
          <Article article={article} />
        ) : path.includes("blog/") ? (
          <Blog category={path.includes("categorias/") ? slug : undefined} />
        ) : (
          <Home />
        )}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
