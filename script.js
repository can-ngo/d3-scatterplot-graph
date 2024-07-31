
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

//Dimension of SVG contains Graph in px
const width = 800;
const height = 500;

//Create SVG container
const svg = d3.select('.container')
              .append('svg')
              .attr('width', width + 60)
              .attr('height', height + 60);

//Function that convert the year number format to Date objects
const yearToDate = year => new Date(year,0,1);

//Function that convert the time from string 'mm:ss' to Date object
const timeToDate = timeString => {
   const [minutes, seconds] = timeString.split(':').map(Number);
   const date = new Date(1970, 0, 1); //Stardard Date ECMAScript 2017
   date.setMinutes(minutes);
   date.setSeconds(seconds);
   return date;
}

//Get data, modify format, draw graph,...
fetch(url)
    .then(res => res.json())
    .then(data => {
 
        const yearsDate = data.map(item => yearToDate(item.Year)).sort((a,b)=>a-b);
        const times = data.map(item => timeToDate(item.Time));
        const color = d3.scaleOrdinal(d3.schemeObservable10);
        const tooltip = d3.select('body')
                          .append('div')
                          .attr('class','tooltip')
                          .attr('id','tooltip')
                          .style('opacity',0);

        const yearMax = d3.max(yearsDate);
              yearMax.setMonth(yearMax.getMonth()+12)//For display purpose
        const yearMin = d3.min(yearsDate);
              yearMin.setMonth(yearMin.getMonth()-12)//For display purpose
              
        //Add legent to x-axis
        svg.append('text')
           .attr('x', width + 30)
           .attr('y', height + 10)
           .text('Year')
           .style('text-anchor','end')
        
        //Add legend to y-axis
        svg.append('text')
           .attr('x', -140)
           .attr('y', 60)
           .attr('transform','rotate(-90)')
           .text('Time in Minutes')
        
        //Scaling x settings
        const xScale = d3.scaleTime()
                         .domain([yearMin,yearMax])
                         .range([0,width]);

        const xAxis = d3.axisBottom(xScale);

        //Add x-axis
        svg.append('g')
           .call(xAxis)
           .attr('id','x-axis')
           .attr('transform','translate(40,520)')
        
        //Scaling y settings
        const yScale = d3.scaleTime()
                         .domain(d3.extent(times))
                         .range([0,height]);
        const timeFormat = d3.timeFormat('%M:%S');
        const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
        
        //Add y-axis
        svg.append('g')
           .call(yAxis)
           .attr('id','y-axis')
           .attr('transform','translate(40,20)')

        //Add dot based on data received
        svg.selectAll('.dot')
           .data(data)
           .enter()
           .append('circle')
           .attr('class','dot')
           .attr('r', 6)
           .attr('cx', d => xScale(yearToDate(d.Year)))
           .attr('cy', d => yScale(timeToDate(d.Time)))
           .attr('transform','translate(40,20)')
           .style('fill', d => color(d.Doping !== ""))
           .on('mouseover', (event, d)=>{
               tooltip.style('opacity',0.9);
               tooltip.attr('data-year', d.Year);
               tooltip.html(
                  d.Name + ': ' + d.Nationality + '<br/>' +
                  'Year: ' + d.Year + 
                  ', Time: ' + timeFormat(timeToDate(d.Time)) +
                  (d.Doping? '<br/><br/>' + d.Doping : '')
               )
               tooltip.style('left', event.pageX + 10 + 'px')
               tooltip.style('top', event.pageY - 30 + 'px')
           })
           .on('mouseout', ()=>{
               tooltip.style('opacity', 0);
           })

         //Add subtitle
         svg.append('text')
            .attr('x', width/2 - 90)
            .attr('y', 20)
            .style('font-size','1rem')
            .text("35 Fastest times up Alpe d'Huez");
         
         const legendContainer = svg.append('g').attr('id','legend');

         const legend = legendContainer.selectAll('#legend')
                                       .data(color.domain())
                                       .enter()
                                       .append('g')
                                       .attr('class','legend-label')
                                       .attr('transform', (d,i) => {
                                          return 'translate(0,' + (height/2-i*20)+')';
                                       });
         
         legend.append('rect')
               .attr('x', width + 20)
               .attr('width', 18)
               .attr('height', 18)
               .style('fill',color);
         
         legend.append('text')
               .attr('x', width + 10)
               .attr('y', 10)
               .attr('dy', '0.35em')
               .style('text-anchor','end')
               .style('font-size','0.6rem')
               .text( d => {
                  if (d) {
                     return 'Riders with doping allegations';
                  } else {
                     return 'No doping allegations';
                  }
               })
         

    })
    .catch(e => console.log(e))
