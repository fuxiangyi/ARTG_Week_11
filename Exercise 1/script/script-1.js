var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");


//First, set up a projection
var projection = d3.geo.albersUsa()
	.translate([width/2, height/2]);

//Then, define a generator function
//which generates the path information for drawing
var path = d3.geo.path()
	.projection(projection);

var lineGenerator = d3.svg.line();

//import geojson data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.await(function(err, states, counties){
        console.log(states.features);
		draw(counties, states);
	});

function draw(counties, states){




    svg.selectAll('.state')
        .data(states.features)
        .enter()
        .append('path')
        .attr('class','state')
        .attr('d',path)
        .on('click',function(d){
            console.log(d.properties.name);
        })

    svg.append('path')
        .datum(counties)
        .attr('class','county')
        .attr('d',path)
        .style('fill','none');

    var lngLatBoston = [-71.0636,42.381],
        lngLatLa = [-118.25,34.0500];
    var xy = projection(lngLatBoston);
    console.log(xy);


    svg.append('circle')
        .attr('cx',xy[0])
        .attr('cy',xy[1])
        .attr('r',5)
        .style('fill','red');
    svg.append('circle')
        .attr('cx',(projection(lngLatLa))[0])
        .attr('cy',(projection(lngLatLa))[1])
        .attr('r',5)
        .style('fill','red');

    var pathObject = {
        type:"Feature",
        geometry:{
            type:"LineString",
            coordinates:[lngLatBoston, lngLatLa]
        }
    }

    svg.append('path')
        .datum(pathObject)
        .attr('d',path)
        .style('stroke','red')
        .style('fill','none');

}