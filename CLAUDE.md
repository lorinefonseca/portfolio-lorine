# Portfólio Lorine — instruções para o Claude Code

## Projeto
Site estático (sem build, sem framework, sem dependências):
- `index.html` — todo o conteúdo e a estrutura (minificado em uma linha)
- `styles.css` — todos os estilos (minificado em uma linha); paleta nas variáveis `:root`
- `script.js` — apenas atualiza o ano do rodapé (`#year`)

Seções (âncoras usadas na navegação): `#inicio`, `#sobre`, `#projetos`, `#moodboard`, `#contato`.
Breakpoints: `900px` e `650px`. Há suporte a `prefers-reduced-motion` — preserve-o.

Publicado na Vercel via integração com o GitHub: `main` = produção; qualquer outro branch gera um Preview Deployment.

## Fluxo de trabalho (obrigatório)
1. Nunca commitar nem dar push direto em `main`.
2. Para cada pedido, criar um branch a partir de `main` atualizado (ex.: `feat/...`, `fix/...`).
3. Fazer as alterações preservando todas as funcionalidades e seções existentes.
4. Verificar antes de commitar: abrir `index.html` no Chromium (Playwright), em desktop (1366px) e celular (390px),
   sem erros no console, com todas as seções e links de navegação funcionando.
5. Commitar e dar push do branch → a Vercel gera uma URL de Preview para revisão.
6. Abrir um Pull Request para `main` apenas quando a Lorine pedir.
7. O merge em `main` (publicação em produção) é feito somente após a aprovação explícita da Lorine.
