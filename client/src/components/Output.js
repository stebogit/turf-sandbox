import React from 'react'
import Alert from './Alert';

function Output ({geojson, error}) {
    return (
        <div style={{width: '50%', position: 'relative'}}>
            {error &&
            <Alert message={error} />}

            <iframe
                title="result"
                src={'data:text/html;charset=utf-8;base64,' + btoa(page(JSON.stringify(geojson)))}
                style={{ border: 'none', width: '100%', margin: 'auto', display: 'block' }} height="100%"
                allowFullScreen
                // sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
            />
        </div>
    )
}

function page (geojson) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Turf result</title>
    <!-- Leaflet https://leafletjs.com/download.html -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
            crossorigin=""></script>

    <style type="text/css">
        html, body, iframe, #map {width:100%; height:100%; margin:0; padding:0; border:0; display:block;}
    </style>
</head>
<body>

<div id="error"></div>
<div id="map"></div>

<script src="https://cdn.jsdelivr.net/npm/@turf/turf@5/turf.min.js"></script>
<script>
    const center = [10, 50];

    const map = L.map('map', {
      center: center.slice().reverse(),
      zoom: 6,
      layers: [ L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png') ],
    });

    L.geoJSON(${geojson}).addTo(map);
</script>
</body>
</html>
    `
}

export default Output;
