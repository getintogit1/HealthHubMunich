    // Specify the path to the file
    const filePath = '/static/output_postal.geojson';
    const filepath2006 = '/static/output_postal_2006_with_density.geojson'
    const filepath2022 = '/static/output_postal_2022_with_density.geojson'
    const filepath2014 = 'static/output_postal_2014_with_density.geojson'

    const pharmacys_muc = '/static/GEOJSONFILES/PHARMACYS/HEALTHHUB_APOTHEKEN.geojson'
    const doctors_muc = '/static/GEOJSONFILES/DOCTORS/HEALTHHUB_DOCTORS.geojson'
    const alternatives_muc = '/static/GEOJSONFILES/ALTERNATIVE/HEALTHHUB_ALTERNATIVE.geojson'
    //const hospitals_muc = 'static/GEOJSONFILES/HOSPITALS/HEALTHHUB_hOSPITALS.geojson'
    const hospitals_muc = '/static/GEOJSONFILES/MUNICH_KRANKENHAUS_ALLE/MUNICH_KRANKENHÄUSER.geojson'
    

    

    let geoJSONLayer; // Declare the variable here


       /// CHLOROPLATH /// 673937.5
       ///                 950025.000000
       function getColor(d) {
        return d >= 6000  ? '#01081D' : // #FF3333 Red     for color blind people: #FA9600 // normal blue gradient: #01081D
               d >= 4500  ? '#042D62' : // #FFA800 Orange  for color blind people: #0077CC // normal blue gradient: #042D62
               d >= 3000  ? '#0077CC' : // #FFCC75 orglght for color blind people: #9D02DD // normal blue gradient: #0077CC
               d >= 1500  ? '#00AA89' : // #0FCBA6 turkis  for color blind people: #00AA89 // normal blue gradient: #00AA89
               d >= 0     ? '#6CE5E8' : // #A5E2FF blue    for color blind people:         // normal blue gradient: #6CE5E8
                            '#9b796b';

    }
    function style(feature) {
        return {
            fillColor: getColor(feature.properties.density),
            weight: 3,
            opacity: 3,
            color: 'black',
            dashArray: '1',
            fillOpacity: 0.8,
        };
    }


    


// // Fetch the first GeoJSON file asynchronously
// fetch(filepath2022)
    
//     .then(response => {
//         console.log(filepath2022)
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('First GeoJSON content:', data);
//         // Create first GeoJSON layer
//         const disctricts_with_density = L.geoJSON(data, { style: style });

//         // Fetch the second GeoJSON file asynchronously
//         fetch(pharmacys_muc)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log('Second GeoJSON content:', data);
                
//                 // Create second GeoJSON layer
//                 const pharmacys_muc_geojsonlayer = L.geoJSON(data);

//                 // Fetch the third GeoJSON file asynchronously
//                 fetch(doctors_muc)
//                     .then(response => {
//                         if (!response.ok) {
//                             throw new Error('Network response was not ok');
//                         }
//                         return response.json();
//                     })
//                     .then(data => {
//                         console.log('Third GeoJSON content:', data);
                        
//                         // Create third GeoJSON layer
//                         const doctors_muc_geojsonlayer = L.geoJSON(data);

//                         // Fetch the fourth GeoJSON file asynchronously
//                         fetch(alternatives_muc)
//                             .then(response => {
//                                 if (!response.ok) {
//                                     throw new Error('Network response was not ok');
//                                 }
//                                 return response.json();
//                             })
//                             .then(data => {
//                                 console.log('Fourth GeoJSON content:', data);
                                
//                                 // Create fourth GeoJSON layer
//                                 const alternatives_muc_geojsonlayer = L.geoJSON(data);

// // Create the hospitals_muc_geojsonlayer once and perform all operations inside its `.then()` block
// fetch(hospitals_muc)
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.json();
//     })
//     .then(data => {
//         console.log('Fifth GeoJSON content:', data);
        
//         // Create fifth GeoJSON layer
//         const hospitals_muc_geojsonlayer = L.geoJSON(data);



//         // Function to calculate the centroid of a polygon
//         function calculateCentroid(coordinates) {
//             // Calculate the average of the coordinates
//             const avg = coordinates.reduce((acc, coord) => [acc[0] + coord[0], acc[1] + coord[1]], [0, 0]);
//             const numPoints = coordinates.length;
//             return [avg[0] / numPoints, avg[1] / numPoints];
//         }

//         // Calculate Nearest Hospital:
//         // Calculate nearest Hospital
//         // Function to calculate distance between two points (in kilometers)
//         function getDistance(lat1, lon1, lat2, lon2) {
//             const R = 6371; // Radius of the earth in km
//             const dLat = deg2rad(lat2 - lat1);
//             const dLon = deg2rad(lon2 - lon1);
//             const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                 Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
//                 Math.sin(dLon / 2) * Math.sin(dLon / 2);
//             const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//             const distance = R * c; // Distance in km
//             return distance;
//         }

//         function deg2rad(deg) {
//             return deg * (Math.PI / 180);
//         }

//         // Get user's current location
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 console.log("THIS IS MY POSITION:", position)
//                 const userLat = position.coords.latitude;
//                 const userLng = position.coords.longitude;

//                 const user_location_icon = L.icon({
//                     iconUrl: "/static/logos/location-pin_blue.png", // URL to the marker icon image
//                     iconSize: [40, 40], // Size of the icon image in pixels
//                     iconAnchor:[20,40],
//                     popupAnchor: [0, -40] 
//                 });

//                 const userPositionMarker = L.marker([userLat, userLng], { icon: user_location_icon }).bindPopup("My Position").addTo(mymap);
//                 userPositionMarker.openPopup();
//                 userPositionMarker.on('click', function(event) {
//                     mymap.setView(event.latlng, mymap.getZoom()); // Zoom to the marker's location
//                 });


//                 // Iterate over each hospital and calculate distance
//                 let nearestHospital;
//                 let minDistance = Infinity;

//                 // Initialize variables to store nearest hospital coordinates
//                 let nearestHospitalLat, nearestHospitalLng;

//                 // Iterate over each hospital to find the nearest one
//                 hospitals_muc_geojsonlayer.eachLayer((hospital) => {
//                     const geometry = hospital.feature.geometry;

//                     if (geometry.type === 'Point') {
//                         const coordinates = geometry.coordinates;
//                         const hospitalLat = coordinates[1];
//                         const hospitalLng = coordinates[0];

//                         // Calculate distance for points
//                         const distance = getDistance(userLat, userLng, hospitalLat, hospitalLng);

//                         if (distance < minDistance) {
//                             minDistance = distance;
//                             nearestHospitalLat = hospitalLat;
//                             nearestHospitalLng = hospitalLng;
//                             nearestHospital = hospital;
//                         }
//                     } else if (geometry.type === 'Polygon') {
//                         // Calculate centroid for polygons
//                         const centroid1 = calculateCentroid(geometry.coordinates[0]);
//                         const centroid = [centroid1[1], centroid1[0]];

//                         const hospitalLat = centroid[0];
//                         const hospitalLng = centroid[1];

//                         // Calculate distance for centroids
//                         const distance = getDistance(userLat, userLng, hospitalLat, hospitalLng);

//                         if (distance < minDistance) {
//                             minDistance = distance;
//                             nearestHospitalLat = hospitalLat;
//                             nearestHospitalLng = hospitalLng;
//                             nearestHospital = hospital;
//                         }
//                     }
                      
//                     });

//                 // Perform reverse geocoding for the nearest hospital
//                 if (nearestHospitalLat !== undefined && nearestHospitalLng !== undefined) {
//                     getAddressFromCoordinates(nearestHospitalLat, nearestHospitalLng);
//                 } else {
//                     console.error('Invalid nearest hospital coordinates');
//                 }


//                 // Output nearest hospital
//                 console.log('Nearest hospital:', nearestHospital);

//                 // Update HTML content with nearest hospital information
//                 document.getElementById('distanceToHospital').innerText = minDistance.toFixed(2) + ' km';

//                 }, (error) => {
//                 console.error('Error getting user location:', error);
//                 });
//                 } else {
//                 console.error('Geolocation is not supported by this browser.');
//                 }

//                 function getAddressFromCoordinates(lat, lon) {
//                     const apiUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

                
//                     fetch(apiUrl)
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error('Network response was not ok');
//                             }
//                             return response.json();
//                         })
//                         .then(data => {
//                             // Check if the response contains an address
//                             if (data && data.display_name) {
//                                 const address = data.display_name;
//                                 console.log('Address:', address);
//                                 // Update HTML content with hospital address
//                                 document.getElementById('hospitalAddress').innerText = address;
//                                 // Split the address into individual elements
//                                 var [hospitalName, houseNumber, street, district_exact, district, city, state, postalcode] = address.split(',');

//                                 // Trim whitespace from each element
//                                 hospitalName = hospitalName.trim();
//                                 houseNumber = houseNumber.trim();
//                                 street = street.trim();
//                                 district_exact = district_exact.trim();
//                                 district = district.trim();
//                                 city = city.trim();
//                                 state = state.trim();
//                                 postalcode = postalcode.trim();

//                                 console.log("HELLO",hospitalName, houseNumber, street, district_exact, district, city, state, postalcode)
//                                 document.getElementById('hospitalName').innerText = hospitalName || 'Unknown';
//                                 document.getElementById('hospitalAddress').innerText = `${street} ${houseNumber} in ${postalcode} ${city}` || 'Unknown';
                                
//                                 // ICON ACTION HOSPITAL
//                                 const hospital_location_icon = L.icon({
//                                     iconUrl: "/static/logos/location-pin_green.png", // URL to the marker icon image
//                                     iconSize: [40, 40], // Size of the icon image in pixels
//                                     iconAnchor:[20,40],
//                                     popupAnchor: [0, -40] // Anchor point for opening the popup (above the icon)
//                                 });

//                                 const nearestHospitalMarker = L.marker([lat, lon], { icon: hospital_location_icon }).addTo(mymap);
//                                 nearestHospitalMarker.bindPopup(hospitalName, { className: 'custom-popup' }); // Add the class name option here
//                                 nearestHospitalMarker.openPopup();

//                                 nearestHospitalMarker.on('click', function(event) {
//                                     mymap.setView(event.latlng, mymap.getZoom()); // Zoom to the marker's location
//                                 });
                                    
//                             } else {
//                                 throw new Error('No address found for the provided coordinates');
//                             }
//                         })
//                         .catch(error => {
//                             console.error('Error getting address:', error);
//                         });
//                 }



//         // Create a layer group and add all layers to it
//         //const geoJSONLayersGroup = L.layerGroup([disctricts_with_density, pharmacys_muc_geojsonlayer, doctors_muc_geojsonlayer, alternatives_muc_geojsonlayer, hospitals_muc_geojsonlayer]);

//                                             // Define overlay layers including all GeoJSON layers
//                                             const overlayLayers = {
                                               
//                                                 "Districts": disctricts_with_density,
//                                                 "Pharmacys": pharmacys_muc_geojsonlayer,
//                                                 "Doctors": doctors_muc_geojsonlayer,
//                                                 "Alternatives": alternatives_muc_geojsonlayer,
//                                                 "Hospitals": hospitals_muc_geojsonlayer,
                                                
//                                             };

//                                         // Add the layer group to the layer control
//                                         const layerControl = L.control.layers(baseLayers, overlayLayers, {
//                                             collapsed: false
//                                         }).addTo(mymap);
//                                     })
//                                 .catch(error => {
//                                     console.error('Error reading fifth GeoJSON file:', error);
//                                 });
//                             })
//                             .catch(error => {
//                                 console.error('Error reading fourth GeoJSON file:', error);
//                             });
//                     })
//                     .catch(error => {
//                         console.error('Error reading third GeoJSON file:', error);
//                     });
//             })
//             .catch(error => {
//                 console.error('Error reading second GeoJSON file:', error);
//             });
//     })
//     .catch(error => {
//         console.error('Error reading first GeoJSON file:', error);
//     });


// Fetch the first GeoJSON file asynchronously
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
        // Create first GeoJSON layer
        const disctricts_with_density = L.geoJSON(data, { style: style });

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
                const pharmacys_muc_geojsonlayer = L.geoJSON(data);

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
                        const doctors_muc_geojsonlayer = L.geoJSON(data);

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
                                const alternatives_muc_geojsonlayer = L.geoJSON(data);

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
                                        const hospitals_muc_geojsonlayer = L.geoJSON(data);

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
                                                    iconSize: [40, 40],
                                                    iconAnchor:[20,40],
                                                    popupAnchor: [0, -40]
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
                                                            iconSize: [40, 40],
                                                            iconAnchor:[20,40],
                                                            popupAnchor: [0, -40]
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
                                            collapsed: false
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



   
      