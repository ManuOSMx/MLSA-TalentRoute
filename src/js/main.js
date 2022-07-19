var map, datasource, routeURL;
var geocodeServiceUrlTemplate = 'https://{azMapsDomain}/search/{searchType}/json?typeahead=true&api-version=1&query={query}&language={language}&lon={lon}&lat={lat}&countrySet={countrySet}&view=Auto';

//Lugar de inicio
//let userGeo = sqlite3.getUserGeo();
//var start = [-99.216670, 19.650000];
var start = [];
//var start = userGeo;

//Expo Guadalajara
var end = [-103.392307, 20.654288];

//Colores de las diferentes rutas MAXIMO 6 RUTAS
var routeColors = ['#2272B9', '#ff7b25', '#6b5b95', '#d64161', '#00cc66', '#000000'];

function GetMap() {
    //Inicializar el mapa
    map = new atlas.Map('myMap', {
        //Expo Guadalajara
        center: [-103.392307, 20.654288],
        zoom: 15,
        view: 'Auto',

        //Add authentication details fo5r connecting to Azure Maps.
        authOptions: {
            //Alternatively, use an Azure Maps key. Get an Azure Maps key at https://azure.com/maps. NOTE: The primary key should be used as the key.
            authType: 'subscriptionKey',
            subscriptionKey: '2v2WcHa8x-isHj31pQd73lNEQQrNxlVPaHGXuzyjLWM'
        }
    });
    

    //Use MapControlCredential to share authentication between a map control and the service module.
    var pipeline = atlas.service.MapsURL.newPipeline(new atlas.service.MapControlCredential(map));

    //Construct the RouteURL object
    routeURL = new atlas.service.RouteURL(pipeline);

    //Wait until the map resources are ready.
    map.events.add('ready', function () {
        datasource = new atlas.source.DataSource();
        map.sources.add(datasource);

        //Create a layer for rendering the route line under the road labels.
        map.layers.add(new atlas.layer.LineLayer(datasource, null, {
            //Get the route color using the resultIndex property of the route line. 
            strokeColor: ['to-color', ['at', ['get', 'resultIndex'], ['literal', routeColors]]],
            strokeWidth: 5,
            lineJoin: 'round',
            lineCap: 'round'
        }), 'labels');

        //Create a layer for rendering the start and end points of the route as symbols.
        map.layers.add(new atlas.layer.SymbolLayer(datasource, null, {
            textOptions: {
                textField: ['get', 'title'],
                offset: [0, 1.2]
            },
            filter: ['any', ['==', ['geometry-type'], 'Point'], ['==', ['geometry-type'], 'MultiPoint']] //Only render Point or MultiPoints in this layer.
        }));
        //Create a jQuery autocomplete UI widget.
        $("#queryTbx").autocomplete({
            minLength: 3,   //Don't ask for suggestions until atleast 3 characters have been typed. This will reduce costs by not making requests that will likely not have much relevance.
            source: function (request, response) {
                var center = map.getCamera().center;

                var elm = document.getElementById('countrySelector');
                var countryIso = elm.options[elm.selectedIndex].value;

                //Create a URL to the Azure Maps search service to perform the search.
                var requestUrl = geocodeServiceUrlTemplate.replace('{query}', encodeURIComponent(request.term))
                    .replace('{searchType}', document.querySelector('input[name="searchTypeGroup"]:checked').value)
                    .replace('{language}', 'en-US')
                    .replace('{lon}', center[0])    //Use a lat and lon value of the center the map to bais the results to the current map view.
                    .replace('{lat}', center[1])
                    .replace('{countrySet}', countryIso); //A comma seperated string of country codes to limit the suggestions to.

                processRequest(requestUrl).then(data => {
                    response(data.results);
                });
            },
            select: function (event, ui) {
                //Remove any previous added data from the map.
                datasource.clear();

                //Create a point feature to mark the selected location.
                datasource.add(new atlas.data.Feature(new atlas.data.Point([ui.item.position.lon, ui.item.position.lat]), ui.item));
                start = [ui.item.position.lon, ui.item.position.lat];
                console.log([ui.item.position.lon, ui.item.position.lat]);
                calculateRoute();
                
                //Zoom the map into the selected location.
                map.setCamera({
                    bounds: [
                        ui.item.viewport.topLeftPoint.lon, ui.item.viewport.btmRightPoint.lat,
                        ui.item.viewport.btmRightPoint.lon, ui.item.viewport.topLeftPoint.lat
                    ],
                    padding: 30
                });
            }
        }).autocomplete("instance")._renderItem = function (ul, item) {
            //Format the displayed suggestion to show the formatted suggestion string.
            var suggestionLabel = item.address.freeformAddress;

            if (item.poi && item.poi.name) {
                suggestionLabel = item.poi.name + ' (' + suggestionLabel + ')';
            }

            return $("<li>")
                .append("<a>" + suggestionLabel + "</a>")
                .appendTo(ul);
        };
        
    });
}
function processRequest(url) {
    //This is a reusable function that sets the Azure Maps platform domain, sings the request, and makes use of any transformRequest set on the map.
    return new Promise((resolve, reject) => {
        //Replace the domain placeholder to ensure the same Azure Maps cloud is used throughout the app.
        url = url.replace('{azMapsDomain}', atlas.getDomain());

        //Get the authentication details from the map for use in the request.
        var requestParams = map.authentication.signRequest({ url: url });

        //Transform the request.
        var transform = map.getServiceOptions().tranformRequest;
        if (transform) {
            requestParams = transform(url);
        }

        fetch(requestParams.url, {
            method: 'GET',
            mode: 'cors',
            headers: new Headers(requestParams.headers)
        })
            .then(r => r.json(), e => reject(e))
            .then(r => {
                resolve(r);
            }, e => reject(e));
    });
}

function calculateRoute() {
    datasource.clear();

    //Create the GeoJSON objects which represent the start and end points of the route and add to data source.
    datasource.add([
        new atlas.data.Feature(new atlas.data.Point(start), { title: 'Start' }),
        new atlas.data.Feature(new atlas.data.Point(end), { title: 'End' })
    ]);

    //Get the coordnates of the start and end points.
    var coordinates = [
        start,
        end
    ];

    //Get the route options from the form.         
    var options = {
        maxAlternatives: parseInt(document.getElementById('alts').value),
        minDeviationTime: parseInt(document.getElementById('mdt').value),
        minDeviationDistance: parseInt(document.getElementById('mdd').value),
        postBody: {
            "supportingPoints": {
                "type": "GeometryCollection",
                "geometries": [
                    new atlas.data.Point(start),
                    new atlas.data.Point([-103.383278, 20.659659]),//A supporitng point on the on I90.
                    new atlas.data.Point(end)
                ]
            }
        }
    };

    if (options.maxAlternatives > 0) {
        var altTypeElm = document.getElementById('alternativeType');

        options.alternativeType = altTypeElm.options[altTypeElm.selectedIndex].value;
    }

    //Calculate a route.
    routeURL.calculateRouteDirections(atlas.service.Aborter.timeout(10000), coordinates, options).then((directions) => {
        //Get the route data as GeoJSON and add it to the data source.
        var data = directions.geojson.getFeatures();
        datasource.add(data);

        //Create a table with the route travel time/distance information.
        var html = ['<table><tr><td>Ruta</td><td>Distancia</td><td>Tiempo</td></tr>'];

        for (var i = 0; i < directions.routes.length; i++) {
            var s = directions.routes[i].summary.travelTimeInSeconds % 60;

            html.push('<tr><td><div class="colorBlock" style="background-color:',
                routeColors[i], '"></div></td><td>',

                //Convert distance to meters and round to 1 decimal place.
                Math.round(directions.routes[i].summary.lengthInMeters / 1000 * 10) / 10, ' km</td><td>',

                //Format time as min:sec. If seconds less than 10, prepend a 0 to the second value.
                Math.round(directions.routes[i].summary.travelTimeInSeconds / 60), ':',
                ((s < 10) ? '0' : ''), s, ' min</td></tr>');
        }

        html.push('</table>');
        document.getElementById('resultsPanel').innerHTML = html.join('');

        //Update the map view to center over the route.
        map.setCamera({
            bounds: data.bbox,
            padding: 30 //Add a padding to account for the pixel size of symbols.
        });
    });
}