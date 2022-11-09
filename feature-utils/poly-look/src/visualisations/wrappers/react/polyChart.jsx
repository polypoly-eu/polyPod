import React, { useEffect, useRef } from "react";

import {
  VerticalBarChart,
  MirroredBarChart,
  BubbleCluster,
  SankeyDiagram,
  HorizontalBarChart,
  TreeMap,
  TimeLineChart,
} from "../../charts";

const charts = {
  "vertical-bar-chart": VerticalBarChart,
  "horizontal-bar-chart": HorizontalBarChart,
  "mirrored-bar-chart": MirroredBarChart,
  "bubble-cluster": BubbleCluster,
  "sankey-diagram": SankeyDiagram,
  "tree-map": TreeMap,
  "time-line-chart": TimeLineChart,
};

/**
 * It renders a chart of the type specified in the props, and it renders it in the div with the class
 * name specified in the props
 * @callback PolyChart
 * @param {Object} props - The props for the selected chart
 * @param {string} props.type - The type of the chart (e. "vertical-bar-chart")
 * @returns {JSX.Element} JSX div with svg-chart attached
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
