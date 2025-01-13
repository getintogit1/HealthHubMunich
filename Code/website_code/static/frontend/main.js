



    // Base Maps
    //CartoDB layer names: light_all / dark_all / light_nonames / dark_nonames

    // Define options for the minimap basemap (same as main map's basemap)
    const cardo_options = {
        maxZoom: 19,
        noWrap: true,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }; 

    const CartoDB_light_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', cardo_options);
    const mini_light_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', cardo_options);

    const CartoDB_dark_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',cardo_options);
    const mini_dark_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',cardo_options);

    const esri_options = {
        maxZoom: 19,
        noWrap: true,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    }
    const Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', esri_options ); 
    const mini_esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', esri_options ); 


    // Define options for the minimap basemap (same as main map's basemap)
    const osm_options = {
        maxZoom: 19,
        noWrap: true,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    };
    // Create the minimap basemap tile layer
    const osmMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', osm_options);
    const miniosm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', osm_options);


    // Define the bounds for Munich
    const bounds = L.latLngBounds(
    L.latLng(48.0, 11.2),   // Southwest corner of the bounding box
    L.latLng(48.3, 11.8),) // Northeast corner of the bounding box

    mapElement = 'map'
    // My Map 
    const mymap = L.map(mapElement, {
        center: [48.1351, 11.5820],
        zoom: 11,
        minZoom: 10,
        zoomSnap: 0.25,
        zoomDelta:0.25,
        easelinearity: 0.2,
        worldcopyjump: true,
        layers: [CartoDB_light_all],
        maxBounds: bounds // Set the maximum bounds
    });


    // Basemap Object
    const baseLayers = {
        "OSM Map": osmMap,
        "Cardo DB Light": CartoDB_light_all,
        "Cardo DB Dark": CartoDB_dark_all,
        "World Image": Esri_WorldImagery,
    }

    // fixing scrolling users
    mymap.on('resize', function(e) {
        console.log('the map has been resized.');
    });

    mymap.on('resize', function(e) {
        mymap.flyTo([48.1351, 11.5820]) // fly to [lat, lon]
        mymap.setView([48.1351, 11.5820]); // Refocus on Munich
    });

// Import geojson_loader.js
//import './geojsonloader';  



    // Create the minimap using the custom basemap tile layer
    const miniMap = new L.Control.MiniMap(mini_light_all, {
        toggleDisplay: true,
        minimized: false // Set to true if you want the minimap to start minimized
    }).addTo(mymap);

    function updateMiniMapLayer(event) {
        // Remove the existing layer from the minimap
        miniMap._miniMap.removeLayer(miniMap._layer);
        
        // Set the new layer based on the event name
        if (event.name === "OSM Map") {
            miniMap._layer = miniosm;
        } else if (event.name === "Cardo DB Light") {
            miniMap._layer = mini_light_all;
        } else if (event.name === "Cardo DB Dark") {
            miniMap._layer = mini_dark_all;
        } else if (event.name === "World Image") {
            miniMap._layer = mini_esri;
        } else {
            miniMap._layer = event.layer;
        }
    
        // Adding the new layer to the minimap
        miniMap._miniMap.addLayer(miniMap._layer);
    }
    
    // Listen for the baselayerchange event
    mymap.on('baselayerchange', function(event) {
        // Log the name of the selected basemap
        console.log(event.name);
        updateMiniMapLayer(event);
    });



// COLOR SCHEME UPDATE
function setMode(mode) {
    // Remove existing mode classes from body
    document.body.classList.remove('light-mode', 'dark-mode');

    // Add the selected mode class to body
    document.body.classList.add(mode + '-mode');

    // Add the appropriate base layer based on the selected mode
    switch (mode) {
        case 'light':
            // Update styles for elements within the 'content' class
            document.querySelectorAll('.content').forEach(function(element) {
                element.style.color = '#000000'; // Change text color for light mode
                element.style.backgroundColor = '#ffffff'; // Change background color for light mode
            });
            CartoDB_dark_all.remove(); // Remove dark mode layer if present
            CartoDB_light_all.addTo(mymap); // Add light mode layer to the map
            break;
        case 'dark':
            // Update styles for elements within the 'content' class
            document.querySelectorAll('.content').forEach(function(element) {
                element.style.color = '#ffffff'; // Change text color for dark mode
                element.style.backgroundColor = '#000000'; // Change background color for dark mode
            });
            CartoDB_light_all.remove(); // Remove light mode layer if present
            CartoDB_dark_all.addTo(mymap); // Add dark mode layer to the map
            break;
    }

    // You can also store the selected mode in local storage for persistence across page loads
    localStorage.setItem('mode', mode);
}



// On page load, check if a mode is stored in local storage and apply it
document.addEventListener('DOMContentLoaded', function() {
    var storedMode = localStorage.getItem('mode');
    if (storedMode) {
        setMode(storedMode);
    }
});


  
  

