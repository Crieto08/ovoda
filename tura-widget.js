/**
 * Tündérkert Óvoda – Virtuális Séta Widget
 *
 * Használat a HTML-ben:
 *   <div class="tura-widget" data-tour="tours/tura1/config.json"></div>
 */
(function () {
  'use strict';

  function waitForPannellum(cb) {
    if (window.pannellum) { cb(); return; }
    var t = setInterval(function () {
      if (window.pannellum) { clearInterval(t); cb(); }
    }, 50);
  }

  function initWidget(container) {
    var configUrl = container.getAttribute('data-tour');
    if (!configUrl) return;
    var baseUrl = configUrl.substring(0, configUrl.lastIndexOf('/') + 1);

    container.classList.add('tw-container');
    container.innerHTML = '<div class="tw-veil"><span>Betöltés…</span></div>' +
                          '<div class="tw-pano"></div>' +
                          '<div class="tw-bar"><span class="tw-label"></span></div>';

    var panoEl  = container.querySelector('.tw-pano');
    var veilEl  = container.querySelector('.tw-veil');
    var labelEl = container.querySelector('.tw-label');

    // Egyedi ID a Pannellum-hoz
    var uid = 'tw' + Date.now() + Math.floor(Math.random() * 1000);
    panoEl.id = uid;

    fetch(configUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (cfg) {
        buildPannellum(cfg, baseUrl, uid, veilEl, labelEl);
      })
      .catch(function (err) {
        veilEl.querySelector('span').textContent = 'Nem sikerült betölteni a túrát.';
        console.error('[TuraWidget]', err);
      });
  }

  function buildPannellum(cfg, baseUrl, uid, veilEl, labelEl) {
    var scenes = {};

    cfg.scenes.forEach(function (scene) {
      var hotSpots = (scene.hotSpots || []).map(function (hs) {
        // megkeressük a célszoba thumb-ját
        var target = cfg.scenes.find(function (s) { return s.id === hs.sceneId; });
        var thumbUrl = target ? (baseUrl + target.thumb) : null;
        var capturedText = hs.text;

        return {
          pitch:    hs.pitch,
          yaw:      hs.yaw,
          type:     'scene',
          text:     capturedText,
          sceneId:  hs.sceneId,
          cssClass: 'tw-hotspot',
          createTooltipFunc: (function (txt, thumb) {
            return function (div) {
              var circle = document.createElement('div');
              circle.className = 'tw-circle';
              if (thumb) {
                circle.style.backgroundImage = 'url(' + thumb + ')';
              } else {
                circle.classList.add('tw-circle--icon');
                circle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
              }
              var label = document.createElement('div');
              label.className = 'tw-hs-label';
              label.textContent = txt;
              div.appendChild(circle);
              div.appendChild(label);
            };
          }(capturedText, thumbUrl))
        };
      });

      scenes[scene.id] = {
        type:      'equirectangular',
        panorama:  baseUrl + scene.panorama,
        hotSpots:  hotSpots
      };
    });

    waitForPannellum(function () {
      var viewer = pannellum.viewer(uid, {
        default: {
          firstScene:         cfg.firstScene,
          autoLoad:           true,
          showZoomCtrl:       false,
          showFullscreenCtrl: true,
          compass:            false,
          sceneFadeDuration:  500,
          hfov:               100
        },
        scenes: scenes
      });

      viewer.on('load', function () {
        veilEl.style.opacity = '0';
        setTimeout(function () { veilEl.style.display = 'none'; }, 400);
        updateLabel(viewer.getScene());
      });

      viewer.on('scenechange', function (id) { updateLabel(id); });

      viewer.on('error', function (err) {
        veilEl.style.display = 'flex';
        veilEl.querySelector('span').textContent = 'Hiba: ' + err;
      });

      function updateLabel(sceneId) {
        var sc = cfg.scenes.find(function (s) { return s.id === sceneId; });
        labelEl.textContent = sc ? sc.title : '';
      }
    });
  }

  // Auto-init
  function autoInit() {
    document.querySelectorAll('.tura-widget[data-tour]').forEach(initWidget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

  window.TuraWidget = { init: initWidget };
}());
