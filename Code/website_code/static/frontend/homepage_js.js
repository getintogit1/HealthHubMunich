



 // Base Maps
//CartoDB layer names: light_all / dark_all / light_nonames / dark_nonames

// Define options for the minimap basemap (same as main map's basemap)
const cardo_options = {
    maxZoom: 19,
    noWrap: true,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}; 

const CartoDB_light_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', cardo_options);

const CartoDB_dark_all = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',cardo_options);

// Define options for the minimap basemap (same as main map's basemap)
const osm_options = {
    maxZoom: 19,
    noWrap: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    easeLinearity: 0.2  // Corrected typo here
};

// Create the minimap basemap tile layer
const osmMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', osm_options);

// Define the bounds for Munich
const bounds = L.latLngBounds(
    L.latLng(48.0, 11.2),   // Southwest corner of the bounding box
    L.latLng(48.3, 11.8)    // Northeast corner of the bounding box (removed comma)
);

const mapElement = 'map'; // Added missing semicolon

// My Map 
const mymap = L.map(mapElement, {
    center: [48.1351, 11.5820],
    zoom: 11,
    minZoom: 10,
    zoomSnap: 0.25,
    zoomDelta: 0.25,
    easeLinearity: 0.2,
    worldCopyJump: true, // Corrected casing here
    layers: [CartoDB_light_all],
    maxBounds: bounds, // Set the maximum bounds
    attributionControl: false, // Vladimir says ist ok , so well remove it :)
});

// Basemap Object
const baseLayers = {
    "Map": osmMap,
    "Light": CartoDB_light_all,
    "Dark": CartoDB_dark_all
};

const layerControl = L.control.layers(baseLayers)

// fixing scrolling users
mymap.on('resize', function(e) {
    console.log('the map has been resized.');
    mymap.flyTo([48.1351, 11.5820]); // fly to [lat, lon]
    mymap.setView([48.1351, 11.5820]); // Refocus on Munich
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


    const hospitals_muc = '/static/GEOJSONFILES/MUNICH_KRANKENHAUS_ALLE/MUNICH_KRANKENHÄUSER.geojson'
    

    
// Create the hospitals_muc_geojsonlayer once and perform all operations inside its `.then()` block
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
        const hospitals_muc_geojsonlayer = L.geoJSON(data);



        // Function to calculate the centroid of a polygon
        function calculateCentroid(coordinates) {
            // Calculate the average of the coordinates
            const avg = coordinates.reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
            const numPoints = coordinates.length;
            return [avg[0] / numPoints, avg[1] / numPoints];
        }

        // Calculate Nearest Hospital:
        // Calculate nearest Hospital
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
                console.log("THIS IS MY POSITION:", position)
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                const user_location_icon = L.icon({
                    iconUrl: "/static/logos/location-pin_blue.png",
                    iconSize: [30, 30],
                    iconAnchor:[15,30],
                    popupAnchor: [0, -30]
                });

                const userPositionMarker = L.marker([userLat, userLng], { icon: user_location_icon }).bindPopup("My Position").addTo(mymap);
                userPositionMarker.openPopup();
                userPositionMarker.on('click', function(event){
                    mymap.setView(event.latlng, 13); // Zoom to the marker's location
                });


                // Iterate over each hospital and calculate distance
                let nearestHospital;
                let minDistance = Infinity;

                // Initialize variables to store nearest hospital coordinates
                let nearestHospitalLat, nearestHospitalLng;

                // Iterate over each hospital to find the nearest one
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

                                console.log("HELLO",hospitalName, houseNumber, street, district_exact, district, city, state, postalcode)
                                document.getElementById('hospitalName').innerText = hospitalName || 'Unknown';
                                document.getElementById('hospitalAddress').innerText = `${street} ${houseNumber} in ${postalcode} ${city}` || 'Unknown';
                                
                                // ICON ACTION HOSPITAL
                                const hospital_location_icon = L.icon({
                                    iconUrl: "/static/logos/location-pin_green.png",
                                    iconSize: [30, 30],
                                    iconAnchor:[15,30],
                                    popupAnchor: [0, -30]
                                });

                                const nearestHospitalMarker = L.marker([lat, lon], { icon: hospital_location_icon }).addTo(mymap);
                                nearestHospitalMarker.bindPopup(hospitalName, { className: 'custom-popup' }); // Add the class name option here
                                nearestHospitalMarker.openPopup();

                                nearestHospitalMarker.on('click', function(event){
                                    mymap.setView(event.latlng, 13); // Zoom to the marker's location
                                });
                                    
                            } else {
                                throw new Error('No address found for the provided coordinates');
                            }
                        })
                        .catch(error => {
                            console.error('Error getting address:', error);
                        });
                }
            });           





   
      


  
  

