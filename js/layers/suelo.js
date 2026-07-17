export function crearCapaSuelo() {
  return fetch('/js/hiba_suelo_latest.json')
    .then(r => r.json())
    .then(datos => {
      var layer = L.layerGroup();
      datos.forEach(function(d) {
        var hace = Math.round((Date.now() - new Date(d.ts)) / 3600000);
        var color = d.tipo === 'Suelo I' ? '#92400e' : d.tipo === 'Suelo II' ? '#a16207' : '#854d0e';
        var popup = '<b>' + d.tipo + ' - ' + d.id + '</b><br><small style="color:#6b7280">HIBA UCO - Campo</small><br><br>';

        if (d.tipo === 'Suelo III') {
          if (d.nitrogen !== null) popup += '<b>N:</b> ' + d.nitrogen + ' &nbsp; <b>P:</b> ' + d.phosphorus + ' &nbsp; <b>K:</b> ' + d.potassium + '<br>';
          if (d.ph !== null) popup += '<b>pH:</b> ' + d.ph + '<br><br>';
          popup += '<b>Humedad suelo:</b><br>';
          if (d.vwc10cm) popup += '&nbsp;10cm: ' + d.vwc10cm.toFixed(1) + '%<br>';
          if (d.vwc20cm) popup += '&nbsp;20cm: ' + d.vwc20cm.toFixed(1) + '%<br>';
          if (d.vwc40cm) popup += '&nbsp;40cm: ' + d.vwc40cm.toFixed(1) + '%<br>';
          if (d.vwc60cm) popup += '&nbsp;60cm: ' + d.vwc60cm.toFixed(1) + '%<br><br>';
          popup += '<b>Temperatura suelo:</b><br>';
          if (d.temp10cm) popup += '&nbsp;10cm: ' + d.temp10cm.toFixed(1) + 'C<br>';
          if (d.temp20cm) popup += '&nbsp;20cm: ' + d.temp20cm.toFixed(1) + 'C<br>';
          if (d.temp40cm) popup += '&nbsp;40cm: ' + d.temp40cm.toFixed(1) + 'C<br>';
          if (d.temp60cm) popup += '&nbsp;60cm: ' + d.temp60cm.toFixed(1) + 'C<br>';
        } else {
          if (d.humidity01) popup += '<b>Humedad 1:</b> ' + d.humidity01.toFixed(1) + '%<br>';
          if (d.humidity02) popup += '<b>Humedad 2:</b> ' + d.humidity02.toFixed(1) + '%<br>';
          if (d.humidity03) popup += '<b>Humedad 3:</b> ' + d.humidity03.toFixed(1) + '%<br>';
          if (d.temperature01) popup += '<b>Temp suelo:</b> ' + d.temperature01.toFixed(1) + 'C<br>';
          if (d.ec) popup += '<b>EC:</b> ' + d.ec.toFixed(3) + ' dS/m<br>';
          if (d.psi) popup += '<b>PSI:</b> ' + d.psi + ' cbar<br>';
        }

        popup += '<b>Bateria:</b> ' + d.battery.toFixed(2) + 'V<br>';
        popup += '<small style="color:#9ca3af">Hace ' + hace + 'h - HIBA UCO</small>';

        L.circleMarker([d.lat, d.lon], {
          radius: 7, fillColor: color, color: '#fff',
          weight: 2, opacity: 1, fillOpacity: 0.9
        }).bindPopup(popup).addTo(layer);
      });
      return layer;
    });
}
