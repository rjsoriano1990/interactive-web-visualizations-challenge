jsonData = d3.json("data/samples.json");


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  jsonData.then((data) => {
    var sampleNames = data.names;

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
  jsonData.then((data) => {
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

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  jsonData.then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(samples => samples.id == sample);
    
    //  5. Create a variable that holds the first sample in the array.
    result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = result.otu_ids;
    var otuLabels = result.otu_labels;
    var sampleValues = result.sample_values;
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.slice(0,10).reverse()
    yticks = yticks.map(items => "OTU " + items.toString());

    xvalues = sampleValues.slice(0,10).reverse()

    // 8. Create the trace for the bar chart. 
    let barTrace = {
      type:'bar',
      x: xvalues,
      y: yticks,
      orientation:'h',
      text: otuLabels,
      marker: {
        color: '#FE8F4E'
      }
    }
    var barData = [
      barTrace
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 OTUs"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 11. Bubble plot
    let bubbleTrace = {
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      marker: {
        color: otuIDs,
        size: sampleValues
      },
      text: otuLabels
    };
    var bubbleData = [
      bubbleTrace
    ];
    var barLayout = {
  
    };
    Plotly.newPlot("bubble", bubbleData);

    // 12. Gauge Plot
    samples = data.metadata;
    var resultArray = samples.filter(samples => samples.id == sample);
    wfreq = resultArray[0].wfreq;

    var data = [
      {
        type: "indicator",
        mode: "gauge+number",
        value: wfreq,
        title: { 
          text: "<b>Belly Button Wash Frequency</b><br>Scrubs per "},
        gauge: {
          axis: { range: [null, 9], visible: false},
          bar: { 
            line: {
              color:'red',
              width: 3
            }, 
            color: "red" },
          bgcolor: "white",
          borderwidth: 0,
          bordercolor: "gray",
          steps: [
            { range: [0,1], color: "#FCE9DC", text: '0-1' },
            { range: [1,2], color: "#FED0B5" },
            { range: [2,3], color: "#FDC19E" },
            { range: [3,4], color: "#FEA571"},
            { range: [4,5], color: "#FE8F4E"},
            { range: [5,6], color: "#FD6F1C"},
            { range: [6,7], color: "#FD3403"},
            { range: [7,8], color: "#DB0303"},
            { range: [8,9], color: "#A10202"},
          ]
        }
      }
    ];
    
    var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
    Plotly.newPlot('gauge', data, layout);

    
  });
}

