/*
Initial setup.
*/

//Canvas size.
var width = 1200;
var height = 800;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Stroke width of arc.
var stroke_width = 3;

//Colors
var colors = d3.scale.category10();
var color_value = function (d, i) { return d; };

//Define the radius of the first arc.
var init_radius = 3;

//The radius of all other arcs are dictated by inner_radius.
var inner_radius = [];

//Initial svg translation to make first arc fully visible.
var init_svg_translation = stroke_width + init_radius;

//Find position of first arc on canvas.
var arc = svg.append("g")
    .attr("transform", "translate(" + init_svg_translation + "," + height / 2 + ")");

//Global translation variables.
var right_translation = 0;
var left_translation = 0;
var translate_back = false;

//Recaman sequence
var sequence = [0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62, 42, 63, 41, 18]//, 17, 43, 16, 44, 15, 45, 14, 46, 79, 113, 78, 114, 77, 39, 78, 38]

//Hop_size defines the distance between the i and i+1 elements in the Recaman sequence.
var hop_size = [];

for (i = 0; i < sequence.length - 1; i++) {
    hop_size.push(sequence[i + 1] - sequence[i]);
}

for (i = 0; i < hop_size.length; i++) {
    inner_radius.push(Math.abs(3 * hop_size[i]));
}

//Global count.
var count = 0;

//Hop size defines the distance between the i and i+1 element in the sequence.

function draw_arc() {

    var arc_path = d3.svg.arc()
        .innerRadius(inner_radius[count])
        .outerRadius(inner_radius[count] + stroke_width)
        .startAngle(Math.PI / 2);

    //If the hop size is positive,we need to translate the next arc to the right. 
    if (hop_size[count] > 0) {
        if (translate_back) {
            translate_back = false;
        }

        else{
            right_translation = right_translation + count * init_radius + stroke_width + inner_radius[count];
        }

        //Defines the concavity of the arc.
        if (count % 2 == 0) {
            count = count + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + right_translation + "," + 0 + ")" + "rotate(" + 180 + ")");
        }

        else {
            count = count + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + right_translation + "," + 0 + ")" + "rotate(" + 0 + ")");
        }

    }

    else {
        //Translate the arc to the left

        //Initial back hop.
        left_translation = right_translation - init_radius;
        translate_back = true;

        //Defines the concavity of the arc.
        if (count % 2 == 0) {
            count = count + 1;
            return d3.select(this)
                .transition()
                .ease('bounce')
                .duration(1500)
                .attr("d", arc_path.endAngle(-0.5 * Math.PI))
                .attr("transform", "translate(" + left_translation + "," + 0 + ")" + "rotate(" + 180 + ")");
        }

        else {
            count = count + 1;
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
    .data(hop_size)
    .enter().append("path")
    .each(draw_arc)
    .style("fill", function (d) { return colors(color_value(d)); });

