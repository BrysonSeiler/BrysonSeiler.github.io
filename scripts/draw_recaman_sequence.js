

var width = 1450;
var height = 800;

var sequence = [0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62, 42, 63, 41, 18]

var translation = 0;
var hop_size = 0;
var innerRadius = 0;
var back_translation = 0;
var translate_back = false;

var colors = d3.scale.category10();
var colorValue = function (d) { return d; };

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var arc = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + height / 2 + ")");

function draw_arc(d, i) {

    hop_size = sequence[i + 1] - sequence[i];

    //Size of arc
    innerRadius = Math.abs((hop_size) * 10);

    stroke_width = 5;

    //document.write(hop_size + " ");

    if (hop_size > 0) {
        if (translate_back == true) {
            translation = back_translation;
            translate_back = false;
        }
        translation = translation - stroke_width + 2 * (hop_size) * 10;
    }
    else {
        //Translate arc backwards
        translation = translation - 2 * stroke_width;

        //Next arc needs to be here:
        back_translation = translation - stroke_width + 2 * (hop_size) * 10;
        translate_back = true;
    }

    var arc_path = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + stroke_width)
        .startAngle((2 * Math.PI) / 4);

    if (i % 2 == 0) {
        return d3.select(this)
            .transition()
            .ease('bounce')
            .duration(1200)
            .attr("d", arc_path.endAngle(2 * Math.PI * -.25))
            .attr("transform", "translate(" + translation + "," + 0 + ")" + "rotate(" + 180 + ")")
    }

    else {
        return d3.select(this)
            .transition()
            .ease('bounce')
            .duration(1200)
            .attr("d", arc_path.endAngle(2 * Math.PI * -.25))
            .attr("transform", "translate(" + translation + "," + 0 + ")" + "rotate(" + 0 + ")")
    }


}

arc.selectAll("path")
    .data(sequence)
    .enter().append("path")
    .each(draw_arc)
    .style("fill", function (d) { return colors(colorValue(d)); });