# Health Hub Munich Website

## Description
This project is a Django-based website that utilizes HTML, CSS, JavaScript, Leaflet, and GeoJSON for mapping functionalities. It serves as a platform to showcase geographic data interactively.

## Features
- Interactive mapping with Leaflet
- Integration of GeoJSON data
- Django-powered backend for dynamic content management
- Responsive frontend design using HTML and CSS
- Enhanced user experience with JavaScript functionalities

## Installation
1. Clone this repository to your local machine using:<br>
git clone "https://git.sbg.ac.at/s1086122/designstudio_ss24.git"

2. Navigate into the project directory:<br>
\path\to\your\dir>

3. Install the required dependencies:<br>
\path\to\your\dir> **pip install -r ./requirements.txt**

If its not working you need to delet directory hierachie by deleting folder:[pages, analyse]<br>
than run: <br>
\path\to\your\dir> **django-admin startproject website_code**   
-> generate folder with settings.py urls.py (main folder) <br>
\path\to\your\dir> **python manage.py startapp pages**          
-> generate app pages ( will render our html docs)<br>
\path\to\your\dir> **python manage.py startapp analyse**        
-> generate app analyse ( will render analyse html doc)

4. Apply migrations to set up the database:<br>
(make sure your manage.py file is inside this directory path)<br>
\path\to\your\dir> **python manage.py makemigrations** <br>
\path\to\your\dir> **python manage.py migrate**<br>
(you need to migrate everytime after you made changes to your database by making changes in django modely.py file)<br>


5. Start the development server:<br>
\path\to\your\dir> **python manage.py runserver**<br>


6. Access the website in your browser at `http://127.0.0.1:8000/`.#

7. Access Django-Admin in your browser at `http://127.0.0.1:8000/admin/`

8. To use static files change your settings.py file accordingly and make sure you pointing to the right static dir

9. After you made your Static settings run : 
\path\to\your\dir> **py mange.py collectstatic**<br>


## Installation of Rollup
1. npm install --save-dev rollup
2. npm install --save-dev @rollup/plugin-babel @babel/core @babel/preset-env
3. Create a rollup.config.js (sometimes if .js dont work, try: rollup.config.mjs) (see file for structure or Rollup docs) 
4. after making changes run in your main Terminal: rollup-c (everytime after you made changes to your budle, make sure you pointing in your .html to your created "bundle.js" file)

## Usage
- Upon accessing the website, explore the interactive map interface.<br>
- Use the provided functionalities to navigate through different geographic data layers.<br>
- Interact with the various features of the website to understand its capabilities.<br>

## Contributing

1. Fork the repository.<br>
2. Create a new branch (`git checkout -b feature/your-feature`).<br>
3. Make your changes.<br>
4. Commit your changes (`git commit -am 'Add new feature'`).<br>
5. Push to the branch (`git push origin feature/your-feature`).<br>
6. Create a new Pull Request.<br>

## License
[  GNU GENERAL PUBLIC LICENSE ](/DesignStudio_SS24/LiCENSE)

## Acknowledgements
- [Leaflet](https://leafletjs.com/)
- [Django](https://www.djangoproject.com/)
- [GeoJSON](https://geojson.org/)
- [HTML](https://html.com/)
- [JS](https://www.javascript.com/)
- [React](https://react.dev/)
- [Rollup](https://rollupjs.org/)
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)


