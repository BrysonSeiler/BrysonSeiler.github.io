/*
*    Title: Force-Directed Graph
*    Author: Mike Bostock
*    Released under: GNU General Public License, version 3
*    Availability: https://bl.ocks.org/mbostock/4062045

*    Edited by: Bryson Seiler
*    Date: 06/04/2018
*/

//Bryson Seiler: Added: function to open json networks:
function setup(filename, scale_node, link_strength, body_strength, collide_strength, distance, iterations, show_labels, node_att) {

	//Bryson Seiler: Added: Varaibles: filename, scale_node, link_strength, body_strength, collide_strength, distance, iterations

	var option = 0;

	var filename = filename;
	var scale_node = scale_node;
	var link_strength = link_strength;
	var body_strength = body_strength;
	var collide_strength = collide_strength;
	var distance = distance;
	var iterations = iterations;
	var show_labels = show_labels;
	var node_att = node_att;

	var svg = d3.select("svg"),
		width = +svg.attr("width"),
		height = +svg.attr("height");

	var color = "#457B9D";

	var simulation = d3.forceSimulation()
		//Bryson Seiler: Added: 1. Collision 2. 
		.force("link", d3.forceLink().id(function (d) { return d.id; }).strength(link_strength).distance(distance))
		.force("charge", d3.forceManyBody().strength(body_strength))
		.force("collision", d3.forceCollide(12).strength(collide_strength).iterations(iterations))
		.force("center", d3.forceCenter(width / 2, height / 2));

	function draw(filename, scale_node, svg, color, simulation, show_labels, node_att) {

		d3.json(filename, function (error, graph) {
			if (error) throw error;

			var node;

			var link = svg.append("g")
				.attr("class", "links")
				.selectAll("line")
				.data(graph.links)
				.enter().append("line")
				.attr("stroke-width", function (d) { return Math.sqrt(d.value); });

			if (node_att) {

				if (option == 0) {

					node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("circle")
						.data(graph.nodes)
						.enter().append("circle")
						//Bryson Seiler added: Change color/size based off of degree
						.attr("fill", "#457B9D")
						.attr("r", 3 * scale_node)
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));

				}

				if (option == 1) {

					node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("circle")
						.data(graph.nodes)
						.enter().append("circle")
						//Bryson Seiler added: Change color/size based off of degree
						.attr("fill", function (d) { return color(d.Degree); })
						.attr("r", function (d) { return d.Degree * scale_node; })
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));
				}

				if (option == 2) {

					node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("circle")
						.data(graph.nodes)
						.enter().append("circle")
						//Bryson Seiler added: Change color/size based off of degree
						.attr("fill", function (d) { return color(d.BetweennessCentrality); })
						.attr("r", function (d) { return d.BetweennessCentrality / (1.5*scale_node); })
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));
				}

				if (option == 3) {

					node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("circle")
						.data(graph.nodes)
						.enter().append("circle")
						//Bryson Seiler added: Change color/size based off of degree
						.attr("fill", function (d) { return color(d.EigenvectorCentrality); })
						.attr("r", function (d) { return d.EigenvectorCentrality * scale_node * 9; })
						.call(d3.drag()
							.on("start", dragstarted)
							.on("drag", dragged)
							.on("end", dragended));
				}

			}

			else {

				node = svg.append("g")
					.attr("class", "nodes")
					.selectAll("circle")
					.data(graph.nodes)
					.enter().append("circle")
					//Bryson Seiler added: Change color/size based off of degree
					.attr("fill", "#457B9D")
					.attr("r", scale_node)
					.call(d3.drag()
						.on("start", dragstarted)
						.on("drag", dragged)
						.on("end", dragended));

			}

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

			node.append("title")
				.text(function (d) { return d.id; });

			simulation
				.nodes(graph.nodes)
				.on("tick", ticked);

			simulation.force("link")
				.links(graph.links);

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

	window.draw = draw(filename, scale_node, svg, color, simulation, show_labels, node_att);

	function choose(choice) {

		//Reset
		d3.selectAll("g").remove();

		simulation = d3.forceSimulation()
			.force("link", d3.forceLink().id(function (d) { return d.id; }).strength(link_strength).distance(distance))
			.force("charge", d3.forceManyBody().strength(body_strength))
			.force("collision", d3.forceCollide(12).strength(collide_strength).iterations(iterations))
			.force("center", d3.forceCenter(width / 2, height / 2));


		if (choice == 0) {
			option = 0;

			color = "#457B9D";
			draw(filename, scale_node, svg, color, simulation, show_labels, node_att);
		}

		if (choice == 1) {
			option = 1;

			color = d3.scaleOrdinal().range(["#05668d", "#028090", "#00a896", "#02c39a", "#f0f3bd"]);
			draw(filename, scale_node, svg, color, simulation, show_labels, node_att);
		}

		if (choice == 2) {
			option = 2;

			color = d3.scaleOrdinal().range(["#220901", "#621708", "#941b0c", "#bc3908", "#f6aa1c"]);
			draw(filename, scale_node, svg, color, simulation, show_labels, node_att);
		}

		if (choice == 3) {
			option = 3;

			color = d3.scaleOrdinal().range(["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"]);
			draw(filename, scale_node, svg, color, simulation, show_labels, node_att);
		}

	}

	window.choose = choose;


}