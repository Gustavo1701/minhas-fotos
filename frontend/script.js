let latitudeEl = document.getElementById('latitude');
let longitudeEl = document.getElementById('longitude');
let accuracyEl = document.getElementById('accuracy');

let map, marker, accuracyCircle;

async function success(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const acc = pos.coords.accuracy;

    // Obter o IP externo
    let ip = '';
    try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        ip = data.ip;
    } catch (err) {
        console.error('Erro ao obter IP:', err);
    }

    // Atualiza info no DOM
    latitudeEl.textContent = `Latitude: ${lat}`;
    longitudeEl.textContent = `Longitude: ${lon}`;
    accuracyEl.textContent = `Precisão: ${acc.toFixed(1)} metros`;

    console.log('Enviando para o backend:', { ip, latitude: lat, longitude: lon });

    // Enviar ao backend
    fetch('http://127.0.0.1:4000/localizacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ip,     
            latitude: lat, 
            longitude: lon 
        })
    }).then(res => {
        if (res.ok) {
            console.log('Localização enviada com sucesso!');
        } else {
            res.json().then(data => {
                console.warn('Erro ao salvar localização:', data.message);
            });
        }
    }).catch(err => console.error('Erro ao enviar localização:', err));

    // Mostrar no mapa
    if (!map) {
        map = L.map('map').setView([lat, lon], 17);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(map);
    } else {
        map.setView([lat, lon], 17);
    }

    if (marker) marker.setLatLng([lat, lon]);
    else marker = L.marker([lat, lon]).addTo(map).bindPopup('Você está aqui').openPopup();

    if (accuracyCircle) accuracyCircle.setLatLng([lat, lon]).setRadius(acc);
    else accuracyCircle = L.circle([lat, lon], {
        radius: acc,
        color: 'blue',
        fillOpacity: 0.1
    }).addTo(map);
}

function error(err) {
    console.warn(`Erro ao obter localização: ${err.message}`);
    // Recarrega a página se o usuário negar
    location.reload();
}

navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
});
