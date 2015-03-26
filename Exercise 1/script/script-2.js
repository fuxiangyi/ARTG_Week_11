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

//import geojson data
queue()
	.defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.defer(d3.json, "data/gz_2010_us_040_00_5m.json")
	.await(function(err, counties, states){

		draw(counties, states);

		//Listen for click on the .control buttons
		//change projection based on input
		$('.control .button').on('click',function(e){
			e.preventDefault();

			var id = $(this).attr('id');
			if(id == "albersUsa"){
				projection = d3.geo.albersUsa()
					.translate([width/2, height/2]);
			}else if(id == "mercator"){
				projection = d3.geo.mercator()
					.translate([width/2, height/2])
					.center([-98,39])
					.scale(300);
			}else if(id == "azimuthalED"){
				projection = d3.geo.azimuthalEquidistant()
					.translate([width/2, height/2])
					.center([-71.0636,42.3581])
					.scale(300);
			}
			path = d3.geo.path()
				.projection(projection);

			draw(counties, states);
		})
	})

function draw(counties, states){

	/*var counties = svg.selectAll('.county')
		.data(counties.features);

	counties
		.enter()
		.append('path')
		.attr('class','county')
		.attr('d',path);

	counties
		.transition()
		.attr('d',path);*/

	var states = svg.selectAll('.state')
		.data(states.features, function(d){
			return d.properties.STATE;
		});

	states
		.enter()
		.append('path')
		.attr('class','state')
		//.attr('d',path);

	states
		.transition()
		.duration(1000)
		.attr('d',path);
}