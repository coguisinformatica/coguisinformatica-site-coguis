# Imagens e medição dos contatos

## Imagens

`npm run dev` e `npm run build` geram versões WebP com Sharp, sem modificar os originais em `images/`. As versões ficam em `public/optimized/` e o manifesto em `.generated/images.json`; ambos são regeneráveis e ignorados pelo Git. O Node recebe Sharp por `npm ci`, com a versão e integridade registradas no lockfile.

As imagens usadas pelo layout e pelos artigos têm variantes de até 480, 960 e 1440 pixels, sem ampliar além do original. O navegador escolhe pelo `srcset` e pelo tamanho de exibição; dimensões intrínsecas ajudam a reservar o espaço. A imagem principal tem prioridade alta e as imagens abaixo da dobra usam carregamento tardio. Os originais continuam publicados para preservar metadados e endereços existentes; o total do pacote de deploy não equivale ao download de uma visita.

O script informa a comparação entre os bytes dos originais selecionados e as maiores variantes geradas. Isso mede tamanho de arquivo, não pontuação do PageSpeed nem velocidade de conexão. Os testes conferem variantes existentes, uso de WebP no mobile e nos artigos e redução mínima de 75% nesse conjunto.

## Analytics

O identificador GA4 `G-1CW9SCH85F` já estava no site. Agora está centralizado em `src/content/site.json` e a mesma configuração é inserida em todas as entradas HTML no build, inclusive artigos.

O evento personalizado `contact_click` é enviado quando um visitante clica em WhatsApp, telefone ou e-mail. Ele contém somente:

- `contact_method`: `whatsapp`, `phone` ou `email`.
- `placement`: `hero`, `header`, `footer`, `contact`, `services`, `article` ou `content`.
- `transport_type`: `beacon`, para permitir envio durante a navegação.

O evento personalizado não envia texto da mensagem, telefone, e-mail, texto do link ou URL de destino. Não bloqueia navegação e funciona mesmo quando o Analytics está indisponível. Mede intenção de contato: não comprova mensagem enviada, atendimento, orçamento ou venda.

## Conferir no Google Analytics após publicar

1. Abra a propriedade que usa o identificador acima e consulte **Tempo real**.
2. Acesse o site publicado, clique uma vez no botão de WhatsApp e confira o evento `contact_click`. A coleta depende da configuração da conta, consentimento aplicável e bloqueadores no navegador.
3. Nas configurações de eventos, marque `contact_click` como evento principal se essa for a métrica de negócio desejada. A ação é feita na conta do proprietário; não foi realizada pelo código.
4. Para relatórios por canal e localização, cadastre `contact_method` e `placement` como dimensões personalizadas de escopo de evento. Relatórios padrão podem levar algum tempo para atualizar.

Os testes interceptam o `gtag` e verificam o conteúdo do evento; não provam recebimento na propriedade privada do Google Analytics. Nenhuma credencial, configuração privada, política de consentimento ou propriedade foi criada ou alterada por esta implementação.
