var setupVisualsGoogleAnalytics = require('./analytics.js').setupVisualsGoogleAnalytics;
var trackEvent = require('./analytics.js').trackEvent;

var pym = require('pym.js');

var pymChild = null;

let d3 = require("d3");

import linechart from "./line-chart";

// FUEL.csv 29.00, 9/20/13
// RUBI.csv 15.00, 4/2/14
// SZMK.csv
// YUME.csv

// <div class="chart yume"></div>
// <div class="chart rubi"></div>
// <div class="chart szmk"></div>
// <div class="chart fuel"></div>

document.addEventListener("DOMContentLoaded", main());


function main() {

    var pymChild = new pym.Child();

    let yume = new linechart({
        element: document.querySelector(`.chart-div.yume .chart`),
        dataUrl: "data/YUME.csv",
        yDomain: [-1.05, .5],
        xDomain : ["7/1/2013", "7/24/2017"],
        name: "YUME",
        onReady : function() {
            pymChild.sendHeight();
        }
    });

    let rubi = new linechart({
        element: document.querySelector(`.chart-div.rubi .chart`),
        dataUrl: "data/RUBI.csv",
        yDomain: [-1.05, .5],
        xDomain : ["7/1/2013", "7/24/2017"],
        name: "RUBI",
        onReady : function() {
            pymChild.sendHeight();
        }
    });

    let szmk = new linechart({
        element: document.querySelector(`.chart-div.szmk .chart`),
        dataUrl: "data/SZMK.csv",
        yDomain: [-1.05, .5],
        xDomain : ["7/1/2013", "7/24/2017"],
        name: "SZMK",
        onReady : function() {
            pymChild.sendHeight();
        }
    });

    let fuel = new linechart({
        element: document.querySelector(`.chart-div.fuel .chart`),
        dataUrl: "data/FUEL.csv",
        yDomain: [-1.05, .5],
        xDomain : ["7/1/2013", "7/24/2017"],
        name: "FUEL",
        onReady : function() {
            pymChild.sendHeight();
        }
    });

    d3.select(window).on("resize", ()=> {
    	yume.update();
    	rubi.update();
    	szmk.update();
    	fuel.update();
    });

    

}