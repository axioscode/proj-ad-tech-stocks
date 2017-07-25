let d3 = require("d3");

class lineChart {

    constructor(opts) {
        this.element = opts.element;
        this.aspectHeight = opts.aspectHeight ? opts.aspectHeight : .66;
        this.onReady = opts.onReady;
        this.dataUrl = opts.dataUrl;
        this.name = opts.name;

        this.parseTime = d3.timeParse("%m/%d/%Y");
        this.formatYear = d3.timeFormat("%y");
        this.formatClose = d3.timeFormat("%b. %d, %Y");

        this.yDomain = opts.yDomain ? opts.yDomain : null;
        this.xDomain = opts.xDomain ? [this.parseTime(opts.xDomain[0]), this.parseTime(opts.xDomain[1])] : null;

        this.onReady = opts.onReady;

        this._setData();

    }

    _setData() {

        this.initPrice = 0;

        //this.timeFormat = d3.timeFormat("%-m/%-d/%y");

        d3.csv(this.dataUrl, data => {

            this.data = data;
            this.initPrice = +this.data[0].Close;

            this.data.forEach(d => {
                d.date = this.parseTime(d.Date);
                d.Close = +d.Close;
                d.Change = ((d.Close-this.initPrice)/this.initPrice)
            });

            this.data = this.data.filter(d=> {
                return d.date;
            })

            this.update();

        })

        console.log(this.initPrice);




    }

    _setDimensions() {
        // define width, height and margin

        this.isMobile = window.innerWidth <= 375 ? true : false;

        this.margin = {
            top: this.isMobile ? 10 : 15,
            right: this.isMobile ? 10 : 45,
            bottom: this.isMobile ? 20 : 30,
            left: this.isMobile ? 34 : 40,
        };

        this.width = this.element.offsetWidth - this.margin.left - this.margin.right;
        this.height = (this.element.offsetWidth * this.aspectHeight) - this.margin.top - this.margin.bottom; //Determine desired height here

    }

    _setScales() {

        this.xScale = d3.scaleTime()
            .rangeRound([0, this.width]);

        this.yScale = d3.scaleLinear()
            .rangeRound([this.height, 0]);

        this.line = d3.line()
            .x(d => {
                return this.xScale(d.date);
            })
            .y(d => {
                return this.yScale(d.Change);
            });

    }

    update() {
        this._setDimensions();
        this._setScales();
        this.draw();
        this.drawLine();
    }

    draw() {

        // set up parent element and SVG
        this.element.innerHTML = "";

        // d3.select(this.element).append("p")
        //     .classed("name", true)
        //     .html(this.name);

        this.svg = d3.select(this.element).append('svg');

        //Set svg dimensions
        this.svg.attr('width', this.width + this.margin.left + this.margin.right);
        this.svg.attr('height', this.height + this.margin.top + this.margin.bottom);

        // create the chart group.
        this.plot = this.svg.append('g')
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`)
            .attr("class", "chart-g");

        this.onReady();
    }





    drawLine() {


        if (!this.xDomain) {
            this.xDomain = d3.extent(this.data, d => {
                return d.date;
            })
        }

        if (!this.yDomain) {
            this.yDomain = d3.extent(this.data, d => {
                return d.Change;
            })
        }

        this.xScale.domain(this.xDomain);
        this.yScale.domain(this.yDomain);

        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(d3.timeYear)
            .tickSize(-this.height)
            .tickFormat(d=> {
                return `'${this.formatYear(d)}`;
            })

        this.plot.append("g")
            .classed("axis", true)
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis)
            .select(".domain")
            .remove();

        this.formatPercent = d3.format(",.0%")


        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(3)
            .tickSize(-this.width)
            .tickFormat(d=> {

                let sign = d > 0 ? "+" : "";
                return `${sign}${this.formatPercent(d)}`;
                
            });

        this.plot.append("line")
            .classed("zero", true)
            .attr("x1", 0)
            .attr("x2", this.width)
            .attr("y1", this.yScale(0))
            .attr("y2", this.yScale(0));

        this.plot.append("g")
            .classed("axis", true)
            .call(this.yAxis);

        this.plot.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", this.line);

        // d3.select(this.element).append('svg');

        // d3.select(this.element).append("div")
        //     .attr("class", "lbl")
        //     .data([this.data[this.data.length-1]])
        //     .style("right", d=> {
        //         return `${this.width + this.margin.right - this.xScale(d.date)}px`;
        //     })
        //     .style("top", `${this.margin.top + 5}px`)
        //     .html(d=> {
        //         return `<span class='date'>${this.formatClose(d.date)}</span>
        //                 <span class='close'>$${d.Close}</span>`;
        //                 // <span class='change'>${round(d.Change, 1)}</span>`;
        //     })

        this.plot.append("text")
            .classed("lbl", true)
            .data([this.data[this.data.length-1]])
            .attr("x", d=> {
                return this.xScale(d.date);
            })
            .attr("y", d=> {
                return this.yScale(d.Change);
            })
            .text(d=> {
                let sign = d > 0 ? "+" : "";
                return `${sign}${this.formatPercent(d.Change)}`;
            })
            .attr("opacity", d=> {
                return this.isMobile ? 0 : 1;
            })


    }




}

function round(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}



export default lineChart;