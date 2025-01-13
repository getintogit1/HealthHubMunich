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
            // document.querySelectorAll('.content').forEach(function(element) {
            //     element.style.color = '#000000'; // Change text color for light mode
            //     element.style.backgroundColor = '#ffffff'; // Change background color for light mode
            // });
            
        case 'dark':
            // Update styles for elements within the 'content' class
            document.querySelectorAll('.content').forEach(function(element) {
                element.style.color = '#ffffff'; // Change text color for dark mode
                element.style.backgroundColor = '#000000'; // Change background color for dark mode
            });   
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

const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    // Update button styles based on mode
    const isLightMode = document.body.classList.contains("light-mode");
    if (isLightMode) {
        toggleBtn.style.setProperty("--btn-border-color", "#fff");
        toggleBtn.style.setProperty("--btn-text-color", "#fff");
    } else {
        toggleBtn.style.setProperty("--btn-border-color", "#000");
        toggleBtn.style.setProperty("--btn-text-color", "#000");
    }
});