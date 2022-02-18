class Line {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 500,
            containerHeight: _config.containerHeight || 140,
            margin: { top: 10, bottom: 30, right: 50, left: 50 },
            tooltipPadding: _config.tooltipPadding || 15,
            yLabel: _config.yLabel || 'No. of days'
        }
        this.data = _data;

        // Call a class function
        this.initVis();
    }


    initVis() {

        let vis = this; //this is a keyword that can go out of scope, especially in callback functions, 
        //so it is good to create a variable that is a reference to 'this' class instance
        // console.log(vis.config.color)
        //set up the width and height of the area where visualizations will go- factoring in margins               
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        console.log(vis.data)

        vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
        vis.colorPalette.domain("median", "percent", "max");

        //reusable functions for x and y 
        //if you reuse a function frequetly, you can define it as a parameter
        //also, maybe someday you will want the user to be able to re-set it.
        vis.xValue = d => d.year;
        vis.yValue = d => d.value
        vis.groups = d3.group(vis.data, d => d.type);

        //setup scales
        vis.xScale = d3.scaleLinear()
            .domain(d3.extent(vis.data, vis.xValue)) //d3.min(vis.data, d => d.year), d3.max(vis.data, d => d.year) );
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .domain(d3.extent(vis.data, vis.yValue))
            .range([vis.height, 0])
            .nice(); //this just makes the y axes behave nicely by rounding up

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight)

        // Append group element that will contain our actual chart (see margin convention)
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)





        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale);

        // Append x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`)
            .call(vis.xAxis)
        // .text('')
        // .text("income per capita, inflation-adjusted (dollars)");

        // Append y-axis group
        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis);

        //TO DO: create an area path

        //first create a helper function : vis.area
        // x should use the x scale created above
        // y should use the y scale created above
        // y0 should use vis.height, since this is the bottom of the chart 

        // Append an area path to your vis.chart.  
        // NOTE:   .data([vis.data])  needs to be structured like this
        //  Set the fill to  '#e9eff5'
        // using the helper function: .attr('d', vis.area);
        // vis.area = d3.area()
        // 	.x(d => vis.xScale(vis.xValue(d)))
        // .y1(d => vis.yScale(vis.yValue(d)))
        // .y0(vis.height)

        // vis.chart.append('path')
        // .data([vis.data])
        // .attr('fill', '#e9eff5')
        // .attr('d', vis.area);


        //TO DO- create a line path 

        // first, initialize line generator helper function : vis.line
        // x should use xScale
        // y should use yScale
        vis.line = d3.line()
            .x(d => vis.xScale(vis.xValue(d)))
            .y(d => vis.yScale(vis.yValue(d)))

        // Append a path to your vis.chart
        // NOTE:   .data([vis.data])  needs to be structured like this
        // stroke should be '#8693a0'
        // fill should be 'none'
        // stroke width should be 2 
        // using the helper function: .attr('d', vis.line);
        // console.log(this.color)

        //add buttons to show individual charts

        vis.circles = vis.chart.selectAll('whatever')
            .data(vis.data)
            .join('circle') // join rerenders the data that is filered
            .attr('fill', (d) => vis.colorPalette(d.type))
            .attr('opacity', .8)
            .attr('stroke', (d) => vis.colorPalette(d.type))
            .attr('stroke-width', 2)
            .attr('r', 2)
            .attr('cy', (d) => vis.yScale(d.value))
            .attr('cx', (d) => vis.xScale(d.year));

        vis.circles
            .on('mouseover', (event, d) => {
                d3.select('#tooltip')
                    .style('display', 'block')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
                    .html(`
              <div class="tooltip-title">${d.type}</div>
              <div><i>${d.year}</i></div>
              <ul>
                <li>${d.value}</li>
             
              </ul>
            `);
            })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('display', 'none');
            });

        vis.chart.selectAll(".line")
            .data(vis.groups)
            .join("path")
            .attr('stroke', (d) => vis.colorPalette(d[0]))
            .attr('fill', 'none')
            .transition()
            .duration(3000)
            .attr('stroke-width', 2)
            .attr('d', function (d) {
                return d3.line()
                    .x(function (d) { return vis.xScale(d.year); })
                    .y(function (d) { return vis.yScale(d.value); })
                    (d[1])
            });

            vis.svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", vis.width - 200)
            .attr("y", vis.height + 80)
            .text("Year----->");


        vis.svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", 12)
            // .attr("x", vis.width)
            .attr("dy", "-0.1em")
            .attr("transform", "rotate(-90)")
            .text(vis.config.yLabel);
        //   vis.svg.selectAll("*").remove();
        this.updateVis();

    }


    //leave this empty for now
    updateVis() {
        let vis = this;
        let test = document.getElementById("vis1");

        // This handler will be executed only once when the cursor
        // moves over the unordered list

        // test

        // This handler will be executed every time the cursor
        // is moved over a different list item

    }


    //leave this empty for now...
    renderVis() {

    }


}