# Do Prado e Rodrigues — Advocacia e Consultoria Jurídica

Landing page estática (HTML/CSS/JS, sem build) publicada no Vercel.

- `/trabalhista` e `/bancario` — duas LPs separadas (geradas pelo mesmo modelo; estilos em `assets/lp.css`, scripts em `assets/lp.js`)
- `/` — redireciona para `/trabalhista`
- `/redirect` — tela pós-formulário (conversões + WhatsApp do escritório)
- `/dashboard` — painel de leads com login (Supabase Auth)
- `assets/` — logo, favicon e imagem de compartilhamento

## Dados
- Supabase "ADS BR CLIENTES" (`qxhnjzyhtllmtdrcyygi`), tabelas `lp_visits` e `lp_leads` com `site` = `do-prado-trabalhista` ou `do-prado-bancario`.
- Acesso ao painel liberado via `lp_acessos` para `admin@do-prado-rodrigues.adsbr.internal` (usuário exibido: `admin`).
- Fotos de fundo no bucket público `lp-assets/do-prado-rodrigues/`, otimizadas pelo Vercel (`/_vercel/image`).

## Pendências
- `redirect/index.html` → `CONFIG.FONE`: WhatsApp do escritório (DDI+DDD). Também `PIXEL_ID`, `GTM_ID`, `AW_ID`, `AW_LABEL`.
- Número da OAB no rodapé (Provimento 205/2021).
