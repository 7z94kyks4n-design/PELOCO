(() => {
  'use strict';

  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const coinsEl = document.getElementById('coins');
  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const playBtn = document.getElementById('playBtn');
  const shareBtn = document.getElementById('shareScore');
  const challengeValue = document.getElementById('challengeValue');
  const toast = document.getElementById('toast');

  if (!scoreEl || !bestEl || !coinsEl || !overlay || !shareBtn) return;

  let lastCoinCount = Number(coinsEl.textContent) || 0;
  let toastTimer = 0;

  const i18n = () => window.PELOCO_I18N;
  const currentScore = () => scoreEl.textContent.trim() || '00000';

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
  }

  function syncChallenge() {
    if (challengeValue) challengeValue.textContent = currentScore();
  }

  function syncGameOverLanguage() {
    const t = i18n();
    if (!t || overlay.classList.contains('hidden')) return;
    if (overlayTitle.textContent === 'PELOCO RUN') return;
    overlayTitle.textContent = t.t('runOver');
    overlayText.textContent = t.t('gameOverText')(currentScore(), coinsEl.textContent.trim());
    playBtn.textContent = t.t('playAgain');
  }

  async function shareScore() {
    const t = i18n();
    if (!t) return;
    const score = currentScore();
    const text = t.t('shareText')(score);
    const payload = {
      title: t.t('shareTitle'),
      text,
      url: location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
      await navigator.clipboard.writeText(`${text} ${location.href}`);
      showToast(t.t('copied'));
    } catch (error) {
      if (error && error.name === 'AbortError') return;
      try {
        const textarea = document.createElement('textarea');
        textarea.value = `${text} ${location.href}`;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showToast(t.t('copied'));
      } catch (_) {}
    }
  }

  const scoreObserver = new MutationObserver(syncChallenge);
  scoreObserver.observe(scoreEl, {childList: true, characterData: true, subtree: true});

  const coinObserver = new MutationObserver(() => {
    const next = Number(coinsEl.textContent) || 0;
    if (next > lastCoinCount && navigator.vibrate) navigator.vibrate(12);
    lastCoinCount = next;
  });
  coinObserver.observe(coinsEl, {childList: true, characterData: true, subtree: true});

  const overlayObserver = new MutationObserver(() => {
    const isVisible = !overlay.classList.contains('hidden');
    if (isVisible && overlayTitle.textContent !== 'PELOCO RUN') {
      if (navigator.vibrate) navigator.vibrate([35, 30, 55]);
      syncGameOverLanguage();
    }
  });
  overlayObserver.observe(overlay, {attributes: true, attributeFilter: ['class'], childList: true, subtree: true});

  shareBtn.addEventListener('click', shareScore);
  window.addEventListener('peloco-language-change', syncGameOverLanguage);

  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('tab-hidden', document.hidden);
  });

  syncChallenge();
})();