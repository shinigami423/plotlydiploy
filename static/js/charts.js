function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    // check is we are pulling our data
    // console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
    // build Gauge chart
    buildGauge(result.wfreq);
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultsArray = samples.filter(function(data) {
      return data.id === sample;
    })
    //  5. Create a variable that holds the first sample in the array.
    var result = resultsArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(function(otuID) {
      return `OTU ${otuID}`;
    }).reverse();

    // 8. Create the trace for the bar chart.
    var barData = [
      {
        x:sample_values.slice(0,10).reverse(),
        y:yticks,
        text: otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Bacteria Cultures Found",
      margin: {t:30,l:150}
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)





    //////////////////////============= BUBBLE CHART =============//////////////////////
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      { 
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker:{
          size:sample_values,
          color:otu_ids,
          color_scale:"Earth"
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title:"Bacteria Cultures per Sample",
      hovermode:"closest",
      xaxis: {title:"OTU ID"},
      margin: {t:30},
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
  });
}
    // // 3. Create a variable that holds the washing frequency.
    // var wfreq = (FROm buildMetadata needs result.wfreq);

    // // // 4. Create the trace for the gauge chart.
    // var gaugeData = [
    //  {
    //   value: wfreq,
    //   x: [0],
    //   y: [0],
    //   marker: {size:12, color: "850000"},
    //   showlegend: false,
    //   name: "Freq",
    //   type: "indicator",
    //   mode: "gauge+number"
    //  }
    // ];
    
    // // // 5. Create the layout for the gauge chart.
    // var gaugeLayout = { 
    //   width: 500,
    //   height: 500,
    //   margin: { t: 0, b: 0 } ,
    //   title:"<b>Belly Button Washing Frequency</b> <br> Scrub per Week",
    //   xaxis: {
    //     zeroline: false,
    //     showticklabels: false,
    //     showgrid: false,
    //     range: [-1,1]
    //   },
    //   yaxis: {
    //     zeroline: false,
    //     showticklabels: false,
    //     showgrid: false,
    //     range: [-1,1]
    //   }
    // };

    // // // 6. Use Plotly to plot the gauge data and layout.
    // Plotly.newPlot("gauge", gaugeData, gaugeLayout);


    //////////////////////============= GAUGE CHART =============//////////////////////
function buildGauge(wfreq) {
  var level = parseFloat(wfreq) * 20;

  //trigs
  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI)/180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  var mainPath = "M -.0 -0.05 L .0 0.05 L";
  var pathX = String(x);
  var space = " ";
  var pathY = String(y);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

    // // 4. Create the trace for the gauge chart.
  var gaugeData = [
    {
      type: "scatter",
      x: [0],
      y: [0],
      marker: {size:12, color: "850000"},
      showlegend: false,
      name: "Freq",
      text: level,
      hoverinfo: "text+name",
    },
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 ],
      rotation: 90,
      text: ["8-9", "7-8", "6-7","5-6", "4-5", "3-4", "2-3", "1-2","0-1",""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0,105,11,.5)",
          "rgba(10,120,22,.5)",
          "rgba(14,127,0,.5)",
          "rgba(110,154,22,.5)",
          "rgba(170,202,42,.5)",
          "rgba(202,209,95,.5)",
          "rgba(210,206,145,.5)",
          "rgba(232,226,202,.5)",
          "rgba(244,230,215,.5)",
          "rgba(255,255,255,.0)"
        ]
      },
      labels:["8-9", "7-8", "6-7","5-6", "4-5", "3-4", "2-3", "1-2","0-1",""],
      hoverinfo: "label",
      hole:0.5,
      type:"pie",
      showlegend:false
    }
  ];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    shapes:[{
      type:"path",
      path: path,
      fillcolor: "850000",
      line: {color:"850000"}
    }],
    title:"<b>Belly Button Washing Frequency</b> <br> Scrub per Week",
    height:500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    }
  };
  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);
}