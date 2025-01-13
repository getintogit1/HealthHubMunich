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
    fullscreenControl: true,        // expanding the map with leaflet plugin
	fullscreenControlOptions: {
		position: 'topleft',
        title: "Fullscreen",
        titleCancel:"Exit"
	},
    center: [48.1351, 11.5820],
    zoom: 11,
    minZoom: 10,
    zoomSnap: 0.25,
    zoomDelta:0.25,
    easelinearity: 0.2,
    worldcopyjump: true,
    layers: [CartoDB_light_all],
    maxBounds: bounds, // Set the maximum bounds
    attributionControl: false, // Vladimir says ist ok , so well remove it :)
    zoomControl: false,       // Disable the default zoom control

    

});




// Basemap Object
const baseLayers = {
    "Light": CartoDB_light_all,
    "Dark": CartoDB_dark_all,
    "Normal":osmMap,
}

// fixing scrolling users
mymap.on('resize', function(e) {
    console.log('the map has been resized.');
});

mymap.on('resize', function(e) {
    mymap.flyTo([48.1351, 11.5820]) // fly to [lat, lon]
    mymap.setView([48.1351, 11.5820]); // Refocus on Munich
});


const filePath = '/static/output_postal.geojson';
const filepath2006 = '/static/output_postal_2006_with_density.geojson'
const filepath2022 = '/static/output_postal_2022_with_density.geojson'
const filepath2014 = 'static/output_postal_2014_with_density.geojson'

const pharmacys_muc = '/static/GEOJSONFILES/PHARMACYS/HEALTHHUB_APOTHEKEN.geojson'
const doctors_muc = '/static/GEOJSONFILES/DOCTORS/HEALTHHUB_DOCTORS.geojson'
const alternatives_muc = '/static/GEOJSONFILES/ALTERNATIVE/HEALTHHUB_ALTERNATIVE.geojson'
//const hospitals_muc = 'static/GEOJSONFILES/HOSPITALS/HEALTHHUB_hOSPITALS.geojson'
const hospitals_muc = '/static/GEOJSONFILES/MUNICH_KRANKENHAUS_ALLE/MUNICH_KRANKENHÄUSER.geojson'


var style = ((feature)=> {
    return {
        fillColor: getColor(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.5
    }
})





    // Fetch the selected GeoJSON file asynchronously
    fetch(filepath2022)
    .then(response => {
        console.log(filepath2022);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('First GeoJSON content:', data);
        // Create first GeoJSON layer THIS IS THE IMPORTANT AND DIFFERENT PART TO GEOJSONLOADER + MAIN.js
        const disctricts_with_density = L.geoJson(data, {
                            style: style,
                            onEachFeature: ((feature, layer) => {
                                // Highlight county on mouse hover
                                layer.on('mouseover', (e) => {
                                    var layer = e.target;
                                    const feature = layer.feature;
                                    if (feature) {
                                        const district_color = style(feature).fillColor;
                                        console.log(district_color);
            
                                        // Set the background color of the legend container to the district color
                                        document.getElementById('info').style.backgroundColor = district_color;
                                        document.getElementById('info2').style.backgroundColor = district_color;
                                        document.getElementById('info3').style.backgroundColor = district_color;
            
                                        layer.setStyle({
                                            weight: 5,
                                            color: '#FFFFFF',
                                            dashArray: '',
                                            fillOpacity: 0.7
                                        });
                                        layer.bringToFront();
                                    }
                                });
            
                                // Return to original symbology upon mouse hover out
                                layer.on('mouseout', function () {
                                    disctricts_with_density.resetStyle(this);
                                });
            
                                // Zoom to county upon clicking it
                                layer.on('click', (e) => {
                                    mymap.fitBounds(e.target.getBounds());
                                    map.setZoom(map.getZoom() + 3); // Increase the zoom level by 1
                                });
                            })
                        }).addTo(mymap);
            
                        // Set up event listeners on the geojson layer
                        disctricts_with_density.on('mouseover', function (e) {
                            info.update(e.layer.feature.properties);
                        });
            
                        disctricts_with_density.on('click', function (e) {
                            info.update(e.layer.feature.properties);
                        });
            
                        // Reset info control when layer is added to map
                        mymap.on('overlayadd', function (e) {
                            if (e.layer === disctricts_with_density) {
                                info.update();
                            }
                        });
                
        // END SPECIAL PART


        // Fetch the second GeoJSON file asynchronously
        fetch(pharmacys_muc)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Second GeoJSON content:', data);
                // Create second GeoJSON layer
                const pharmacys_muc_geojsonlayer = L.geoJSON(data, {
                    // Define a function to run for each feature in the GeoJSON
                    onEachFeature: function (feature, layer) {
                        // Check if the feature has a 'properties' object with a 'name' property
                        if (feature.properties && feature.properties.name) {
                            // Bind a popup with the 'name' property to the layer (marker)
                            layer.bindPopup(feature.properties.name);
                        }
                    }
                });

                // Fetch the third GeoJSON file asynchronously
                fetch(doctors_muc)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Third GeoJSON content:', data);
                        // Create third GeoJSON layer
                        const doctors_muc_geojsonlayer = L.geoJSON(data, {
                            // Define a function to run for each feature in the GeoJSON
                            onEachFeature: function (feature, layer) {
                                // Check if the feature has a 'properties' object with a 'name' property
                                if (feature.properties && feature.properties.name) {
                                    // Bind a popup with the 'name' property to the layer (marker)
                                    layer.bindPopup(feature.properties.name);
                                }
                            }
                        });

                        // Fetch the fourth GeoJSON file asynchronously
                        fetch(alternatives_muc)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Network response was not ok');
                                }
                                return response.json();
                            })
                            .then(data => {
                                console.log('Fourth GeoJSON content:', data);
                                // Create fourth GeoJSON layer
                                const alternatives_muc_geojsonlayer =L.geoJSON(data, {
                                    // Define a function to run for each feature in the GeoJSON
                                    onEachFeature: function (feature, layer) {
                                        // Check if the feature has a 'properties' object with a 'name' property
                                        if (feature.properties && feature.properties.name) {
                                            // Bind a popup with the 'name' property to the layer (marker)
                                            layer.bindPopup(feature.properties.name);
                                        }
                                    }
                                });

                                // Fetch the fifth GeoJSON file asynchronously
                                fetch(hospitals_muc)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        console.log('Fifth GeoJSON content:', data);
                                        // Create fifth GeoJSON layer
                                        const hospitals_muc_geojsonlayer =L.geoJSON(data);

                                        // Function to calculate the centroid of a polygon
                                        function calculateCentroid(coordinates) {
                                            // Calculate the average of the coordinates
                                            const avg = coordinates.reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
                                            const numPoints = coordinates.length;
                                            return [avg[0] / numPoints, avg[1] / numPoints];
                                        }

                                        // Calculate Nearest Hospital:
                                        // Function to calculate distance between two points (in kilometers)
                                        function getDistance(lat1, lon1, lat2, lon2) {
                                            const R = 6371; // Radius of the earth in km
                                            const dLat = deg2rad(lat2 - lat1);
                                            const dLon = deg2rad(lon2 - lon1);
                                            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                                Math.sin(dLon / 2) * Math.sin(dLon / 2);
                                            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                            const distance = R * c; // Distance in km
                                            return distance;
                                        }

                                        function deg2rad(deg) {
                                            return deg * (Math.PI / 180);
                                        }

                                        // Get user's current location
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition((position) => {
                                                console.log("THIS IS MY POSITION:", position);
                                                const userLat = position.coords.latitude;
                                                const userLng = position.coords.longitude;

                                                // Define user location icon
                                                const user_location_icon = L.icon({
                                                    iconUrl: "/static/logos/location-pin_blue.png",
                                                    iconSize: [30, 30],
                                                    iconAnchor:[15,30],
                                                    popupAnchor: [0, -30]
                                                });

                                                // Create marker for user's position
                                                const userPositionMarker = L.marker([userLat, userLng], { icon: user_location_icon }).bindPopup("My Position").addTo(mymap);
                                                userPositionMarker.openPopup();
                                                userPositionMarker.on('click', function(event) {
                                                    mymap.setView(event.latlng, mymap.getZoom());
                                                });

                                                // Initialize variables for nearest hospital
                                                let nearestHospital;
                                                let minDistance = Infinity;
                                                let nearestHospitalLat, nearestHospitalLng;

                                                // Iterate over each hospital and calculate distance
                                                hospitals_muc_geojsonlayer.eachLayer((hospital) => {
                                                    const geometry = hospital.feature.geometry;

                                                    if (geometry.type === 'Point') {
                                                        const coordinates = geometry.coordinates;
                                                        const hospitalLat = coordinates[1];
                                                        const hospitalLng = coordinates[0];

                                                        // Calculate distance for points
                                                        const distance = getDistance(userLat, userLng, hospitalLat, hospitalLng);

                                                        if (distance < minDistance) {
                                                            minDistance = distance;
                                                            nearestHospitalLat = hospitalLat;
                                                            nearestHospitalLng = hospitalLng;
                                                            nearestHospital = hospital;
                                                        }
                                                    } else if (geometry.type === 'Polygon') {
                                                        // Calculate centroid for polygons
                                                        const centroid1 = calculateCentroid(geometry.coordinates[0]);
                                                        const centroid = [centroid1[1], centroid1[0]];

                                                        const hospitalLat = centroid[0];
                                                        const hospitalLng = centroid[1];

                                                        // Calculate distance for centroids
                                                        const distance = getDistance(userLat, userLng, hospitalLat, hospitalLng);

                                                        if (distance < minDistance) {
                                                            minDistance = distance;
                                                            nearestHospitalLat = hospitalLat;
                                                            nearestHospitalLng = hospitalLng;
                                                            nearestHospital = hospital;
                                                        }
                                                    }
                                                });

                                                // Perform reverse geocoding for the nearest hospital
                                                if (nearestHospitalLat !== undefined && nearestHospitalLng !== undefined) {
                                                    getAddressFromCoordinates(nearestHospitalLat, nearestHospitalLng);
                                                } else {
                                                    console.error('Invalid nearest hospital coordinates');
                                                }

                                                // Output nearest hospital
                                                console.log('Nearest hospital:', nearestHospital);

                                                // Update HTML content with nearest hospital information
                                                document.getElementById('distanceToHospital').innerText = minDistance.toFixed(2) + ' km';

                                            }, (error) => {
                                                console.error('Error getting user location:', error);
                                            });
                                        } else {
                                            console.error('Geolocation is not supported by this browser.');
                                        }

                                        // Function to get address from coordinates
                                        function getAddressFromCoordinates(lat, lon) {
                                            const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

                                            fetch(apiUrl)
                                                .then(response => {
                                                    if (!response.ok) {
                                                        throw new Error('Network response was not ok');
                                                    }
                                                    return response.json();
                                                })
                                                .then(data => {
                                                    // Check if the response contains an address
                                                    if (data && data.display_name) {
                                                        const address = data.display_name;
                                                        console.log('Address:', address);
                                                        // Update HTML content with hospital address
                                                        document.getElementById('hospitalAddress').innerText = address;
                                                        // Split the address into individual elements
                                                        var [hospitalName, houseNumber, street, district_exact, district, city, state, postalcode] = address.split(',');

                                                        // Trim whitespace from each element
                                                        hospitalName = hospitalName.trim();
                                                        houseNumber = houseNumber.trim();
                                                        street = street.trim();
                                                        district_exact = district_exact.trim();
                                                        district = district.trim();
                                                        city = city.trim();
                                                        state = state.trim();
                                                        postalcode = postalcode.trim();

                                                        // Update HTML elements with hospital information
                                                        document.getElementById('hospitalName').innerText = hospitalName || 'Unknown';
                                                        document.getElementById('hospitalAddress').innerText = `${street} ${houseNumber} in ${postalcode} ${city}` || 'Unknown';

                                                        // Define hospital location icon
                                                        const hospital_location_icon = L.icon({
                                                            iconUrl: "/static/logos/location-pin_green.png",
                                                            iconSize: [30, 30],
                                                            iconAnchor:[15,30],
                                                            popupAnchor: [0, -30]
                                                        });

                                                        // Create marker for nearest hospital
                                                        const nearestHospitalMarker = L.marker([lat, lon], { icon: hospital_location_icon }).addTo(mymap);
                                                        nearestHospitalMarker.bindPopup(hospitalName, { className: 'custom-popup' });
                                                        nearestHospitalMarker.openPopup();

                                                        nearestHospitalMarker.on('click', function(event) {
                                                            mymap.setView(event.latlng, mymap.getZoom());
                                                        });
                                                    } else {
                                                        throw new Error('No address found for the provided coordinates');
                                                    }
                                                })
                                                .catch(error => {
                                                    console.error('Error getting address:', error);
                                                });
                                        }

                                        // Define overlay layers including all GeoJSON layers
                                        const overlayLayers = {
                                            "Districts": disctricts_with_density,
                                            "Pharmacys": pharmacys_muc_geojsonlayer,
                                            "Doctors": doctors_muc_geojsonlayer,
                                            "Alternatives": alternatives_muc_geojsonlayer,
                                            "Hospitals": hospitals_muc_geojsonlayer,
                                        };

                                        // Add the overlay layers to the layer control
                                        const layerControl = L.control.layers(baseLayers, overlayLayers, {
                                            collapsed: true
                                        }).addTo(mymap);

                                    })
                                    .catch(error => {
                                        console.error('Error reading fifth GeoJSON file:', error);
                                    });
                            })
                            .catch(error => {
                                console.error('Error reading fourth GeoJSON file:', error);
                            });
                    })
                    .catch(error => {
                        console.error('Error reading third GeoJSON file:', error);
                    });
            })
            .catch(error => {
                console.error('Error reading second GeoJSON file:', error);
            });
    })
    .catch(error => {
        console.error('Error reading first GeoJSON file:', error);
    });




    // adding Minimap
        // Create the minimap using the custom basemap tile layer
        const miniMap = new L.Control.MiniMap(mini_light_all, {
            toggleDisplay: true,
            minimized: false, // Set to true if you want the minimap to start minimized
            width:200,
            height:200,
        }).addTo(mymap);
        
        function updateMiniMapLayer(layerName) {
            // Remove the existing layer from the minimap
            miniMap._miniMap.removeLayer(miniMap._layer);
            
            // Set the new layer based on the layer name
            if (layerName === "Light") {
                miniMap._layer = mini_light_all;
            } else if (layerName === "Dark") {
                miniMap._layer = mini_dark_all;
            } else if (layerName === "Normal") {
                miniMap._layer = miniosm;
            } else {
                // For other layers, assuming they are provided directly
                miniMap._layer = layerName;
            }
            
            // Adding the new layer to the minimap
            miniMap._miniMap.addLayer(miniMap._layer);
        }

        
        // Listen for the baselayerchange event
        mymap.on('baselayerchange', function(event) {
            // Log the name of the selected basemap
            var currentlayer_name = event.name
            console.log(currentlayer_name);
            updateMiniMapLayer(currentlayer_name);
        });



  
    