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
 * Renders a chart of the type specified in the props.
 *
 * @function
 * @param {Object} props - The props for the chart.
 * @param {string} props.type - The type of the chart,
 * e.g. `vertical-bar-chart`.
  * @returns {JSX.Element} JSX element that renders the specified chart.
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
