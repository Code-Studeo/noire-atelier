# NOIRÉ ATELIER

Site de moda autoral da NOIRÉ ATELIER, com foco na coleção Essência, alfaiataria e acessórios.

## Executar localmente

Não há dependências npm nem etapa de build. Abra `index.html` diretamente ou sirva esta pasta com qualquer servidor estático. Por exemplo, com Node instalado:

```powershell
npx --yes serve .
```

Depois, acesse o endereço local informado pelo servidor. O site também pode ser publicado como site estático na Vercel: importe o repositório, selecione **Other** como preset, deixe build command e output directory vazios (ou diretório `.`) e publique.

## Tecnologias e escolhas

HTML semântico, CSS autoral, pilhas tipográficas locais e JavaScript nativo mantêm o pacote leve, sem dependências externas ou framework para uma página estática.
IntersectionObserver, diálogos nativos e elementos acessíveis resolvem as interações sem biblioteca de animação ou serviço externo.

## Recursos

- Layout adaptável, menu mobile acessível, navegação por âncoras e foco de teclado visível.
- Animações de entrada via IntersectionObserver, parallax leve e respeito a `prefers-reduced-motion`.
- Coleção filtrável por vestidos, alfaiataria, bolsas e editorial.
- Lookbook interativo e sacola de compras que encaminha a seleção ao formulário de contato.
- Formulário com validação nativa. Configure um canal de atendimento antes de receber contatos.
- SEO básico, Open Graph, favicon local e crédito de portfólio configurável.
- Sem API, backend, analytics ou serviço pago.

## Estrutura

```text
index.html
styles.css
atelier.css
app.js
config.js
favicon.svg
public/images/README.md
public/images/SOURCES.md
public/images/*.webp
```

As cinco imagens fornecidas foram otimizadas para WebP e estão aplicadas no hero, no atelier, no catálogo, no lookbook e na seção de processo. Dimensões e fontes estão documentadas em [public/images/README.md](public/images/README.md) e [public/images/SOURCES.md](public/images/SOURCES.md).

Para personalizar a linha de crédito do portfólio, preencha `portfolioCredit` em `config.js`.

## Atendimento e pedidos

A sacola mantém a seleção na sessão e preenche o formulário de contato. O formulário ainda não está ligado a um endereço ou serviço de atendimento; configure esse canal antes de publicar e receber pedidos reais.

## Publicar na Vercel

1. Envie esta pasta para um repositório GitHub.
2. Na Vercel, importe o repositório como projeto novo.
3. Escolha **Other** como preset; não há comando de build. Publique a pasta raiz do projeto.
4. Confira a URL gerada e adicione um domínio próprio nas configurações da Vercel, se desejar.

Nenhuma publicação foi feita por este projeto.
