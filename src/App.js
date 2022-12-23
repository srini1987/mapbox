import './App.css';
import React from 'react'
import { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import geoData from "./geoData";

function App() {
  useEffect(() => {
    //access token
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYWthc2g3ODQiLCJhIjoiY2s5djFzZGVjMDZ1bjNobno2bnpqcmM1ZSJ9.sSCmxRN30ldqt1rVVPTEOg";
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.9851659999999, 40.0541710000001], // [-77.04, 38.907],
      zoom: 8
    });
    map.on("load", () => {
      map.addSource("places", {
        type: "geojson",
        data: geoData
      });
      // Add a layer showing the places.
      map.addLayer({
        id: "places",
        type: "circle",
        source: "places",
        paint: {
          "circle-color": "#2DBFC4", //'#4264fb',
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff"
        }
      });

      // Create a popup
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      map.on("mouseenter", "places", (e) => {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const siteId = e.features[0].properties.SITE_ID;
        const siteName = e.features[0].properties.SITE_NAME;
        const siteAddr = e.features[0].properties.SITE_ADDRESS;
        const html = `<b>Site ID:</b> ${siteId}<br><b>Site Name:</b> ${siteName}<br><b>Site Address:</b> ${siteAddr}`;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        popup.setLngLat(coordinates).setHTML(html).addTo(map);
      });

      map.on("mouseleave", "places", () => {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });
    });
    // Add search control to the map.
    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );
    //add navigation control
    map.addControl(new mapboxgl.NavigationControl());
    //reset when clicking home button
    document.getElementById("home").addEventListener("click", () => {
      map.setCenter([-74.9851659999999, 40.0541710000001]);
      map.setZoom(8);
    });
    //Add legend
    var html = '<h4>Site Names</h4>';
    geoData.features.forEach((val) => {
      const siteName = val.properties.SITE_NAME;
      html += `<div><span>${siteName}</span></div>`;
      //console.log(siteName)
      document.getElementById('legend').innerHTML = html
    })
  }, []);

  return (
    <div className="App">
      <div className="mapHdr">Mapbox - UI Assignment</div>
      <div id='legend'></div>
      <div id="map"></div>
      <div><button id="home">Home</button></div>
    </div>
  );
}

export default App;
