import React, {forwardRef} from 'react';
import Alert from './Alert';

function Output ({geojson, error}, ref) {
    return (
        <>
            {error &&
            <Alert message={error} />}

            <iframe
                title="result" ref={ref} sandbox="allow-scripts allow-popups"
                src={'data:text/html;charset=utf-8;base64,' + btoa(page(JSON.stringify(geojson)))}
            />
        </>
    )
}

function page (geojson) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Turf result</title>
    <!-- Leaflet https://leafletjs.com/download.html -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
          integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
          crossorigin="" />
    <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
            integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
            crossorigin=""></script>

    <!-- leaflet-simplestyle -->
    <script src="https://unpkg.com/leaflet-simplestyle@1.2.4/dist/leaflet-simplestyle.min.js"
            integrity="sha384-MUW8mmDYbCEQ9ocMk0C8yuhyW3fx+Ab5eSgDZp0jUL0Rfxa9M2xmDyGPAK1P3nTw"
            crossorigin=""></script>

    <style type="text/css">
        html, body, iframe, #map {width:100%; height:100%; margin:0; padding:0; border:0; display:block;}
    </style>
</head>
<body>

<div id="map"></div>

<script>
    const center = [10, 50];

    const map = L.map('map', {
      center: center.slice().reverse(),
      zoom: 4,
    });

    // make it open in another tab
    map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps" target="_blank" rel="noreferrer noopener">Leaflet</a>');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer noopener">OpenStreetMap</a> contributors'
    }).addTo(map);

    const geoJSON = L.geoJSON(${geojson}, {
        useSimpleStyle: true,
        useMakiMarkers: true,
        style: (feature) => ({...feature.properties}),
    }).addTo(map);
    const bounds = geoJSON.getBounds();
    if (bounds.isValid()) map.fitBounds(bounds);
</script>
</body>
</html>
    `;
}

export default forwardRef(Output);
