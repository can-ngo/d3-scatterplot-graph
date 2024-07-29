
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
    .then(res => res.json())
    .then(data => {

        //Convert the year format to Date objects
        const yearToDate = year => new Date(year,0,1);

        const yearsDate = data.map(item => yearToDate(item.Year)).sort((a,b)=>a-b);
        
        //Convert the time from string 'mm:ss' to Date object
        const timeToDate = timeString => {
            const [minutes, seconds] = timeString.split(':').map(Number);
            const date = new Date(1970, 0, 1); //Stardard Date ECMAScript 2017
            date.setMinutes(minutes);
            date.setSeconds(seconds);
            return date;
        }

        const times = data.map(item => item.Time);
        
        const width = 800;
        const height = 500;

        const yearMax = d3.max(yearsDate);
              yearMax.setMonth(yearMax.getMonth()+12)//For display purpose
        const yearMin = d3.min(yearsDate);
              yearMin.setMonth(yearMin.getMonth()-12)//For display purpose
              
        //Create SVG container
        const svg = d3.select('.container')
                      .append('svg')
                      .attr('width', width + 60)
                      .attr('height', height + 60);

        //Add legend to y-axis only
        svg.append('text')
           .attr('x', -140)
           .attr('y', 60)
           .attr('transform','rotate(-90)')
           .text('Time in Minutes')
        
        //Scaling x settings
        const xScale = d3.scaleTime()
                         .domain([yearMin,yearMax])
                         .range([0,width]);

        const xAxis = d3.axisBottom().scale(xScale);

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

    })
    .catch(e => console.log(e))
