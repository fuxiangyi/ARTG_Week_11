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

//Then, define a 
var path = d3.geo.path()
	.projection(projection);

//creating a map structure
var rateById = d3.map();

//create a formatting function
var formatNumber = d3.format('05');

//
var colorScale = d3.scale.linear().domain([0,0.2]).range(['white','red']);

//import geojson data
queue()
	.defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.tsv, "data/unemployment.tsv", parseData)
	.await(function(err, counties, states){

		draw(counties, states);
	})

function draw(counties, states){

}

function parseData(d){
    rateById.set(formatNumber(+d.id), +d.rate);
}