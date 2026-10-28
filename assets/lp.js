/* LP Do Prado e Rodrigues — visitas, leads (Supabase) e parallax */
(function () {
  var c = window.LP_CONFIG;
  if (!c) return;

  window.lpInsert = function (table, row) {
    return fetch(c.supabaseUrl + '/rest/v1/' + table, {
      method: 'POST',
      headers: { apikey: c.supabaseAnonKey, Authorization: 'Bearer ' + c.supabaseAnonKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row), keepalive: true
    });
  };

  // origem do acesso (UTM, Google Ads, Meta ou site de referência)
  try {
    var q = new URLSearchParams(location.search), o = '';
    if (q.get('utm_source')) o = q.get('utm_source') + (q.get('utm_campaign') ? ' / ' + q.get('utm_campaign') : '');
    else if (q.get('gclid') || q.get('gbraid') || q.get('wbraid')) o = 'google-ads';
    else if (q.get('fbclid')) o = 'meta';
    else if (document.referrer && document.referrer.indexOf(location.hostname) < 0) { try { o = new URL(document.referrer).hostname; } catch (e) {} }
    if (o) sessionStorage.setItem('lp_origem', o.slice(0, 120));
  } catch (e) {}
  function origem() { try { return sessionStorage.getItem('lp_origem') || 'direto'; } catch (e) { return 'direto'; } }

  try { lpInsert('lp_visits', { site: c.site, path: location.pathname, referrer: (document.referrer || '').slice(0, 500) || null }); } catch (e) {}

  // formulário
  var f = document.getElementById('lead-form');
  if (f) {
    var n = f.querySelector('input[name="nome"]'), w = f.querySelector('input[name="telefone"]');
    var btn = f.querySelector('button[type="submit"]'), label = btn.innerHTML, msg = f.querySelector('.form-msg');
    var mask = function (v) {
      var d = String(v || '').replace(/\D/g, '').slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    };
    w.addEventListener('input', function () { w.value = mask(w.value); w.setCustomValidity(''); });
    n.addEventListener('input', function () { n.setCustomValidity(''); });
    var sending = false;
    f.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      if (sending) return;
      var nome = n.value.trim(), digits = w.value.replace(/\D/g, '');
      if (nome.length < 3) { n.setCustomValidity('Informe seu nome.'); n.reportValidity(); return; }
      if (digits.length < 10 || digits.length > 11) { w.setCustomValidity('Informe um WhatsApp válido com DDD.'); w.reportValidity(); return; }
      sending = true; btn.disabled = true; btn.textContent = 'Enviando…'; msg.style.display = 'none';
      try {
        var key = 'lp_sent_' + c.site + '_' + digits, already = false;
        try { var t = +sessionStorage.getItem(key); already = t && (Date.now() - t < 30 * 60 * 1000); } catch (e) {}
        if (!already) {
          var r = await lpInsert('lp_leads', { site: c.site, nome: nome.slice(0, 120), whatsapp: digits, origem: origem() });
          if (!r.ok) throw new Error('falha');
          try { sessionStorage.setItem(key, String(Date.now())); } catch (e) {}
        }
        try { window.dataLayer = window.dataLayer || []; dataLayer.push({ event: 'lead_submit', area: c.area }); if (window.fbq) fbq('track', 'Lead'); if (window.gtag) gtag('event', 'generate_lead'); } catch (e) {}
        location.href = '/redirect/?' + new URLSearchParams({ nome: nome, whatsapp: w.value, area: c.area, lp: c.slug }).toString();
      } catch (e) {
        sending = false; btn.disabled = false; btn.innerHTML = label;
        msg.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.'; msg.style.display = 'block';
      }
    });
  }

  // parallax das fotos de fundo
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var items = [].slice.call(document.querySelectorAll('.photo'));
  if (!items.length) return;
  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    items.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
      el.firstElementChild.style.setProperty('--py', (p * r.height * 0.13).toFixed(1) + 'px');
    });
    ticking = false;
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
