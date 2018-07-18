/*
*    Title: Force-Directed Graph
*    Author: Mike Bostock
*    Released under: GNU General Public License, version 3
*    Availability: https://bl.ocks.org/mbostock/4062045

*    Edited by: Bryson Seiler
*    Date: 06/04/2018
*/

//Bryson Seiler: Added: function to open json networks:
function setup(filename, link_strength, body_strength, collide_strength, distance, iterations, show_labels, default_node_color, default_node_size) {

	//Create svg container
	//var svg = d3.select("svg"),
	//	width = +svg.attr("width"),
	//	height = +svg.attr("height");

	var width = d3.select(".container").style('width').slice(0, -2);
	var height = d3.select(".container").style('height').slice(0, -2);

	console.log((2/3) * d3.select(".container").style('width').slice(0, -2));

	var svg = d3.select("svg")
				.attr("viewBox", '0 0 ' + width + ' ' + height)

	//Initialize force simulation
	var simulation = d3.forceSimulation()
		//Bryson Seiler: Added: 1. Collision 
		.force("link", d3.forceLink().id(function (d) { return d.id; }).strength(link_strength).distance(distance))
		.force("charge", d3.forceManyBody().strength(body_strength))
		.force("collision", d3.forceCollide(12).strength(collide_strength).iterations(iterations))
		.force("center", d3.forceCenter(width / 2, height / 2));

	//Draw network
	window.draw = draw(filename, svg, simulation, show_labels);
	

	function draw(filename, svg, simulation, show_labels) {

		//Open json network
		d3.json(filename, function (error, graph) {
			if (error) throw error;

			//Create links
			var link = svg.append("g")
				.attr("class", "links")
				.selectAll("line")
				.data(graph.links)
				.enter().append("line")
				.attr("stroke-width", function (d) { return Math.sqrt(d.value); });

			//Create nodes of default size/color
			var node = svg.append("g")
				.attr("class", "nodes")
				.selectAll("circle")
				.data(graph.nodes)
				.enter().append("circle")
				.attr("fill", default_node_color)
				.attr("r", default_node_size)
				.call(d3.drag()
					.on("start", dragstarted)
					.on("drag", dragged)
					.on("end", dragended));

			//Create node labels
			if (show_labels == true) {

				var lables = svg.append("g")
					.attr("class", "labels")
					.selectAll("text")
					.data(graph.nodes)
					.enter().append("text")
					.attr("dx", ".25em")
					.attr("dy", "-0.5em")
					.text(function (d) { return d.id; });
			}

			simulation
				.nodes(graph.nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(graph.links);

			resize();
			d3.select(window).on("resize", resize);

			function ticked() {
				link
					.attr("x1", function (d) { return d.source.x; })
					.attr("y1", function (d) { return d.source.y; })
					.attr("x2", function (d) { return d.target.x; })
					.attr("y2", function (d) { return d.target.y; });

				node
					.attr("cx", function (d) { return d.x; })
					.attr("cy", function (d) { return d.y; });

				if (show_labels == true) {

					lables
						.attr("x", function (d) { return d.x; })
						.attr("y", function (d) { return d.y; });

				}

			}

			function resize(){
				width = svg.select("container").width;
				height = svg.select("container").height;

				svg.attr("width", width).attr("height", height);
			}

		});

		function dragstarted(d) {
			if (!d3.event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(d) {
			d.fx = d3.event.x;
			d.fy = d3.event.y;
		}

		function dragended(d) {
			if (!d3.event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

	}


	//Bryson Seiler: added code to change color/size of node based off of centrality measurement
	function update_node(value) {

		//Blue: ['#215077', '#265d8b', '#2c6b9f', '#3178b3', '#3685c7', '#4a92cd', '#5e9ed3'];
		//New Blue: ['#215077', '#2c6b9f', '#3685c7', '#5e9ed3', '#9ac2e3', '#d6e6f4', '#feffff'];

		var color = ['#215077', '#2c6b9f', '#3685c7', '#5e9ed3', '#9ac2e3', '#d6e6f4', '#eaf2f9'];
		var size = [default_node_size, default_node_size + 6, default_node_size + 11, default_node_size + 14, default_node_size + 17, default_node_size + 20, default_node_size + 25]

		if (value == 0) {

			//Reset nodes color/size to original values

			d3.selectAll("svg").selectAll("circle").each(function (d, i) {
				d3.select(this).attr("fill", default_node_color)
				d3.select(this).attr("r", default_node_size)
			})

		}

		if (value == 1) {

			//Size/color nodes based off of degree centrality

			d3.selectAll("svg").selectAll("circle").each(function (d) {
				d3.select(this).attr("fill", function (d){ return color[d.Degree-1]})
				d3.select(this).attr("r", function (d) { return default_node_size + Math.pow(d.Degree, 1.65); })


				if (d.Degree == 0 || d.Degree == 1){
					d3.select(this).attr("fill", color[0]).attr("r", size[0])
				}

				if (d.Degree == 2){
					d3.select(this).attr("fill", color[1]).attr("r", size[1])
				}

				if (d.Degree == 3){
					d3.select(this).attr("fill", color[2]).attr("r", size[2])
				}

				if (d.Degree == 4){
					d3.select(this).attr("fill", color[3]).attr("r", size[3])
				}

				if (d.Degree == 5){
					d3.select(this).attr("fill", color[4]).attr("r", size[4])
				}

				if (d.Degree == 6){
					d3.select(this).attr("fill", color[5]).attr("r", size[5])
				}

				if (d.Degree == 7){
					d3.select(this).attr("fill", color[6]).attr("r", size[6])
				}

			})

		}

		if (value == 2) {

			//Size/color nodes based off of Betweenness centrality
			
			d3.selectAll("svg").selectAll("circle").each(function (d) {

				if (d.BetweennessCentrality == 0.0){
					d3.select(this).attr("fill", color[0]).attr("r", size[0])
				}

				if (d.BetweennessCentrality > 0.0 && d.BetweennessCentrality < 20.0){
					d3.select(this).attr("fill", color[1]).attr("r", size[1])
				}

				if (d.BetweennessCentrality > 20.0 && d.BetweennessCentrality < 50.0){
					d3.select(this).attr("fill", color[2]).attr("r", size[2])
				}

				if (d.BetweennessCentrality > 50.0 && d.BetweennessCentrality < 80.0){
					d3.select(this).attr("fill", color[3]).attr("r", size[3])
				}

				if (d.BetweennessCentrality > 80.0 && d.BetweennessCentrality < 100.0){
					d3.select(this).attr("fill", color[4]).attr("r", size[4])
				}

				if (d.BetweennessCentrality > 100.0 && d.BetweennessCentrality < 120.0){
					d3.select(this).attr("fill", color[5]).attr("r", size[5])
				}

				if (d.BetweennessCentrality > 120.0 && d.BetweennessCentrality < 150.0){
					d3.select(this).attr("fill", color[6]).attr("r", size[6])
				}
				
			})

		}

		if (value == 3) {

			//Size/color nodes based off of Eigenvector centrality

			d3.selectAll("svg").selectAll("circle").each(function (d) {

				if (d.EigenvectorCentrality > 0.0 && d.EigenvectorCentrality < 0.2){
					d3.select(this).attr("fill", color[0]).attr("r", size[0])
				}

				if (d.EigenvectorCentrality > 0.2 && d.EigenvectorCentrality < 0.3){
					d3.select(this).attr("fill", color[1]).attr("r", size[1])
				}

				if (d.EigenvectorCentrality > 0.3 && d.EigenvectorCentrality < 0.4){
					d3.select(this).attr("fill", color[2]).attr("r", size[2])
				}

				if (d.EigenvectorCentrality > 0.4 && d.EigenvectorCentrality < 0.5){
					d3.select(this).attr("fill", color[3]).attr("r", size[3])
				}

				if (d.EigenvectorCentrality > 0.5 && d.BetweennessCentrality < 0.6){
					d3.select(this).attr("fill", color[4]).attr("r", size[4])
				}

				if (d.EigenvectorCentrality > 0.6 && d.EigenvectorCentrality < 0.8){
					d3.select(this).attr("fill", color[5]).attr("r", size[5])
				}

				if (d.EigenvectorCentrality > 0.8 && d.EigenvectorCentrality <= 1.0){
					d3.select(this).attr("fill", color[6]).attr("r", size[6])
				}

				//d3.select(this).attr("r", function (d) { return default_node_size + 25*d.EigenvectorCentrality; })
			})

		}
	}

	window.update_node = update_node

}
