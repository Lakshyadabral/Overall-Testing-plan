mapboxgl.accessToken = mapToken;
    
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v11", 
        center: listing.geometry.coordinates, // Default starting position set to Halifax coordinates
        zoom: 9 // starting zoom
    });



    const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(listing.geometry.coordinates) //Listing.geometry.cordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be Provided After Booking</p>`))
    .addTo(map);

    