# SEO e Perfil da Empresa no Google

## Implementado no site

- HTML pré-renderizado no build: home, listagens e artigos chegam com conteúdo, links e headings antes de executar JavaScript. O React hidrata esse HTML para adicionar busca e menu.
- URL canônica, título, descrição, Open Graph e Twitter Card em cada entrada.
- Dados estruturados `Organization`, `WebSite`, `WebPage`/`CollectionPage`, `BlogPosting` e breadcrumbs, sem notas, avaliações, endereço ou horários inventados.
- Imagens dos artigos nos metadados correspondem a arquivos existentes.
- Sitemap com home, blog, dois artigos e duas categorias com conteúdo. Categorias vazias e modelos editoriais são `noindex, follow` e não entram no sitemap.
- Nome, telefone e e-mail existentes no repositório apresentados também no rodapé.

`src/content/site.json` centraliza a identidade e o endereço canônico atual do site. Os dados vieram do próprio repositório; ainda precisam ser conferidos com o perfil do Google pelo proprietário. `scripts/seo.mjs` gera os metadados e o sitemap a cada build. Não edite manualmente campos gerados nos HTMLs. `scripts/prerender.mjs` gera o conteúdo estático em `dist/`; não é necessário manter um servidor Node em produção.

As datas de publicação dos artigos foram preservadas. Não são alteradas automaticamente a cada build. Atualize `dateModified` no artigo somente quando houver uma revisão real do conteúdo.

## Dados pendentes de confirmação

O link enviado abre uma busca pública do Google, não uma sessão de gestão. Neste ambiente, o acesso público ao Google e ao site em GitHub Pages retornou bloqueio de rede (403). Não foi possível inspecionar o perfil ou a versão pública.

Confirmar com o proprietário:

- Nome exato da empresa e categoria principal no Google; categorias secundárias pertinentes.
- Telefone comercial, horários e área real de atendimento.
- Se recebe clientes em endereço público ou funciona por visitas/busca e entrega. Não publicar endereço particular por dedução.
- URL pública estável do perfil: confirmada pelo link do Maps enviado pelo proprietário (CID `4843789275991588309`). O link foi incluído no rodapé e em `sameAs`.
- URL oficial do site: GitHub Pages atual ou domínio próprio.

Após confirmação, alinhar textos visíveis e dados estruturados. Uma entidade local e seus campos devem refletir a operação real; ter um schema não substitui a validação da empresa pelo Google. Não criar páginas de cidades onde não há atendimento nem inserir palavras-chave no nome comercial artificialmente.

## Após publicar o site

1. Conferir o site efetivamente publicado, suas URLs canônicas, páginas de artigos e sitemap. As mudanças numa branch não mudam o site público.
2. No Perfil da Empresa, confirmar o link do site, categoria, contato, serviços, horário e área atendida. Essas alterações devem ser feitas pelo proprietário na área de gestão.
3. No Search Console, usar uma propriedade de **prefixo de URL** para o endereço completo `https://coguisinformatica.github.io/coguisinformatica-site-coguis/`. Uma propriedade de domínio só faz sentido quando houver domínio próprio com acesso ao DNS.
4. Concluir a verificação pelo método oferecido à conta. Não inserir um código fictício: se o Google fornecer um arquivo HTML ou metatag, utilizar exatamente o que ele emitir.
5. Enviar `sitemap.xml` na propriedade verificada e inspecionar a home e os artigos. Confirmar que o Google consegue acessar o HTML publicado.
6. Validar as páginas publicadas no Rich Results Test e acompanhar indexação, consultas e conversões reais. A marcação não garante resultados enriquecidos ou posição no ranking.

Acesso privado ao Search Console ou ao Perfil da Empresa não está disponível neste ambiente. Não houve alteração de cadastro, envio de sitemap, solicitação de indexação ou publicação por esta tarefa.

O proprietário confirmou que o site continuará no GitHub Pages. O link do Maps também retornou bloqueio de rede (403); portanto, categoria, telefone exibido no Google, horários e modalidade/área de atendimento continuam pendentes de conferência. As coordenadas do link não foram usadas para deduzir ou publicar endereço.
