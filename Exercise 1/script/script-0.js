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

//Then, define a generator function
//which generates the path information for drawing


//import geojson data
queue()
    .defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.await(function(err, states, counties){
        console.log(states.features);
		draw(counties, states);
	});

function draw(counties, states){


}