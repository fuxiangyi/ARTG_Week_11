var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var svg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var projection = d3.geo.albersUsa()
	.translate([width/2, height/2]);

var path = d3.geo.path()
	.projection(projection);

var rateById = d3.map();

var scaleColor = d3.scale.linear().domain([0,0.15]).range(["#fff","red"]);

//import data
queue()
	.defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.tsv, "data/unemployment.tsv", parseData)
	.await(function(err, counties, states){

		draw(counties, states);
	})

function draw(counties, states){
	console.log(counties.features);

	svg.selectAll('.county')
		.data(counties.features)
		.enter()
		.append('path')
		.attr('class','county')
		.attr('d',path)
        .style('fill',function(d){
           var id = (+d.properties.STATE) + d.properties.COUNTY,
               rate = rateById.get(id);
           return scaleColor(rate);
        });
        //on hover?

	svg.append('path')
		.attr('class','state')
		.datum(states)
		.attr('d',path);

}

function parseData(d){
    rateById.set(formatNumber(+d.id), +d.rate);
}