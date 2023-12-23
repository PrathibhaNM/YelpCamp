mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 4, // starting zoom
});

//addcontrol(control, position) // by default position is set to top-right
map.addControl(new mapboxgl.NavigationControl());
//map.addControl(new mapboxgl.NavigationControl(), 'bottom-left'); // Navigation buttons will be displayed in the bottom left if w specify bottom-left

new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset : 25})
        .setHTML(`<h3> ${campground.location}</h3><p>${campground.title}</p>`)
    )
    .addTo(map)