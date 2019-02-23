metadata = "/metadata/"
samples = "/samples/"

//Complete the following function that builds the metadata panel
function buildMetadata(sample) {

  var num = d3.select('#selDataset').select('option:checked').property('value')
  var mdataURL = `${metadata}${num}`;

  d3.json(mdataURL).then(function(data) {

    var Panel = d3.select('#sample-metadata')
    Panel.html('')

    Object.entries(data).forEach(function([key, value]) {
      Panel.append('h7').text(`${key}: ${value}`).append('br');
      });

  });
}

function buildCharts(sample) {

  var num = d3.select('#selDataset').select('option:checked').property('value')
  var sDataURL = `${samples}${num}`;

  d3.json(sDataURL).then(function(data) {
    console.log(data.otu_ids);

    // Build a Bubble Chart using the sample data
    var Trace = {
      x: data.otu_ids,
      y: data.sample_values,
      text: data.otu_labels,
      mode: 'markers',
      marker: {size: data.sample_values,
        color: data.otu_ids}
      };

    var Data = [Trace];

    var Layout = {
      margin: {
        l: 100,
        r: 0,
        b: 100,
        t: 0
      }
    };

    Plotly.newPlot("bubble", Data, Layout);


    // Build a Pie Chart
    var Ids = data.otu_ids.slice(0,10);
    var Label = data.otu_labels.slice(0,10);
    var Values = data.sample_values.slice(0,10);

    var Trace ={
      values: Values,
      labels: Ids,
      hoverinfo: Label,
      type: "pie",
    };

    var Data = [Trace];

    Plotly.newPlot("pie", Data); 

});

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
