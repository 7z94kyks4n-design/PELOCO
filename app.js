      const TOKEN = "HprAo1GwX5ezFSp7yaYTeAhkj5pCjXVgs2mwRXjqpump";
      const CREATOR_WALLETS = [
        "FG7w73eqj4VaB4Yxj8KmBrUuSin4jv9vhxhmeqdaFZj2",
        "BGAmHnySzhRd25ikw7Xpgf2P3DJuHJhaU79tuucgkTmG",
        "2BvMhRQS3bghmgJav8sbnGXfh1UqcKwrJPTPAaRSHrEk",
      ];
      const CREATOR_ADDRESS = "BGAmHnySzhRd25ikw7Xpgf2P3DJuHJhaU79tuucgkTmG";
      const CURVE = "CjesdxRmP3ncNpnSzLxabPw3AAiVts2HEKH7i3nbK262";
      const links = {
        pump: "https://pump.fun/coin/" + TOKEN,
        dex: "https://dexscreener.com/solana/" + TOKEN,
        token: "https://solscan.io/token/" + TOKEN,
        creator: "https://solscan.io/account/" + CREATOR_ADDRESS,
        curve: "https://solscan.io/account/" + CURVE,
        binance:
          "https://app.binance.com/uni-qr/web3-token-details?utm_medium=share&tokenCA=" +
          TOKEN +
          "&binanceChainId=CT_501&chain=sol",
      };
      const ORBIS_RESIDENTS = [
        { name: "PELOCO", src: "orbis-peloco.webp", role: ["Protagonista", "Protagonist", "Protagonista"], species: ["Pintinho", "Chick", "Pollito"] },
        { name: "Vulpira", src: "orbis-vulpira.webp", role: ["Inteligência e coragem", "Insight and courage", "Ingenio y coraje"], species: ["Raposa", "Fox", "Zorra"] },
        { name: "Fidelis", src: "orbis-fidelis.webp", role: ["Lealdade e cuidado", "Loyalty and care", "Lealtad y cuidado"], species: ["Cão", "Dog", "Perro"] },
        { name: "Anatis", src: "orbis-anatis.webp", role: ["Curiosidade e movimento", "Curiosity and motion", "Curiosidad y movimiento"], species: ["Pato", "Duck", "Pato"] },
        { name: "Porcellus", src: "orbis-porcellus.webp", role: ["Alegria e abundância", "Joy and abundance", "Alegría y abundancia"], species: ["Porco", "Pig", "Cerdo"] },
        { name: "Noctua", src: "orbis-noctua.webp", role: ["Sabedoria e observação", "Wisdom and observation", "Sabiduría y observación"], species: ["Coruja", "Owl", "Búho"] },
      ];
      const copy = {
        pt: {
          nav: [
            "INÍCIO",
            "IDEIA",
            "MANIFESTO",
            "TRANSPARÊNCIA",
            "CONSTRUÇÃO",
            "VERIFICAR",
            "ATUALIZAÇÕES",
            "FLOCK",
            "COMUNIDADE",
            "VISÃO",
            "RISCOS",
            "PRIVACIDADE",
          ],
          footer: "Construído publicamente. Crescendo organicamente.",
          home: {
            ey: "Do zero à construção",
            title: "Da família à <span>comunidade.</span>",
            lead: "PELOCO é uma memecoin na Solana nascida de uma história familiar e construída publicamente — com transparência, crescimento orgânico e visão de longo prazo.",
          },
          idea: {
            title: "Uma ideia pequena. Uma visão de longo prazo.",
            lead: "O PELOCO começou com algo simples: família. Inspirado nos sobrinhos do criador, o que era pessoal se tornou uma ideia maior — construir uma comunidade real ao redor de uma identidade própria.",
          },
        },
        en: {
          nav: [
            "HOME",
            "IDEA",
            "MANIFESTO",
            "TRANSPARENCY",
            "BUILDING",
            "VERIFY",
            "UPDATES",
            "FLOCK",
            "COMMUNITY",
            "VISION",
            "RISKS",
            "PRIVACY",
          ],
          footer: "Built publicly. Growing organically.",
          home: {
            ey: "From zero to building",
            title: "From family to <span>community.</span>",
            lead: "PELOCO is a Solana memecoin born from a family story and built in public — with transparency, organic growth, and a long-term vision.",
          },
          idea: {
            title: "A small idea. A long-term vision.",
            lead: "PELOCO started with something simple: family. Inspired by the creator’s nieces and nephews, something personal became a bigger idea — building a real community around an identity of its own.",
          },
        },
        es: {
          nav: [
            "INICIO",
            "IDEA",
            "MANIFIESTO",
            "TRANSPARENCIA",
            "CONSTRUCCIÓN",
            "VERIFICAR",
            "ACTUALIZACIONES",
            "FLOCK",
            "COMUNIDAD",
            "VISIÓN",
            "RIESGOS",
            "PRIVACIDAD",
          ],
          footer: "Construido públicamente. Creciendo orgánicamente.",
          home: {
            ey: "De cero a la construcción",
            title: "De la familia a la <span>comunidad.</span>",
            lead: "PELOCO es una memecoin en Solana nacida de una historia familiar y construida públicamente, con transparencia, crecimiento orgánico y visión a largo plazo.",
          },
          idea: {
            title: "Una pequeña idea. Una visión a largo plazo.",
            lead: "PELOCO comenzó con algo sencillo: la familia. Inspirado en los sobrinos del creador, algo personal se convirtió en una idea mayor: construir una comunidad real alrededor de una identidad propia.",
          },
        },
      };
      const supportedLangs = ["pt", "en", "es"];
      let savedLang = "pt";
      try {
        savedLang = localStorage.getItem("peloco-lang") || "pt";
      } catch {}
      let lang = supportedLangs.includes(savedLang) ? savedLang : "pt";
      let marketTimer = null;
      let liveDataTimer = null;
      const tr = (pt, en, es) => ({ pt, en, es })[lang];
      const shell = (x) =>
        `<section class="page"><div class="shell">${x}</div></section>`;
      const head = (ey, title, lead = "") =>
        `<div class="section-head"><span class="eyebrow">${ey}</span><h2>${title}</h2>${lead ? `<p class="lead">${lead}</p>` : ""}</div>`;
      const status = (kind, pt, en, es) =>
        `<span class="status ${kind}">${tr(pt, en, es || en)}</span>`;
      const card = (n, t, p, tag = "") =>
        `<article class="card">${n ? `<div class="number">${n}</div>` : ""}${tag}<h3>${t}</h3><p class="muted">${p}</p></article>`;
      function home() {
        const t = copy[lang].home;
        return shell(
          `<div class="hero"><div><span class="eyebrow">${t.ey}</span><h1 class="hero-title">${t.title}</h1><p class="lead">${t.lead}</p><div class="actions"><a class="btn primary" href="#/idea">${tr("Explorar PELOCO", "Explore PELOCO", "Explorar PELOCO")} →</a><a class="btn" href="#/manifesto">${tr("Ler o Manifesto", "Read the Manifesto", "Leer el Manifiesto")}</a><a class="btn subtle-link" href="#/verify">${tr("Verificar on-chain", "Verify on-chain", "Verificar on-chain")}</a><a class="btn subtle-link" href="#/flock">${tr("Entrar na FLOCK", "Join the FLOCK", "Entrar en FLOCK")}</a></div></div><div class="hero-art"><img src="peloco-manifesto-cutout.webp" width="1254" height="1254" decoding="async" alt="${tr("PELOCO, o pequeno pintinho amarelo com corrente e medalha dourada", "PELOCO, the little yellow chick with a gold chain and medal", "PELOCO, el pequeño pollito amarillo con cadena y medalla dorada")}"><div class="pulse"><i></i>${tr("Construção pública", "Building in public", "Construcción pública")}</div></div></div><div class="stats"><div class="stat"><strong>Solana</strong><span>${tr("Rede", "Network", "Red")}</span></div><div class="stat"><strong>1B PELOCO</strong><span>${tr("Supply total", "Total Supply", "Supply total")}</span></div><div class="stat"><strong data-holders>—</strong><span>${tr("Proprietários on-chain", "On-chain owners", "Propietarios on-chain")}</span><small>${tr("Carregando dados on-chain…", "Loading on-chain data…", "Cargando datos on-chain…")}</small></div><div class="stat"><strong data-market="cap">—</strong><span>Market Cap</span><small>DexScreener</small></div></div><p class="stats-note">${tr("Carregando a contagem de proprietários únicos com saldo positivo, incluindo contas técnicas.", "Loading the count of unique positive-balance owners, including technical accounts.", "Cargando el recuento de propietarios únicos con saldo positivo, incluidas las cuentas técnicas.")}</p>`,
        );
      }
      function idea() {
        const t = copy[lang].idea;
        const pts = {
          pt: [
            [
              "ORIGEM",
              "Começou como uma homenagem familiar, inspirada nos sobrinhos do criador.",
            ],
            [
              "POR QUE EXISTE",
              "Para começar pequeno, construir publicamente e crescer organicamente.",
            ],
            [
              "DA FAMÍLIA",
              "Uma ideia pessoal, simples e cheia de significado.",
            ],
            [
              "À COMUNIDADE",
              "Uma identidade e uma história que podem evoluir com o tempo.",
            ],
          ],
          en: [
            [
              "ORIGIN",
              "It began as a family tribute, inspired by the creator’s nieces and nephews.",
            ],
            [
              "WHY IT EXISTS",
              "To start small, build publicly, and grow organically.",
            ],
            ["FROM FAMILY", "A personal, simple idea full of meaning."],
            [
              "TO COMMUNITY",
              "An identity and a story that can evolve over time.",
            ],
          ],
          es: [
            [
              "ORIGEN",
              "Comenzó como un homenaje familiar, inspirado en los sobrinos del creador.",
            ],
            [
              "POR QUÉ EXISTE",
              "Para comenzar en pequeño, construir públicamente y crecer de forma orgánica.",
            ],
            [
              "DE LA FAMILIA",
              "Una idea personal, sencilla y llena de significado.",
            ],
            [
              "A LA COMUNIDAD",
              "Una identidad y una historia que pueden evolucionar con el tiempo.",
            ],
          ],
        }[lang];
        return shell(
          head(tr("A ideia", "The idea", "La idea"), t.title, t.lead) +
            `<div class="flow">${pts.map((x) => card("", x[0], x[1])).join("")}</div><blockquote class="quote">${tr("Não queremos parecer maiores do que somos. Queremos construir até realmente sermos maiores.", "We do not want to appear bigger than we are. We want to build until we truly become bigger.", "No queremos parecer más grandes de lo que somos. Queremos construir hasta llegar a ser realmente más grandes.")}</blockquote>`,
        );
      }
      const manifestoPts = {
        pt: [
          [
            "A ORIGEM",
            "O PELOCO começou com algo simples: família. Inspirado nos sobrinhos do criador, o que nasceu como homenagem se tornou uma ideia maior: construir uma comunidade que possa crescer com o tempo.",
          ],
          [
            "POR QUE O PELOCO EXISTE",
            "Para começar pequeno, construir publicamente e crescer organicamente. Mais do que um token, queremos uma identidade, uma comunidade e uma história em evolução.",
          ],
          [
            "O QUE QUEREMOS CONSTRUIR",
            "Um projeto que qualquer pessoa possa acompanhar, verificar e compreender, com transparência, responsabilidade, liberdade de decisão e continuidade.",
          ],
          [
            "NOSSO COMPROMISSO COM O LONGO PRAZO",
            "Não podemos garantir o futuro. Podemos mostrar a direção por meio do trabalho, das decisões e do histórico construído publicamente.",
          ],
          [
            "INDEPENDÊNCIA DO PROJETO",
            "O PELOCO não está sendo construído para ser vendido ou transferido a terceiros. Crescer não significa vender. Crescer significa construir mais.",
          ],
          [
            "CRESCIMENTO ORGÂNICO",
            "Não compraremos holders nem fabricaremos atividade, volume, engajamento, comunidade ou hype. Preferimos uma comunidade pequena e real a uma grande e artificial.",
          ],
          [
            "A COMUNIDADE",
            "A comunidade não pertence ao criador. Cada pessoa é livre para comprar, vender, manter, acompanhar ou simplesmente não participar, sem pressão ou confiança cega.",
          ],
          [
            "O CRIADOR E SUAS HOLDINGS",
            "O PELOCO está distribuído em três carteiras declaradas. Como os saldos mudam, a participação agregada atual deve ser consultada no snapshot on-chain datado da página Transparência. Permanecer abaixo de 5%, alcançar 4,8%–4,9% e realizar um lock de dois anos são planos ainda não implementados.",
          ],
          [
            "CREATOR FEES E REINVESTIMENTO",
            "A intenção é sustentar o trabalho por Creator Fees, não pela venda das holdings. Quando houver capacidade, parte poderá ser reinvestida em desenvolvimento, infraestrutura, conteúdo e operações.",
          ],
          [
            "PUBLIC RESERVE",
            "Estrutura planejada, separada das carteiras pessoais e abaixo de 6% do supply. Ainda não foi implementada e seu mecanismo deverá ser divulgado antes da implementação.",
          ],
          [
            "TRANSPARÊNCIA E VERIFICABILIDADE",
            "Transparência significa permitir verificação: holdings, liquidez, transações relevantes, decisões, atualizações e histórico devem ser públicos quando aplicável.",
          ],
          [
            "FATO, INDÍCIO E INTERPRETAÇÃO",
            "Fato deve ser apresentado como fato. Indício como indício. Interpretação como interpretação. Expectativa nunca deve ser transformada em certeza.",
          ],
          [
            "COMO LER ESTE MANIFESTO",
            "O documento distingue claramente o que existe hoje, o que está sendo construído e o que está planejado. Intenção não é implementação; meta não é previsão.",
          ],
          [
            "O QUE EXISTE HOJE",
            "Supply total de 1 bilhão, rede Solana, token identificável on-chain, presença pública, comunidade inicial e três carteiras declaradas do criador.",
          ],
          [
            "O QUE ESTÁ SENDO CONSTRUÍDO",
            "Identidade, comunidade, presença pública, transparência, documentação, histórico e uma estrutura pública de acompanhamento.",
          ],
          [
            "O QUE ESTÁ PLANEJADO",
            "Holdings do criador abaixo de 5%, alvo de 4,8%–4,9%, lock de dois anos, Public Reserve abaixo de 6% e mecanismos públicos de transparência.",
          ],
          [
            "NOSSA VISÃO DE CRESCIMENTO",
            "As metas de 1.000, 5.000 e 12.000 holders nos anos 1, 2 e 3 são aspiracionais. Não são previsões nem garantias.",
          ],
          [
            "NOSSA AMBIÇÃO",
            "A ambição de alcançar aproximadamente R$ 90 bilhões de market cap representa a escala da visão, não uma previsão de preço ou promessa de retorno.",
          ],
          [
            "SE O PELOCO CRESCER",
            "Mais comunidade deve significar mais responsabilidade. Mais recursos, mais transparência. Mais visibilidade, mais cuidado. Mais escala, mais estrutura.",
          ],
          [
            "O QUE NÃO PROMETEMOS",
            "Não prometemos lucro, valorização, retorno, preço mínimo, market cap, número de holders, ausência de perdas, ausência de riscos ou sucesso.",
          ],
          [
            "NÃO PRECISA CONFIAR CEGAMENTE",
            "Leia. Questione. Verifique. Observe. Compare. Acompanhe o histórico e tome sua própria decisão.",
          ],
          [
            "NOSSO COMPROMISSO",
            "Construir publicamente, crescer organicamente, respeitar a liberdade da comunidade, não fabricar sucesso e não apresentar planos como fatos.",
          ],
          [
            "RESUMO DOS PRINCIPAIS COMPROMISSOS",
            "Supply total de 1 bilhão e três carteiras declaradas existentes; participação agregada publicada como dado dinâmico e datado; limites, lock e Public Reserve identificados como planejados.",
          ],
          [
            "A REGRA",
            "REGRA → NÚMERO → MECANISMO → PROVA. Se existe uma afirmação importante, queremos explicar e permitir sua verificação.",
          ],
          [
            "CONCLUSÃO",
            "Começamos pequenos. Não sabemos exatamente até onde podemos chegar, mas sabemos como queremos construir: com verdade, responsabilidade, estrutura e continuidade.",
          ],
        ],
        en: [
          [
            "THE ORIGIN",
            "PELOCO started with something simple: family. Inspired by the creator’s nieces and nephews, a tribute became a larger idea: a community that can grow over time.",
          ],
          [
            "WHY PELOCO EXISTS",
            "To start small, build publicly, and grow organically. More than a token, we want an identity, a community, and an evolving story.",
          ],
          [
            "WHAT WE WANT TO BUILD",
            "A project anyone can follow, verify, and understand, grounded in transparency, responsibility, freedom of choice, and continuity.",
          ],
          [
            "OUR LONG-TERM COMMITMENT",
            "We cannot guarantee the future. We can show our direction through work, decisions, and a track record built in public.",
          ],
          [
            "PROJECT INDEPENDENCE",
            "PELOCO is not being built to be sold or transferred to a third party. Growing does not mean selling. Growing means building more.",
          ],
          [
            "ORGANIC GROWTH",
            "We will not buy holders or manufacture activity, volume, engagement, community, or hype. We prefer a small real community to a large artificial one.",
          ],
          [
            "THE COMMUNITY",
            "The community does not belong to the creator. Everyone is free to buy, sell, hold, follow, or not participate, without pressure or blind trust.",
          ],
          [
            "THE CREATOR AND THEIR HOLDINGS",
            "PELOCO is held across three declared wallets. Because balances change, the current aggregate share must be checked in the dated on-chain snapshot on the Transparency page. Staying below 5%, reaching 4.8%–4.9%, and a two-year lock are plans, not active mechanisms.",
          ],
          [
            "CREATOR FEES AND REINVESTMENT",
            "The intention is to support the work through Creator Fees rather than selling holdings. When possible, resources may be reinvested in development, infrastructure, content, and operations.",
          ],
          [
            "PUBLIC RESERVE",
            "A planned structure separate from personal wallets and below 6% of supply. It is not implemented, and its mechanism must be disclosed before implementation.",
          ],
          [
            "TRANSPARENCY AND VERIFIABILITY",
            "Transparency means enabling verification: holdings, liquidity, relevant transactions, decisions, updates, and track record should be public when applicable.",
          ],
          [
            "FACT, INDICATION, AND INTERPRETATION",
            "A fact is a fact. An indication is an indication. An interpretation is an interpretation. Expectation must never become certainty.",
          ],
          [
            "HOW TO READ THIS MANIFESTO",
            "The document clearly separates what exists today, what is being built, and what is planned. An intention is not an implementation; a goal is not a forecast.",
          ],
          [
            "WHAT EXISTS TODAY",
            "A Total Supply of 1 billion, Solana network, identifiable on-chain token, public presence, an initial community, and three declared creator wallets.",
          ],
          [
            "WHAT IS BEING BUILT",
            "Identity, community, public presence, transparency, documentation, track record, and a public tracking structure.",
          ],
          [
            "WHAT IS PLANNED",
            "Creator holdings below 5%, a 4.8%–4.9% target, a two-year lock, a Public Reserve below 6%, and public transparency mechanisms.",
          ],
          [
            "OUR GROWTH VISION",
            "Targets of 1,000, 5,000, and 12,000 holders in years 1, 2, and 3 are aspirational. They are not forecasts or guarantees.",
          ],
          [
            "OUR AMBITION",
            "The ambition of approximately R$90 billion market cap represents the scale of the vision, not a price forecast or return promise.",
          ],
          [
            "IF PELOCO GROWS",
            "More community should mean more responsibility. More resources, more transparency. More visibility, more care. More scale, more structure.",
          ],
          [
            "WHAT WE DO NOT PROMISE",
            "We do not promise profit, appreciation, returns, a minimum price, market cap, holder count, absence of losses, absence of risk, or success.",
          ],
          [
            "YOU DO NOT NEED TO TRUST BLINDLY",
            "Read. Question. Verify. Observe. Compare. Follow the track record and make your own decision.",
          ],
          [
            "OUR COMMITMENT",
            "Build publicly, grow organically, respect community freedom, never manufacture success, and never present plans as facts.",
          ],
          [
            "SUMMARY OF KEY COMMITMENTS",
            "An existing Total Supply of 1 billion and three declared wallets; aggregate position published as dated dynamic data; limits, lock, and Public Reserve identified as planned.",
          ],
          [
            "THE RULE",
            "RULE → NUMBER → MECHANISM → PROOF. If a claim matters, we want to explain it and make it verifiable.",
          ],
          [
            "CONCLUSION",
            "We started small. We do not know exactly how far we can go, but we know how we want to build: with truth, responsibility, structure, and continuity.",
          ],
        ],
        es: [
          [
            "EL ORIGEN",
            "PELOCO comenzó con algo sencillo: la familia. Inspirado en los sobrinos del creador, un homenaje se convirtió en una idea mayor: construir una comunidad que pueda crecer con el tiempo.",
          ],
          [
            "POR QUÉ EXISTE PELOCO",
            "Para comenzar en pequeño, construir públicamente y crecer de forma orgánica. Más que un token, queremos una identidad, una comunidad y una historia en evolución.",
          ],
          [
            "LO QUE QUEREMOS CONSTRUIR",
            "Un proyecto que cualquier persona pueda seguir, verificar y comprender, basado en transparencia, responsabilidad, libertad de decisión y continuidad.",
          ],
          [
            "NUESTRO COMPROMISO A LARGO PLAZO",
            "No podemos garantizar el futuro. Podemos mostrar nuestra dirección mediante el trabajo, las decisiones y un historial construido públicamente.",
          ],
          [
            "INDEPENDENCIA DEL PROYECTO",
            "PELOCO no se está construyendo para ser vendido o transferido a terceros. Crecer no significa vender. Crecer significa construir más.",
          ],
          [
            "CRECIMIENTO ORGÁNICO",
            "No compraremos holders ni fabricaremos actividad, volumen, interacción, comunidad o hype. Preferimos una comunidad pequeña y real a una grande y artificial.",
          ],
          [
            "LA COMUNIDAD",
            "La comunidad no pertenece al creador. Cada persona es libre de comprar, vender, mantener, acompañar o no participar, sin presión ni confianza ciega.",
          ],
          [
            "EL CREADOR Y SUS HOLDINGS",
            "PELOCO está distribuido en tres carteras declaradas. Como los saldos cambian, la participación agregada actual debe consultarse en la captura on-chain fechada de la página Transparencia. Mantenerse por debajo del 5%, alcanzar entre 4,8% y 4,9% y realizar un bloqueo de dos años son planes aún no implementados.",
          ],
          [
            "CREATOR FEES Y REINVERSIÓN",
            "La intención es sostener el trabajo mediante Creator Fees, no con la venta de holdings. Cuando exista capacidad, una parte podrá reinvertirse en desarrollo, infraestructura, contenido y operaciones.",
          ],
          [
            "PUBLIC RESERVE",
            "Estructura planificada, separada de las carteras personales y por debajo del 6% del supply. Todavía no se ha implementado y su mecanismo deberá publicarse antes de la implementación.",
          ],
          [
            "TRANSPARENCIA Y VERIFICABILIDAD",
            "Transparencia significa permitir la verificación: holdings, liquidez, transacciones relevantes, decisiones, actualizaciones e historial deben ser públicos cuando corresponda.",
          ],
          [
            "HECHO, INDICIO E INTERPRETACIÓN",
            "Un hecho debe presentarse como hecho. Un indicio como indicio. Una interpretación como interpretación. Una expectativa nunca debe convertirse en certeza.",
          ],
          [
            "CÓMO LEER ESTE MANIFIESTO",
            "El documento distingue claramente lo que existe hoy, lo que se está construyendo y lo que está planificado. Una intención no es una implementación; una meta no es una previsión.",
          ],
          [
            "LO QUE EXISTE HOY",
            "Supply total de mil millones, red Solana, token identificable on-chain, presencia pública, comunidad inicial y tres carteras declaradas del creador.",
          ],
          [
            "LO QUE SE ESTÁ CONSTRUYENDO",
            "Identidad, comunidad, presencia pública, transparencia, documentación, historial y una estructura pública de seguimiento.",
          ],
          [
            "LO QUE ESTÁ PLANIFICADO",
            "Holdings del creador por debajo del 5%, objetivo entre 4,8% y 4,9%, bloqueo de dos años, Public Reserve por debajo del 6% y mecanismos públicos de transparencia.",
          ],
          [
            "NUESTRA VISIÓN DE CRECIMIENTO",
            "Las metas de 1.000, 5.000 y 12.000 holders en los años 1, 2 y 3 son aspiracionales. No son previsiones ni garantías.",
          ],
          [
            "NUESTRA AMBICIÓN",
            "La ambición de alcanzar aproximadamente R$ 90 mil millones de capitalización representa la escala de la visión, no una previsión de precio ni una promesa de retorno.",
          ],
          [
            "SI PELOCO CRECE",
            "Más comunidad debe significar más responsabilidad. Más recursos, más transparencia. Más visibilidad, más cuidado. Más escala, más estructura.",
          ],
          [
            "LO QUE NO PROMETEMOS",
            "No prometemos ganancias, valorización, retorno, precio mínimo, capitalización, cantidad de holders, ausencia de pérdidas, ausencia de riesgos o éxito.",
          ],
          [
            "NO NECESITAS CONFIAR CIEGAMENTE",
            "Lee. Cuestiona. Verifica. Observa. Compara. Sigue el historial y toma tu propia decisión.",
          ],
          [
            "NUESTRO COMPROMISO",
            "Construir públicamente, crecer de forma orgánica, respetar la libertad de la comunidad, no fabricar éxito y no presentar planes como hechos.",
          ],
          [
            "RESUMEN DE LOS PRINCIPALES COMPROMISOS",
            "Supply total de mil millones y tres carteras declaradas existentes; posición agregada publicada como dato dinámico y fechado; límites, bloqueo y Public Reserve identificados como planificados.",
          ],
          [
            "LA REGLA",
            "REGLA → NÚMERO → MECANISMO → PRUEBA. Si una afirmación es importante, queremos explicarla y permitir su verificación.",
          ],
          [
            "CONCLUSIÓN",
            "Comenzamos en pequeño. No sabemos exactamente hasta dónde podemos llegar, pero sabemos cómo queremos construir: con verdad, responsabilidad, estructura y continuidad.",
          ],
        ],
      };
      function manifesto() {
        const intro = {
          pt: {
            title: "Um manifesto para ser lido, sentido e verificado.",
            lead: "A origem familiar é a alma do PELOCO. Este documento registra os princípios que transformam uma ideia pequena em uma construção pública.",
            quote:
              "Não prometemos risco zero. Prometemos tornar os riscos visíveis.",
            open: "Abrir cada parte",
            viewPt: "Visualizar em português",
            viewEn: "Visualizar em inglês",
            downPt: "Baixar PDF em português",
            downEn: "Baixar PDF em inglês",
            official: "Documento oficial • edição 2026",
            ready:
              "Escolha visualizar no navegador ou baixar o arquivo PDF completo.",
            soul: "A alma do PELOCO, parte por parte.",
            parts: "partes",
          },
          en: {
            title: "A manifesto to be read, felt, and verified.",
            lead: "Family origin is the soul of PELOCO. This document records the principles that turn a small idea into public building.",
            quote:
              "We do not promise zero risk. We promise to make the risks visible.",
            open: "Open each part",
            viewPt: "View in Portuguese",
            viewEn: "View in English",
            downPt: "Download Portuguese PDF",
            downEn: "Download English PDF",
            official: "Official document • 2026 edition",
            ready:
              "Choose to view in your browser or download the complete PDF file.",
            soul: "The soul of PELOCO, part by part.",
            parts: "parts",
          },
          es: {
            title: "Un manifiesto para leer, sentir y verificar.",
            lead: "El origen familiar es el alma de PELOCO. Este documento registra los principios que transforman una pequeña idea en una construcción pública.",
            quote:
              "No prometemos riesgo cero. Prometemos hacer visibles los riesgos.",
            open: "Abrir cada parte",
            viewPt: "Ver en portugués",
            viewEn: "Ver en inglés",
            downPt: "Descargar PDF en portugués",
            downEn: "Descargar PDF en inglés",
            official: "Documento oficial • edición 2026",
            ready:
              "Elige verlo en el navegador o descargar el archivo PDF completo.",
            soul: "El alma de PELOCO, parte por parte.",
            parts: "partes",
          },
        }[lang];
        const pdfActions = (file, viewLabel, downloadLabel) =>
          `<div class="pdf-actions"><a class="btn primary" href="${file}?v=20260907-2" target="_blank" rel="noopener noreferrer">${viewLabel} ↗</a><a class="btn" href="${file}?v=20260907-2" download="${file}">${downloadLabel} ↓</a></div>`;
        return shell(
          head(
            tr("Manifesto", "Manifesto", "Manifiesto"),
            intro.title,
            intro.lead,
          ) +
            `<div class="manifesto-intro"><img class="manifesto-cover" src="PELOCO_MANIFESTO_CAPA_2026.png" width="910" height="1287" decoding="async" alt="${tr("PELOCO — capa editorial do Manifesto", "PELOCO — Manifesto editorial cover", "PELOCO — portada editorial del Manifiesto")}"><div class="manifesto-statement"><span class="eyebrow">${intro.official}</span><blockquote class="quote">${intro.quote}</blockquote><p class="muted">${intro.ready}</p><div class="download-row">${pdfActions("PELOCO_MANIFESTO_PT_2026.pdf", intro.viewPt, intro.downPt)}${pdfActions("PELOCO_MANIFESTO_EN_2026.pdf", intro.viewEn, intro.downEn)}</div><p class="pdf-help">${tr("No iPhone, “Visualizar” abre o PDF em outra aba; “Baixar” permite salvá-lo pelo menu de compartilhamento do Safari.", "On iPhone, “View” opens the PDF in a new tab; “Download” lets you save it using Safari’s share menu.", "En iPhone, “Ver” abre el PDF en otra pestaña; “Descargar” permite guardarlo desde el menú de compartir de Safari.")}</p></div></div><div class="section-head"><span class="eyebrow">25 ${intro.parts}</span><h2>${intro.soul}</h2><p class="muted">${intro.open}</p></div><div class="manifesto-list">${manifestoPts[lang].map((x, i) => `<details${i === 0 ? " open" : ""}><summary><span class="number">${String(i + 1).padStart(2, "0")}</span><strong>${x[0]}</strong></summary><div class="manifesto-body"><p>${x[1]}</p></div></details>`).join("")}</div>`,
        );
      }
      function marketPanel() {
        return `<section class="market-live" aria-labelledby="marketTitle"><div class="market-live-head"><h3 id="marketTitle">${tr("Dados de mercado", "Market data", "Datos de mercado")}</h3><a class="market-source" href="${links.dex}" target="_blank" rel="noopener noreferrer">${tr("Fonte pública: DexScreener", "Public source: DexScreener", "Fuente pública: DexScreener")} ↗</a></div><div class="market-grid"><div class="market-item"><strong data-market="price">—</strong><span>${tr("Preço em USD", "Price in USD", "Precio en USD")}</span></div><div class="market-item"><strong data-market="cap">—</strong><span>Market Cap</span></div><div class="market-item"><strong data-market="liquidity">—</strong><span>${tr("Liquidez", "Liquidity", "Liquidez")}</span></div><div class="market-item"><strong data-market="change">—</strong><span>${tr("Variação em 24h", "24h change", "Variación en 24h")}</span></div><div class="market-item"><strong data-market="volume">—</strong><span>${tr("Volume em 24h", "24h volume", "Volumen en 24h")}</span></div></div><p class="market-status" data-market-activity>${tr("Compras e vendas em 24h: aguardando um par DEX confirmado.", "24h buys and sells: waiting for a confirmed DEX pair.", "Compras y ventas en 24h: esperando un par DEX confirmado.")}</p><p class="market-status" data-pump-source>${tr("Avaliação da Bonding Curve: aguardando snapshot da Pump.fun…", "Bonding Curve valuation: waiting for the Pump.fun snapshot…", "Valoración de la Bonding Curve: esperando la captura de Pump.fun…")}</p><p class="market-status" id="marketStatus" role="status" aria-live="polite">${tr("Carregando dados públicos…", "Loading public data…", "Cargando datos públicos…")}</p></section>`;
      }
      function marketHistoryPanel() {
        return `<section class="market-live" aria-labelledby="marketHistoryTitle"><div class="market-live-head"><h3 id="marketHistoryTitle">${tr("Histórico de preço e volume", "Price and volume history", "Historial de precio y volumen")}</h3><span class="market-source">7D · DexScreener · UTC</span></div><div id="marketHistory" class="history-plot" role="img" aria-label="${tr("Gráficos baseados em snapshots reais de preço e volume", "Charts based on real price and volume snapshots", "Gráficos basados en capturas reales de precio y volumen")}"><p class="market-status">${tr("A coleta começará quando existir um par DEX confirmado. Nenhum histórico é estimado.", "Collection will begin when a DEX pair is confirmed. No history is estimated.", "La recopilación comenzará cuando exista un par DEX confirmado. No se estima ningún historial.")}</p></div></section>`;
      }
      function creatorHoldingsPanel() {
        return `<section class="technical-data creator-holdings" aria-labelledby="creatorHoldingsTitle"><span class="eyebrow">${tr("Holdings declaradas", "Declared holdings", "Holdings declaradas")}</span><h3 id="creatorHoldingsTitle">${tr("Três carteiras declaradas", "Three declared wallets", "Tres carteras declaradas")}</h3><p class="muted">${tr("Saldos calculados on-chain. Estas carteiras declaradas não são automaticamente o Creator Address do token.", "Balances calculated on-chain. These declared wallets are not automatically the token Creator Address.", "Saldos calculados on-chain. Estas carteras declaradas no son automáticamente el Creator Address del token.")}</p><p class="market-status" data-bonding-status>${tr("Status da Bonding Curve: consultando a Pump.fun…", "Bonding Curve status: checking Pump.fun…", "Estado de la Bonding Curve: consultando Pump.fun…")}</p><div class="market-grid">${CREATOR_WALLETS.map((wallet, index) => `<div class="market-item"><strong data-creator-balance="${index}">—</strong><span>${tr("Carteira declarada", "Declared wallet", "Cartera declarada")} ${index + 1}</span></div>`).join("")}<div class="market-item"><strong data-creator-aggregate>—</strong><span>${tr("Total agregado confirmado", "Confirmed aggregate total", "Total agregado confirmado")}</span></div></div><p class="market-status" data-creator-status>${tr("Consultando o snapshot on-chain…", "Checking the on-chain snapshot…", "Consultando la captura on-chain…")}</p></section>`;
      }
      function holdersHistoryPanel() {
        return `<section class="market-live holders-history" aria-labelledby="holdersHistoryTitle"><div class="market-live-head"><h3 id="holdersHistoryTitle">${tr("Histórico de proprietários on-chain", "On-chain owner history", "Historial de propietarios on-chain")}</h3><span class="market-source">7D · ${tr("Fonte on-chain", "On-chain source", "Fuente on-chain")} · UTC</span></div><div id="holdersHistory" class="history-plot" role="img" aria-label="${tr("Gráfico do histórico real de proprietários on-chain", "Chart of real on-chain owner history", "Gráfico del historial real de propietarios on-chain")}"><p class="market-status">${tr("Coleta de snapshots reais iniciada. O gráfico aparecerá após três registros.", "Collection of real snapshots has started. The chart will appear after three records.", "La recopilación de capturas reales ha comenzado. El gráfico aparecerá después de tres registros.")}</p></div></section>`;
      }
      function transparency() {
        return shell(
          head(
            tr("Transparência", "Transparency", "Transparencia"),
            tr(
              "Não confie cegamente. Verifique.",
              "Do not trust blindly. Verify.",
              "No confíes ciegamente. Verifica.",
            ),
            tr(
              "Os dados abaixo são referências públicas do projeto. Dados atuais, informações técnicas e planos estão separados com clareza.",
              "The data below are public project references. Current data, technical information, and plans are clearly separated.",
              "Los datos siguientes son referencias públicas del proyecto. Los datos actuales, la información técnica y los planes están claramente separados.",
            ),
          ) +
            `<div class="stats"><div class="stat"><strong>Solana</strong><span>${tr("Rede", "Network", "Red")}</span></div><div class="stat"><strong>1B PELOCO</strong><span>${tr("Supply total", "Total Supply", "Supply total")}</span></div><div class="stat"><strong data-holders>—</strong><span>${tr("Proprietários on-chain", "On-chain owners", "Propietarios on-chain")}</span><small>${tr("Carregando dados on-chain…", "Loading on-chain data…", "Cargando datos on-chain…")}</small></div><div class="stat"><strong data-market="cap">—</strong><span>Market Cap</span><small>DexScreener</small></div></div><p class="stats-note">${tr("Carregando a contagem de proprietários únicos com saldo positivo, incluindo contas técnicas.", "Loading the count of unique positive-balance owners, including technical accounts.", "Cargando el recuento de propietarios únicos con saldo positivo, incluidas las cuentas técnicas.")}</p><div class="grid">${card("", tr("Existe hoje", "Exists today", "Existe hoy"), tr("Token identificável on-chain, supply total definido, presença pública, comunidade inicial e três carteiras declaradas do criador.", "On-chain identifiable token, defined total supply, public presence, initial community, and three declared creator wallets.", "Token identificable on-chain, supply total definido, presencia pública, comunidad inicial y tres carteras declaradas del creador."), status("exists", "EXISTE HOJE", "EXISTS TODAY", "EXISTE HOY"))}${card("", tr("Em construção", "Being built", "En construcción"), tr("Identidade, comunidade, documentação, histórico e estrutura pública de acompanhamento.", "Identity, community, documentation, track record, and a public tracking structure.", "Identidad, comunidad, documentación, historial y una estructura pública de seguimiento."), status("building", "EM CONSTRUÇÃO", "BEING BUILT", "EN CONSTRUCCIÓN"))}${card("", tr("Planejado — ainda não implementado", "Planned — not yet implemented", "Planificado — aún no implementado"), tr("Metas futuras: holdings agregadas do criador abaixo de 5%, lock de 2 anos e Public Reserve abaixo de 6%. Os mecanismos ainda serão divulgados e verificados.", "Future goals: aggregate creator holdings below 5%, a 2-year lock, and a Public Reserve below 6%. The mechanisms are yet to be disclosed and verified.", "Metas futuras: holdings agregadas del creador por debajo del 5%, bloqueo de 2 años y Public Reserve por debajo del 6%. Los mecanismos aún deberán publicarse y verificarse."), status("planned", "PLANEJADO", "PLANNED", "PLANIFICADO"))}</div>${marketPanel()}${marketHistoryPanel()}${creatorHoldingsPanel()}${holdersHistoryPanel()}<section class="technical-data"><span class="eyebrow">${tr("Dados técnicos", "Technical data", "Datos técnicos")}</span><div class="data-row"><strong>${tr("Endereço do token", "Token address", "Dirección del token")}</strong><code>${TOKEN}</code><a class="btn" href="${links.token}" target="_blank" rel="noopener noreferrer">Solscan ↗</a></div><div class="data-row"><strong>Bonding curve</strong><code>${CURVE}</code><a class="btn" href="${links.curve}" target="_blank" rel="noopener noreferrer">Solscan ↗</a></div></section>`,
        );
      }
      function building() {
        const topics = {
          pt: [
            "Identidade",
            "Comunidade",
            "Presença pública",
            "Documentação",
            "Transparência",
            "Histórico",
          ],
          en: [
            "Identity",
            "Community",
            "Public presence",
            "Documentation",
            "Transparency",
            "Track record",
          ],
          es: [
            "Identidad",
            "Comunidad",
            "Presencia pública",
            "Documentación",
            "Transparencia",
            "Historial",
          ],
        }[lang];
        return shell(
          head(
            tr(
              "Construção pública",
              "Building in public",
              "Construcción pública",
            ),
            tr(
              "O que estamos construindo.",
              "What we are building.",
              "Lo que estamos construyendo.",
            ),
            tr(
              "Credibilidade deve ser construída por execução e histórico — não por aparência.",
              "Credibility must be built through execution and track record — not appearance.",
              "La credibilidad debe construirse mediante ejecución e historial, no por apariencia.",
            ),
          ) +
            `<div class="grid">${topics.map((topic, i) => card(String(i + 1).padStart(2, "0"), topic, tr("Desenvolvimento progressivo, público e verificável.", "Progressive, public, and verifiable development.", "Desarrollo progresivo, público y verificable."), status("building", "EM CONSTRUÇÃO", "BEING BUILT", "EN CONSTRUCCIÓN"))).join("")}</div><blockquote class="quote">${tr("Crescimento deve ser construído, não comprado.", "Growth should be built, not bought.", "El crecimiento debe construirse, no comprarse.")}</blockquote>`,
        );
      }
      function verify() {
        const label = tr("Copiar", "Copy", "Copiar");
        const walletRows = CREATOR_WALLETS.map(
          (wallet, index) =>
            `<div class="data-row"><strong>${tr("Carteira declarada", "Declared holdings wallet", "Cartera declarada")} ${index + 1}</strong><code>${wallet}</code><span class="wallet-actions"><button class="btn copy" data-copy="${wallet}">${label}</button><a class="btn" href="https://solscan.io/account/${wallet}" target="_blank" rel="noopener noreferrer">Solscan ↗</a></span></div>`,
        ).join("");
        return shell(
          head(
            tr(
              "Verificação on-chain",
              "On-chain verification",
              "Verificación on-chain",
            ),
            tr(
              "Verifique PELOCO nas fontes públicas.",
              "Verify PELOCO through public sources.",
              "Verifica PELOCO en fuentes públicas.",
            ),
            tr(
              "Use os endereços e links oficiais abaixo. Sempre confira antes de qualquer interação.",
              "Use the official addresses and links below. Always check before any interaction.",
              "Utiliza las direcciones y enlaces oficiales. Compruébalos siempre antes de cualquier interacción.",
            ),
          ) +
            `<div class="card"><div class="data-row"><strong>Token</strong><code>${TOKEN}</code><button class="btn copy" data-copy="${TOKEN}">${label}</button></div><div class="data-row"><strong>Creator Address</strong><code>${CREATOR_ADDRESS}</code><span class="wallet-actions"><button class="btn copy" data-copy="${CREATOR_ADDRESS}">${label}</button><a class="btn" href="${links.creator}" target="_blank" rel="noopener noreferrer">Solscan ↗</a></span></div>${walletRows}<div class="data-row"><strong>Bonding curve</strong><code>${CURVE}</code><a class="btn" href="${links.curve}" target="_blank" rel="noopener noreferrer">Solscan ↗</a></div></div><p class="build-note">${tr("As três carteiras são apresentadas separadamente. Os saldos e o percentual agregado são calculados no snapshot on-chain datado da página Transparência.", "The three wallets are shown separately. Their balances and aggregate percentage are calculated in the dated on-chain snapshot on the Transparency page.", "Las tres carteras se muestran por separado. Sus saldos y el porcentaje agregado se calculan en la captura on-chain fechada de la página Transparencia.")}</p><div class="link-list verify-links">${[
              ["Pump.fun", links.pump],
              ["DexScreener", links.dex],
              ["Solscan — Token", links.token],
              ["Solscan — Bonding Curve", links.curve],
              ["Binance Wallet", links.binance],
            ]
              .map(
                (x) =>
                  `<a class="verify-link" href="${x[1]}" target="_blank" rel="noopener noreferrer"><span>${x[0]}</span><span>↗</span></a>`,
              )
              .join(
                "",
              )}</div><p class="build-note">${tr("A Binance pode abrir a tela geral da Wallet dependendo do aparelho. Nesse caso, pesquise usando o CA oficial mostrado acima. O PELOCO não está listado na corretora Binance.", "Binance may open the general Wallet screen depending on the device. If it does, search using the official CA shown above. PELOCO is not listed on the Binance exchange.", "Binance puede abrir la pantalla general de Wallet según el dispositivo. En ese caso, busca usando el CA oficial que aparece arriba. PELOCO no está listado en el exchange Binance.")}</p>`,
        );
      }
      function updates() {
        const events = {
          pt: [
            ["DIA 1", "LANÇAMENTO", "Marco inicial registrado."],
            ["DIA 4", "PEQUENOS PASSOS", "Evolução inicial registrada."],
            ["DIA 6", "REGISTRO PÚBLICO", "Início da documentação pública."],
          ],
          en: [
            ["DAY 1", "LAUNCH", "Initial milestone recorded."],
            ["DAY 4", "SMALL STEPS", "Early progress recorded."],
            ["DAY 6", "PUBLIC RECORD", "Public documentation began."],
          ],
          es: [
            ["DÍA 1", "LANZAMIENTO", "Hito inicial registrado."],
            ["DÍA 4", "PEQUEÑOS PASOS", "Progreso inicial registrado."],
            ["DÍA 6", "REGISTRO PÚBLICO", "Inicio de la documentación pública."],
          ],
        }[lang];
        return shell(
          head(
            tr("Atualizações", "Updates", "Actualizaciones"),
            tr(
              "Um histórico que cresce com o projeto.",
              "A track record that grows with the project.",
              "Un historial que crece con el proyecto.",
            ),
            tr(
              "Somente acontecimentos registrados. Sem preencher lacunas com eventos inventados.",
              "Recorded events only. No invented updates to fill gaps.",
              "Solo acontecimientos registrados. Sin llenar vacíos con eventos inventados.",
            ),
          ) +
            `<div class="timeline">${events.map((x) => `<article class="card event"><div class="number">${x[0]}</div><h3>${x[1]}</h3><p class="muted">${x[2]}</p></article>`).join("")}</div><p class="build-note">${tr("O histórico não preenche dias sem registro. Novos marcos e detalhes só serão acrescentados quando houver informação real e verificável.", "The history does not fill unrecorded days. New milestones and details will be added only when real, verifiable information exists.", "El historial no rellena días sin registro. Solo se añadirán nuevos hitos y detalles cuando exista información real y verificable.")}</p>`,
        );
      }
      function flock() {
        const t = {
          pt: {
            title: "Seu PELOCO. Seu jeito.",
            lead: "A FLOCK está se transformando em um estúdio de avatar. Gire o PELOCO, escolha uma identidade e acompanhe a construção das primeiras roupas.",
            hint: "Arraste para girar",
            choose: "Escolha o estilo",
            base: "PELOCO original",
            ready: "Disponível",
            soon: "Em desenvolvimento",
            gestures: "Gestos e emoções oficiais",
            gallery: "ORBIS PELOCI · Habitantes",
            residents: "Animais conscientes de um mesmo universo. PELOCO é o protagonista; cada integrante tem espécie, personalidade e papel próprios.",
            doctor: "Médico",
            builder: "Construtor",
            surfer: "Surfista",
          },
          en: {
            title: "Your PELOCO. Your way.",
            lead: "FLOCK is becoming an avatar studio. Rotate PELOCO, choose an identity, and follow the creation of the first outfits.",
            hint: "Drag to rotate",
            choose: "Choose a style",
            base: "Original PELOCO",
            ready: "Available",
            soon: "In development",
            gestures: "Official gestures and emotions",
            gallery: "ORBIS PELOCI · Residents",
            residents: "Conscious animals from one shared universe. PELOCO is the protagonist; every resident has a distinct species, personality, and role.",
            doctor: "Doctor",
            builder: "Builder",
            surfer: "Surfer",
          },
          es: {
            title: "Tu PELOCO. Tu estilo.",
            lead: "FLOCK se está convirtiendo en un estudio de avatares. Gira a PELOCO, elige una identidad y acompaña la creación de los primeros trajes.",
            hint: "Arrastra para girar",
            choose: "Elige el estilo",
            base: "PELOCO original",
            ready: "Disponible",
            soon: "En desarrollo",
            gestures: "Gestos y emociones oficiales",
            gallery: "ORBIS PELOCI · Habitantes",
            residents: "Animales conscientes de un mismo universo. PELOCO es el protagonista; cada integrante tiene su propia especie, personalidad y función.",
            doctor: "Médico",
            builder: "Constructor",
            surfer: "Surfista",
          },
        }[lang];
        return shell(
          head("FLOCK • AVATAR STUDIO", t.title, t.lead) +
            `<div class="flock-studio"><div class="avatar-stage"><div class="avatar-view" id="avatarView" role="slider" aria-label="${tr("Rotação 360 graus do PELOCO. Use as setas esquerda e direita.", "PELOCO 360-degree rotation. Use the left and right arrow keys.", "Rotación de 360 grados de PELOCO. Usa las flechas izquierda y derecha.")}" aria-valuemin="0" aria-valuemax="7" aria-valuenow="0" aria-valuetext="${tr("frente", "front", "frente")}" tabindex="0"><img id="avatarFrame" src="peloco-360-v2-0.webp" alt="" draggable="false" decoding="async" width="384" height="512"></div><div class="rotate-controls"><button type="button" id="rotateLeft" aria-label="${tr("Girar para a esquerda", "Rotate left", "Girar a la izquierda")}">←</button><span class="rotate-hint">↔ ${t.hint}</span><button type="button" id="rotateRight" aria-label="${tr("Girar para a direita", "Rotate right", "Girar a la derecha")}">→</button></div></div><div class="studio-panel"><section class="studio-card"><span class="eyebrow">360°</span><h3>${t.choose}</h3><div class="choice-grid"><button class="avatar-choice active" type="button"><strong>🐣 ${t.base}</strong><span>${t.ready}</span></button><button class="avatar-choice" type="button" disabled><strong>🩺 ${t.doctor}</strong><span>${t.soon}</span></button><button class="avatar-choice" type="button" disabled><strong>🏗️ ${t.builder}</strong><span>${t.soon}</span></button><button class="avatar-choice" type="button" disabled><strong>🏄 ${t.surfer}</strong><span>${t.soon}</span></button></div><p class="build-note">${tr("Cada roupa será criada sobre o mesmo avatar oficial e validada em todos os ângulos antes de ser liberada.", "Every outfit will use the same official avatar and be validated from every angle before release.", "Cada traje se creará sobre el mismo avatar oficial y se validará desde todos los ángulos antes de su lanzamiento.")}</p></section><section class="studio-card"><span class="eyebrow">${t.gestures}</span><img class="expression-sheet" src="peloco-expressions.webp" alt="${tr("PELOCO em oito gestos e emoções oficiais", "PELOCO in eight official gestures and emotions", "PELOCO en ocho gestos y emociones oficiales")}" loading="lazy" decoding="async" width="1536" height="1024"></section></div></div><section class="orbis-section" aria-labelledby="orbisTitle"><div class="section-head"><span class="eyebrow">${t.gallery}</span><h2 id="orbisTitle">ORBIS PELOCI</h2><p>${t.residents}</p></div><div class="orbis-gallery">${ORBIS_RESIDENTS.map((resident) => { const localeIndex = { pt: 0, en: 1, es: 2 }[lang]; return `<figure class="orbis-resident"><img src="${resident.src}" loading="lazy" decoding="async" width="1024" height="1024" alt="${resident.name}, ${resident.species[localeIndex]} — ORBIS PELOCI"><figcaption><strong>${resident.name}</strong><span>${resident.species[localeIndex]} · ${resident.role[localeIndex]}</span></figcaption></figure>`; }).join("")}</div></section>`,
        );
      }
      function community() {
        return shell(
          head(
            tr("Comunidade", "Community", "Comunidad"),
            tr(
              "A comunidade não pertence ao criador.",
              "The community does not belong to the creator.",
              "La comunidad no pertenece al creador.",
            ),
            tr(
              "Cada pessoa é livre para analisar, questionar, acompanhar, participar — ou não participar.",
              "Everyone is free to analyze, question, follow, participate — or not participate.",
              "Cada persona es libre de analizar, cuestionar, acompañar, participar o no participar.",
            ),
          ) +
            `<div class="grid">${card("01", tr("Liberdade", "Freedom", "Libertad"), tr("Sem pressão e sem confiança cega. Cada decisão é individual.", "No pressure and no blind trust. Every decision is individual.", "Sin presión y sin confianza ciega. Cada decisión es individual."))}${card("02", tr("Verdade", "Truth", "Verdad"), tr("Não fabricamos atividade, volume, engajamento ou comunidade.", "We do not manufacture activity, volume, engagement, or community.", "No fabricamos actividad, volumen, interacción o comunidad."))}${card("03", tr("Participação real", "Real participation", "Participación real"), tr("Preferimos uma comunidade pequena e verdadeira a uma grande e artificial.", "We prefer a small, real community to a large, artificial one.", "Preferimos una comunidad pequeña y auténtica a una grande y artificial."))}</div><div class="actions"><a class="btn primary" href="https://t.me/pelocochat" target="_blank" rel="noopener noreferrer">Telegram ↗</a><a class="btn" href="https://discord.gg/wnXxWjftUZ" target="_blank" rel="noopener noreferrer">Discord ↗</a><a class="btn" href="https://x.com/PelocoCoin" target="_blank" rel="noopener noreferrer">X ↗</a></div>`,
        );
      }
      function vision() {
        return shell(
          head(
            tr("Visão", "Vision", "Visión"),
            tr(
              "Crescer com mais responsabilidade.",
              "Grow with greater responsibility.",
              "Crecer con mayor responsabilidad.",
            ),
            tr(
              "Mais comunidade deve significar mais estrutura. Mais recursos, mais transparência. Mais visibilidade, mais cuidado.",
              "More community should mean more structure. More resources, more transparency. More visibility, more care.",
              "Más comunidad debe significar más estructura. Más recursos, más transparencia. Más visibilidad, más cuidado.",
            ),
          ) +
            `<div class="grid">${[1, 2, 3].map((year, i) => card("", `${tr("Ano", "Year", "Año")} ${year}`, ["1,000", "5,000", "12,000"][i] + " holders", status("planned", "META ASPIRACIONAL", "ASPIRATIONAL GOAL", "META ASPIRACIONAL"))).join("")}</div><blockquote class="quote">${tr("Esses números são metas aspiracionais — não previsões ou garantias.", "These numbers are aspirational goals — not forecasts or guarantees.", "Estas cifras son metas aspiracionales, no previsiones ni garantías.")}</blockquote>`,
        );
      }
      function risks() {
        const items = {
          pt: [
            "Perda total ou parcial",
            "Alta volatilidade",
            "Baixa liquidez",
            "Manipulação de mercado",
            "Riscos técnicos e de infraestrutura",
            "Riscos relacionados a carteiras e plataformas",
            "Ausência de garantia de sucesso",
          ],
          en: [
            "Partial or total loss",
            "High volatility",
            "Low liquidity",
            "Market manipulation",
            "Technical and infrastructure risks",
            "Wallet and platform risks",
            "No guarantee of success",
          ],
          es: [
            "Pérdida total o parcial",
            "Alta volatilidad",
            "Baja liquidez",
            "Manipulación de mercado",
            "Riesgos técnicos y de infraestructura",
            "Riesgos relacionados con carteras y plataformas",
            "Ausencia de garantía de éxito",
          ],
        }[lang];
        return shell(
          head(
            tr("Riscos", "Risks", "Riesgos"),
            tr(
              "Informação antes de participação.",
              "Information before participation.",
              "Información antes de participar.",
            ),
            tr(
              "Memecoins são ativos altamente especulativos. PELOCO não promete lucro, valorização, retorno financeiro ou ausência de perdas.",
              "Memecoins are highly speculative assets. PELOCO does not promise profit, appreciation, financial returns, or absence of losses.",
              "Las memecoins son activos altamente especulativos. PELOCO no promete ganancias, valorización, retorno financiero ni ausencia de pérdidas.",
            ),
          ) +
            `<div class="grid">${items.map((item, i) => card(String(i + 1).padStart(2, "0"), item, tr("Considere este risco antes de tomar qualquer decisão.", "Consider this risk before making any decision.", "Considera este riesgo antes de tomar cualquier decisión."))).join("")}</div><blockquote class="quote warning">${tr("Não prometemos risco zero. Prometemos tornar os riscos visíveis.", "We do not promise zero risk. We promise to make the risks visible.", "No prometemos riesgo cero. Prometemos hacer visibles los riesgos.")}</blockquote>`,
        );
      }
      function privacy() {
        return shell(
          head(
            tr("Privacidade", "Privacy", "Privacidad"),
            tr(
              "A identidade pessoal da pessoa criadora permanece privada.",
              "The creator’s personal identity remains private.",
              "La identidad personal de la persona creadora permanece privada.",
            ),
            tr(
              "Transparência do projeto não exige exposição de nome, localização, endereço IP ou outros dados pessoais.",
              "Project transparency does not require exposing a name, location, IP address, or other personal data.",
              "La transparencia del proyecto no exige exponer nombre, ubicación, dirección IP u otros datos personales.",
            ),
          ) +
            `<div class="grid">${card("01", tr("Anonimato da pessoa criadora", "Creator anonymity", "Anonimato de la persona creadora"), tr("O site publica apenas informações do projeto e endereços públicos on-chain declarados. Não publica identidade civil, localização, IP ou contato pessoal.", "The site publishes only project information and declared public on-chain addresses. It does not publish civil identity, location, IP address, or personal contact details.", "El sitio publica únicamente información del proyecto y direcciones públicas on-chain declaradas. No publica identidad civil, ubicación, dirección IP ni contacto personal."))}${card("02", tr("Sem rastreamento próprio", "No first-party tracking", "Sin rastreo propio"), tr("Não usamos analytics, pixels de publicidade, contas de usuário, cookies de rastreamento, geolocalização ou formulários de coleta de dados.", "We do not use analytics, advertising pixels, user accounts, tracking cookies, geolocation, or data-collection forms.", "No utilizamos analytics, píxeles publicitarios, cuentas de usuario, cookies de rastreo, geolocalización ni formularios de recopilación de datos."))}${card("03", tr("Serviços externos", "External services", "Servicios externos"), tr("Ao abrir dados de mercado ou links externos, o navegador se conecta ao respectivo serviço, sujeito às políticas dele. O site não envia a identidade da pessoa criadora.", "When market data or external links are opened, the browser connects to the relevant service under its policies. The site does not send the creator’s identity.", "Al abrir datos de mercado o enlaces externos, el navegador se conecta al servicio correspondiente y a sus políticas. El sitio no envía la identidad de la persona creadora."))}</div><blockquote class="quote">${tr("Privacidade pessoal. Transparência on-chain.", "Personal privacy. On-chain transparency.", "Privacidad personal. Transparencia on-chain.")}</blockquote>`,
        );
      }
      const routes = {
        home,
        idea,
        manifesto,
        transparency,
        building,
        verify,
        updates,
        flock,
        community,
        vision,
        risks,
        privacy,
      };
      const routeKeys = [
        "home",
        "idea",
        "manifesto",
        "transparency",
        "building",
        "verify",
        "updates",
        "flock",
        "community",
        "vision",
        "risks",
        "privacy",
      ];
      function renderNav() {
        const labels = copy[lang].nav;
        const mobile = document.getElementById("mobileNav");
        const desktop = document.getElementById("desktopNav");
        mobile.innerHTML = routeKeys
          .map((r, i) => `<a href="#/${r}" data-route="${r}">${labels[i]}</a>`)
          .join("");
        document.querySelectorAll("[data-nav-index]").forEach((link) => {
          link.textContent = labels[Number(link.dataset.navIndex)];
        });
        document.querySelector("#navMore summary").textContent = tr(
          "MAIS",
          "MORE",
          "MÁS",
        );
        const language = document.getElementById("langSelect");
        language.value = lang;
        language.setAttribute(
          "aria-label",
          tr("Selecionar idioma", "Select language", "Seleccionar idioma"),
        );
        document
          .getElementById("menuBtn")
          .setAttribute(
            "aria-label",
            tr("Abrir menu", "Open menu", "Abrir menú"),
          );
        mobile.setAttribute(
          "aria-label",
          tr("Navegação móvel", "Mobile navigation", "Navegación móvil"),
        );
        desktop.setAttribute(
          "aria-label",
          tr("Navegação principal", "Main navigation", "Navegación principal"),
        );
        document
          .querySelector(".brand")
          .setAttribute("aria-label", `PELOCO — ${labels[0]}`);
        document.querySelector('[data-t="skip"]').textContent = tr(
          "Pular para o conteúdo",
          "Skip to content",
          "Saltar al contenido",
        );
      }
      async function setupHolderHistory() {
        const host = document.getElementById("holdersHistory");
        if (!host) return;
        try {
          const response = await fetch(`data/history.json?t=${Date.now()}`, {
            cache: "no-store",
            referrerPolicy: "no-referrer",
          });
          if (!response.ok) throw new Error("history response");
          const history = await response.json();
          const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const points = Array.isArray(history?.snapshots)
            ? history.snapshots
                .map((item) => ({
                  time: new Date(item?.checkedAt).getTime(),
                  value: Number(item?.holders),
                }))
                .filter(
                  (item) =>
                    Number.isFinite(item.time) &&
                    item.time >= cutoff &&
                    Number.isInteger(item.value) &&
                    item.value >= 0,
                )
            : [];
          if (points.length < 3) return;
          const minTime = Math.min(...points.map((item) => item.time));
          const maxTime = Math.max(...points.map((item) => item.time));
          const minValue = Math.min(...points.map((item) => item.value));
          const maxValue = Math.max(...points.map((item) => item.value));
          const timeRange = Math.max(1, maxTime - minTime);
          const valueRange = Math.max(1, maxValue - minValue);
          const coordinates = points
            .map((item) => {
              const x = 42 + ((item.time - minTime) / timeRange) * 516;
              const y = 166 - ((item.value - minValue) / valueRange) * 126;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(" ");
          const locale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[lang];
          const firstDate = new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date(minTime));
          const lastDate = new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date(maxTime));
          host.innerHTML = `<svg viewBox="0 0 600 210" aria-hidden="true" focusable="false"><line x1="42" y1="166" x2="558" y2="166"></line><polyline points="${coordinates}"></polyline><text x="42" y="194">${firstDate}</text><text x="558" y="194" text-anchor="end">${lastDate}</text><text x="42" y="28">${maxValue.toLocaleString(locale)}</text><text x="42" y="158">${minValue.toLocaleString(locale)}</text></svg><p class="market-status">${tr(`Último valor: ${points.at(-1).value.toLocaleString(locale)} proprietários on-chain · ${points.length} snapshots reais.`, `Latest value: ${points.at(-1).value.toLocaleString(locale)} on-chain owners · ${points.length} real snapshots.`, `Último valor: ${points.at(-1).value.toLocaleString(locale)} propietarios on-chain · ${points.length} capturas reales.`)}</p>`;
        } catch {
          host.innerHTML = `<p class="market-status">${tr("Histórico temporariamente indisponível.", "History temporarily unavailable.", "Historial temporalmente no disponible.")}</p>`;
        }
      }

      async function setupMarketHistory() {
        const host = document.getElementById("marketHistory");
        if (!host) return;
        try {
          const response = await fetch(`data/history.json?t=${Date.now()}`, {
            cache: "no-store",
            referrerPolicy: "no-referrer",
          });
          if (!response.ok) throw new Error("market history response");
          const history = await response.json();
          const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
          const points = (Array.isArray(history?.snapshots)
            ? history.snapshots
            : []
          )
            .map((item) => ({
              time: new Date(item?.checkedAt).getTime(),
              price: Number(item?.priceUsd),
              volume: Number(item?.volume24h),
            }))
            .filter(
              (item) =>
                Number.isFinite(item.time) &&
                item.time >= cutoff &&
                Number.isFinite(item.price) &&
                item.price > 0 &&
                Number.isFinite(item.volume) &&
                item.volume >= 0,
            );
          if (points.length < 3) return;
          const locale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[lang];
          const chart = (key, label, formatter) => {
            const values = points.map((item) => item[key]);
            const min = Math.min(...values);
            const max = Math.max(...values);
            const first = points[0].time;
            const last = points.at(-1).time;
            const timeRange = Math.max(1, last - first);
            const valueRange = Math.max(Number.EPSILON, max - min);
            const coordinates = points
              .map((item) => {
                const x = 34 + ((item.time - first) / timeRange) * 532;
                const y = 150 - ((item[key] - min) / valueRange) * 112;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              })
              .join(" ");
            return `<figure><figcaption>${label}</figcaption><svg viewBox="0 0 600 180" aria-hidden="true" focusable="false"><line x1="34" y1="150" x2="566" y2="150"></line><polyline points="${coordinates}"></polyline><text x="34" y="24">${formatter(max)}</text><text x="34" y="144">${formatter(min)}</text></svg><p class="market-status">${tr("Último valor", "Latest value", "Último valor")}: ${formatter(values.at(-1))}</p></figure>`;
          };
          const money = (value, compact = false) =>
            new Intl.NumberFormat(locale, {
              style: "currency",
              currency: "USD",
              notation: compact ? "compact" : "standard",
              maximumFractionDigits: compact ? 2 : Number(value) < 0.01 ? 8 : 4,
            }).format(value);
          host.innerHTML = `<div class="market-history-grid">${chart("price", tr("Preço em USD", "Price in USD", "Precio en USD"), (value) => money(value))}${chart("volume", tr("Volume em 24h", "24h volume", "Volumen en 24h"), (value) => money(value, true))}</div><p class="market-status">${points.length} ${tr("snapshots reais · sem estimativas", "real snapshots · no estimates", "capturas reales · sin estimaciones")}.</p>`;
        } catch {
          host.innerHTML = `<p class="market-status">${tr("Histórico de mercado temporariamente indisponível.", "Market history temporarily unavailable.", "Historial de mercado temporalmente no disponible.")}</p>`;
        }
      }

      async function setupLiveData() {
        const holderNodes = document.querySelectorAll("[data-holders]");
        if (!holderNodes.length) return;
        holderNodes.forEach((node) => {
          const label = node.closest(".stat")?.querySelector("span");
          if (label)
            label.textContent = tr(
              "Proprietários on-chain",
              "On-chain owners",
              "Propietarios on-chain",
            );
        });
        const setHolderText = (value) =>
          holderNodes.forEach((node) => {
            node.textContent = value;
          });
        const setHolderDetails = (source, message) => {
          holderNodes.forEach((node) => {
            const card = node.closest(".stat");
            const detail = card?.querySelector("small");
            if (detail) detail.textContent = source;
          });
          document.querySelectorAll(".stats-note").forEach((node) => {
            if (node.closest("main")) node.textContent = message;
          });
        };
        setHolderDetails(
          tr(
            "Carregando dados on-chain…",
            "Loading on-chain data…",
            "Cargando datos on-chain…",
          ),
          tr(
            "Carregando a contagem de proprietários únicos com saldo positivo, incluindo contas técnicas.",
            "Loading the count of unique positive-balance owners, including technical accounts.",
            "Cargando el recuento de propietarios únicos con saldo positivo, incluidas las cuentas técnicas.",
          ),
        );
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          const response = await fetch(`data/live.json?t=${Date.now()}`, {
            cache: "no-store",
            referrerPolicy: "no-referrer",
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("snapshot response");
          const snapshot = await response.json();
          const checkedAt = new Date(snapshot?.checkedAt);
          const age = Date.now() - checkedAt.getTime();
          const holders = Number(snapshot?.onChain?.uniquePositiveOwners);
          const valid =
            snapshot?.mint === TOKEN &&
            Number.isInteger(holders) &&
            holders >= 0 &&
            Number.isFinite(age) &&
            age >= 0 &&
            age <= 3 * 60 * 60 * 1000;
          if (!valid) throw new Error("stale snapshot");
          const locale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[lang];
          const updated = `${new Intl.DateTimeFormat(locale, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "UTC",
          }).format(checkedAt)} UTC`;
          setHolderText(holders.toLocaleString(locale));
          const pump = snapshot?.pumpFun;
          const pumpMarketCap = Number(pump?.marketCapUsd);
          const pumpIsVerified =
            pump?.creatorAddress === CREATOR_ADDRESS &&
            pump?.bondingCurve === CURVE &&
            pump?.migrationComplete === false &&
            Number.isFinite(pumpMarketCap) &&
            pumpMarketCap > 0;
          if (pumpIsVerified) {
            const cap = new Intl.NumberFormat(locale, {
              style: "currency",
              currency: "USD",
              notation: "compact",
              maximumFractionDigits: 2,
            }).format(pumpMarketCap);
            const pumpSource = document.querySelector("[data-pump-source]");
            if (pumpSource)
              pumpSource.innerHTML = `${tr("Avaliação atual da Bonding Curve", "Current Bonding Curve valuation", "Valoración actual de la Bonding Curve")}: <strong>${cap}</strong> · Pump.fun · ${updated} · <a href="${links.pump}" target="_blank" rel="noopener noreferrer">${tr("verificar", "verify", "verificar")} ↗</a>`;
            const bondingStatus = document.querySelector(
              "[data-bonding-status]",
            );
            if (bondingStatus)
              bondingStatus.textContent = tr(
                `Bonding Curve em andamento; migração para DEX ainda não concluída. Fonte: Pump.fun · ${updated}.`,
                `Bonding Curve in progress; DEX migration not yet complete. Source: Pump.fun · ${updated}.`,
                `Bonding Curve en curso; la migración a DEX aún no se ha completado. Fuente: Pump.fun · ${updated}.`,
              );
          }
          const declared = snapshot?.onChain?.declaredWallets;
          const aggregate = snapshot?.onChain?.declaredAggregate;
          if (
            Array.isArray(declared) &&
            declared.length === CREATOR_WALLETS.length &&
            declared.every(
              (item, index) =>
                item?.address === CREATOR_WALLETS[index] &&
                Number.isFinite(Number(item?.balance)) &&
                Number.isFinite(Number(item?.sharePercent)),
            )
          ) {
            declared.forEach((item, index) => {
              const node = document.querySelector(
                `[data-creator-balance="${index}"]`,
              );
              if (node)
                node.textContent = `${Number(item.balance).toLocaleString(locale, { maximumFractionDigits: 2 })} PELOCO · ${Number(item.sharePercent).toLocaleString(locale, { maximumFractionDigits: 4 })}%`;
            });
            const aggregateNode = document.querySelector(
              "[data-creator-aggregate]",
            );
            if (aggregateNode && aggregate)
              aggregateNode.textContent = `${Number(aggregate.balance).toLocaleString(locale, { maximumFractionDigits: 2 })} PELOCO · ${Number(aggregate.sharePercent).toLocaleString(locale, { maximumFractionDigits: 4 })}%`;
            const creatorStatus = document.querySelector(
              "[data-creator-status]",
            );
            if (creatorStatus)
              creatorStatus.textContent = tr(
                `Fonte: Solana JSON-RPC · ${updated}. Atualização automática a cada hora.`,
                `Source: Solana JSON-RPC · ${updated}. Automatically updated hourly.`,
                `Fuente: Solana JSON-RPC · ${updated}. Actualización automática cada hora.`,
              );
          }
          setHolderDetails(
            tr(
              `Solana on-chain • ${updated}`,
              `Solana on-chain • ${updated}`,
              `Solana on-chain • ${updated}`,
            ),
            tr(
              "Contagem de proprietários únicos com saldo positivo, incluindo contas técnicas. Fonte: Solana JSON-RPC. Atualização automática a cada hora.",
              "Unique owners with a positive balance, including technical accounts. Source: Solana JSON-RPC. Automatically updated hourly.",
              "Propietarios únicos con saldo positivo, incluidas las cuentas técnicas. Fuente: Solana JSON-RPC. Actualización automática cada hora.",
            ),
          );
        } catch {
          setHolderText("—");
          const pumpSource = document.querySelector("[data-pump-source]");
          if (pumpSource)
            pumpSource.textContent = tr(
              "Avaliação da Bonding Curve temporariamente indisponível.",
              "Bonding Curve valuation temporarily unavailable.",
              "Valoración de la Bonding Curve temporalmente no disponible.",
            );
          const bondingStatus = document.querySelector(
            "[data-bonding-status]",
          );
          if (bondingStatus)
            bondingStatus.textContent = tr(
              "Status da Bonding Curve temporariamente indisponível.",
              "Bonding Curve status temporarily unavailable.",
              "Estado de la Bonding Curve temporalmente no disponible.",
            );
          document
            .querySelectorAll(
              "[data-creator-balance], [data-creator-aggregate]",
            )
            .forEach((node) => {
              node.textContent = "—";
            });
          const creatorStatus = document.querySelector(
            "[data-creator-status]",
          );
          if (creatorStatus)
            creatorStatus.textContent = tr(
              "Dados temporariamente indisponíveis.",
              "Data temporarily unavailable.",
              "Datos temporalmente no disponibles.",
            );
          setHolderDetails(
            tr(
              "Dados temporariamente indisponíveis",
              "Data temporarily unavailable",
              "Datos temporalmente no disponibles",
            ),
            tr(
              "O snapshot on-chain não está atual. Nenhum número antigo ou estimado será exibido.",
              "The on-chain snapshot is not current. No old or estimated number will be shown.",
              "La captura on-chain no está actualizada. No se mostrará ningún número antiguo ni estimado.",
            ),
          );
        }
        clearTimeout(timeout);
        setupHolderHistory();
        setupMarketHistory();
        clearInterval(liveDataTimer);
        liveDataTimer = setInterval(setupLiveData, 5 * 60 * 1000);
      }

      async function setupMarketData() {
        const status = document.getElementById("marketStatus");
        const activity = document.querySelector("[data-market-activity]");
        const resetMarket = () => {
          document.querySelectorAll("[data-market]").forEach((node) => {
            node.textContent = "—";
            node.classList.remove("positive", "negative");
          });
        };
        const setStatus = (message) => {
          if (status) status.textContent = message;
        };
        const setActivity = (message) => {
          if (activity) activity.textContent = message;
        };
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        try {
          const response = await fetch(
            `https://api.dexscreener.com/token-pairs/v1/solana/${TOKEN}`,
            { signal: controller.signal, referrerPolicy: "no-referrer" },
          );
          if (!response.ok) throw new Error("market response");
          const pairs = await response.json();
          const exactPairs = Array.isArray(pairs)
            ? pairs.filter(
                (item) =>
                  item?.chainId === "solana" &&
                  (item?.baseToken?.address === TOKEN ||
                    item?.quoteToken?.address === TOKEN) &&
                  Number(item?.priceUsd) > 0,
              )
            : [];
          const pair =
            exactPairs.sort(
              (a, b) =>
                Number(b?.liquidity?.usd || 0) -
                  Number(a?.liquidity?.usd || 0) ||
                Number(b?.volume?.h24 || 0) - Number(a?.volume?.h24 || 0),
            )[0] || null;
          if (!pair) {
            resetMarket();
            setActivity(
              tr(
                "Compras e vendas em 24h: aguardando um par DEX confirmado.",
                "24h buys and sells: waiting for a confirmed DEX pair.",
                "Compras y ventas en 24h: esperando un par DEX confirmado.",
              ),
            );
            setStatus(
              tr(
                "Nenhum par DEX confirmado. Preço, liquidez, volume e variação permanecem indisponíveis; a avaliação da Bonding Curve é exibida separadamente quando o snapshot da Pump.fun está atual.",
                "No confirmed DEX pair was found. Price, liquidity, volume, and change remain unavailable; the Bonding Curve valuation is shown separately when the Pump.fun snapshot is current.",
                "No se encontró un par DEX confirmado. Precio, liquidez, volumen y variación siguen sin estar disponibles; la valoración de la Bonding Curve se muestra por separado cuando la captura de Pump.fun está actualizada.",
              ),
            );
            return;
          }
          const locale = { pt: "pt-BR", en: "en-US", es: "es-ES" }[lang];
          const money = (value, compact = false) =>
            new Intl.NumberFormat(locale, {
              style: "currency",
              currency: "USD",
              notation: compact ? "compact" : "standard",
              maximumFractionDigits: compact ? 2 : Number(value) < 0.01 ? 8 : 4,
            }).format(Number(value));
          const set = (key, value) =>
            document
              .querySelectorAll(`[data-market="${key}"]`)
              .forEach((node) => {
                node.textContent = value;
              });
          set("price", money(pair.priceUsd));
          const marketCap = Number(pair.marketCap);
          set("cap", marketCap > 0 ? money(marketCap, true) : "—");
          const liquidity = Number(pair.liquidity?.usd);
          set(
            "liquidity",
            Number.isFinite(liquidity) && liquidity > 0
              ? money(liquidity, true)
              : "—",
          );
          const volume24h = Number(pair.volume?.h24);
          set(
            "volume",
            Number.isFinite(volume24h) && volume24h > 0
              ? money(volume24h, true)
              : "—",
          );
          const change = Number(pair.priceChange?.h24);
          const changeNodes = document.querySelectorAll(
            '[data-market="change"]',
          );
          if (Number.isFinite(change))
            changeNodes.forEach((changeNode) => {
              changeNode.textContent = `${change > 0 ? "+" : ""}${change.toLocaleString(locale, { maximumFractionDigits: 2 })}%`;
              changeNode.classList.add(change >= 0 ? "positive" : "negative");
            });
          const buys = Number(pair.txns?.h24?.buys);
          const sells = Number(pair.txns?.h24?.sells);
          setActivity(
            Number.isInteger(buys) && Number.isInteger(sells)
              ? tr(
                  `Transações em 24h: ${buys.toLocaleString(locale)} compras · ${sells.toLocaleString(locale)} vendas.`,
                  `24h transactions: ${buys.toLocaleString(locale)} buys · ${sells.toLocaleString(locale)} sells.`,
                  `Transacciones en 24h: ${buys.toLocaleString(locale)} compras · ${sells.toLocaleString(locale)} ventas.`,
                )
              : tr(
                  "Compras e vendas em 24h: dados indisponíveis.",
                  "24h buys and sells: data unavailable.",
                  "Compras y ventas en 24h: datos no disponibles.",
                ),
          );
          const updated = `${new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: "UTC",
          }).format(new Date())} UTC`;
          setStatus(
            tr(
              `Atualizado em ${updated}. Par priorizado por liquidez e volume.`,
              `Updated ${updated}. Pair prioritized by liquidity and volume.`,
              `Actualizado ${updated}. Par priorizado por liquidez y volumen.`,
            ),
          );
        } catch {
          resetMarket();
          setActivity(
            tr(
              "Compras e vendas em 24h: dados temporariamente indisponíveis.",
              "24h buys and sells: data temporarily unavailable.",
              "Compras y ventas en 24h: datos temporalmente no disponibles.",
            ),
          );
          setStatus(
            tr(
              "Dados temporariamente indisponíveis. Verifique diretamente no DexScreener.",
              "Data temporarily unavailable. Verify directly on DexScreener.",
              "Datos temporalmente no disponibles. Verifica directamente en DexScreener.",
            ),
          );
        } finally {
          clearTimeout(timeout);
          clearInterval(marketTimer);
          marketTimer = setInterval(setupMarketData, 60 * 1000);
        }
      }
      function setupFlock() {
        const viewer = document.getElementById("avatarView");
        if (!viewer) return;
        const frameCount = 8;
        const frameImage = document.getElementById("avatarFrame");
        let lastValidFrame = 0;
        for (let index = 0; index < frameCount; index += 1) {
          const preload = new Image();
          preload.src = `peloco-360-v2-${index}.webp`;
        }
        const angles = {
          pt: [
            "frente",
            "frente direita",
            "lado direito",
            "costas direita",
            "costas",
            "costas esquerda",
            "lado esquerdo",
            "frente esquerda",
          ],
          en: [
            "front",
            "front right",
            "right side",
            "back right",
            "back",
            "back left",
            "left side",
            "front left",
          ],
          es: [
            "frente",
            "frente derecha",
            "lado derecho",
            "espalda derecha",
            "espalda",
            "espalda izquierda",
            "lado izquierdo",
            "frente izquierda",
          ],
        }[lang];
        let frame = 0,
          startX = 0,
          dragFrame = 0;
        frameImage.addEventListener("load", () => {
          lastValidFrame = frame;
        });
        frameImage.addEventListener("error", () => {
          frame = lastValidFrame;
          const fallback = `peloco-360-v2-${lastValidFrame}.webp`;
          if (!frameImage.src.endsWith(fallback)) frameImage.src = fallback;
        });
        const show = (next) => {
          frame = (next + frameCount) % frameCount;
          frameImage.src = `peloco-360-v2-${frame}.webp`;
          viewer.setAttribute("aria-valuenow", String(frame));
          viewer.setAttribute("aria-valuetext", angles[frame]);
        };
        const rotate = (step) => show(frame + step);
        document
          .getElementById("rotateLeft")
          .addEventListener("click", () => rotate(-1));
        document
          .getElementById("rotateRight")
          .addEventListener("click", () => rotate(1));
        viewer.addEventListener("keydown", (event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            rotate(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            rotate(1);
          }
        });
        viewer.addEventListener("pointerdown", (event) => {
          startX = event.clientX;
          dragFrame = frame;
          viewer.classList.add("dragging");
          viewer.setPointerCapture(event.pointerId);
        });
        viewer.addEventListener("pointermove", (event) => {
          if (!viewer.hasPointerCapture(event.pointerId)) return;
          show(dragFrame + Math.round((startX - event.clientX) / 64));
        });
        const stop = (event) => {
          viewer.classList.remove("dragging");
          if (viewer.hasPointerCapture(event.pointerId))
            viewer.releasePointerCapture(event.pointerId);
        };
        viewer.addEventListener("pointerup", stop);
        viewer.addEventListener("pointercancel", stop);
        show(0);
      }
      function render() {
        clearInterval(marketTimer);
        clearInterval(liveDataTimer);
        marketTimer = null;
        liveDataTimer = null;
        const route = location.hash.replace("#/", "") || "home";
        const page =
          routes[route] ||
          (() =>
            shell(
              `<div class="error"><h2>404</h2><p>${tr("Esta página não existe.", "This page does not exist.", "Esta página no existe.")}</p><a class="btn primary" href="#/home">${tr("Voltar ao início", "Back to Home", "Volver al inicio")}</a></div>`,
            ));
        document.documentElement.lang = { pt: "pt-BR", en: "en", es: "es" }[
          lang
        ];
        document.getElementById("langSelect").value = lang;
        document.querySelector('[data-t="footer"]').textContent =
          copy[lang].footer;
        document.querySelector('[data-t="privacyLink"]').textContent =
          copy[lang].nav[11];
        const binanceLink = document.querySelector('[data-t="binanceLink"]');
        binanceLink.textContent = "Binance Wallet ↗";
        binanceLink.title = tr(
          "Pode abrir a tela geral da Binance Wallet; pesquise pelo CA oficial do PELOCO.",
          "May open the general Binance Wallet screen; search using PELOCO's official CA.",
          "Puede abrir la pantalla general de Binance Wallet; busca con el CA oficial de PELOCO.",
        );
        const content = document.getElementById("content");
        content.innerHTML = page();
        document
          .querySelectorAll(".orbis-gallery img, .expression-sheet")
          .forEach((image) => {
            image.decoding = "async";
          });
        document
          .querySelectorAll("[data-route]")
          .forEach((a) =>
            a.toggleAttribute("aria-current", a.dataset.route === route),
          );
        const moreRoutes = [
          "updates",
          "community",
          "vision",
          "risks",
          "privacy",
        ];
        document
          .getElementById("navMore")
          .classList.toggle("active", moreRoutes.includes(route));
        document.getElementById("navMore").removeAttribute("open");
        document.title = `${copy[lang].nav[routeKeys.indexOf(route)] || "404"} | PELOCO`;
        document.querySelectorAll("[data-copy]").forEach((btn) =>
          btn.addEventListener("click", async () => {
            const original = btn.textContent;
            let copied = false;
            try {
              await Promise.race([
                navigator.clipboard.writeText(btn.dataset.copy),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error("clipboard timeout")), 700),
                ),
              ]);
              copied = true;
            } catch {}
            if (!copied) {
              const field = document.createElement("textarea");
              field.value = btn.dataset.copy;
              field.setAttribute("readonly", "");
              field.className = "copy-fallback";
              document.body.appendChild(field);
              field.select();
              field.setSelectionRange(0, field.value.length);
              try {
                copied = document.execCommand("copy");
              } catch {}
              field.remove();
            }
            if (copied) {
              btn.textContent = tr("Copiado ✓", "Copied ✓", "Copiado ✓");
            } else {
              const code = btn.closest(".data-row")?.querySelector("code");
              if (code) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(code);
                selection.removeAllRanges();
                selection.addRange(range);
              }
              btn.textContent = tr(
                "Selecionado",
                "Selected",
                "Seleccionado",
              );
            }
            setTimeout(() => {
              btn.textContent = original;
            }, 1800);
          }),
        );
        if (route === "flock") setupFlock();
        if (route === "transparency" || route === "home") {
          setupLiveData();
          setupMarketData();
        }
        document.getElementById("mobileNav").classList.remove("open");
        document
          .getElementById("menuBtn")
          .setAttribute("aria-expanded", "false");
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
          content.focus({ preventScroll: true });
        });
      }
      document
        .getElementById("langSelect")
        .addEventListener("change", (event) => {
          lang = supportedLangs.includes(event.target.value)
            ? event.target.value
            : "pt";
          try {
            localStorage.setItem("peloco-lang", lang);
          } catch {}
          renderNav();
          render();
        });
      document.getElementById("menuBtn").addEventListener("click", (e) => {
        const nav = document.getElementById("mobileNav");
        nav.classList.toggle("open");
        e.currentTarget.setAttribute(
          "aria-expanded",
          nav.classList.contains("open"),
        );
      });
      document.getElementById("mobileNav").addEventListener("click", (e) => {
        if (!e.target.closest("a")) return;
        document.getElementById("mobileNav").classList.remove("open");
        document
          .getElementById("menuBtn")
          .setAttribute("aria-expanded", "false");
      });
      document.getElementById("desktopNav").addEventListener("click", (e) => {
        if (e.target.closest("a"))
          document.getElementById("navMore").removeAttribute("open");
      });
      document.addEventListener("click", (e) => {
        const more = document.getElementById("navMore");
        if (!more.contains(e.target)) more.removeAttribute("open");
      });
      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        document.getElementById("mobileNav").classList.remove("open");
        document
          .getElementById("menuBtn")
          .setAttribute("aria-expanded", "false");
        document.getElementById("navMore").removeAttribute("open");
      });
      window.addEventListener("hashchange", render);
      renderNav();
      if (!location.hash) history.replaceState(null, "", "#/home");
      render();
