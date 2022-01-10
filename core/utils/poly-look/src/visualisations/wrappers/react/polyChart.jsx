import React, { useEffect, useRef } from "react";

import {
  VerticalBarChart,
  MirroredBarChart,
  BubbleCluster,
  SankeyDiagram,
} from "../../charts";

const charts = {
  "vertical-bar-chart": VerticalBarChart,
  "mirrored-bar-chart": MirroredBarChart,
  "bubble-cluster": BubbleCluster,
  "sankey-diagram": SankeyDiagram,
};

/**
 *
 * @param {Object} props - The props for the selected chart
 * @param {string} props.type - The type of the chart (e. "vertical-bar-chart")
 * @returns jsx-div with svg-chart attached
 */
export const PolyChart = (props) => {
  const chartRef = useRef();

  useEffect(() => {
    const chartProps = {
      selector: chartRef.current,
      ...props,
    };
    const chart = new charts[props.type](chartProps);
    chart.render();
  }, [props]);

  return <div ref={chartRef} className={props.type}></div>;
};
