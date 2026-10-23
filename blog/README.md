# Blog da Coguis — React

Os artigos são renderizados pelo React a partir de `src/content/articles.json`. Os textos completos dos dois artigos originais foram preservados na migração.

Para criar um artigo:

1. Adicione no JSON um registro com `slug`, `title`, `summary`, `category`, `image` e `body`.
2. Use como categoria um dos slugs definidos em `src/main.jsx`.
3. Salve a imagem em `images/blog/artigos/` e use um caminho relativo à raiz, por exemplo `images/blog/artigos/minha-imagem.png`.
4. O campo `body` aceita HTML editorial confiável, com títulos a partir de `h2`. Não insira scripts ou HTML de fontes não confiáveis.
5. Crie `blog/artigos/<slug>.html` com a estrutura de uma entrada atual: título, descrição, URL canônica, metadados sociais e dados estruturados próprios. Mantenha `#root` e o script `/src/main.jsx`.
6. Execute `npm run build` e `npm test` na raiz do projeto.

A listagem e os filtros passam a usar o novo registro automaticamente. Categorias vazias exibem uma mensagem, sem simular publicações futuras. Os arquivos em `templates/` são esqueletos de entrada; não contêm mais o layout visual, agora compartilhado em React.
