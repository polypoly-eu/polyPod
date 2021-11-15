import React, { useEffect, useRef } from "react";

import {
  PolyVerticalBarChart,
  PolyMirroredBarChart,
  PolyBubbleCluster,
} from "../../charts";

const charts = {
  "poly-vertical-bar-chart": PolyVerticalBarChart,
  "poly-mirrored-bar-chart": PolyMirroredBarChart,
  "poly-bubble-cluster": PolyBubbleCluster,
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
