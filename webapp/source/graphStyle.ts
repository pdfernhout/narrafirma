// TODO: Rules should be read from loaded stylesheet
export const graphResultsPaneCSS = `
    .narrafirma-graph-results-pane {
        width: 850px;
        margin: 5px auto 0px auto;
    }
    
    .chartBackground {
        width: 700px;
        fill: none;
    }
    
    .chartBodyBackground {
        fill: none;
    }
    
    .chart {
        background-color: white;
        fill: none;
    }
    
    .bar {
      fill: none;
    }
    
    .x-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .y-axis {
        fill: none;
        stroke: #231f20;
        stroke-width: 1px;
        shape-rendering: crispEdges;    
    }
    
    .x-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .y-axis text {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .x-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }
    
    .y-axis-label {
        fill: #231f20;
        stroke-width: 0.5px;
        font-family: sans-serif;
        font-size: 1em;
    }

    .barChart.x-axis-label {
        font-size: 1.2em;
    }
    
    .barChart.y-axis-label {
        font-size: 1em;
    }
    
    .histogram.x-axis-label.middle, .histogram.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .histogram.x-axis-label.small.middle {
        font-size: 0.9em;
    }
    
    .histogram.x-axis-label.start, .histogram.x-axis-label.end {
        font-size: 0.9em;
    }
    
    .table.x-axis-label.middle, .table.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .scatterplot.x-axis-label.middle, .scatterplot.y-axis-label.middle {
        font-size: 1.1em;
    }
    
    .scatterplot.x-axis-label.small.middle, .scatterplot.y-axis-label.small.middle {
        font-size: 0.9em;
    }
    
    .scatterplot.x-axis-label.start, .scatterplot.y-axis-label.start, .scatterplot.x-axis-label.end, .scatterplot.y-axis-label.end {
        font-size: 0.9em;
    }
    
    .story.even {
      fill: #2e4a85;
    }
    
    .story.odd {
      fill: #7b8cb2;
    }
    
    .brush .extent {
      fill-opacity: 0.3;
      fill: #ff7d00;
      stroke: #cc6400;
      stroke-width: 1px;
      shape-rendering: auto; /* was crispEdges; auto turns on anti-aliasing */
    }
    
    .histogram-mean {
        stroke: red;
        stroke-width: 2px;
    }
    
    .histogram-standard-deviation-low {
        stroke: #8db500;
        stroke-width: 1.5px;
    }
    
    .histogram-standard-deviation-high {
        stroke: #8db500;    
        stroke-width: 1.5px;
    }
    
    .scatterPlot .story {
      stroke: #2e4a85;
      stroke-width: 0.2px;
      fill: #2e4a85;
      fill-opacity: 0.7;
    }
    
    .contingencyChart .storyCluster.observed {
      stroke-width: 3px;
      stroke: #2e4a85;
      fill: #d5dae6;
    }

    .contingencyChart .storyClusterLabel.observed {
        font-size: 0.8em;
        fill: #2e4a85;
    }

    .contingencyChart .expected {
      stroke-width: 1px;
      stroke: red;
      stroke-dasharray: "5, 5";
      fill: none;
    }
    
    .contingencyChart .axis path {
      display: none;
    }
    
    .contingencyChart .axis line {
      shape-rendering: crispEdges;
      stroke: gray;
    }

    .contingencyChart .miniHistogram {
        fill: #eff4ff;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogram.selected {
        fill: #ffbb84;
        stroke: black;
        stroke-width: 1px;
    }
    
    .contingencyChart .miniHistogramMean {
        fill: blue;
        stroke: none;
    }
    
    .contingencyChart .miniHistogramStdDev {
        fill: #b0d4d4; 
        stroke: black;
        stroke-width: 1px;
    }
    
`;