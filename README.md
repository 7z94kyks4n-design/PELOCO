# PELOCO

Site oficial do PELOCO: [7z94kyks4n-design.github.io/PELOCO](https://7z94kyks4n-design.github.io/PELOCO/).

Da Família à Comunidade. Construído publicamente. Crescendo organicamente.

## Estrutura

- `index.html`: estrutura pública, metadados, header e footer.
- `styles.css`: design system responsivo em navy, dourado e creme.
- `app.js`: rotas hash, conteúdo PT/EN/ES, FLOCK, dados e interações.
- `PELOCO_MANIFESTO_*_2026.pdf`: documentos oficiais em PT e EN.
- `tools/generate_manifestos.py`: fonte e gerador dos dois PDFs.
- `tools/update_live_data.py`: coleta pública on-chain e de mercado.
- `data/live.json`: snapshot atual com fonte e timestamp.
- `data/history.json`: série histórica iniciada com snapshots reais.

## Dados públicos

O site nunca preenche dados ausentes com estimativas:

- holders e holdings declaradas: Solana JSON-RPC, pelo programa Token-2022;
- Creator Address, Bonding Curve e estado de migração: Pump.fun;
- preço, liquidez, volume e Market Cap de pares DEX: DexScreener, quando existir um par confirmado.

O workflow `update-live-data.yml` consulta as fontes a cada hora. O navegador verifica o snapshot automaticamente e rejeita dados com mais de três horas. O histórico registra apenas consultas reais; o gráfico só aparece depois de existirem dados suficientes.

## Validação local

```bash
python3 tools/update_live_data.py
python3 tools/generate_manifestos.py
node --check app.js
python3 -m json.tool data/live.json
python3 -m json.tool data/history.json
```

Sirva a raiz por HTTP e valide Home, rotas, idiomas, menu, PDFs, cópia, links externos e os oito frames do FLOCK. As larguras mínimas de QA são 320, 360, 375, 390, 430, 768, 1024 e 1440 px.

## Publicação

A branch `main` é a fonte pública do GitHub Pages. Depois de cada alteração:

1. testar localmente;
2. publicar em `main`;
3. aguardar o Pages;
4. validar a URL pública com cache limpo;
5. conferir novamente mobile, desktop, PDFs, links, idiomas e FLOCK.

Nenhum dado pessoal da pessoa criadora deve ser publicado. Transparência aqui significa informações do projeto, fontes públicas e endereços on-chain declarados.
