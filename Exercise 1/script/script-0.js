var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var lngLatBoston = [-71.0589,42.3601],
    lngLatSF = [-122.4167,37.7833];

//First, set up a projection
var project = d3.geo.albersUsa()
    .translate([width/2,height/2])
    .scale(1200);

//Then, define a generator function
//which generates the path information for drawing
var path = d3.geo.path()
    .projection(project);

//import geojson data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.await(function(err, states, counties){
		draw(counties, states);
	});

function draw(counties, states){

    //console.log(states);


    svg.append('path')
        .attr('class','state')
        .attr('d', path(states));

    console.log(project(lngLatBoston));
    svg.append('circle')
        .attr('class','city Boston')
        .attr('cx', (project(lngLatBoston))[0])
        .attr('cy', (project(lngLatBoston))[1])
        .attr('r',6)
        .style('fill','red');

    svg.append('circle')
        .attr('class','city SF')
        .datum( project(lngLatSF) )
        .attr('cx',function(d){ return d[0]; })
        .attr('cy',function(d){ return d[1]; })
        .attr('r',6)
        .style('fill','red');

    svg.append('line')
        .attr('x1', (project(lngLatBoston))[0])
        .attr('y1', (project(lngLatBoston))[1])
        .attr('x2', (project(lngLatSF))[0] )
        .attr('y2', (project(lngLatSF))[1] )
        .style('stroke','red')
        .style('stroke-width','1px');

    var flightPath = {
            type:"Feature",
            geometry:{
               type:"LineString",
               coordinates:[lngLatBoston,lngLatSF]
            }
        };

    svg.append('path')
        .style('stroke','white')
        .style('stroke-width','2px')
        .style('fill','none')
        .datum(flightPath)
        .attr('d',function(d){
            return path(d);
        });




}