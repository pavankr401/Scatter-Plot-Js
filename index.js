
// request the json file
const req = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
req.open('GET', url, true);
req.send();
req.onload = function(){
    const json = JSON.parse(req.responseText);
    
    ScatterPlot(json);
}
function ScatterPlot(data)
{
    const dataset = data;

    // time format mm:ss
    const timeFormat = d3.timeFormat("%M:%S");
    
    // svg width, height
    const w = 900;
    const h = 550;
    const padding = 60;

    // svg colors
    const color1 = "rgba(255, 166, 0, 0.806)";
    const color2 = "rgba(0, 98, 255, 0.683)";

    // create x Scale , y Scale
    // years xScale
    let xMin = d3.min(dataset, (d) => d.Year)
    let xMax = d3.max(dataset, (d) => d.Year)
    const xScale = d3.scaleLinear()
                   .domain([xMin-1, xMax+1])
                   .range([padding, w-padding])

    // time yScale
    function setMinsAndSecs(time){
        let [min, sec] = time.split(":");
        let date = new Date();
        date.setMinutes(min);
        date.setSeconds(sec);

        return date;
    }
    const timings = dataset.map((d) => setMinsAndSecs(d.Time));
    // console.log(timings);
    let yMin = d3.min(timings);
    let yMax = d3.max(timings);
    
    const yScale = d3.scaleTime()
                   .domain([yMax, yMin])
                   .range([h-padding, padding])

    // create svg
    const svg = d3.select('body')
                  .append('svg')
                  .attr('width', w)
                  .attr('height', h)

    // create circles for each dataset
    svg.selectAll('circle')
       .data(dataset)
       .enter()
       .append('circle')
       .attr('class','dot')
       .attr('data-xvalue',(d) => d.Year)
       .attr('data-yvalue',(d,i) => timings[i])
       .attr('cx', (d) => xScale(d.Year))
       .attr('cy', (d,i) => yScale(timings[i]))
       .attr('r',5)
       .attr("fill", (d) => {
        if(d.Doping == "")
        {
            return color1;
        }
        else{
            return color2;
        }
       })
       .on("mouseover",function(d){

            let xPosition = d3.select(this).attr('cx');
            let yPosition = d3.select(this).attr('cy');

            d3.select('#tooltip')
              .style("left", (Number(xPosition) + 180) + 'px')
              .style("top", (Number(yPosition) + 60) + 'px')
              .attr('data-year', d3.select(this).attr('data-xvalue'))
              
            // add values to tooltip
            let doping = "";
            {if(d.Doping != "") {doping = '<br><br>' + d.Doping}}
            document.getElementById('legend').innerHTML = d.Name + ": " + d.Nationality + "<br>" + "Year: " + d.Year +",Time: " + d.Time + doping
        

            // show the tool tip
            d3.select('#tooltip').classed('hidden', false);
       })
       .on("mouseout", function(){
            d3.select('#tooltip').classed('hidden', true)
       })
       
    // create x-axis and y-axis

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));

    svg.append('g')
       .attr('transform', `translate(0, ${h-padding})`)
       .attr('id', 'x-axis')
       .call(xAxis);

    
    // times for y axis
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
    

    svg.append('g')
       .attr('transform', `translate(${padding}, 0)`)
       .attr('id', 'y-axis')
       .call(yAxis);

    svg.append('text')
    .attr('x', -230)
    .attr('y', 20)
    .style('font-weight', 530)
    .style('font-size','22px')
    .attr('transform', `rotate(${-90})`)
    .text('Time in Minutes')

    // orange box left side
    const size = 20;
    svg.append('rect')
       .attr('x',800)
       .attr('y',200)
       .attr('width', size)
       .attr('height', size)
       .style('fill', color1)

    svg.append('text')
       .attr('x', 602)
       .attr('y', 215)
       .style('font-size', '14px')
       .text('Riders with no Doping allegations')

    // blue box left side
    svg.append('rect')
       .attr('x', 800)
       .attr('y', 225)
       .attr('width', size)
       .attr('height', size)
       .style('fill', color2)
    
    svg.append('text')
       .attr('x', 620)
       .attr('y',240)
       .style('font-size', '14px')
       .text('Riders with Doping allegations')


}