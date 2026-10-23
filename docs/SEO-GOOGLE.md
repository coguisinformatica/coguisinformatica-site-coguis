# SEO e Perfil da Empresa no Google

## Implementado no site

- HTML pré-renderizado no build: home, listagens e artigos chegam com conteúdo, links e headings antes de executar JavaScript. O React hidrata esse HTML para adicionar busca e menu.
- URL canônica, título, descrição, Open Graph e Twitter Card em cada entrada.
- Dados estruturados `LocalBusiness`, `WebSite`, `WebPage`/`CollectionPage`, `BlogPosting` e breadcrumbs, sem notas, avaliações, endereço ou horários inventados.
- Imagens dos artigos nos metadados correspondem a arquivos existentes.
- Sitemap com home, blog, dois artigos e duas categorias com conteúdo. Categorias vazias e modelos editoriais são `noindex, follow` e não entram no sitemap.
- Nome, telefone e e-mail existentes no repositório apresentados também no rodapé.

`src/content/site.json` centraliza a identidade e o endereço canônico atual do site. Nome, categoria, telefone, endereço, área atendida e horários foram conferidos nas capturas do Perfil da Empresa enviadas pelo proprietário. O e-mail e os serviços complementares já constavam no repositório. `scripts/seo.mjs` gera os metadados e o sitemap a cada build. Não edite manualmente campos gerados nos HTMLs. `scripts/prerender.mjs` gera o conteúdo estático em `dist/`; não é necessário manter um servidor Node em produção.

As datas de publicação dos artigos foram preservadas. Não são alteradas automaticamente a cada build. Atualize `dateModified` no artigo somente quando houver uma revisão real do conteúdo.

## Dados conferidos nas capturas do proprietário

- Nome: **Coguis Informática**.
- Categoria principal: **Reparação e manutenção de computadores**.
- Telefone: **(11) 96028-1070**.
- Endereço cadastrado: **Rua Guarizinho, 242 — Casa Verde Média, São Paulo — SP, CEP 02530-010**.
- Área de serviço: **São Paulo, SP, Brasil**. Não foram adicionadas outras cidades.
- Segunda a sexta: **08:00–18:00**; sábado: **09:00–13:00**; domingo: **fechado**.
- Planejamento: **reserva obrigatória**, apresentado no site como atendimento com agendamento pelo WhatsApp, sem prometer atendimento livre no local.
- Idiomas informados no perfil: **português e inglês**.
- Site: GitHub Pages, confirmado também por mensagem do proprietário.
- Perfil no Maps: CID `4843789275991588309`, incluído no rodapé, `sameAs` e `hasMap`.

Os dados constam no conteúdo visível e na entidade `LocalBusiness`, que mantém o mesmo identificador usado pelo autor e publicador dos artigos. `openingHoursSpecification` contém os dias abertos; domingo fica omitido na marcação e explicitamente fechado no texto. Não foram inventados horários especiais, data de fundação, avaliações ou notas.

As capturas mostram opções de pagamento que merecem revisão no próprio perfil: aceita débito e NFC, mas não aceita crédito e marca diversas bandeiras como não aceitas. Não foram inferidos Pix, bandeiras aceitas ou condições de pagamento para o site. Os campos de acessibilidade, estacionamento e reciclagem estão sem preenchimento; não representam confirmação de disponibilidade ou indisponibilidade.

## Após publicar o site

1. Conferir o site efetivamente publicado, suas URLs canônicas, páginas de artigos e sitemap. As mudanças numa branch não mudam o site público.
2. No Perfil da Empresa, confirmar o link do site, categoria, contato, serviços, horário e área atendida. Essas alterações devem ser feitas pelo proprietário na área de gestão.
3. No Search Console, usar uma propriedade de **prefixo de URL** para o endereço completo `https://coguisinformatica.github.io/coguisinformatica-site-coguis/`. Uma propriedade de domínio só faz sentido quando houver domínio próprio com acesso ao DNS.
4. Concluir a verificação pelo método oferecido à conta. Não inserir um código fictício: se o Google fornecer um arquivo HTML ou metatag, utilizar exatamente o que ele emitir.
5. Enviar `sitemap.xml` na propriedade verificada e inspecionar a home e os artigos. Confirmar que o Google consegue acessar o HTML publicado.
6. Validar as páginas publicadas no Rich Results Test e acompanhar indexação, consultas e conversões reais. A marcação não garante resultados enriquecidos ou posição no ranking.

Acesso privado ao Search Console ou ao Perfil da Empresa não está disponível neste ambiente. Não houve alteração de cadastro, envio de sitemap, solicitação de indexação ou publicação por esta tarefa.

As consultas públicas ao Google e ao GitHub Pages foram bloqueadas pela rede (403). A conferência cadastral foi feita pelas capturas enviadas pelo proprietário, sem alegar acesso à área privada ou validação da versão publicada.
