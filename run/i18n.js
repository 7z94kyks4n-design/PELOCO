(() => {
  'use strict';

  const copy = {
    pt: {
      preview: 'PRÉVIA PRIVADA',
      heroTitle: 'Corra. Pule. Continue.',
      heroSub: 'Toque em qualquer lugar ou pressione Espaço / ↑ para pular.',
      score: 'PONTOS',
      best: 'RECORDE',
      coins: 'MOEDAS',
      intro: 'Desvie dos obstáculos e colete moedas PELOCO.',
      play: 'JOGAR',
      tap: 'TOQUE PARA PULAR',
      share: 'COMPARTILHAR PONTOS',
      challengeKicker: 'SUA CORRIDA',
      challengeText: 'Supere seu recorde. Depois desafie outra pessoa.',
      legal: 'Protótipo. Sem conexão de carteira. Sem compras. Sem recompensas.',
      backAria: 'Voltar ao PELOCO',
      languageAria: 'Idioma',
      gameAria: 'Jogo PELOCO RUN',
      canvasAria: 'Jogo de corrida infinita do PELOCO',
      runOver: 'FIM DA CORRIDA',
      playAgain: 'JOGAR NOVAMENTE',
      copied: 'Resultado copiado.',
      shareTitle: 'PELOCO RUN',
      shareText: (score) => `Fiz ${score} pontos no PELOCO RUN. Consegue passar?`,
      gameOverText: (score, coins) => `Pontos ${score} · Moedas ${coins}. Toque em jogar e tente de novo.`
    },
    en: {
      preview: 'PRIVATE PREVIEW',
      heroTitle: 'Run. Jump. Keep going.',
      heroSub: 'Tap anywhere or press Space / ↑ to jump.',
      score: 'SCORE',
      best: 'BEST',
      coins: 'COINS',
      intro: 'Jump over obstacles and collect PELOCO coins.',
      play: 'PLAY',
      tap: 'TAP TO JUMP',
      share: 'SHARE SCORE',
      challengeKicker: 'YOUR RUN',
      challengeText: 'Beat your best. Then challenge someone else.',
      legal: 'Prototype only. No wallet connection. No purchases. No rewards.',
      backAria: 'Back to PELOCO',
      languageAria: 'Language',
      gameAria: 'PELOCO RUN game',
      canvasAria: 'PELOCO endless runner game',
      runOver: 'RUN OVER',
      playAgain: 'PLAY AGAIN',
      copied: 'Result copied.',
      shareTitle: 'PELOCO RUN',
      shareText: (score) => `I scored ${score} in PELOCO RUN. Can you beat it?`,
      gameOverText: (score, coins) => `Score ${score} · Coins ${coins}. Tap play and try again.`
    },
    es: {
      preview: 'VISTA PREVIA PRIVADA',
      heroTitle: 'Corre. Salta. Sigue.',
      heroSub: 'Toca en cualquier lugar o pulsa Espacio / ↑ para saltar.',
      score: 'PUNTOS',
      best: 'RÉCORD',
      coins: 'MONEDAS',
      intro: 'Esquiva obstáculos y recoge monedas PELOCO.',
      play: 'JUGAR',
      tap: 'TOCA PARA SALTAR',
      share: 'COMPARTIR PUNTOS',
      challengeKicker: 'TU CARRERA',
      challengeText: 'Supera tu récord. Después reta a otra persona.',
      legal: 'Prototipo. Sin conexión de cartera. Sin compras. Sin recompensas.',
      backAria: 'Volver a PELOCO',
      languageAria: 'Idioma',
      gameAria: 'Juego PELOCO RUN',
      canvasAria: 'Juego de carrera infinita de PELOCO',
      runOver: 'FIN DE LA CARRERA',
      playAgain: 'JUGAR DE NUEVO',
      copied: 'Resultado copiado.',
      shareTitle: 'PELOCO RUN',
      shareText: (score) => `Hice ${score} puntos en PELOCO RUN. ¿Puedes superarlo?`,
      gameOverText: (score, coins) => `Puntos ${score} · Monedas ${coins}. Toca jugar e inténtalo de nuevo.`
    }
  };

  const allowed = ['pt','en','es'];
  const saved = localStorage.getItem('pelocoRunLang');
  const browser = (navigator.language || 'en').slice(0,2).toLowerCase();
  let lang = allowed.includes(saved) ? saved : (allowed.includes(browser) ? browser : 'en');

  function t(key) {
    return copy[lang][key];
  }

  function apply() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (typeof copy[lang][key] === 'string') el.textContent = copy[lang][key];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.dataset.i18nAria;
      if (typeof copy[lang][key] === 'string') el.setAttribute('aria-label', copy[lang][key]);
    });
    document.querySelectorAll('.lang-btn').forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    window.dispatchEvent(new CustomEvent('peloco-language-change', {detail: {lang}}));
  }

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.lang;
      if (!allowed.includes(next) || next === lang) return;
      lang = next;
      localStorage.setItem('pelocoRunLang', lang);
      apply();
    });
  });

  window.PELOCO_I18N = {
    get lang() { return lang; },
    t,
    copy,
    apply
  };

  apply();
})();