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

var format = d3.format('%')

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
        .on('click', function(d){
            console.log(path.bounds(d));
        })
        .on('mouseenter', onMouseEnter)
        .on('mouseleave', onMouseLeave);
        //on hover?

	svg.append('path')
		.attr('class','state')
		.datum(states)
		.attr('d',path);

}

function parseData(d){
    rateById.set(d.id, +d.rate);
}

function onMouseEnter(d){
    console.log(d3.event);
    //console.log(d3.event.pageX, d3.event.pageY);
    //console.log(d3.mouse(svg.node()));

    var parentElem = d3.select('.canvas').node();
    var mouse = d3.mouse(parentElem);


    var tooltip = d3.select('.custom-tooltip')
        .style('visibility','visible');

    tooltip
        .select('h2').html(d.properties.NAME);
    tooltip
        .select('span').html(format(rateById.get((+d.properties.STATE) + d.properties.COUNTY)));

    var tooltipWidth =$('.tooltip').width();

    tooltip
        .style('left',mouse[0]-tooltipWidth/2 + 'px')
        .style('top',mouse[1] + 10 + 'px');
        //.style('left',d3.event.pageX + 'px')
        //.style('top',d3.event.pageY + 'px');

}

function onMouseLeave(d){
    d3.select('.custom-tooltip')
        .style('visibility','hidden');

}