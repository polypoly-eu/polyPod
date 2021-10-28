import React, { useEffect, useRef } from "react";

import {
  VerticalBarChart,
  MirroredBarChart,
  BubbleCluster,
} from "../../charts";

const charts = {
  "vertical-bar-chart": VerticalBarChart,
  "mirrored-bar-chart": MirroredBarChart,
  "bubble-cluster": BubbleCluster,
};

/**
 *
 * @param {Object} props - The props for the selected chart
 * @param {string} props.type - The type of the chart (e. "vertical-bar-chart")
 * @returns jsx-div with svg-chart attached
 */
export const PolyChart = (props) => {
  const chartType = props.type;
  const chartRef = useRef();
  const chartProps = { ...props, selector: () => chartRef.current };
  const chart = new charts[chartType](chartProps);

  useEffect(() => {
    chart.render();
  }, [props]);

  return <div ref={chartRef} className={chartType}></div>;
};
