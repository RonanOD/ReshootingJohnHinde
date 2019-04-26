
const mapStyle = [
    {
      "featureType": "administrative",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 33
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#f2e5d4"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5dac6"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "lightness": 20
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c5c6c6"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e4d7c6"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#fbfaf7"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#acbcc9"
        }
      ]
    }
  ];

  var map;
  
  // Escapes HTML characters in a template literal string, to prevent XSS.
  // See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
  function sanitizeHTML(strings) {
    const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
    let result = strings[0];
    for (let i = 1; i < arguments.length; i++) {
      result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
        return entities[char];
      });
      result += strings[i];
    }
    return result;
  }
  
  function initMap() {
  
    // Create the map.
    map = new google.maps.Map(document.getElementsByClassName('map')[0], {
      zoom: 7,
      center: {lat: 52.86042833180031, lng: -7.882265599999982},
      styles: mapStyle
    });
  
    let placesList = document.getElementById('places');
    let details = document.getElementById('more');

    details.addEventListener('click', event => {
      window.location = 'http://www.ronanodriscoll.com'
    });

    // Load the stores GeoJSON onto the map.
    let placesCount = 0;
    map.data.loadGeoJson('locations.json', {},
    function(features) {
      features.forEach(feature => {
        placesCount++;
        let li = document.createElement('li');
        let anchor = document.createElement('a');
        anchor.textContent = feature.getProperty('name');
        anchor.setAttribute('href', '#');
        anchor.addEventListener('click', event => {
          const position = feature.getGeometry().get();
          map.setZoom(12);
          map.panTo(position);
        })
        li.appendChild(anchor);
        placesList.appendChild(li);
      });
      // Set the count on the info window.
      let countSpan = document.getElementById('count');
      countSpan.textContent = "(" + placesCount + ")";
    });
  
    // Define the custom marker icons, using the store's "category".
    /*map.data.setStyle(feature => {
      return {
        icon: {
          url: `img/icon_${feature.getProperty('category')}.png`,
          scaledSize: new google.maps.Size(64, 64)
        }
      };
    });
    */
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
  
    // Show the information for a store when its marker is clicked.
    map.data.addListener('click', event => {
  
      const image_src = event.feature.getProperty('image_src');
      const name = event.feature.getProperty('name');
      const description = event.feature.getProperty('description');
      const position = event.feature.getGeometry().get();
      const content = sanitizeHTML`
        <div>
          <h2>${name}</h2><p>${description}</p>
          <p><img style="float:left;" src="${image_src}"></p>
        </div>
      `;
    
      infoWindow.setContent(content);
      infoWindow.setPosition(position);
      infoWindow.open(map);
    });
  }
