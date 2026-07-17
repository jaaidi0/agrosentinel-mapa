// Header clock: pure DOM, ticks every second, no business logic.

var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

function formatearReloj(date) {
  var mes = MESES[date.getMonth()];
  mes = mes.charAt(0).toUpperCase() + mes.slice(1);
  return date.getDate() + ' ' + mes + ' · ' + pad(date.getHours()) + ':' + pad(date.getMinutes());
}

export function initClock(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  function tick() { el.textContent = formatearReloj(new Date()); }
  tick();
  setInterval(tick, 1000);
}
