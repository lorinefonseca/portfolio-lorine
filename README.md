# Portfólio Lorine Fonseca

Site estático (HTML, CSS e JavaScript, sem build) publicado na Vercel.

Direção visual: editorial anotado (notas à mão na margem) + botânica (janela em arco, gravuras antigas).

## Estrutura
- `index.html`: conteúdo. Seções: `#inicio`, `#sobre`, `#metodo` (processo, serviços, ferramentas e combinados), `#ia`, `#projetos`, `#contato`.
- `sobre-mim.html`: página "Conheça a Lo" (link no menu e no marcador flutuante), com os cadernos (`#moodboard`) e a trilha sonora (`#trilha`).
- Ícone da página: `favicon.ico` e `assets/icone-*.png` (borboleta).
- `styles.css`: estilos. Paleta e fontes nas variáveis `:root` no topo.
- `script.js`: ano do rodapé, notas da margem, frases dos cadernos e aparecer suave ao rolar.
- `assets/behance/`: capas dos projetos (do Behance da Lorine).
- `assets/botanica/`: gravuras botânicas recortadas (domínio público).
- `assets/aquarela/`: elementos em aquarela (flores, folhas, pétalas).
- `assets/objetos/`: terrário, borboleta, gato, gramofone, pássaros.
- `assets/fotos/`: fundos das seções de método e contato (da pasta "mysite" no Pinterest).
- `assets/texturas/papel.png`: textura de papel.

## Trilha sonora (Spotify)
No topo do `script.js`, a lista `TRACKS` tem as músicas da estante (título, artista e `spotify:track:ID`).
O player usa a API oficial do Spotify (IFrame API): o disco gira quando toca e para quando pausa.
As capas dos álbuns vêm do próprio Spotify (campo `cover`).

## Personalizar
- Projetos: cada card em `#projetos` é um link `<a class="work">` para o Behance.
- Frases dos cadernos: lista `phrases` em `script.js`.
- WhatsApp: botão flutuante `.whatsapp` no fim do `index.html` e do `sobre-mim.html`.
- Cards que viram (`flip.js`): qualquer `.flip` com `.flip-front` e `.flip-back` vira ao clicar (mola, inclinação e brilho). Usado nos princípios, nas etapas, nos trabalhos e nos passatempos.
- Efeitos de texto (`script.js`): títulos se datilografam letra por letra (Text Type), "lo faz · ..." em loop (`.typer`) e assinaturas desenhadas à mão (`.handwrite`).
- Fichário (método): abas `.tab` e botões `.turn` viram as páginas; cada página dupla é um `.spread`.
- Cursor de borboleta com rastro pontilhado: imagem em `assets/objetos/borboleta-cursor.webp` (aparece só em computador).
- Tela de abertura: `.loader` no início do `index.html` (aparece uma vez por visita).

## Créditos das imagens
Todas as ilustrações botânicas são de domínio público, via Wikimedia Commons:
- Orquídea: *Cattleya mossiae*, Edwards's Botanical Register, vol. 26, pl. 58 (1840).
- Heléboro: *Helleborus niger* (1797).
- Romã: *Punica granatum*, Köhler's Medizinal-Pflanzen, pl. 110 (1887).
- Lírio: *Lilium martagon*, P.-J. Redouté, Les Liliacées, vol. 3, t. 146.
- Papoula: *Papaver somniferum*, O. W. Thomé, Flora von Deutschland (1885).
- Borboleta e prancha de frutos: Maria Sibylla Merian, Metamorphosis insectorum Surinamensium (1705).

Efeito de chuva no vidro (`rain.js`): shader "Rain" de ittybitty (https://ittybitty.dev), licença MIT.
Textura de papel: "Natural Paper", Transparent Textures (transparenttextures.com).
Aquarelas, terrário, borboleta vinho, gato e gramofone: imagens enviadas pela Lorine.
Fotografias de fundo: referências salvas pela Lorine no Pinterest; confirme os direitos de uso antes de publicar ou troque por fotos autorais.
