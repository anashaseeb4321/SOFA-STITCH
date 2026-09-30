/* =============================================================
   Sofa Stitch — shared tags for ALL pages except the homepage
   (category pages + /sofas/ product pages).

   Load order in each page <head> (already set up):
     1. inline Consent Mode default (denied)
     2. /site-tags.js   <- this file (re-applies a saved "Accept")
     3. /analytics.js   (GA4 G-NPEJYF56EZ)
     4. gtag('config','AW-18467779574')

   The homepage (index.html) has its own banner that uses the SAME
   localStorage key ("ss_consent"), so a choice made on any page
   carries across the whole site. Do NOT load this file on index.html.
   ============================================================= */
(function () {
  var AW_ID = 'AW-18467779574';

  // WhatsApp tap conversion.
  // Currently counts taps as the "Contact" conversion.
  // If you create a separate "WhatsApp Click" conversion in Google Ads,
  // replace ONLY the label after the slash with the new label.
  var WA_CONVERSION = AW_ID + '/Qf1lCJ6QvIEdEPbnj-ZE';

  var WA_NUMBER = '447438135313';
  var KEY = 'ss_consent';

  function grant() {
    try {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    } catch (e) {}
    try { if (window.fbq) fbq('consent', 'grant'); } catch (e) {}
  }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  // Returning visitor who already accepted: grant immediately,
  // before GA4 / Ads load, so the page view is measured normally.
  if (choice === 'granted') grant();

  // WhatsApp tap tracking (every wa.me link to our number)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me/' + WA_NUMBER + '"]');
    if (!a) return;
    try { gtag('event', 'conversion', { send_to: WA_CONVERSION }); } catch (x) {}
    try { gtag('event', 'whatsapp_click'); } catch (x) {}
  }, true);

  // Banner: only for visitors who haven't chosen yet
  if (choice === 'granted' || choice === 'denied') return;

  function buildBanner() {
    var css = document.createElement('style');
    css.textContent =
      '#ssConsent{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;' +
      'background:#1B1915;color:#fff;border:1px solid rgba(255,255,255,.12);border-top:3px solid #B8902A;' +
      'border-radius:12px;padding:20px 22px;box-shadow:0 20px 50px rgba(0,0,0,.4);font-family:Inter,sans-serif}' +
      '#ssConsent p{font-size:14px;line-height:1.6;color:rgba(255,255,255,.8);margin:0 0 14px}' +
      '#ssConsent a{color:#D4AC50}' +
      '#ssConsent .ss-consent-btns{display:flex;gap:10px;flex-wrap:wrap}' +
      '#ssConsent button{font-family:inherit;font-size:14px;font-weight:600;padding:10px 20px;border-radius:4px;cursor:pointer;border:none}' +
      '#ssConsent .ss-accept{background:#B8902A;color:#fff}' +
      '#ssConsent .ss-accept:hover{background:#D4AC50}' +
      '#ssConsent .ss-reject{background:transparent;color:rgba(255,255,255,.75);border:1px solid rgba(255,255,255,.25)}' +
      '#ssConsent .ss-reject:hover{color:#fff;border-color:rgba(255,255,255,.5)}';
    document.head.appendChild(css);

    var box = document.createElement('div');
    box.id = 'ssConsent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie consent');
    box.innerHTML =
      '<p>We use cookies to run this site and to measure our advertising (Google &amp; Meta). ' +
      'You can accept these or continue with only what\'s essential. See our ' +
      '<a href="/privacy.html">Privacy Policy</a>.</p>' +
      '<div class="ss-consent-btns">' +
      '<button class="ss-accept" id="ssAccept">Accept all</button>' +
      '<button class="ss-reject" id="ssReject">Essential only</button>' +
      '</div>';
    document.body.appendChild(box);

    document.getElementById('ssAccept').addEventListener('click', function () {
      grant(); save('granted'); box.remove();
    });
    document.getElementById('ssReject').addEventListener('click', function () {
      save('denied'); box.remove();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBanner);
  } else {
    buildBanner();
  }
})();
