// Bottom status bar: per-station "last updated" + connection status.
// Owns its own DOM under #statusbar; no business logic, no Leaflet.

var lastUpdates = {};
var conexiones = {};
var estados = {};
var reintentando = {};

function formatAgo(ms) {
  var segs = Math.floor(ms / 1000);
  if (segs < 60) return "hace " + segs + "s";
  var mins = Math.floor(segs / 60);
  if (mins < 60) return "hace " + mins + " min";
  var horas = Math.floor(mins / 60);
  return "hace " + horas + "h";
}

function renderRow(stationId) {
  var row = document.getElementById('status-' + stationId);
  if (!row) return;
  var update = lastUpdates[stationId];
  var conexion = conexiones[stationId] || { nivel: 'desconectado', label: '❌ Desconectado', dotClass: 'dot-err' };

  row.querySelector('.station-time').textContent = update
    ? "Último dato " + formatAgo(Date.now() - update.at)
    : "⚠️ Sin datos en tiempo real";

  var connText;
  if (reintentando[stationId] && !update) {
    connText = "Reintentando conexión...";
  } else if (conexion.nivel === 'desconectado') {
    connText = "Fuente no disponible";
  } else {
    connText = conexion.label;
  }
  row.querySelector('.station-conn').textContent = connText;
  row.querySelector('.dot').className = 'dot ' + (conexion.dotClass || 'dot-err');

  var estado = estados[stationId];
  var stressDot = row.querySelector('.stress-dot');
  if (stressDot) stressDot.style.background = estado ? estado.color : '#4b5563';
}

export function initStatusBar(stations) {
  var container = document.getElementById('statusbar');
  stations.forEach(function (station) {
    var row = document.createElement('div');
    row.className = 'station-status';
    row.id = 'status-' + station.id;
    row.innerHTML =
      "<span class='dot dot-err'></span>" +
      "<span class='stress-dot' title='Nivel de estres'></span>" +
      "<span class='station-name'>" + station.nombre + "</span>" +
      "<span class='station-time'>⚠️ Sin datos en tiempo real</span>" +
      "<span class='station-conn'>Reintentando conexión...</span>";
    container.appendChild(row);
  });
  setInterval(function () {
    stations.forEach(function (station) { renderRow(station.id); });
  }, 5000);
}

export function markUpdated(stationId, estado) {
  lastUpdates[stationId] = { at: Date.now() };
  reintentando[stationId] = false;
  if (estado) estados[stationId] = estado;
  renderRow(stationId);
}

export function setConnection(stationId, conexion, isReintentando) {
  conexiones[stationId] = conexion;
  reintentando[stationId] = !!isReintentando;
  renderRow(stationId);
}
