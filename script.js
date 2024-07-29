
const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

fetch(url)
    .then(res => res.json())
    .then(data => {

        const years = data.map(item => item.Year)
                              .sort((a,b)=>a-b);
        
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
        const height = 400;

        const yearMax = d3.max(years);
        const yearMin = d3.min(years);
        const timeMax = d3.max(times);
        const timeMin = d3.min(times);

        //Create SVG container
        const svg = d3.select('.container')
                      .append('svg')
                      .attr('width', width)
                      .attr('height', height);

        //Add legend to y-axis only
        svg.append('text')
          .attr('x', 200)
          .attr('y', 200)
          .text('Time in Minutes')
        

    })
    .catch(e => console.log(e))
