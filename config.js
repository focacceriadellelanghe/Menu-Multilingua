window.APP_CONFIG = {
  SUPABASE_URL: 'https://hvvgeiemvmbmbhnybdfq.supabase.co',
  SUPABASE_KEY: 'sb_publishable_o03R7Rv3A_mu52aVTvHL3g_zX3QY-6V'
};

(() => {
  const GA_MEASUREMENT_ID = 'G-JNE2G138MB';
  const CLARITY_PROJECT_ID = 'xpxsvojg7q';

  const CONSENT_STORAGE_KEY = 'menu_analytics_consent';

  /*
   * -------------------------------------------------------
   * GOOGLE CONSENT MODE - DEFAULT
   * -------------------------------------------------------
   *
   * Prima della scelta dell'utente:
   * - analytics negato
   * - advertising sempre negato
   */

  window.dataLayer = window.dataLayer || [];

  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });


  /*
   * -------------------------------------------------------
   * LANGUAGE
   * -------------------------------------------------------
   */

  const getLanguageCode = () => {
    const match = window.location.pathname.match(
      /menu_([A-Z]{2})\.html$/i
    );

    return match
      ? match[1].toUpperCase()
      : 'INDEX';
  };

  const languageCode = getLanguageCode();


  /*
   * -------------------------------------------------------
   * GA4
   * -------------------------------------------------------
   */

  function ensureGA4() {

    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement('script');

    script.async = true;

    script.src =
      `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

    document.head.appendChild(script);

    window.gtag('js', new Date());

    window.gtag(
      'config',
      GA_MEASUREMENT_ID
    );
  }


  /*
   * -------------------------------------------------------
   * MICROSOFT CLARITY
   * -------------------------------------------------------
   */

  function ensureClarity() {

    if (window.clarity) {
      return;
    }

    (function(c,l,a,r,i,t,y){

      c[a] = c[a] || function(){
        (c[a].q = c[a].q || []).push(arguments);
      };

      t = l.createElement(r);

      t.async = 1;

      t.src =
        'https://www.clarity.ms/tag/' + i;

      y = l.getElementsByTagName(r)[0];

      y.parentNode.insertBefore(t,y);

    })(
      window,
      document,
      'clarity',
      'script',
      CLARITY_PROJECT_ID
    );
  }


  /*
   * -------------------------------------------------------
   * CONSENT UPDATE
   * -------------------------------------------------------
   */

  function updateAnalyticsConsent(
    status,
    savePreference = true
  ) {

    const granted =
      status === 'granted';


    /*
     * GOOGLE CONSENT MODE
     */

    window.gtag(
      'consent',
      'update',
      {

        analytics_storage:
          granted
            ? 'granted'
            : 'denied',

        ad_storage:
          'denied',

        ad_user_data:
          'denied',

        ad_personalization:
          'denied'
      }
    );


    /*
     * MICROSOFT CLARITY CONSENT V2
     */

    if (
      typeof window.clarity === 'function'
    ) {

      try {

        window.clarity(
          'consentv2',
          {

            ad_Storage:
              'denied',

            analytics_Storage:
              granted
                ? 'granted'
                : 'denied'
          }
        );

      } catch (e) {

        console.warn(
          'Clarity consent error:',
          e
        );
      }
    }


    /*
     * MEMORIZZA SCELTA
     */

    if (savePreference) {

      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        granted
          ? 'granted'
          : 'denied'
      );
    }
  }


  /*
   * -------------------------------------------------------
   * APERTURA PREFERENZE COOKIE
   * -------------------------------------------------------
   */

  function resetConsentPreference() {

    localStorage.removeItem(
      CONSENT_STORAGE_KEY
    );

    window.gtag(
      'consent',
      'update',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      }
    );

    if (
      typeof window.clarity === 'function'
    ) {

      try {

        window.clarity(
          'consentv2',
          {
            ad_Storage: 'denied',
            analytics_Storage: 'denied'
          }
        );

      } catch (e) {

        console.warn(
          'Clarity consent reset error:',
          e
        );
      }
    }

    window.location.reload();
  }


  /*
   * Rende disponibile la funzione
   * anche alla pagina Cookie Policy.
   */

  window.resetMenuCookieConsent =
    resetConsentPreference;


  /*
   * -------------------------------------------------------
   * BANNER COOKIE
   * -------------------------------------------------------
   */

  function createConsentBanner() {

    const savedConsent =
      localStorage.getItem(
        CONSENT_STORAGE_KEY
      );


    /*
     * Consenso già espresso.
     */

    if (
      savedConsent === 'granted' ||
      savedConsent === 'denied'
    ) {

      updateAnalyticsConsent(
        savedConsent,
        false
      );

      createCookieSettingsButton();

      return;
    }


    /*
     * STILE
     */

    const style =
      document.createElement('style');

    style.textContent = `

      #menu-consent-banner {

        position: fixed;

        left: 16px;
        right: 16px;
        bottom: 16px;

        z-index: 999999;

        max-width: 720px;

        margin: 0 auto;

        padding: 16px;

        box-sizing: border-box;

        background: #111111;

        color: #ffffff;

        border: 1px solid #DFA145;

        border-radius: 10px;

        box-shadow:
          0 6px 24px
          rgba(0,0,0,.40);

        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }


      #menu-consent-banner p {

        margin:
          0 0 14px;

        font-size:
          14px;

        line-height:
          1.45;
      }


      #menu-consent-banner a {

        color:
          #DFA145;

        text-decoration:
          underline;

        font-weight:
          600;
      }


      #menu-consent-actions {

        display:
          flex;

        gap:
          10px;

        justify-content:
          flex-end;
      }


      #menu-consent-banner button {

        padding:
          9px 16px;

        border-radius:
          6px;

        font-size:
          14px;

        cursor:
          pointer;
      }


      #menu-consent-reject {

        background:
          transparent;

        color:
          #ffffff;

        border:
          1px solid #777777;
      }


      #menu-consent-accept {

        background:
          #DFA145;

        color:
          #111111;

        border:
          1px solid #DFA145;

        font-weight:
          600;
      }


      #menu-cookie-settings {

        position:
          fixed;

        right:
          10px;

        bottom:
          10px;

        z-index:
          999998;

        padding:
          5px 8px;

        background:
          rgba(17,17,17,.90);

        color:
          #DFA145;

        border:
          1px solid
          rgba(223,161,69,.55);

        border-radius:
          5px;

        font-size:
          11px;

        cursor:
          pointer;

        opacity:
          .75;
      }


      #menu-cookie-settings:hover {

        opacity:
          1;
      }


      @media (
        max-width: 600px
      ) {

        #menu-consent-banner {

          left:
            10px;

          right:
            10px;

          bottom:
            10px;

          padding:
            14px;
        }


        #menu-consent-actions {

          justify-content:
            stretch;
        }


        #menu-consent-banner button {

          flex:
            1;
        }
      }

    `;

    document.head.appendChild(
      style
    );


    /*
     * HTML BANNER
     */

    const banner =
      document.createElement('div');

    banner.id =
      'menu-consent-banner';


    banner.innerHTML = `

      <p>
        Questo sito utilizza cookie tecnici e, previo consenso,
        cookie analitici per le finalità illustrate nella
        <a href="cookie-policy.html">
          Cookie Policy
        </a>.
      </p>

      <div id="menu-consent-actions">

        <button
          id="menu-consent-reject"
          type="button"
        >
          Rifiuta
        </button>

        <button
          id="menu-consent-accept"
          type="button"
        >
          Accetta
        </button>

      </div>
    `;


    document.body.appendChild(
      banner
    );


    /*
     * RIFIUTA
     */

    document
      .getElementById(
        'menu-consent-reject'
      )
      .addEventListener(
        'click',
        () => {

          updateAnalyticsConsent(
            'denied'
          );

          banner.remove();

          createCookieSettingsButton();
        }
      );


    /*
     * ACCETTA
     */

    document
      .getElementById(
        'menu-consent-accept'
      )
      .addEventListener(
        'click',
        () => {

          updateAnalyticsConsent(
            'granted'
          );

          banner.remove();

          createCookieSettingsButton();
        }
      );
  }


  /*
   * -------------------------------------------------------
   * PICCOLO PULSANTE PER RIVEDERE LA SCELTA
   * -------------------------------------------------------
   *
   * Non modifica il layout.
   * È sovrapposto in basso a destra.
   */

  function createCookieSettingsButton() {

    if (
      document.getElementById(
        'menu-cookie-settings'
      )
    ) {
      return;
    }

    const button =
      document.createElement('button');

    button.id =
      'menu-cookie-settings';

    button.type =
      'button';

    button.textContent =
      'Cookie';

    button.setAttribute(
      'aria-label',
      'Rivedi le tue scelte sui cookie'
    );

    button.addEventListener(
      'click',
      resetConsentPreference
    );

    document.body.appendChild(
      button
    );
  }


  /*
   * -------------------------------------------------------
   * EVENT TRACKING
   * -------------------------------------------------------
   */

  function trackEvent(
    eventName,
    params = {}
  ) {

    if (
      typeof window.gtag ===
      'function'
    ) {

      window.gtag(
        'event',
        eventName,
        {

          language:
            languageCode,

          ...params
        }
      );
    }


    if (
      typeof window.clarity ===
      'function'
    ) {

      try {

        window.clarity(
          'event',
          eventName
        );

      } catch (e) {

        console.warn(
          'Clarity event error:',
          e
        );
      }
    }
  }


  /*
   * -------------------------------------------------------
   * MENU OPEN
   * -------------------------------------------------------
   */

  function trackMenuOpen() {

    if (
      sessionStorage.getItem(
        `menu_open_${languageCode}`
      )
    ) {
      return;
    }


    sessionStorage.setItem(
      `menu_open_${languageCode}`,
      '1'
    );


    trackEvent(
      'menu_open',
      {

        page_type:
          languageCode === 'INDEX'
            ? 'language_selector'
            : 'menu'
      }
    );
  }


  /*
   * -------------------------------------------------------
   * LANGUAGE SELECTED
   * -------------------------------------------------------
   */

  function trackLanguageSelection() {

    const languageCards =
      document.querySelectorAll(
        '.lang-card'
      );


    languageCards.forEach(
      card => {

        card.addEventListener(
          'click',
          () => {

            const href =
              card.getAttribute(
                'href'
              ) || '';


            const match =
              href.match(
                /menu_([A-Z]{2})\.html$/i
              );


            if (!match) {
              return;
            }


            trackEvent(
              'language_selected',
              {

                selected_language:
                  match[1]
                    .toUpperCase()
              }
            );
          }
        );
      }
    );
  }


  /*
   * -------------------------------------------------------
   * SCROLL DEPTH
   * -------------------------------------------------------
   */

  function trackScrollDepth() {

    if (
      languageCode === 'INDEX'
    ) {
      return;
    }


    const thresholds =
      [
        25,
        50,
        75,
        90,
        100
      ];


    const reached =
      new Set();


    const handler = () => {

      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;


      const viewportHeight =
        window.innerHeight;


      const documentHeight =
        Math.max(

          document.body.scrollHeight,

          document.documentElement.scrollHeight
        );


      if (
        documentHeight <=
        viewportHeight
      ) {
        return;
      }


      const percent =
        Math.min(
          100,

          Math.round(

            (
              (
                scrollTop +
                viewportHeight
              )
              /
              documentHeight
            )
            *
            100
          )
        );


      thresholds.forEach(
        threshold => {

          if (
            percent >= threshold &&
            !reached.has(
              threshold
            )
          ) {

            reached.add(
              threshold
            );


            trackEvent(
              'scroll_depth',
              {

                scroll_percent:
                  threshold
              }
            );
          }
        }
      );
    };


    window.addEventListener(
      'scroll',
      handler,
      {
        passive: true
      }
    );


    window.addEventListener(
      'load',
      handler
    );


    setTimeout(
      handler,
      1000
    );
  }


  /*
   * -------------------------------------------------------
   * PRODUCT TRACKING
   * -------------------------------------------------------
   */

  function setupProductTracking() {

    if (
      languageCode === 'INDEX'
    ) {
      return;
    }


    const viewed =
      new Set();


    let productViewNumber =
      0;


    const getProductName =
      element => {

        return (

          element
            .querySelector(
              '.item-name'
            )
            ?.textContent
            ?.trim()

          ||

          element
            .querySelector(
              '.dessert-name'
            )
            ?.textContent
            ?.trim()

          ||

          'unknown'
        );
      };


    const getProductType =
      element => {

        if (
          element
            .classList
            .contains(
              'dessert-item'
            )
        ) {

          return 'dessert';
        }

        return 'focaccia';
      };


    const observeProducts =
      () => {


        const elements =
          [

            ...document.querySelectorAll(
              '.bs-item, .menu-item, .dessert-item'
            )

          ];


        if (
          !elements.length
        ) {

          return false;
        }


        elements.forEach(
          (element, index) => {

            element.dataset.analyticsPosition =
              String(
                index + 1
              );
          }
        );


        const observer =
          new IntersectionObserver(

            entries => {

              entries.forEach(
                entry => {

                  if (
                    !entry.isIntersecting
                  ) {

                    return;
                  }


                  const element =
                    entry.target;


                  const productName =
                    getProductName(
                      element
                    );


                  const position =
                    Number(

                      element
                        .dataset
                        .analyticsPosition

                      ||

                      0
                    );


                  const productType =
                    getProductType(
                      element
                    );


                  const key =
                    `${languageCode}|${productType}|${productName}|${position}`;


                  if (
                    viewed.has(
                      key
                    )
                  ) {

                    return;
                  }


                  viewed.add(
                    key
                  );


                  productViewNumber++;


                  trackEvent(
                    'product_view',
                    {

                      product_name:
                        productName,

                      product_position:
                        position,

                      product_type:
                        productType,

                      product_view_number:
                        productViewNumber
                    }
                  );


                  observer.unobserve(
                    element
                  );
                }
              );
            },

            {
              threshold:
                0.5
            }
          );


        elements.forEach(
          element => {

            observer.observe(
              element
            );
          }
        );


        return true;
      };


    let attempts =
      0;


    const interval =
      setInterval(
        () => {

          attempts++;


          if (
            observeProducts()
            ||
            attempts >= 20
          ) {

            clearInterval(
              interval
            );
          }

        },
        500
      );
  }


  /*
   * -------------------------------------------------------
   * INIT
   * -------------------------------------------------------
   */

  function init() {

    ensureGA4();

    ensureClarity();

    createConsentBanner();

    trackMenuOpen();


    if (
      languageCode === 'INDEX'
    ) {

      trackLanguageSelection();

    } else {

      trackScrollDepth();

      setupProductTracking();
    }
  }


  /*
   * -------------------------------------------------------
   * START
   * -------------------------------------------------------
   */

  if (
    document.readyState ===
    'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      init
    );

  } else {

    init();
  }

})();
