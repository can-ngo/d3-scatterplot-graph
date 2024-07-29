
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
        const times = data.map(item => timeToDate(item.Time));
             
        const width = 800;
        const height = 500;

        const yearMax = d3.max(yearsDate);
              yearMax.setMonth(yearMax.getMonth()+12)//For display purpose
        const yearMin = d3.min(yearsDate);
              yearMin.setMonth(yearMin.getMonth()-12)//For display purpose
        const timeMax = d3.max(times);
        const timeMin = d3.min(times);

        //Create SVG container
        const svg = d3.select('.container')
                      .append('svg')
                      .attr('width', width + 60)
                      .attr('height', height + 60);

        //Add legend to y-axis only
        svg.append('text')
           .attr('x', -120)
           .attr('y', 20)
           .attr('transform','rotate(-90)')
           .text('Time in Minutes')
        
        //Scaling settings
        const xScale = d3.scaleTime()
                         .domain([yearMin,yearMax])
                         .range([0,width]);

        const xAxis = d3.axisBottom().scale(xScale);
        //Add x-axis
        svg.append('g')
           .call(xAxis)
           .attr('id','x-axis')
           .attr('transform','translate(25,520)')


    })
    .catch(e => console.log(e))
