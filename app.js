function getPlots(id) {
    // Read samples.json
    d3.json("samples.json").then(sampledata => {
        var selectedSample = sampledata.samples.filter(sample => sample.id === id)[0];
        var ids = selectedSample.otu_ids;
        var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var labels = selectedSample.otu_labels.slice(0, 10);
        // get only top 10 otu ids for the plot OTU and reversing it.
        var OTU_top = ids.slice(0, 10).reverse();
        // get the otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d);
        // get the top 10 labels for the plot
        var trace = {
            x: sampleValues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'blue'
            },
            type: "bar",
            orientation: "h",
        };
        // create data variable
        var data = [trace];

        // create layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        // The bubble chart
        var trace1 = {
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            mode: "markers",
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids
            },
            text: selectedSample.otu_labels

        };

        // set the layout for the bubble plot
        var layout_2 = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_2);

    });
}
// create the function to get the necessary data
function getDemoInfo(id) {
    // read the json file to get data
    d3.json("samples.json").then((data) => {
        // get the metadata info for the demographic panel
        var metadata = data.metadata;

        // filter meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];
        // select demographic panel to put data
        var demographicInfo = d3.select("#sample-metadata");

        // empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");
        });
    });
}
// create the function for the change event
function optionChanged(id) {
    getPlots(id);
    getDemoInfo(id);
}

// create the function for the initial data rendering
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");

    // read the data 
    d3.json("samples.json").then((data) => {

        // get the id data to the dropdwown menu
        data.names.forEach(function (name) {
            dropdown.append("option").text(name).property("value", name);
        });

        // call the functions to display the data and the plots to the page
        getPlots(data.names[0]);
        getDemoInfo(data.names[0]);
    });
}

init();
