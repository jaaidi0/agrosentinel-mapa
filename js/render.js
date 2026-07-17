// UI rendering: turns a view-model (see logic.js) into HTML/style objects.
// No fetching, no Leaflet map APIs here - just string/object building.

var CULTIVO_ICONOS = { Olivo: "🫒", Citrico: "🍊" };

function iconoCultivo(cultivo) {
  return CULTIVO_ICONOS[cultivo] || "🌱";
}

export function estiloMarcador(viewModel) {
  return {
    fillColor: viewModel.estado.color,
    color: "#ffffff",
    weight: 3,
    radius: viewModel.badge === 'badge-real' ? 18 : 14
  };
}

function renderEstadoChip(conexion) {
  return "<span class='conexion-chip conexion-" + conexion.nivel + "'>" + conexion.label + "</span>";
}

export function renderSinDatos(nombre) {
  return "<div class='popup-grande popup-sin-datos'>" +
    "<div class='popup-status-strip' style='background:#9ca3af'></div>" +
    "<div class='popup-body'>" +
    "<div class='popup-header'>" +
      "<span class='cultivo-icono'>📡</span>" +
      "<span class='cultivo-tag'>" + nombre + "</span>" +
      renderEstadoChip({ nivel: 'desconectado', label: '❌ Desconectado' }) +
    "</div>" +
    "<div class='sin-datos-aviso'>⚠️ Sin datos en tiempo real</div>" +
    "<div class='sin-datos-sub'>Fuente externa no disponible</div>" +
    "</div></div>";
}

function renderUltimoDatoValido(viewModel) {
  var timestampLine = viewModel.ultimaActualizacion
    ? "<div>" + viewModel.ultimaActualizacion + "</div>"
    : "";
  return "<div class='ultimo-dato-box'>" +
    "<b>Último dato válido:</b>" +
    timestampLine +
    "<div>VPD " + viewModel.vpd + " kPa &middot; ETc " + viewModel.etc_mm + " mm</div>" +
    "</div>" +
    "<div class='datos-no-disponibles-aviso'>⚠️ Datos en tiempo real no disponibles</div>";
}

function renderFitosanitario(fito) {
  if (!fito) return "";
  return "<div class='fito-box " + fito.clase + "'>" +
    "Estado fitosanitario (" + fito.enfermedad + "): <b>" + fito.nivel + "</b>" +
    "<div class='fito-interpretacion'>" + fito.interpretacion + "</div>" +
    "<div class='fito-interpretacion' style='font-style:normal; font-weight:600; margin-top:2px;'>" + fito.recomendacion + "</div>" +
    "</div>";
}

function renderForecast(forecast) {
  var html = "<div class='forecast-table-wrap'><table class='forecast-table'>" +
    "<tr><th>Dia</th><th>Tmax</th><th>VPD</th><th>Riego</th></tr>";
  forecast.forEach(function (d) {
    html += "<tr>" +
      "<td>" + d.day + "</td>" +
      "<td>" + d.temperature_max + "°C</td>" +
      "<td><span class='" + d.vpdClase + "'>" + d.vpd + "</span></td>" +
      "<td>" + d.dose_m3ha + " m³</td>" +
      "</tr>";
  });
  html += "</table></div>";
  return html;
}

export function renderPopup(viewModel, conexion) {
  conexion = conexion || { nivel: 'activo', label: '✅ Activo' };
  var textoBadge = viewModel.badge === 'badge-real' ? 'DATO REAL (en vivo)' : 'DATO REAL (historico)';
  var ts = viewModel.ultimaActualizacion;
  var avisoDatos = conexion.nivel !== 'activo' ? renderUltimoDatoValido(viewModel) : '';

  return "<div class='popup-grande'>" +
    "<div class='popup-status-strip' style='background:" + viewModel.estado.color + "'></div>" +
    "<div class='popup-body'>" +
    "<div class='popup-header'>" +
      "<span class='cultivo-icono'>" + iconoCultivo(viewModel.cultivo) + "</span>" +
      "<span class='cultivo-tag'>" + viewModel.cultivo + " &middot; " + viewModel.estado.icono + " " + viewModel.estado.estado + "</span>" +
      renderEstadoChip(conexion) +
    "</div>" +
    avisoDatos +
    "<div class='accion-principal'>" + viewModel.accion + "</div>" +
    "<div class='tecnico'>VPD " + viewModel.vpd + " kPa &middot; ETc " + viewModel.etc_mm + " mm</div>" +
    "<div class='popup-divider'></div>" +
    renderFitosanitario(viewModel.fitosanitario) +
    "<div class='forecast-mini'><b>Prevision 7 dias</b>" + renderForecast(viewModel.forecast) + "</div>" +
    "<div class='popup-divider'></div>" +
    "<small class='popup-estacion'>" + viewModel.nombre + "</small><br>" +
    "<span class='" + viewModel.badge + "' style='margin-top:4px;'>" + textoBadge + "</span>" +
    (ts ? " <small style='color:#9ca3af'>" + ts + "</small>" : "") +
    "</div>" +
    "</div>";
}
