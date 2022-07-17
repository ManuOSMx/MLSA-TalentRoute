var map, datasource, routeURL;

//Lugar de inicio
//let userGeo = sqlite3.getUserGeo();
//var start = [-99.216670, 19.650000];
var start = [-103.392134, 20.647609];
//var start = userGeo;

//Expo Guadalajara
var end = [-103.392307, 20.654288];

//Colores de las diferentes rutas
var routeColors = ['#2272B9', '#ff7b25', '#6b5b95', '#d64161', '#00cc66', '#000000'];

function GetMap() {
    //Inicializar el mapa
    map = new atlas.Map('myMap', {
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

        calculateRoute();
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
        var html = ['<table><tr><td>Route</td><td>Distance</td><td>Time</td></tr>'];

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