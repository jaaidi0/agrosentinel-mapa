// Pure business logic: no DOM, no Leaflet, no HTML strings.

export function clasificarEstado(vpd) {
  if (vpd > 3.0) return { color: "#e74c3c", estado: "Estres critico", icono: "🔴", radio: 20 };
  if (vpd > 1.5) return { color: "#f39c12", estado: "Estres moderado", icono: "💧", radio: 16 };
  return { color: "#2ecc71", estado: "Sin estres", icono: "✅", radio: 12 };
}

export function vpdClase(vpd) {
  if (vpd > 3.0) return "vpd-crit";
  if (vpd > 1.5) return "vpd-mod";
  return "vpd-ok";
}

export function calcularRiesgoFitosanitario(cultivo, temp, vpd) {
  var enfermedad = cultivo === "Olivo" ? "repilo" : "alternaria";
  var rangoAlto, rangoMedio;
  if (cultivo === "Olivo") {
    rangoAlto = temp >= 14 && temp <= 20;
    rangoMedio = temp >= 8 && temp <= 28;
  } else {
    rangoAlto = temp >= 20 && temp <= 25;
    rangoMedio = temp >= 18 && temp <= 28;
  }

  if (rangoAlto && vpd < 0.7) {
    return {
      enfermedad: enfermedad,
      nivel: "Riesgo alto",
      clase: "fito-alto",
      interpretacion: "Condiciones favorables para infeccion si se mantienen varias horas",
      recomendacion: "Vigilar de cerca, valorar tratamiento preventivo"
    };
  }
  if (rangoMedio && vpd < 1.2) {
    return {
      enfermedad: enfermedad,
      nivel: "Riesgo medio",
      clase: "fito-medio",
      interpretacion: "Vigilar evolucion de humedad y temperatura",
      recomendacion: "Sin accion inmediata, revisar en proximas horas"
    };
  }
  return {
    enfermedad: enfermedad,
    nivel: "Riesgo bajo",
    clase: "fito-bajo",
    interpretacion: "Ambiente poco favorable para la infeccion",
    recomendacion: "No se requiere tratamiento fitosanitario"
  };
}

export function decidirAccionRiego(rec, vpd, horaActual) {
  if (rec.stress === "Severe" || vpd > 3.0) {
    if (horaActual >= 10 && horaActual < 20) {
      return "🚨 Riego urgente inmediato (" + rec.dose_m3ha + " m3/ha)";
    }
    return "Regar " + rec.dose_m3ha + " m3/ha antes de las 10:00";
  }
  if (vpd > 1.5) {
    if (horaActual >= 10 && horaActual < 20) {
      return "Vigilar riego hoy (" + rec.dose_m3ha + " m3/ha para el atardecer)";
    }
    return "Vigilar riego hoy (" + rec.dose_m3ha + " m3/ha cada " + rec.frequency + ")";
  }
  return "No es necesario regar hoy";
}

// Connection-status thresholds derived from each station's own expected cadence
// (SSE stations are fed by a ~15min ingestion cycle; polling stations refresh
// every pollIntervalMs). Purely a frontend read of "how stale is the last
// update", no backend behaviour involved.
export function umbralesConexion(station) {
  if (station.stream === 'sse') {
    return { activoMs: 18 * 60 * 1000, degradadoMs: 45 * 60 * 1000 };
  }
  var poll = station.pollIntervalMs || 30000;
  return { activoMs: poll * 3, degradadoMs: 10 * 60 * 1000 };
}

export function clasificarConexion(lastUpdateAt, umbrales, ahoraMs, forzado) {
  ahoraMs = ahoraMs || Date.now();

  if (forzado === 'desconectado' && !lastUpdateAt) {
    return { nivel: 'desconectado', label: '❌ Desconectado', dotClass: 'dot-err' };
  }
  if (!lastUpdateAt) {
    return { nivel: 'desconectado', label: '❌ Desconectado', dotClass: 'dot-err' };
  }

  var edadMs = ahoraMs - lastUpdateAt;
  if (forzado !== 'desconectado' && edadMs <= umbrales.activoMs) {
    return { nivel: 'activo', label: '✅ Activo', dotClass: 'dot-ok' };
  }
  if (edadMs <= umbrales.degradadoMs) {
    return { nivel: 'degradado', label: '⚠️ Degradado', dotClass: 'dot-warn' };
  }
  return { nivel: 'desconectado', label: '❌ Desconectado', dotClass: 'dot-err' };
}

export function tiempoTranscurrido(timestamp, ahora) {
  ahora = ahora || new Date();
  var ts2 = timestamp.includes('Z') ? timestamp : timestamp + 'Z';
  var entonces = new Date(ts2);
  var segs = Math.floor((ahora - entonces) / 1000);
  if (segs < 60) return "hace " + segs + "s";
  var mins = Math.floor(segs / 60);
  if (mins < 60) return "hace " + mins + " min";
  var horas = Math.floor(mins / 60);
  return "hace " + horas + "h";
}

// Combines a raw API payload + station metadata into a plain view-model
// with no HTML or Leaflet dependencies, ready for the renderer.
export function construirViewModel(payload, station, ahora) {
  var rec = payload.recommendation;
  var vpd = rec.vpd;
  var temp = payload.reading ? payload.reading.temperature : null;
  var estado = clasificarEstado(vpd);
  var horaActual = (ahora || new Date()).getHours();

  return {
    nombre: station.nombre,
    cultivo: station.cultivo,
    badge: station.badge,
    estado: estado,
    vpd: vpd,
    etc_mm: rec.etc_mm,
    accion: decidirAccionRiego(rec, vpd, horaActual),
    fitosanitario: temp !== null ? calcularRiesgoFitosanitario(station.cultivo, temp, vpd) : null,
    forecast: payload.forecast.slice(0, 7).map(function (d) {
      return {
        day: d.day,
        temperature_max: d.temperature_max,
        vpd: d.vpd,
        vpdClase: vpdClase(d.vpd),
        dose_m3ha: d.dose_m3ha
      };
    }),
    ultimaActualizacion: payload.reading && payload.reading.timestamp
      ? tiempoTranscurrido(payload.reading.timestamp, ahora)
      : ""
  };
}
