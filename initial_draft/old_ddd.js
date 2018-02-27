var Alldata = []; 
var finalData = JSON.parse('{}'); 
var dc1; 
var dc2; 
var dc3; 
var dc5; 
var last_fil_5 =[];
$( window ).on( "load", function() {
 console.log( "window loaded" );
 d3.csv("http://localhost:8000/titanic-data.csv", function(data) {
 Alldata = data;
 ch1();ch2();ch3();ch4();ch5();});});
function chartRefresh(filter){
 dc1.data = groupBY(Alldata,["Pclass","Survived"],"",filter);
 dc2.data = groupBY(Alldata,["Company","Survived"],"",filter);
 dc3.data = groupBY(Alldata,["Embarked","Survived"],"",filter);
 dc1.draw();
 dc2.draw();
 dc3.draw();};
function chartRefresh_histogram(col,x,y){
dc1.data = groupBY(rangeFilter(Alldata,col,x,y),["Pclass","Survived"],"","");
dc2.data = groupBY(rangeFilter(Alldata,col,x,y),["Company","Survived"],"","");
dc3.data = groupBY(rangeFilter(Alldata,col,x,y),["Embarked","Survived"],"","");
dc1.draw();
dc2.draw();
dc3.draw();}
function ch5(){
var svg = d3.select("#chart5").select("svg");
var data = groupBY(Alldata,["Sex"],"","");
svg.append("text").attr("x", $("#chart5").width()/2).attr("y", $("#chart5").height()/15).attr("text-anchor", "middle").style("font-size", "13px").style("font-weight", "bold").text("Gender");
dc5 = new dimple.chart(svg, data);
dc5.setBounds(80, 40, $("#chart5").width()-150, $("#chart5").height()-75); 
dc5.addMeasureAxis("p", "count");
var mySeries = dc5.addSeries("Sex", dimple.plot.pie);
dc5.addLegend($("#chart5").width()-75, 20, 90, $("#chart5").height()-25, "left");
mySeries.addEventHandler("click", function (e) {
var fil = [];
fil.push(["Sex",e.seriesValue]);
if(JSON.stringify(last_fil_5)==JSON.stringify(fil))
{chartRefresh("");last_fil_5 = [""];}
 else {chartRefresh(fil);
last_fil_5 = fil;}}); 
dc5.draw();}
function ch1(){
var svg = d3.select("#chart1").select("svg");
var data = groupBY(Alldata,["Pclass","Survived"],"","");
dc1 = new dimple.chart(svg, data);
dc1.setBounds(80, 30, $("#chart1").width()-120, $("#chart1").height()-60);
dc1.addMeasureAxis("x", "count");
dc1.addCategoryAxis("y", ["Pclass","Survived"]);
dc1.addSeries("Survived", dimple.plot.bar);
dc1.addLegend($("#chart1").width()-95, 20, 90, $("#chart1").height()-25, "left");
dc1.draw();}
function ch2(){
var svg = d3.select("#chart2").select("svg"); 
var data = groupBY(Alldata,["Company","Survived"],"",""); 
dc2 = new dimple.chart(svg, data);
dc2.setBounds(80, 30, $("#chart2").width()-120, $("#chart2").height()-60);
dc2.addMeasureAxis("x", "count"); 
dc2.addCategoryAxis("y", ["Company","Survived"]);
dc2.addSeries("Survived", dimple.plot.bar);
dc2.addLegend($("#chart2").width()-95, 20, 90, $("#chart2").height()-25, "left");
dc2.draw();}
function ch3(){
var svg = d3.select("#chart3").select("svg");
var data = groupBY(Alldata,["Embarked","Survived"],"","");
dc3 = new dimple.chart(svg, data);
dc3.setBounds(80, 30, $("#chart3").width()-120, $("#chart3").height()-60);
dc3.addMeasureAxis("x", "count");
dc3.addCategoryAxis("y", ["Embarked","Survived"]);
dc3.addSeries("Survived", dimple.plot.bar);
dc3.addLegend($("#chart3").width()-95, 20, 90, $("#chart3").height()-25, "left");
dc3.draw();
}
function ch4(){
var data = getAttr(Alldata,"Age",1);
var i = 0;
var max = Math.round(d3.max(data));
var min = Math.round(d3.min(data));
var formatCount = d3.format(",.0f");
var margin = {top: 20, right: 25, bottom: 25, left: 20}, width = $('svg',$('#chart4')).width() - margin.left - margin.right, height = $('svg',$('#chart4')).height() - margin.top - margin.bottom;
var svg = d3.select("#chart4").select("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom ),
g = svg.append("g").attr("transform","translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleLinear().domain([min, max]).range([0, width]);
var bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(30))(data);
var y = d3.scaleLinear().domain([0, d3.max(bins, function(d) { return d.length; })]).range([height, 0]);
var bar = g.selectAll(".bar").data(bins).enter().append("g").attr("class", "bar").attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
bar.append("rect").attr("x", ++i).attr("onclick", function(d) { return 'chartRefresh_histogram("Age",' + d.x0 + ',' + d.x1 + ')';}).attr("width", x(bins[0].x1) - x(bins[0].x0) - 1).attr("height", function(d) { return height - y(d.length); });
bar.append("text").attr("dy", ".75em").attr("y", 6).attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2).attr("text-anchor", "middle").text(function(d) { return formatCount(d.length); });
g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));};
function groupBY(data,dims,measures,filters){
var interData = JSON.parse('{}');
var finalDataStr = ""; 
 for (rw in data){
 var key = "";
 var valStr = "{";
 var val = data[rw];
 var valid = 0; 
 var vld = 0  
 if (filters == "" ){ valid = 1}
 else{ for ( fils in filters){ 
for ( vv in filters[fils][1]) 
{
if (val[filters[fils][0]] == filters[fils][1][vv]) 
vld++; 
}
if (vld == filters.length) 
valid = 1; 
}
}
if (valid == 1 ) { 
for ( d in dims ) 
{
key += val[dims[d]]; 
if(key == "undefined" || key == "undefinedundefined"){ }else{ 
 if (d == 0)
 valStr += '"'+dims[d]+'":"'+ val[dims[d]] +'"'
 else
 valStr += ',"' + dims[d] + '":"' + val[dims[d]] + '"'}}
 if ( measures == "" )
 {}
 else{ 
 for ( d in measures )
 {
 valStr += ',"'+measures[d]+'":'+ val[measures[d]] +''}} 
valStr += "}";
 valStr = JSON.parse(valStr);
 
 if (interData.hasOwnProperty(key) && key != "undefined" && key != "undefinedundefined" ){
 for ( d in measures )
 {
 interData[key][measures[d]] += valStr[measures[d]] 
 }
 interData[key]['count'] += 1;
 }
 else { 
 if(key != "undefined" && key != "undefinedundefined"){ 
 interData[key] = valStr;
 interData[key]['count'] = 1;}}}}
 var i = 0;
 for (d in interData){ 
 if ( i == 0){
 finalDataStr += JSON.stringify(interData[d]);
 i++;}
 else
 finalDataStr += ','+JSON.stringify(interData[d]);}
 finalData = JSON.parse('['+finalDataStr+']');
 return finalData;}
function getAttr(objArray,attr,m){
 var arr = [];
 if(m==1){ for ( i in objArray)
 { arr.push(+objArray[i][attr]);}}
 else { for ( i in objArray){
 arr.push(objArray[i][attr]);}}
 return arr;};
function getAttrDistinct(objArray,attr,m){
 var arr = [];
 if(m==1){
 for ( i in objArray)
 {if(!arr.includes(+objArray[i][attr])){arr.push(+objArray[i][attr]);}}}
 else {for ( i in objArray)
 {if(!arr.includes(objArray[i][attr])){arr.push(objArray[i][attr]);}}}
 return arr;};
function rangeFilter(data,col,r_s,r_e){
 var rtn_data = [];
 for (rw in data){
 var colm = +data[rw][col];
 if (colm >= r_s && colm < r_e)
 rtn_data.push(data[rw]);}
 return rtn_data;
}
