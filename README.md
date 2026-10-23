# Coguis Informática 🍄

Site institucional e blog da Coguis, migrados para **React 19, Tailwind CSS 4 e Vite 8**. Identidade escura em preto e roxo, com o mascote original da marca.

## Desenvolvimento

Requer Node.js 22.12+ (recomendado: Node.js 24).

```sh
npm ci
npm run dev
```

O Vite fornece atualização instantânea durante a edição. Não use mais `python -m http.server` para desenvolver: agora o JSX e o Tailwind precisam do Vite.

```sh
npm run build
npm run preview
npm test
```

Os testes usam o build em `dist/`, iniciam um preview próprio e verificam as 11 páginas públicas, imagens carregadas, erros de JavaScript, menu mobile, FAQ, busca, categorias e conteúdo dos artigos. Execute o build antes dos testes. O ambiente cloud já possui Chromium. Em outra máquina, execute `npx playwright install chromium`; alternativamente, informe o executável em `CHROMIUM_PATH`.

## Estrutura

- `src/main.jsx`: componentes React, home, listagem do blog e leitura de artigos.
- `src/styles.css`: Tailwind e identidade visual responsiva, com foco visível e respeito à preferência por movimento reduzido.
- `src/content/articles.json`: conteúdo completo dos artigos existentes, migrado do HTML original.
- `index.html` e `blog/**/*.html`: entradas HTML com metadados específicos. Os endereços públicos existentes foram mantidos.
- `images/`: acervo original da marca, copiado para `dist/images` no build.
- `tests/site.test.mjs`: testes funcionais com Chromium e o runner nativo do Node.
- `css/` e `js/`: implementação antiga, mantida como referência; não é carregada pela aplicação React.

## Blog

A busca funciona no navegador, sem API ou credenciais. Categorias sem artigos apresentam um estado vazio, sem links ou imagens fictícias.

Para publicar um artigo, adicione um registro em `src/content/articles.json` e uma entrada HTML em `blog/artigos/<slug>.html`, copiando a estrutura de uma entrada existente e atualizando seus metadados. Veja [o guia do blog](blog/README.md).

O campo `body` contém HTML editorial local e confiável. Não passe conteúdo de usuários ou APIs diretamente para esse campo sem sanitização.

## GitHub Pages

O workflow `.github/workflows/deploy.yml` instala dependências com o lockfile, gera o build com a base do repositório e publica `dist/`. Em **Settings → Pages**, selecione **GitHub Actions** como origem. O workflow só executará após o código estar no GitHub; nenhuma publicação foi realizada durante a migração.

Para gerar o mesmo build localmente:

```sh
VITE_BASE_PATH=/coguisinformatica-site-coguis/ npm run build
```

Para domínio próprio, use a base `/` e ajuste as URLs canônicas, sitemap e metadados ao domínio. A navegação usa entradas HTML reais, sem depender de redirecionamento de SPA para acessar artigos diretamente.

## Contato

WhatsApp: https://wa.me/5511960281070

Instagram: https://www.instagram.com/coguisinformatica/

© Coguis Informática. Todos os direitos reservados.
