// -------------Global Variables -------------//
//Data Variables
var Alldata = []; // Contains all of the data
var finalData = JSON.parse('{}'); // Contains Alldata converted to JSON format
// Global chart elements for all charts
var dimpleChart1; //Seat Class chart
var dimpleChart2; //Travelling with chart
var dimpleChart3; //Embarked from Chart
var dimpleChart5; // Gender Chart
//Filter Variables
var last_fil_5 =[];//Last filter selection of Chart5
var lastx = 0; //Min of filter selection of chart 4
var lasty = 0; //Max of filter selection of chart 4


//On window load, loads the data from file into Alldata element and calls the function to draw all the charts
$( window ).on( "load", function() {
        console.log( "window loaded" );
		d3.csv("http://localhost:8000/titanic-data.csv", function(data) {
		Alldata = data;
		//console.log(data);

		drawCharts();

});});


// This function calls the create function of all the charts
function drawCharts(){
	drawChart1();
	drawChart2();
	drawChart3();
	drawChart4();
	drawChart5();


};

//This function is used to redraw the charts when filter is selected from chart 4 or unselected from Chart 4 or 5
function chartRefresh(filter){

  //Updates the data, using the selected filter. Fitler can be "" to deselects the filter
	dimpleChart1.data =  groupBY(Alldata,["Pclass","Survived"],"",filter);
	dimpleChart2.data = groupBY(Alldata,["Company","Survived"],"",filter);
	dimpleChart3.data = groupBY(Alldata,["Embarked","Survived"],"",filter);

  //Re-draws the charts
	dimpleChart1.draw(1500);
	dimpleChart2.draw(1500);
	dimpleChart3.draw(1500);
};
//This function is used to redraw the charts when filter is selected from chart 5
function chartRefresh_histogram(col,x,y){

  //Checks if the selected filter is already applied, then calls refresh function to deselect the filters
  if (x==lastx && y==lasty)
  {
    chartRefresh("");
    //empties the varibale with latest selected filter, as the filter has been deselected
    lastx=0;
    lasty=0;
  }
  // if the filter is not already selected, then calls refresh function to deselect the filters
  else {
  // Updates the values to catch the latest selected filters
  lastx=x;
  lasty=y;

  //Updates the data, using the selected filter.
	dimpleChart1.data =  groupBY(rangeFilter(Alldata,col,x,y),["Pclass","Survived"],"","");
	dimpleChart2.data = groupBY(rangeFilter(Alldata,col,x,y),["Company","Survived"],"","");
	dimpleChart3.data = groupBY(rangeFilter(Alldata,col,x,y),["Embarked","Survived"],"","");

  //redraws the chart
	dimpleChart1.draw(1500);
	dimpleChart2.draw(1500);
	dimpleChart3.draw(1500);
}

}

//This function converts the text to proper :::: First letter Upper case, remaining all lower case
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//Function to draw the chart 5 (Gender PIE)
function drawChart5(){

  //Selects the SVG for Chart 5
	var svg = d3.select("#chart5").select("svg");

	//Groups the data, into JSON format
	var data = groupBY(Alldata,["Sex"],"","");
	// Adds the title to the chart
  svg.append("text").attr("x", $("#chart5").width()/2)
  .attr("y", $("#chart5").height()/15)
  .attr("text-anchor", "middle")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .text("Gender");
  // map our svg to our chart
	dimpleChart5 = new dimple.chart(svg, data);
  //set the bounds of the charts
	dimpleChart5.setBounds(80, 40, $("#chart5").width()-150, $("#chart5").height()-75);
  // Custom colors to be used in legends
  dimpleChart5.defaultColors = [
    new dimple.color("#006EC3"),
    new dimple.color("#FFCE44")
];
  //Adds the measure axis of the pie chart
	dimpleChart5.addMeasureAxis("p", "count");
  //Adds the series
	var mySeries = dimpleChart5.addSeries("Sex", dimple.plot.pie);
  //After drawing the chart, this function adds the data labels on the pie slices
  mySeries.afterDraw = function(shape, data) {
    var bbox, ctm;
    ctm = shape.getCTM();
    bbox = shape.getBBox();
    return this.chart.svg.append("text")
      .attr("x", ctm.e + bbox.x + bbox.width - 100 )
      .attr("y", ctm.f + bbox.y + bbox.height/2)
      .text(toTitleCase(data.aggField[0])+' : '+Math.round(1000*data.piePct)/10 + "%");
  };

  //Adds the legends
	dimpleChart5.addLegend($("#chart5").width()-75, 20, 90, $("#chart5").height()-25, "left");

  //This functionality is used in applying the filters
	mySeries.addEventHandler("click", function (e) {
		var fil = [];
		fil.push(["Sex",e.seriesValue]);

		if(JSON.stringify(last_fil_5)==JSON.stringify(fil))
		{
			chartRefresh("");
			last_fil_5 = [""];
		}
		else {
			chartRefresh(fil);
			last_fil_5 = fil;
		}
	});

  //Draws the chart for the first time
	dimpleChart5.draw(1000);



}
//Function to draw the chart 1 (Class Bar)
function drawChart1(){
  //Selects the SVG for Chart 1
	var svg = d3.select("#chart1").select("svg");

	//Groups the data, into JSON format
	var data = groupBY(Alldata,["Pclass","Survived"],"","");
  // Adds the title to the chart
  svg.append("text").attr("x", $("#chart1").width()/1.8)
  .attr("y", $("#chart1").height()/15)
  .attr("text-anchor", "middle")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .text("Seat Class");
  // maps our svg to our chart
	dimpleChart1 = new dimple.chart(svg, data);
  //set the bounds of the charts
  dimpleChart1.setBounds(80, 30, $("#chart1").width()-120, $("#chart1").height()-60);
  // Custom colors to be used in legends
  dimpleChart1.defaultColors = [
    new dimple.color("#D24625"),
    new dimple.color("#1BA261")
];
  //Adds the measure axis of the bar chart
  var m1 = dimpleChart1.addMeasureAxis("x", "count");
  //Disabling the axis titles
  m1.title = "";
  //Adds the series
	var c1 = dimpleChart1.addCategoryAxis("y", ["Pclass","Survived"]);
	c1.addGroupOrderRule(getAttrDistinct(data,"Survived"));
	c1.addOrderRule(getAttrDistinct(data,"Pclass"));
//Disabling the axis titles
  c1.title = "";
  //Adds the Series
	dimpleChart1.addSeries("Survived", dimple.plot.bar);
  //Adds the legends
	dimpleChart1.addLegend($("#chart1").width()-95, 20, 90, $("#chart1").height()-25, "left");
  //Draws the chart
  dimpleChart1.draw(1000);


}
//Function to draw the chart 2 (Company Bar)
function drawChart2(){
//Selects the SVG for Chart 2
	var svg = d3.select("#chart2").select("svg");

	//Groups the data, into JSON format
	var data = groupBY(Alldata,["Company","Survived"],"","");
  // Adds the title to the chart
  svg.append("text").attr("x", $("#chart2").width()/1.8)
  .attr("y", $("#chart2").height()/15)
  .attr("text-anchor", "middle")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .text("Travelling Companion");
  // maps our svg to our chart
	dimpleChart2 = new dimple.chart(svg, data);
  //set the bounds of the charts
	dimpleChart2.setBounds(80, 30, $("#chart2").width()-120, $("#chart2").height()-60);
  // Custom colors to be used in legends
  dimpleChart2.defaultColors = [
    new dimple.color("#D24625"),
    new dimple.color("#1BA261")
];
  //Adds the measure axis of the bar chart
	var m1 = dimpleChart2.addMeasureAxis("x", "count");
    //Disabling the axis titles
  m1.title = "";
    //Adds the series
	var c1 = dimpleChart2.addCategoryAxis("y", ["Company","Survived"]);
	c1.addGroupOrderRule(getAttrDistinct(data,"Survived"));
	c1.addOrderRule(getAttrDistinct(data,"Company"));
  //Disabling the axis titles
  c1.title = "";
    //Adds the Series
	dimpleChart2.addSeries("Survived", dimple.plot.bar);
  //Adds the legends
	dimpleChart2.addLegend($("#chart2").width()-95, 20, 90, $("#chart2").height()-25, "left");
  //Draws the chart
  dimpleChart2.draw(1000);


}

//Function to draw the chart 3 (Embarked Bar)
function drawChart3(){
//Selects the SVG for Chart 3
	var svg = d3.select("#chart3").select("svg");

	//Groups the data, into JSON format
	var data = groupBY(Alldata,["Embarked","Survived"],"","");
// Adds the title to the chart
  svg.append("text").attr("x", $("#chart3").width()/1.8)
  .attr("y", $("#chart3").height()/15)
  .attr("text-anchor", "middle")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .text("Embarked From");
  // maps our svg to our chart
	dimpleChart3 = new dimple.chart(svg, data);
  //set the bounds of the charts
  dimpleChart3.setBounds(80, 30, $("#chart3").width()-120, $("#chart3").height()-60);
// Custom colors to be used in legends
  dimpleChart3.defaultColors = [
    new dimple.color("#D24625"),
    new dimple.color("#1BA261")
];
//Adds the measure axis of the bar chart
	var m1 = dimpleChart3.addMeasureAxis("x", "count");
//Disabling the axis titles
  m1.title = "";
//Adds the series
  var c1 = dimpleChart3.addCategoryAxis("y", ["Embarked","Survived"]);
	c1.addGroupOrderRule(getAttrDistinct(data,"Survived"));
	c1.addOrderRule(getAttrDistinct(data,"Embarked"));
//Disabling the axis titles
  c1.title = "";
  //Adds the Series
	dimpleChart3.addSeries("Survived", dimple.plot.bar);
    //Adds the legends
  dimpleChart3.addLegend($("#chart3").width()-95, 20, 90, $("#chart3").height()-25, "left");

    //Draws the chart
	dimpleChart3.draw(1000);


}

//Function to draw the chart 4 (Age histogram)
function drawChart4(){
  //Gets age attr for every row fo data
var data = getAttr(Alldata,"Age",1);
  // removes one extra values
data.splice(-1,1);

var i = 0;

//min & max out of the data
var max = Math.round(d3.max(data));
var min = Math.round(d3.min(data));
var formatCount = d3.format(",.0f");

//Adding the margins reletive to the svg size
var margin = {top: 20, right: 25, bottom: 25, left: 20},
    width = $('svg',$('#chart4')).width() - margin.left - margin.right,
    height = $('svg',$('#chart4')).height() - margin.top - margin.bottom;
// making change in the svg size
	var svg = d3.select("#chart4").select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom ),
    g = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  // Appending the chart 4 title
    svg.append("text").attr("x", $("#chart4").width()/2)
          .attr("y", $("#chart4").height()/15)
          .attr("text-anchor", "middle")
          .style("font-size", "13px")
          .style("font-weight", "bold")
          .text("Age Distribution");
//Creating the linear scale of value-pixel mapping to x-axis
var x = d3.scaleLinear()
     .domain([min, max])
      .range([0, width]);

//Defining the histogram and its size
var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(x.ticks(30))
    (data);

//Creating the linear scale of value-pixel mapping to y-axis
var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d) { return d.length; })])
    .range([height, 0]);

//Adjusting the size of bars as per the value
var bar = g.selectAll(".bar")
  .data(bins)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

//Adding the click function to filter functionality
bar.append("rect")
    .attr("x", ++i)
    .attr("onclick", function(d) { return 'chartRefresh_histogram("Age",' + d.x0 + ',' + d.x1 + ')';})
    .attr("style","cursor: pointer")
	.attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
    .attr("height", function(d) { return height - y(d.length); });

//Appending the data value labels
bar.append("text")
    .attr("dy", ".75em")
    .attr("y", 6)
    .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
    .attr("text-anchor", "middle")
    .text(function(d) { return formatCount(d.length); });

//Adding the X axis line
g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));


};

// FUnction to group/aggregates the data into JSON fotmat, based on the paramters
function groupBY(data,dims,measures,filters){
var interData = JSON.parse('{}');
var finalDataStr = "";
  //process each row of input data
  for (rw in data){
		var key = "";
		var valStr = "{";
		var val = data[rw];
    var valid = 0; // Flag if the row is meets the filter crieteria
		var vld = 0 // count of cols in a row that meets filter crieteria
    //checks if the filter is applied or not
		if (filters == "" )
		{
      //Marks the row valid as no filter is applied
      valid = 1
		}
		else{ // if the filter is applied
			for ( fils in filters){ //iterates for every filter

				for ( vv in filters[fils][1]) // iterates each value of filter against the respective column
				{
					if (val[filters[fils][0]] == filters[fils][1][vv]) //checks if column qualifies or not
						vld++; // adds if col qualifies
				}
				if (vld == filters.length) // checks if all cols qualifies or not
					valid = 1; // mark the row valid as total col are equal to qualified cols
			}
		}
	if (valid == 1 ) { // Continues if the row if valid, otherwise do nothing to move to next row
			for ( d in dims ) // iterates each values of the list of grouping attributes
			{
				key += val[dims[d]]; // creates unique key for all combo of attr values
				if(key == "undefined" || key == "undefinedundefined"){ // omits if the values are undefined
					//console.log("undefined");
				}
				else{ //  if the values are not undefined, then creates a place holder for the values to be added in final JSON string
					if (d == 0)
						valStr += '"'+dims[d]+'":"'+ val[dims[d]] +'"'
					else
						valStr += ',"' + dims[d] + '":"' + val[dims[d]] + '"'
				}
			}
      //checks if the measure list is empty or not, this list is used to be aggregated.
			if ( measures == "" )
			{}
			else{ // if the list is not empty, iterates for each measure, and add the values place holder.
				for ( d in measures )
				{
					valStr += ',"'+measures[d]+'":'+ val[measures[d]] +''
				}
			}
			valStr += "}";
			valStr = JSON.parse(valStr);
      // checks if the key exist or not,
      if (interData.hasOwnProperty(key) && key != "undefined" && key != "undefinedundefined" ){// if it exists, add the measure value in the same,
				for ( d in measures )
				{
					interData[key][measures[d]] += valStr[measures[d]] // aggregatting the measure for same key
				}
        //Adding an additional column of count
          interData[key]['count'] += 1;
			}
			else { //else adds the key.
				if(key != "undefined" && key != "undefinedundefined"){ // adds the ey for first time, with measure as is and count as 1.
				interData[key] = valStr;
				interData[key]['count'] = 1;
				}
			}
		}
	}
	var i = 0;
	for (d in interData){ // converts each JSON String into a form of JSON Array String
		if ( i == 0){
			finalDataStr += JSON.stringify(interData[d]);
			i++;
		}
		else
			finalDataStr += ','+JSON.stringify(interData[d]);
	}
// converts to JSON Array
	finalData = JSON.parse('['+finalDataStr+']');

	return finalData;
}


//Function to fetch all values of single attribute from JSON object and returns an array
function getAttr(objArray,attr,m){
	var arr = [];

	if(m==1){
		for ( i in objArray)
		{
			arr.push(+objArray[i][attr]);
		}
	}
	else {
		for ( i in objArray)
		{
			arr.push(objArray[i][attr]);
		}
	}

	return arr;
};

//Function to fetch all distinct values of single attribute from JSON object and returns an array
function getAttrDistinct(objArray,attr,m){
	var arr = [];

	if(m==1){
		for ( i in objArray)
		{
			if(!arr.includes(+objArray[i][attr])){
			arr.push(+objArray[i][attr]);
			}
		}
	}
	else {
		for ( i in objArray)
		{
			if(!arr.includes(objArray[i][attr])){
			arr.push(objArray[i][attr]);
			}
		}
	}

	return arr;
};


//Applies range filter to the data provided
function rangeFilter(data,col,r_s,r_e){
	var rtn_data = [];
	for (rw in data){
	var colm = +data[rw][col];
		if (colm >= r_s && colm < r_e)
			rtn_data.push(data[rw]);
	}
	return rtn_data;

}
