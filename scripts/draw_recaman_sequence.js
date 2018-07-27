//Define canvas size
var width = d3.select(".container").style('width').slice(0, -2);
var height = 5 * d3.select(".container").style('height').slice(0, -2);

var center_height = height / 2;

var svg = d3.select(".visualization").append("svg")
            .attr("viewBox", '0 0 ' + width + ' ' + height)
            .attr("class", "rec_svg");

var color = ['#3075ae'];

//Recaman sequence
var sequence = [0, 1, 3, 6, 2, 7, 13, 20, 12, 21, 11, 22, 10, 23, 9, 24, 8, 25, 43, 62, 42, 63, 41, 18, 42, 17, 43, 16, 44, 15, 45, 14, 46, 79, 113, 78, 114, 77, 39, 78, 38, 79, 37, 80, 36, 81, 35, 82, 34, 83, 33, 84, 32, 85, 31, 86, 30, 87, 29, 88, 28, 89, 27, 90, 26, 91, 157, 224, 156, 225, 155, 226, 154, 227, 153, 228, 152, 75, 153, 74, 154, 73, 155, 72, 156, 71, 157, 70, 158, 69, 159, 68, 160, 67, 161, 66, 162, 65, 163, 64, 164];

//Hop_size defines the distance between the i and i+1 elements in the Recaman sequence.
var hop_size = [];

//Add hop sizes to array
for (i = 0; i < sequence.length - 1; i++) {
    hop_size.push(sequence[i + 1] - sequence[i]);
}


//=====================Find centers for each arc=====================//

//Stroke width of the arcs
var stroke_width = 1;

//Initial arc center to make first arc fully visible
var initial_center = 6;

//Array of locations where each arc will be placed
var centers = [initial_center];

//Inner radius of each arc
var inner_radii = [];

for (i = 0; i < hop_size.length; i++) {
    inner_radii.push(Math.abs(3 * hop_size[i]));
}

//Outer radius of selected arc
var R_i = 0;

//Center of selected arc
var c_i = initial_center;

var counter = 0;
var back = false;

//For loop to get centers of each arc
for (i = 0; i < hop_size.length; i++) {

    //Get outer radius of current arc
    R_i = c_i + inner_radii[i] + stroke_width;

    //If the hop size is positive
    if (hop_size[i + 1] > 0) {
        //Set counter back to zero
        counter = 0;

        //If arc needs to be translated back, it will enter this if statement
        if (back == true) {
            c_i = R_i - inner_radii[i] + 2 * stroke_width;
            centers.push(c_i);
            back = false;
        }

        //Otherwise, the arc will be translated forward
        else {
            //Get next center
            c_i = R_i + inner_radii[i + 1];
            centers.push(c_i);
        }
    }

    //If the hop size is negative, we need to translate the arc backwards
    else {

        back = true;
        counter = counter + 1;

        if (counter > 1) {
            c_i = c_i - 2 * inner_radii[i + 1] + 2 * stroke_width;
            R_i = c_i + inner_radii[i] + stroke_width;
            centers.push(c_i);

        }

        else {
            c_i = R_i - inner_radii[i + 1] - stroke_width;
            centers.push(c_i);
        }
    }
}


//=====================Define first arc=====================//

//Find the positioning of the first arc
svg.select("g").remove();
var group = svg.append("g");

function draw() {

    for (i = 0; i < hop_size.length; i++) {

        //Translate arc to the right if the hop size is positive and not the first one
        if (hop_size[i] > 0 && i != 0) {

            right_translation = c_i + 2 * stroke_width;

            var arc = d3.svg.arc()
                .innerRadius(inner_radii[i])
                .outerRadius(inner_radii[i] + stroke_width)
                .startAngle(Math.PI / 2)
                .endAngle(-0.5 * Math.PI);

            if (i % 2 == 0) {
                group.append("path").attr("d", arc)
                    .style("fill", color[i % color.length])
                    .attr("transform", "translate(" + centers[i] + "," + center_height + ")" + "rotate(" + 180 + ")");
            }

            else {
                group.append("path").attr("d", arc)
                    .style("fill", color[i % color.length])
                    .attr("transform", "translate(" + centers[i] + "," + center_height + ")" + "rotate(" + 0 + ")");
            }

        }

        else {

            if (i == 0) {
                left_translation = initial_center;
            }

            var arc = d3.svg.arc()
                .innerRadius(inner_radii[i])
                .outerRadius(inner_radii[i] + stroke_width)
                .startAngle(Math.PI / 2)
                .endAngle(-0.5 * Math.PI);

            if (i % 2 == 0) {
                group.append("path").attr("d", arc)
                    .style("fill", color[i % color.length])
                    .attr("transform", "translate(" + centers[i] + "," + center_height + ")" + "rotate(" + 180 + ")");
            }
            else {
                group.append("path").attr("d", arc)
                    .style("fill", color[i % color.length])
                    .attr("transform", "translate(" + centers[i] + "," + center_height + ")" + "rotate(" + 0 + ")");
            }
        }
    }
}

window.draw = draw();