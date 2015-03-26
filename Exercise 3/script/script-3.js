var margin = {t:50,l:50,b:50,r:50},
    width = $('.canvas').width()-margin.l-margin.r,
    height = $('.canvas').height()-margin.t-margin.b;

var rootSvg = d3.select('.canvas')
    .append('svg')
    .attr('width',width+margin.l+margin.r)
    .attr('height',height+margin.t+margin.b)
var svg = rootSvg
    .append('g')
    .attr('transform',"translate("+margin.l+","+margin.t+")");

var projection = d3.geo.albersUsa()
	.translate([width/2, height/2]);

var path = d3.geo.path()
	.projection(projection);

var rateById = d3.map();

var scaleColor = d3.scale.linear().domain([0,0.15]).range(["#fff","red"]);


//zoom behavior
var zoom = d3.behavior.zoom()
    .translate([margin.l,margin.t])
    .scale(1)
    .scaleExtent([1,5])
    .on('zoom', zoomed);

rootSvg.call(zoom);

//import data
queue()
	.defer(d3.json, "data/gz_2010_us_050_00_5m.json")
	.defer(d3.json, "data/gz_2010_us_040_00_5m.json")
    .defer(d3.tsv, "data/unemployment.tsv", parseData)
	.await(function(err, counties, states){

		draw(counties, states);
	})

function draw(counties, states){

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
        })
        .on('click', onClick)

	svg.append('path')
		.attr('class','state')
		.datum(states)
		.attr('d',path);

}

function parseData(d){
    rateById.set(d.id, +d.rate);
}

function onClick(d){
    console.log(d);
    var bounds = path.bounds(d.geometry);
    var x = (bounds[0][0] + bounds[1][0])/2,
        y = (bounds[0][1] + bounds[1][1])/2,
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1];

    //scale factor is determined by the proportion of dx vs. width, and dy vs. height
    var scaleFactor = Math.min(width/dx, height/dy)/4;
    var translate = [margin.l+width/2-scaleFactor*x, margin.t+height/2-scaleFactor*y];

    //
    zoom.translate(translate).scale(scaleFactor);
    svg.transition()
        .duration(2000)
        .call(zoom.event);
}

function zoomed(){

    svg
        .attr('transform', 'translate('+d3.event.translate+')scale('+d3.event.scale+')');
    svg.selectAll('.county')
        .style('stroke-width',.5/d3.event.scale+'px');
    svg.selectAll('.state')
        .style('stroke-width',1/d3.event.scale+'px');
}

