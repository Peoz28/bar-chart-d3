document.addEventListener('DOMContentLoaded', function() {
    const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    
    d3.json(url).then(function(data) {
        const margin = {top: 50, right: 50, bottom: 50, left: 50};
        const width = 1000 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const x = d3.scaleTime()
            .domain(d3.extent(data.data, d => new Date(d[0])))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data.data, d => d[1])])
            .range([height, 0]);

        // Create axes
        const xAxis = d3.axisBottom(x)
            .ticks(10);

        const yAxis = d3.axisLeft(y)
            .ticks(10);

        // Add x-axis
        svg.append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(xAxis);

        // Add y-axis
        svg.append('g')
            .attr('id', 'y-axis')
            .call(yAxis);

        // Add bars
        svg.selectAll('.bar')
            .data(data.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('data-date', d => d[0])
            .attr('data-gdp', d => d[1])
            .attr('x', d => x(new Date(d[0])))
            .attr('y', d => y(d[1]))
            .attr('width', width / data.data.length - 1)
            .attr('height', d => height - y(d[1]))
            .on('mouseover', function(event, d) {
                const tooltip = d3.select('#tooltip');
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`Date: ${d[0]}<br/>GDP: $${d[1].toLocaleString()} Billion`)
                    .attr('data-date', d[0])
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select('#tooltip').transition()
                    .duration(500)
                    .style('opacity', 0);
            });

        // Add axis labels
        svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Gross Domestic Product (Billions of Dollars)');

        svg.append('text')
            .attr('class', 'axis-label')
            .attr('transform', `translate(${width/2}, ${height + margin.bottom})`)
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text('Year');
    });
}); 