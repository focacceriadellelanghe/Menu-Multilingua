window.APP_CONFIG = {
  SUPABASE_URL: 'https://hvvgeiemvmbmbhnybdfq.supabase.co',
  SUPABASE_KEY: 'sb_publishable_o03R7Rv3A_mu52aVTvHL3g_zX3QY-6V'
};

(() => {
  const GA_MEASUREMENT_ID = 'G-JNE2G138MB';
  const CLARITY_PROJECT_ID = 'xpxsvojg7q';

  const getLanguageCode = () => {
    const match = window.location.pathname.match(/menu_([A-Z]{2})\.html$/i);
    return match ? match[1].toUpperCase() : 'INDEX';
  };

  const languageCode = getLanguageCode();

  function ensureGA4() {
    if (window.gtag) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID);
  }

  function ensureClarity() {
    if (window.clarity) return;

    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);
      t.async=1;
      t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', CLARITY_PROJECT_ID);
  }

  function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, {
        language: languageCode,
        ...params
      });
    }

    if (typeof window.clarity === 'function') {
      try {
        window.clarity('event', eventName);
      } catch (e) {
        console.warn('Clarity event error:', e);
      }
    }
  }

  function trackMenuOpen() {
    if (sessionStorage.getItem(`menu_open_${languageCode}`)) return;

    sessionStorage.setItem(`menu_open_${languageCode}`, '1');

    trackEvent('menu_open', {
      page_type: languageCode === 'INDEX' ? 'language_selector' : 'menu'
    });
  }

  function trackLanguageSelection() {
    const languageCards = document.querySelectorAll('.lang-card');

    languageCards.forEach(card => {
      card.addEventListener('click', () => {
        const href = card.getAttribute('href') || '';
        const match = href.match(/menu_([A-Z]{2})\.html$/i);

        if (!match) return;

        trackEvent('language_selected', {
          selected_language: match[1].toUpperCase()
        });
      });
    });
  }

  function trackScrollDepth() {
    if (languageCode === 'INDEX') return;

    const thresholds = [25, 50, 75, 90, 100];
    const reached = new Set();

    const handler = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const viewportHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      if (documentHeight <= viewportHeight) return;

      const percent = Math.min(
        100,
        Math.round(((scrollTop + viewportHeight) / documentHeight) * 100)
      );

      thresholds.forEach(threshold => {
        if (percent >= threshold && !reached.has(threshold)) {
          reached.add(threshold);

          trackEvent('scroll_depth', {
            scroll_percent: threshold
          });
        }
      });
    };

    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('load', handler);
    setTimeout(handler, 1000);
  }

  function setupProductTracking() {
    if (languageCode === 'INDEX') return;

    const viewed = new Set();
let productViewNumber = 0;

    const getProductName = element => {
      return (
        element.querySelector('.item-name')?.textContent?.trim() ||
        element.querySelector('.dessert-name')?.textContent?.trim() ||
        'unknown'
      );
    };

    const getProductType = element => {
      if (element.classList.contains('dessert-item')) return 'dessert';
      return 'focaccia';
    };

    const observeProducts = () => {
      const elements = [
        ...document.querySelectorAll(
          '.bs-item, .menu-item, .dessert-item'
        )
      ];

      if (!elements.length) return false;

      elements.forEach((element, index) => {
        element.dataset.analyticsPosition = String(index + 1);
      });

      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const element = entry.target;
            const productName = getProductName(element);
            const position = Number(element.dataset.analyticsPosition || 0);
            const productType = getProductType(element);

            const key = `${languageCode}|${productType}|${productName}|${position}`;

            if (viewed.has(key)) return;

            viewed.add(key);

productViewNumber++;

trackEvent('product_view', {
  product_name: productName,
  product_position: position,
  product_type: productType,
  product_view_number: productViewNumber
});

observer.unobserve(element);
          });
        },
        {
          threshold: 0.5
        }
      );

      elements.forEach(element => observer.observe(element));

      return true;
    };

    let attempts = 0;

    const interval = setInterval(() => {
      attempts++;

      if (observeProducts() || attempts >= 20) {
        clearInterval(interval);
      }
    }, 500);
  }

  function init() {
    ensureGA4();
    ensureClarity();

    trackMenuOpen();

    if (languageCode === 'INDEX') {
      trackLanguageSelection();
    } else {
      trackScrollDepth();
      setupProductTracking();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
