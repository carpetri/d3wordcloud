var el, x, data;
HTMLWidgets.widget({

  name: 'd3wordcloud',

  type: 'output',

  initialize: function(el, width, height) {

    var w = el.offsetWidth;
    var h = el.offsetHeight;

    var cloud = d3.layout.cloud();
    var svg = d3.select(el).append("svg").attr("width", w).attr("height", h);
    var background = svg.append("g");
    var vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

    return {
      cloud: cloud,
      svg: svg,
      background: background,
      vis: vis
    };

  },

  renderValue: function(el, x, instance) {

    var data = HTMLWidgets.dataframeToD3(x.data);

    var w = el.offsetWidth;
    var h = el.offsetHeight;

    var fill = d3.scale.category20();

    var scalesize = d3.scale.log()
      .domain([d3.min(data, function(d) { return d.size; }),
               d3.max(data, function(d) { return d.size; })])
      .range([10, 90]);

    instance.cloud
      .size([w, h])
      .words(data)
      .padding(x.pars.padding)
      .rotate(function() { return Math.floor(Math.random() * (x.pars.rotmax - x.pars.rotmin)) + x.pars.rotmin; })
      .font(x.pars.font)
      .fontSize(function(d) { return scalesize(d.size); })
      .on("end", draw)
      .start();

    function draw(words) {
      var text = instance.vis.selectAll("text")
        .data(words, function(d) { return d.text.toLowerCase(); });

      text.transition()
        .duration(1000)
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .style("font-size", function(d) { return d.size + "px"; });

      text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .style("font-size", "1px")
        .transition()
        .duration(1000)
        .style("font-size", function(d) { return d.size + "px"; });

      text.style("font-family", function(d) { return d.font; })
        .style("fill", function(d) { return fill(d.text.toLowerCase()); })
        .text(function(d) { return d.text; });

      var exitGroup = instance.background.append("g")
        .attr("transform", instance.vis.attr("transform"));

      var exitGroupNode = exitGroup.node();

      text.exit().each(function() {
        exitGroupNode.appendChild(this);
      });

      exitGroup.transition()
        .duration(1000)
        .style("opacity", 1e-6)
        .remove();

      instance.vis.transition()
        .delay(1000)
        .duration(750)
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + 1 + ")");
    }


  },

  resize: function(el, width, height, instance) {

  }

});
