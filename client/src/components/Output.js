import React, {forwardRef, useContext} from 'react';
import Alert from './Alert';
import {AppContext} from '../context';

function Output (props, ref) {
    const {geojson, error} = useContext(AppContext);
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
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
          integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
          crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.6.0/dist/leaflet.js"
            integrity="sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew=="
            crossorigin=""></script>

    <!-- leaflet-simplestyle -->
    <script src="https://unpkg.com/leaflet-simplestyle@1.0.1/dist/leaflet-simplestyle.min.js"
            integrity="sha384-5/fqZjPyJTThDocZ9o85x+dhgirhDqRKjJ5Z72zDzFpyJxi1Mdl9TvoPIuddk4EF"
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
      zoom: 6,
    });

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
