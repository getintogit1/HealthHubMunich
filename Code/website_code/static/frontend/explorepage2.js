// use of sequential instead of diverging because we have no 50/50 or -1 0 +1 etc or two siedes i want do demmonstrate instead i want to show the amount decreasing in each district
function getColor(d) {
  if (d === 0) {
      return '#B3E5FC'; // Add the appropriate color for the value 0  -> because in create legend color i needet that adjustment
  } else if (d > 5500) {
      return '#82B1FF';
  } else if (d > 4500) {
      return '#0D47A1';
  } else if (d > 3750) {
      return '#1976D2';
  } else if (d > 3000) {
      return '#2196F3';
  } else if (d > 2250) {
      return '#4FC3F7';
  } else if (d > 1500) {
      return '#82B1FF';
  } else if (d > 0) {
      return '#B3E5FC';
  } else {
      return "#000000"; // Default color for negative values
  }
}
 

//   function getColorBlind(d) {
//     if (d > 5500) {
//         return '#0052B4';
//     } else if (d > 4500) {
//         return '#2E8B57'; // Dark green
//     } else if (d > 3750) {
//         return '#FFD700'; // Gold
//     } else if (d > 3000) {
//         return '#00FFFF'; // Cyan
//     } else if (d > 2250) {
//         return '#A52A2A'; // Brown
//     } else if (d > 1500) {
//         return '#FFA07A'; // Light salmon
//     } else {
//         return '#808080'; // Gray
//     }
// }







// Add control for info
var info = L.control();

info.onAdd = function (mymap) {
this.div = L.DomUtil.create('div', 'info');
this.update();
return this.div;
};

info.update = function (props) {
// Update info control content based on feature properties
console.log(props); // Check the value of props
document.getElementById('info').innerHTML = '<h4>Dichte</h4>' + (props ? 
'<b>' + props.Name + '</br><br />' + 'Bewohner pro Apotheke' + '<br>' + (props.density).toFixed(2)+ '<br> <br>' + 
props.Bevölkerung + ' Bewohner' : 'Hover über Bezirk');
};

info.addTo(mymap);




// Define the grades and getColor function according to your map's data
var grades = [0, 1500, 2250, 3000, 3750, 4500, 5500]; // Include 0 in the grades array


// Create a function to generate the legend
function createLegend() {
  var legendContainer = document.getElementById('legend');
  var div = document.createElement('div');
  div.className = 'legend-container'; // Add a class to style the legend container as a row

  // Loop through density intervals in reverse order
  for (var i = grades.length - 1; i >= 0; i--) {
      var color = getColor(grades[i]); // getColor is assumed to be a function defined elsewhere
      var label = '';
          label = '>' + grades[i];
      var legendItem = document.createElement('div');
      legendItem.className = 'legend-item'; // Add a class to style each legend item as a row
      legendItem.innerHTML = '<div class="legend-color" style="background:' + color + '"></div>' + label;
      div.appendChild(legendItem);
  }

  legendContainer.appendChild(div);
}

// Call the createLegend function after the map has been initialized
createLegend();




//// COLOR CHANGE 
// COLOR SCHEME UPDATE
function setMode(mode) {
  // Remove existing mode classes from body
  document.body.classList.remove('light-mode', 'dark-mode');

  // Add the selected mode class to body
  document.body.classList.add(mode + '-mode');

  // Check if the current base layer is "Normal"
  var currentLayerName = mymap.getLayerName(mymap._currentLayer);

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
          if (currentLayerName === "Normal") {  // I want to have same minimap like base layer, <- therefore this part
              CartoDB_light_all.remove(); // Remove light mode layer
              osmMap.addTo(mymap); // Add OSM layer
          }
          break;
      case 'dark':
          // Update styles for elements within the 'content' class
          document.querySelectorAll('.content').forEach(function(element) {
              element.style.color = '#ffffff'; // Change text color for dark mode
              element.style.backgroundColor = '#000000'; // Change background color for dark mode
          });
          CartoDB_light_all.remove(); // Remove light mode layer if present
          CartoDB_dark_all.addTo(mymap); // Add dark mode layer to the map
          if (currentLayerName === "Normal") {
              CartoDB_dark_all.remove(); // Remove dark mode layer
              osmMap.addTo(mymap); // Add OSM layer
          }
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