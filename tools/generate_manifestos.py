#!/usr/bin/env python3
"""Generate the official PELOCO manifesto PDFs in Portuguese and English."""

from pathlib import Path
import shutil
import subprocess
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT_PT = ROOT / "PELOCO_MANIFESTO_PT_2026.pdf"
OUT_EN = ROOT / "PELOCO_MANIFESTO_EN_2026.pdf"
ART = ROOT / "peloco-manifesto-cutout.webp"

NAVY = HexColor("#071A31")
NAVY_2 = HexColor("#0D2947")
BLUE = HexColor("#1D6C98")
SKY = HexColor("#DFF4FF")
GOLD = HexColor("#F5C64E")
GOLD_2 = HexColor("#E99D24")
CREAM = HexColor("#FFF4CF")
PAPER = HexColor("#FFFDF7")
MUTED = HexColor("#50677C")
LINE = HexColor("#B8D8E8")
GREEN = HexColor("#2C7A61")
ORANGE = HexColor("#9A5D18")

W, H = A4
MARGIN = 48
CONTENT_W = W - 2 * MARGIN

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
pdfmetrics.registerFont(TTFont("PelocoSans", FONT_REG))
pdfmetrics.registerFont(TTFont("PelocoSans-Bold", FONT_BOLD))


WALLETS = [
    "FG7w73eqj4VaB4Yxj8KmBrUuSin4jv9vhxhmeqdaFZj2",
    "BGAmHnySzhRd25ikw7Xpgf2P3DJuHJhaU79tuucgkTmG",
    "2BvMhRQS3bghmgJav8sbnGXfh1UqcKwrJPTPAaRSHrEk",
]


PT = {
    "lang": "pt-BR",
    "tagline": "Da família à comunidade. Do zero à construção.",
    "title": "MANIFESTO",
    "subtitle": "Princípios, compromissos e visão de construção do PELOCO.",
    "risk_title": "LEIA. QUESTIONE. VERIFIQUE.",
    "risk_intro": "Memecoins são ativos altamente especulativos. Podem envolver baixa liquidez, alta volatilidade e riscos de mercado, infraestrutura, carteiras, tecnologia e plataformas.",
    "risk_line": "Não prometemos risco zero. Prometemos tornar os riscos visíveis.",
    "not_promised": ["lucro", "valorização", "retorno financeiro", "preço mínimo", "market cap específico", "número específico de holders", "ausência de perdas", "ausência de manipulação", "ausência de falhas técnicas", "ausência de riscos", "sucesso"],
    "map": "MAPA DO MANIFESTO",
    "summary": "RESUMO DOS PRINCIPAIS COMPROMISSOS",
    "summary_note": "Os estados abaixo distinguem fatos atuais de planos, intenções e metas aspiracionais.",
    "table_headers": ["COMPROMISSO", "NÚMERO / DIREÇÃO", "ESTADO"],
    "summary_rows": [
        ["Supply total", "1 bilhão PELOCO", "Existente"],
        ["Carteiras do criador", "3 declaradas", "Existente"],
        ["Participação agregada", "A confirmar on-chain", "Verificação pendente"],
        ["Limite pretendido do criador", "Abaixo de 5%", "Planejado"],
        ["Objetivo de holdings", "4,8% a 4,9%", "Planejado"],
        ["Lock da posição", "2 anos", "Planejado"],
        ["Public Reserve", "Abaixo de 6%", "Planejado"],
        ["Holders - Ano 1", "1.000", "Meta aspiracional"],
        ["Holders - Ano 2", "5.000", "Meta aspiracional"],
        ["Holders - Ano 3", "12.000", "Meta aspiracional"],
        ["Market Cap", "R$ 90 bilhões", "Meta aspiracional"],
        ["Venda do projeto", "Não é objetivo", "Intenção"],
        ["Crescimento orgânico", "Sem número", "Princípio"],
    ],
    "sections": [
        ("A ORIGEM", ["O PELOCO começou com algo simples: família. A ideia nasceu inspirada nos sobrinhos da pessoa criadora - algo pequeno, pessoal e cheio de significado.", "O que começou como homenagem tornou-se uma ideia maior: construir uma comunidade em torno do PELOCO e permitir que essa origem continue crescendo com o tempo."]),
        ("POR QUE O PELOCO EXISTE", ["O PELOCO existe para reunir uma comunidade em torno de uma ideia simples: começar pequeno, construir publicamente e crescer de forma orgânica.", "Não queremos criar apenas um token. Queremos construir identidade, comunidade e uma história capaz de evoluir no longo prazo."]),
        ("O QUE QUEREMOS CONSTRUIR", ["Queremos um projeto que qualquer pessoa possa acompanhar, verificar e compreender.", ["transparência", "crescimento orgânico", "construção pública", "responsabilidade com as informações", "liberdade para decisões individuais", "continuidade no longo prazo"], "Não queremos parecer maiores do que somos. Queremos construir até realmente sermos maiores."]),
        ("NOSSO COMPROMISSO COM O LONGO PRAZO", ["O PELOCO não está sendo construído para desaparecer. A intenção é continuar construindo, crescer junto com a comunidade e buscar relevância ao longo do tempo.", "Não podemos garantir o futuro. Podemos mostrar, por meio de execução e histórico, que estamos construindo em direção a ele."]),
        ("INDEPENDÊNCIA DO PROJETO", ["O PELOCO não está sendo construído com o objetivo de ser vendido ou ter seu controle transferido para uma empresa ou terceiro.", "A intenção é seguir de forma independente. Crescer não significa vender; significa construir mais."]),
        ("CRESCIMENTO ORGÂNICO", ["Não queremos comprar comunidade, fabricar atividade ou criar aparência artificial de crescimento.", ["sem compra de holders", "sem bots para fabricar atividade", "sem volume ou engajamento falsos", "sem comunidades falsas", "sem apoio pago apresentado como orgânico", "sem hype artificial apresentado como crescimento real"], "Preferimos uma comunidade pequena e real a uma comunidade grande e artificial."]),
        ("A COMUNIDADE", ["A comunidade não pertence à pessoa criadora. Cada pessoa é livre para comprar, vender, manter, negociar, acompanhar ou simplesmente não participar.", "Ninguém deve comprar PELOCO por pressão ou confiança cega. Cada pessoa deve analisar as informações disponíveis e tomar sua própria decisão."]),
        ("A PESSOA CRIADORA E SUAS HOLDINGS", ["A pessoa criadora mantém PELOCO em três carteiras declaradas e sob seu controle. A participação agregada atual não é afirmada neste documento enquanto não houver confirmação on-chain com data e fonte.", "Carteiras declaradas:", WALLETS, "A intenção declarada é manter a posição no longo prazo e abaixo de 5% do supply. O objetivo de 4,8% a 4,9% e o lock de 2 anos são planos, ainda não condições implementadas.", "O mecanismo do lock deverá ser divulgado publicamente e ser verificável antes da implementação."]),
        ("CREATOR FEES E REINVESTIMENTO", ["A intenção é que Creator Fees sustentem o trabalho da pessoa criadora, em vez da venda de suas holdings de PELOCO.", "Quando houver capacidade financeira, recursos poderão ser reinvestidos em desenvolvimento, ferramentas, infraestrutura, marketing, conteúdo, operações e estrutura empresarial. Mudanças relevantes deverão ser explicadas publicamente."]),
        ("PUBLIC RESERVE", ["A Public Reserve é uma estrutura planejada para fortalecer o projeto no longo prazo. Ainda não está implementada.", "A intenção é mantê-la abaixo de 6% do supply e separada das carteiras pessoais. Quando implementada, deverá ter identificação pública, movimentos verificáveis e explicações sobre finalidade, valor e destino dos recursos."]),
        ("TRANSPARÊNCIA E VERIFICABILIDADE", ["Transparência não é apenas dizer o que estamos fazendo; é permitir que outras pessoas verifiquem.", "Sempre que aplicável, queremos tornar públicos holdings, posição do criador, liquidez, transações relevantes, Public Reserve, decisões, atualizações e histórico de construção.", "Não queremos que as pessoas precisem acreditar. Queremos que possam verificar."]),
        ("FATO, INDÍCIO E INTERPRETAÇÃO", ["Toda informação sobre o PELOCO deve respeitar uma distinção simples: FATO > INDÍCIO > INTERPRETAÇÃO.", "Expectativa não é certeza. Possibilidade não é promessa. Opinião não é fato."]),
        ("COMO LER ESTE MANIFESTO", ["Este documento distingue o que existe hoje, o que está sendo construído e o que está planejado para o futuro.", "Uma intenção não é implementação. Uma meta não é previsão. Uma ambição não é garantia."]),
        ("O QUE EXISTE HOJE", ["Existe hoje:", ["supply total de 1.000.000.000 PELOCO", "rede Solana", "token identificável on-chain", "presença pública e comunidade inicial", "três carteiras declaradas da pessoa criadora"], "O projeto ainda é pequeno. Não escondemos isso."]),
        ("O QUE ESTÁ SENDO CONSTRUÍDO", ["Estamos construindo progressivamente identidade, comunidade, presença pública, transparência, documentação, histórico de desenvolvimento e estrutura de acompanhamento.", "A credibilidade do PELOCO deverá ser construída por execução e histórico."]),
        ("O QUE ESTÁ PLANEJADO", ["Estão planejados - ainda não implementados:", ["holdings agregadas do criador abaixo de 5%", "objetivo de 4,8% a 4,9%", "lock de 2 anos quando a posição for alcançada", "Public Reserve abaixo de 6%", "reinvestimento no fortalecimento do projeto", "mecanismos públicos de acompanhamento"], "Planos podem mudar. Mudanças relevantes deverão ser comunicadas publicamente."]),
        ("NOSSA VISÃO DE CRESCIMENTO", ["As metas de 1.000 holders no Ano 1, 5.000 no Ano 2 e 12.000 no Ano 3 são metas aspiracionais - não previsões ou garantias.", "Podemos chegar antes, depois ou não alcançar essas metas. Holders são apenas um dos indicadores de expansão e devem ser lidos junto com participação e atividade real."]),
        ("NOSSA AMBIÇÃO", ["Nossa ambição é tornar o PELOCO uma memecoin reconhecida. A referência de R$ 90 bilhões de Market Cap é uma meta aspiracional.", "Não é previsão de preço, promessa de valorização nem garantia de retorno."]),
        ("SE O PELOCO CRESCER", ["Se o PELOCO crescer, queremos que a estrutura cresça junto: mais comunidade deve significar mais responsabilidade; mais recursos, mais transparência; mais visibilidade, mais cuidado.", "Não queremos apenas ficar maiores. Queremos nos tornar mais sólidos à medida que crescemos."]),
        ("O QUE NÃO PROMETEMOS", ["Não prometemos lucro, valorização, retorno financeiro, preço mínimo, Market Cap específico, quantidade específica de holders, ausência de perdas, ausência de manipulação, ausência de falhas técnicas, ausência de riscos ou sucesso.", "Memecoins são altamente especulativas. Não prometemos risco zero; prometemos tornar os riscos visíveis."]),
        ("NÃO PRECISA CONFIAR CEGAMENTE", ["Leia. Questione. Verifique. Observe. Compare. Acompanhe o histórico. Tome sua própria decisão.", "Não confie cegamente. Verifique."]),
        ("NOSSO COMPROMISSO", ["Nosso compromisso é construir publicamente, agir com transparência, crescer organicamente e respeitar a liberdade da comunidade.", "Não fabricar aparência de sucesso, não esconder riscos, não apresentar planos como fatos e continuar trabalhando para transformar uma ideia pequena em algo maior."]),
        ("RESUMO DOS PRINCIPAIS COMPROMISSOS", ["A tabela desta página consolida compromissos, direções e estados. Ela faz parte desta seção e deve ser lida com as notas de transparência do documento."]),
        ("A REGRA", ["Queremos que cada compromisso siga uma lógica simples: REGRA > NÚMERO > MECANISMO > PROVA.", "Se existe uma regra, queremos explicar. Se existe um número, mostrar. Se existe um mecanismo, definir. Se existe uma afirmação importante, permitir sua verificação."]),
        ("CONCLUSÃO", ["O PELOCO começou pequeno. Não escondemos isso. Não sabemos exatamente até onde podemos chegar, mas sabemos como queremos construir.", "Não queremos desaparecer, construir para vender, comprar crescimento, fabricar comunidade ou prometer o que não podemos garantir.", "Queremos construir, crescer, reinvestir, estruturar e continuar.", "Da família à comunidade. Do zero à construção. PELOCO."]),
    ],
}


EN = {
    "lang": "en",
    "tagline": "From family to community. From zero to building.",
    "title": "MANIFESTO",
    "subtitle": "Principles, commitments, and a vision for building PELOCO.",
    "risk_title": "READ. QUESTION. VERIFY.",
    "risk_intro": "Memecoins are highly speculative assets. They may involve low liquidity, high volatility, and risks related to markets, infrastructure, wallets, technology, and platforms.",
    "risk_line": "We do not promise zero risk. We promise to make the risks visible.",
    "not_promised": ["profit", "appreciation", "financial return", "minimum price", "a specific Market Cap", "a specific number of holders", "absence of losses", "absence of manipulation", "absence of technical failures", "absence of risks", "success"],
    "map": "MANIFESTO MAP",
    "summary": "SUMMARY OF KEY COMMITMENTS",
    "summary_note": "The statuses below distinguish present facts from plans, intentions, and aspirational goals.",
    "table_headers": ["COMMITMENT", "NUMBER / DIRECTION", "STATUS"],
    "summary_rows": [
        ["Total Supply", "1 billion PELOCO", "Existing"],
        ["Creator wallets", "3 declared", "Existing"],
        ["Aggregate position", "Pending on-chain confirmation", "Verification pending"],
        ["Intended creator limit", "Below 5%", "Planned"],
        ["Holdings target", "4.8% to 4.9%", "Planned"],
        ["Position lock", "2 years", "Planned"],
        ["Public Reserve", "Below 6%", "Planned"],
        ["Holders - Year 1", "1,000", "Aspirational goal"],
        ["Holders - Year 2", "5,000", "Aspirational goal"],
        ["Holders - Year 3", "12,000", "Aspirational goal"],
        ["Market Cap", "BRL 90 billion", "Aspirational goal"],
        ["Project sale", "Not an objective", "Intention"],
        ["Organic growth", "No fixed number", "Principle"],
    ],
    "sections": [
        ("THE ORIGIN", ["PELOCO started with something simple: family. The idea was inspired by the creator's nieces and nephews - something small, personal, and full of meaning.", "What began as a tribute became a larger idea: build a community around PELOCO and allow that origin to keep growing over time."]),
        ("WHY PELOCO EXISTS", ["PELOCO exists to bring a community together around a simple idea: start small, build publicly, and grow organically.", "We do not want to create only a token. We want to build an identity, a community, and a story that can evolve over the long term."]),
        ("WHAT WE WANT TO BUILD", ["We want a project that anyone can follow, verify, and understand.", ["transparency", "organic growth", "building in public", "responsibility for published information", "freedom for individual decisions", "long-term continuity"], "We do not want to appear bigger than we are. We want to build until we truly become bigger."]),
        ("OUR LONG-TERM COMMITMENT", ["PELOCO is not being built to disappear. The intention is to keep building, grow with the community, and seek relevance over time.", "We cannot guarantee the future. We can show, through execution and track record, that we are building toward it."]),
        ("PROJECT INDEPENDENCE", ["PELOCO is not being built with the objective of being sold or having its control transferred to a company or third party.", "The intention is to remain independent. Growing does not mean selling; it means building more."]),
        ("ORGANIC GROWTH", ["We do not want to buy a community, manufacture activity, or create an artificial appearance of growth.", ["no buying holders", "no bots to manufacture activity", "no artificial volume or engagement", "no fake communities", "no paid support presented as organic", "no artificial hype presented as real growth"], "We prefer a small, real community to a large, artificial one."]),
        ("THE COMMUNITY", ["The community does not belong to the creator. Everyone is free to buy, sell, hold, trade, follow, or simply not participate.", "No one should buy PELOCO because of pressure or blind trust. Everyone should analyze the available information and make their own decision."]),
        ("THE CREATOR AND THEIR HOLDINGS", ["The creator holds PELOCO across three declared wallets under their control. The current aggregate share is not stated in this document until it is confirmed on-chain with a date and source.", "Declared wallets:", WALLETS, "The declared intention is to hold the position long term and keep it below 5% of the Total Supply. The 4.8% to 4.9% target and the 2-year lock are plans, not implemented conditions.", "The lock mechanism must be publicly disclosed and verifiable before implementation."]),
        ("CREATOR FEES AND REINVESTMENT", ["The intention is for Creator Fees to support the creator's work instead of selling PELOCO holdings.", "When financially possible, resources may be reinvested in development, tools, infrastructure, marketing, content, operations, and business structure. Material changes must be explained publicly."]),
        ("PUBLIC RESERVE", ["The Public Reserve is a planned structure intended to strengthen the project over the long term. It has not yet been implemented.", "The intention is to keep it below 6% of the Total Supply and separate from personal wallets. Once implemented, it must be publicly identified, verifiable, and accompanied by explanations of purpose, amount, and destination."]),
        ("TRANSPARENCY AND VERIFIABILITY", ["Transparency is not only saying what we are doing; it is allowing other people to verify it.", "Whenever applicable, we want to make holdings, creator position, liquidity, relevant transactions, the Public Reserve, decisions, updates, and the building history public.", "We do not want people to have to believe. We want them to be able to verify."]),
        ("FACT, INDICATION, AND INTERPRETATION", ["All information about PELOCO should follow a simple distinction: FACT > INDICATION > INTERPRETATION.", "Expectation is not certainty. Possibility is not a promise. Opinion is not fact."]),
        ("HOW TO READ THIS MANIFESTO", ["This document distinguishes what exists today, what is being built, and what is planned for the future.", "An intention is not an implementation. A goal is not a forecast. An ambition is not a guarantee."]),
        ("WHAT EXISTS TODAY", ["Existing today:", ["Total Supply of 1,000,000,000 PELOCO", "Solana network", "an identifiable on-chain token", "public presence and an initial community", "three declared creator wallets"], "The project is still small. We do not hide that."]),
        ("WHAT IS BEING BUILT", ["We are progressively building identity, community, public presence, transparency, documentation, development history, and a public tracking structure.", "PELOCO's credibility must be built through execution and track record."]),
        ("WHAT IS PLANNED", ["Planned - not yet implemented:", ["aggregate creator holdings below 5%", "a 4.8% to 4.9% target", "a 2-year lock once that position is reached", "a Public Reserve below 6%", "reinvestment in strengthening the project", "public tracking mechanisms"], "Plans may change. Material changes must be communicated publicly."]),
        ("OUR GROWTH VISION", ["Targets of 1,000 holders in Year 1, 5,000 in Year 2, and 12,000 in Year 3 are aspirational goals - not forecasts or guarantees.", "We may reach them earlier, later, or not at all. Holders are only one growth indicator and should be read together with participation and real activity."]),
        ("OUR AMBITION", ["Our ambition is to make PELOCO a recognized memecoin. The BRL 90 billion Market Cap reference is an aspirational goal.", "It is not a price forecast, a promise of appreciation, or a guarantee of return."]),
        ("IF PELOCO GROWS", ["If PELOCO grows, we want the structure to grow with it: more community should mean more responsibility; more resources, more transparency; more visibility, more care.", "We do not only want to become bigger. We want to become more solid as we grow."]),
        ("WHAT WE DO NOT PROMISE", ["We do not promise profit, appreciation, financial return, a minimum price, a specific Market Cap, a specific holder count, absence of losses, manipulation, technical failures, risks, or guaranteed success.", "Memecoins are highly speculative. We do not promise zero risk; we promise to make the risks visible."]),
        ("YOU DO NOT NEED TO TRUST BLINDLY", ["Read. Question. Verify. Observe. Compare. Follow the track record. Make your own decision.", "Do not trust blindly. Verify."]),
        ("OUR COMMITMENT", ["Our commitment is to build publicly, act with transparency, grow organically, and respect the community's freedom.", "We will not manufacture an appearance of success, hide risks, or present plans as facts. We will keep working to turn a small idea into something larger."]),
        ("SUMMARY OF KEY COMMITMENTS", ["The table on this page consolidates commitments, directions, and statuses. It is part of this section and should be read together with the document's transparency notes."]),
        ("THE RULE", ["We want every commitment to follow a simple logic: RULE > NUMBER > MECHANISM > PROOF.", "If there is a rule, we want to explain it. If there is a number, show it. If there is a mechanism, define it. If there is an important claim, allow it to be verified."]),
        ("CONCLUSION", ["PELOCO started small. We do not hide that. We do not know exactly how far we can go, but we know how we want to build.", "We do not want to disappear, build to sell, buy growth, manufacture a community, or promise what we cannot guarantee.", "We want to build, grow, reinvest, structure, and continue.", "From family to community. From zero to building. PELOCO."]),
    ],
}


BODY = ParagraphStyle("body", fontName="PelocoSans", fontSize=8.7, leading=12.4, textColor=NAVY, spaceAfter=5)
BODY_DARK = ParagraphStyle("body-dark", parent=BODY, textColor=PAPER)
SMALL = ParagraphStyle("small", fontName="PelocoSans", fontSize=7.3, leading=10.2, textColor=MUTED)
TITLE = ParagraphStyle("title", fontName="PelocoSans-Bold", fontSize=13.5, leading=16, textColor=NAVY, alignment=TA_LEFT)


def p_height(text, style, width):
    p = Paragraph(escape(text), style)
    _, h = p.wrap(width, H)
    return p, h


def draw_paragraph(c, text, x, y, width, style=BODY):
    p, h = p_height(text, style, width)
    p.drawOn(c, x, y - h)
    return y - h


def draw_bullets(c, items, x, y, width, dark=False):
    style = BODY_DARK if dark else BODY
    for item in items:
        y = draw_paragraph(c, "• " + item, x + 8, y, width - 8, style) - 1
    return y


def header_footer(c, page, data, dark=False):
    fg = PAPER if dark else NAVY
    c.setStrokeColor(GOLD if dark else LINE)
    c.setLineWidth(0.7)
    c.line(MARGIN, H - 38, W - MARGIN, H - 38)
    c.setFont("PelocoSans-Bold", 7.2)
    c.setFillColor(GOLD if dark else NAVY)
    c.drawString(MARGIN, H - 29, "PELOCO")
    c.setFont("PelocoSans", 7)
    c.setFillColor(fg)
    c.drawRightString(W - MARGIN, H - 29, "MANIFESTO • 2026")
    c.setStrokeColor(GOLD if dark else LINE)
    c.line(MARGIN, 36, W - MARGIN, 36)
    c.setFont("PelocoSans", 6.8)
    c.setFillColor(fg)
    c.drawString(MARGIN, 24, "PELOCO • Manifesto")
    c.setFillColor(GOLD_2 if not dark else GOLD)
    c.drawRightString(W - MARGIN, 24, f"{page:02d}")


def draw_cover(c, data):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(W * 0.61, 0, W * 0.39, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(MARGIN, H - 105, 46, 4, fill=1, stroke=0)
    c.setFont("PelocoSans-Bold", 8)
    c.setFillColor(ORANGE)
    c.drawString(MARGIN, H - 95, "PELOCO • MANIFESTO")
    c.setFont("PelocoSans-Bold", 34)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, H - 230, data["title"])
    y = draw_paragraph(c, data["tagline"], MARGIN, H - 255, W * 0.48, ParagraphStyle("cover-tag", fontName="PelocoSans", fontSize=13, leading=18, textColor=NAVY))
    c.setFont("PelocoSans-Bold", 7.5)
    c.setFillColor(ORANGE)
    c.drawString(MARGIN, y - 55, "TRANSPARÊNCIA • CRESCIMENTO ORGÂNICO • LONGO PRAZO" if data["lang"] == "pt-BR" else "TRANSPARENCY • ORGANIC GROWTH • LONG TERM")
    draw_paragraph(c, data["subtitle"], MARGIN, 115, W * 0.48, SMALL)
    image = ImageReader(str(ART))
    iw, ih = image.getSize()
    max_w, max_h = W * 0.33, H * 0.47
    scale = min(max_w / iw, max_h / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(image, W * 0.61 + (W * 0.39 - dw) / 2, (H - dh) / 2, dw, dh, mask="auto")
    c.setTitle(f"PELOCO {data['title'].title()}")
    c.setAuthor("PELOCO")
    c.setSubject(data["subtitle"])
    c.showPage()


def draw_risk(c, data, page):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header_footer(c, page, data, dark=True)
    c.setFont("PelocoSans-Bold", 8)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, H - 85, "AVISO IMPORTANTE" if data["lang"] == "pt-BR" else "IMPORTANT NOTICE")
    c.setFont("PelocoSans-Bold", 26)
    c.setFillColor(PAPER)
    c.drawString(MARGIN, H - 125, data["risk_title"])
    y = draw_paragraph(c, data["risk_intro"], MARGIN, H - 160, CONTENT_W, BODY_DARK) - 20
    c.setFillColor(NAVY_2)
    c.roundRect(MARGIN, y - 205, CONTENT_W, 200, 16, fill=1, stroke=0)
    c.setFont("PelocoSans-Bold", 9)
    c.setFillColor(GOLD)
    c.drawString(MARGIN + 20, y - 28, "NÃO PROMETEMOS" if data["lang"] == "pt-BR" else "WE DO NOT PROMISE")
    left, right = data["not_promised"][:6], data["not_promised"][6:]
    draw_bullets(c, left, MARGIN + 20, y - 50, 220, dark=True)
    draw_bullets(c, right, MARGIN + 260, y - 50, 220, dark=True)
    c.setFillColor(GOLD)
    c.roundRect(MARGIN, 105, CONTENT_W, 80, 14, fill=1, stroke=0)
    draw_paragraph(c, data["risk_line"], MARGIN + 22, 157, CONTENT_W - 44, ParagraphStyle("risk", fontName="PelocoSans-Bold", fontSize=15, leading=20, textColor=NAVY))
    c.showPage()


def draw_map(c, data, page):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header_footer(c, page, data)
    c.setFont("PelocoSans-Bold", 24)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, H - 95, data["map"])
    c.setFillColor(GOLD)
    c.rect(MARGIN, H - 108, 54, 4, fill=1, stroke=0)
    rows = []
    for i, (title, _) in enumerate(data["sections"], 1):
        rows.append([f"{i:02d}", title])
    left, right = rows[:13], rows[13:]
    for col, group in enumerate((left, right)):
        x = MARGIN + col * (CONTENT_W / 2 + 8)
        y = H - 145
        for num, title in group:
            c.setFont("PelocoSans-Bold", 8)
            c.setFillColor(GOLD_2)
            c.drawString(x, y, num)
            c.setFont("PelocoSans-Bold", 7.7)
            c.setFillColor(NAVY)
            c.drawString(x + 24, y, title)
            y -= 42
    c.showPage()


def block_height(section, width):
    _, content = section
    total = 48
    for item in content:
        if isinstance(item, list):
            for bullet in item:
                _, h = p_height("• " + bullet, BODY, width - 42)
                total += h + 1
        else:
            _, h = p_height(item, BODY, width - 34)
            total += h + 5
    return total + 13


def draw_section(c, index, section, x, y, width, extra_height=0):
    title, content = section
    height = block_height(section, width) + extra_height
    c.setFillColor(PAPER)
    c.setStrokeColor(LINE)
    c.roundRect(x, y - height, width, height, 14, fill=1, stroke=1)
    c.setFillColor(GOLD)
    c.roundRect(x + 15, y - 37, 34, 22, 8, fill=1, stroke=0)
    c.setFont("PelocoSans-Bold", 8.2)
    c.setFillColor(NAVY)
    c.drawCentredString(x + 32, y - 30, f"{index:02d}")
    title_p = Paragraph(escape(title), TITLE)
    title_p.wrap(width - 72, 30)
    title_p.drawOn(c, x + 60, y - 36)
    cursor = y - 55
    for item in content:
        if isinstance(item, list):
            cursor = draw_bullets(c, item, x + 18, cursor, width - 36)
        else:
            cursor = draw_paragraph(c, item, x + 18, cursor, width - 36, BODY) - 5
    return y - height


def draw_sections_page(c, data, page, indexes):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header_footer(c, page, data)
    y = H - 62
    gap = 11
    available = H - 120
    heights = [block_height(data["sections"][i - 1], CONTENT_W) for i in indexes]
    total = sum(heights) + gap * (len(indexes) - 1)
    if total > available:
        raise RuntimeError(f"Page {page} content does not fit: {total:.1f} > {available:.1f}")
    extra_height = (available - total) / len(indexes)
    for i in indexes:
        y = draw_section(c, i, data["sections"][i - 1], MARGIN, y, CONTENT_W, extra_height) - gap
    c.showPage()


def draw_summary_page(c, data, page):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header_footer(c, page, data)
    y = draw_section(c, 22, data["sections"][21], MARGIN, H - 62, CONTENT_W) - 13
    c.setFont("PelocoSans-Bold", 17)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, y - 20, data["summary"])
    y = draw_paragraph(c, data["summary_note"], MARGIN, y - 36, CONTENT_W, SMALL) - 9
    rows = [data["table_headers"]] + data["summary_rows"]
    table = Table(rows, colWidths=[190, 165, 135], rowHeights=[27] + [30] * len(data["summary_rows"]))
    table.setStyle(TableStyle([
        ("FONT", (0, 0), (-1, -1), "PelocoSans", 6.8),
        ("FONT", (0, 0), (-1, 0), "PelocoSans-Bold", 7),
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), PAPER),
        ("BACKGROUND", (0, 1), (-1, -1), PAPER),
        ("TEXTCOLOR", (0, 1), (-1, -1), NAVY),
        ("GRID", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TEXTCOLOR", (2, 1), (2, 2), GREEN),
        ("TEXTCOLOR", (2, 3), (2, 3), ORANGE),
        ("TEXTCOLOR", (2, 4), (2, -1), ORANGE),
    ]))
    _, th = table.wrap(CONTENT_W, H)
    table.drawOn(c, MARGIN, y - th)
    c.showPage()


def draw_final(c, data, page):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    header_footer(c, page, data, dark=True)
    y = H - 78
    for index in (23, 24):
        title, content = data["sections"][index - 1]
        c.setFont("PelocoSans-Bold", 8)
        c.setFillColor(GOLD)
        c.drawString(MARGIN, y, f"{index:02d} • {title}")
        y -= 18
        for item in content:
            y = draw_paragraph(c, item, MARGIN, y, CONTENT_W, BODY_DARK) - 5
        y -= 18
    c.setFillColor(GOLD)
    c.rect(MARGIN, y, 58, 4, fill=1, stroke=0)
    y -= 35
    title, content = data["sections"][24]
    c.setFont("PelocoSans-Bold", 8)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, y, f"25 • {title}")
    y -= 30
    for item in content:
        style = ParagraphStyle("final-body", parent=BODY_DARK, fontSize=10.2, leading=15)
        y = draw_paragraph(c, item, MARGIN, y, CONTENT_W * 0.74, style) - 9
    image = ImageReader(str(ART))
    iw, ih = image.getSize()
    dw = 122
    dh = ih * dw / iw
    c.drawImage(image, W - MARGIN - dw, 68, dw, dh, mask="auto")
    c.showPage()


def generate(path, data):
    c = canvas.Canvas(str(path), pagesize=A4, pageCompression=1)
    draw_cover(c, data)
    draw_risk(c, data, 2)
    draw_map(c, data, 3)
    groups = [(1, 2, 3), (4, 5, 6), (7, 8, 9), (10, 11, 12), (13, 14, 15), (16, 17, 18), (19, 20, 21)]
    for page, indexes in enumerate(groups, start=4):
        draw_sections_page(c, data, page, indexes)
    draw_summary_page(c, data, 11)
    draw_final(c, data, 12)
    c.save()


def optimize(path):
    """Create a compact, Safari-friendly PDF while preserving vector text."""
    gs = shutil.which("gs")
    if not gs:
        return
    optimized = path.with_suffix(".optimized.pdf")
    subprocess.run(
        [
            gs,
            "-sDEVICE=pdfwrite",
            "-dCompatibilityLevel=1.6",
            "-dPDFSETTINGS=/ebook",
            "-dNOPAUSE",
            "-dQUIET",
            "-dBATCH",
            f"-sOutputFile={optimized}",
            str(path),
        ],
        check=True,
    )
    optimized.replace(path)


if __name__ == "__main__":
    generate(OUT_PT, PT)
    generate(OUT_EN, EN)
    optimize(OUT_PT)
    optimize(OUT_EN)
    print(OUT_PT)
    print(OUT_EN)
