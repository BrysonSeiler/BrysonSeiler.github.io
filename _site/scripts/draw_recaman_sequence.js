

var width = 1450;
var height = 800;

var right_translation = 0;
var left_translation = 0;
var translate_back = false;

var hop_size = 0;

var counter = 0;

var inner_radius = 0;

var sequence = [0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62, 42, 63, 41, 18]

var colors = d3.scale.category10();
var color_value = function (d, i) { return d; };
var stroke_width = 5;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var arc = svg.append("g")
    .attr("transform", "translate(" + 0 + "," + height / 2 + ")");


function draw_arc() {

    //Hop size defines the distance between the i and i+1 element in the sequence.
    hop_size = sequence[counter + 1] - sequence[counter];

    document.write(hop_size + " ");

    //Defines the inner radius of the arc.
    inner_radius = Math.abs(10 * hop_size);

    var arc_path = d3.svg.arc()
        .innerRadius(inner_radius)
        .outerRadius(inner_radius + stroke_width)
        .startAngle(Math.PI / 2);

    //If the hop size is positive, we need to translate the arc to the right.
    if (hop_size > 0) {

        if (translate_back == true){
            right_translation = left_translation + 3 * stroke_width - 2 * inner_radius;
            translate_back = false;
        }

        right_translation = right_translation - stroke_width + 20 * hop_size;

        //Defines the concavity of the arc.
        if (counter % 2 == 0) {
            counter = counter + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + right_translation + "," + 0 + ")" + "rotate(" + 180 + ")");
        }

        else {
            counter = counter + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + right_translation + "," + 0 + ")" + "rotate(" + 0 + ")");
        }
    }

    //If the hop size is negative, we need to translate the arc to the left.
    else {

        translate_back = true;

        //Translate the arc to the left
        left_translation = right_translation - 2 * stroke_width;

        

        //Defines the concavity of the arc.
        if (counter % 2 == 0) {
            counter = counter + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + left_translation + "," + 0 + ")" + "rotate(" + 180 + ")");
        }

        else {
            counter = counter + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + left_translation + "," + 0 + ")" + "rotate(" + 0 + ")");
        }
    }
}

arc.selectAll("path")
    .data(sequence)
    .enter().append("path")
    .each(draw_arc)
    .style("fill", function (d) { return colors(color_value(d)); });


