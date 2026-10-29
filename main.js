/* Automatische Preis-Umschaltung:
 * 15 € gilt bis einschließlich 31.12.2026 (Europe/Berlin).
 * Ab 01.01.2027, 00:00 Uhr Europe/Berlin, wird überall automatisch 25 € angezeigt –
 * Preise, Hinweistexte, FAQ und Footer gleichzeitig. */
(function () {
  'use strict';

  // Stichtag: 1. Januar 2027, 00:00 Uhr Europe/Berlin (Winterzeit = UTC+1)
  var CUTOFF = new Date('2027-01-01T00:00:00+01:00');
  var PRICE_BEFORE = '15 €';
  var PRICE_AFTER = '25 €';

  function currentPrice() {
    return new Date() < CUTOFF ? PRICE_BEFORE : PRICE_AFTER;
  }

  function applyPrice() {
    var now = new Date();
    var after = now >= CUTOFF;
    var price = after ? PRICE_AFTER : PRICE_BEFORE;

    // Alle Preis-Zahlen
    document.querySelectorAll('[data-price]').forEach(function (el) {
      el.textContent = price;
    });

    // Langer Hinweis (Preis-Karte)
    document.querySelectorAll('[data-price-note]').forEach(function (el) {
      el.innerHTML = after
        ? '<strong>Neuer Preis aktiv:</strong> Seit dem 01.01.2027 kostet ein Design 25&nbsp;€.'
        : '<strong>15&nbsp;€-Preis gilt bis einschließlich 31.12.2026.</strong> ' +
          'Ab dem 01.01.2027 kostet ein Design automatisch 25&nbsp;€.';
    });

    // Kurzer Hinweis (Hero)
    document.querySelectorAll('[data-price-short]').forEach(function (el) {
      el.textContent = after ? 'seit 01.01.2027' : 'gilt bis 31.12.2026';
    });

    // Footer-Satz
    document.querySelectorAll('[data-footer-price]').forEach(function (el) {
      el.textContent = after
        ? '25 € (seit 01.01.2027)'
        : '15 € bis 31.12.2026, danach 25 €';
    });

    // FAQ-Antwort
    var faq = document.getElementById('faq-price-answer');
    if (faq) {
      faq.innerHTML = after
        ? 'Aktuell <strong>25&nbsp;€</strong> pro Design (Thumbnail oder Logo). Der Preis ist zum 01.01.2027 automatisch von 15&nbsp;€ auf 25&nbsp;€ gestiegen.'
        : 'Aktuell <strong>15&nbsp;€</strong> pro Design (Thumbnail oder Logo). Dieser Preis gilt bis einschließlich 31.12.2026 – danach kostet ein Design automatisch 25&nbsp;€.';
    }

    // Countdown zur Preiserhöhung
    document.querySelectorAll('[data-countdown]').forEach(function (el) {
      if (after) {
        el.hidden = true;
      } else {
        el.hidden = false;
        var days = Math.ceil((CUTOFF - now) / 86400000);
        el.textContent =
          'Nur noch ' + days.toLocaleString('de-DE') +
          ' Tage bis zum Preiswechsel auf 25 €';
      }
    });
  }

  // Beim Laden setzen …
  applyPrice();

  // … einmal pro Minute aktualisieren (z. B. nach Standby) …
  setInterval(applyPrice, 60000);

  // … und exakt zum Stichtag umschalten. setTimeout akzeptiert max.
  // ca. 24 Tage, deshalb wird der Timer in Etappen gesetzt, bis der
  // Stichtag erreicht ist.
  var TIMER_CAP = 2147483000; // ~24,8 Tage in Millisekunden
  function scheduleCutoffTimer() {
    var msLeft = CUTOFF - new Date();
    if (msLeft <= 0) {
      applyPrice();
      return;
    }
    setTimeout(function () {
      scheduleCutoffTimer();
    }, Math.min(msLeft, TIMER_CAP));
  }
  scheduleCutoffTimer();

  // FAQ-Details: nur eins gleichzeitig offen (Komfort-Feature)
  var items = document.querySelectorAll('.faq__item');
  items.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (item.open) {
        items.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
