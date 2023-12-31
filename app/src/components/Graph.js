import React, {Fragment, useEffect, useState} from "react";
import { line, scaleLinear, scaleTime } from "d3";
import * as d3 from "d3";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    root: {
    },

    xaxis: {
        color: 'black',
    },

    yaxis: {
        color: 'black',
    },

    text: {
      fill: 'gainsboro',
      color: 'gainsboro',
      fontSize: '16px',
    },
    // Set the border for the whole graph
    graph: {
        height: '30vh',
      overflow: 'visible',
    },

    // Set the colour of the line (and remove any default "fill" our line may have)
    graph_data: {
        fill: 'none',
        stroke: 'black'
    }
}));

const Graph = ({ data, site }) => {
    const classes = useStyles();
    const [activeIndex, setActiveIndex] = React.useState(null)

    const layout = {
        width: 500,
        height: 200
    };
    const yMinValue = d3.min(data, (d) => d.y);
    const yMaxValue = d3.max(data, (d) => d.y);


    const graphDetails = {
        xScale: scaleTime().domain(d3.extent(data, (d) => d.x)).range([0, layout.width]),
        yScale: scaleLinear().domain([0, yMaxValue + 2]).range([layout.height, 0]),
        lineGenerator: line()
    };
    const [lineData, setLineData] = useState(() =>
        graphDetails.lineGenerator(data)
    );
    useEffect(() => {
        if (data) {
            // Calculate the data line
            const newLine = graphDetails.lineGenerator(data);
            setLineData(newLine);
        }
    }, [data]);


    graphDetails.lineGenerator.x(d => graphDetails.xScale(d["x"]));
    graphDetails.lineGenerator.y(d => graphDetails.yScale(d["y"]));

    const getXAxis = (ref) => {
        const xAxis = d3.axisBottom(graphDetails.xScale);
        d3.select(ref).call(xAxis.tickFormat(d3.timeFormat("%H:%M")));
    };

    const getYAxis = (ref) => {
        const yAxis = d3.axisLeft(graphDetails.yScale);
        d3.select(ref).call(yAxis);
    };


    // Mouse handlers
    const handleMouseMove = (e) => {
        const bisect = d3.bisector((d) => d.x).left,
                x0 = graphDetails.xScale.invert(d3.pointer(e, this)[0]),
                index = bisect(data, x0, 1);
        setActiveIndex(index);
    };

    const handleMouseLeave = () => {
        setActiveIndex(null);
    };

    return (
        <svg
            className={classes.graph}
            width={"100%"}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
        >
            // Data
            <path className={classes.graph_data} d={lineData} />


            // Site label (upper right)
            <text
                className={classes.text}
                transform={`translate(${layout.width - 100}, 20)`}
            >
                {site}
            </text>

            // y-axis label
          <text
                className={classes.text}
                transform={`rotate(-90)`}
              x={0 - 3 * layout.height / 4} y={0} dy="1em"
          >
              {"Concentration (ng/ml)"}
          </text>

            // Axes
             <g className={classes.yaxis} ref={getYAxis} />
             <g
                  className={classes.xaxis}
                  ref={getXAxis}
                  transform={`translate(0,${layout.height})`}
              />

    // display current time (new Date()) as dot on x-axis if current time inf to max of x-axis
            <circle
                cx={graphDetails.xScale(new Date())}
                cy={layout.height}
                r={new Date() < graphDetails.xScale.domain()[1] ? 2 : 0}
                fill='#666'
                strokeWidth={new Date() < graphDetails.xScale.domain()[1] ? 2 : 0}
                stroke="#fff"
                style={{ transition: "ease-out .1s" }}
            />

            // Hovering
            {data.map((item, index) => {
              return (
                  <g key={index}>
                  // hovering text 
                      <text
                          fill="#666"
                          x={graphDetails.xScale(item.x)}
                          y={graphDetails.yScale(item.y) - 20}
                          textAnchor="middle"
                      >
                          {index === activeIndex ? item.y.toFixed(2) : ""}
                      </text>
                     // hovering circle
                      <circle
                          cx={graphDetails.xScale(item.x)}
                          cy={graphDetails.yScale(item.y)}
                          r={index === activeIndex ? 2 : 0}
                          fill='black'
                          strokeWidth={index === activeIndex ? 2 : 0}
                          stroke="#fff"
                          style={{ transition: "ease-out .1s" }}
                      />
                    // line to indicate the point on x-axis
                        <line
                            x1={graphDetails.xScale(item.x)}
                            y1={graphDetails.yScale(item.y)}
                            x2={graphDetails.xScale(item.x)}
                            y2={layout.height}
                            stroke="#666"
                            strokeWidth={index === activeIndex ? 0.2 : 0}
                            style={{ transition: "ease-out .1s" }}
                        /> 
                    // display the time value on hovering
                        <text
                            fill="#666"
                            // half of text size of dosis
                            fontSize={8}
                            x={graphDetails.xScale(item.x)}
                            y={graphDetails.yScale(item.y) - 10}
                            textAnchor="left"
                        >
                            {index === activeIndex
                                ? d3.timeFormat("[%H:%M]")(item.x)  // format the time
                                : ""}
                        </text>                    
                  </g>
              );
          })}
        </svg>
    );
};

export default Graph;