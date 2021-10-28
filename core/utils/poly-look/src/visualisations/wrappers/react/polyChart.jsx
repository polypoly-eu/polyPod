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
