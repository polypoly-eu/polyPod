import React from "react";
import { PolyChart } from "../../../poly-look";

/**
 * A n to m sankey diagram where groups are represented by selectable chips
 * @param {*} param0
 * @returns
 */
const EmbeddedSankey = ({ links }) => {
  return (
    <div className="embedded-sankey">
      <PolyChart
        type="sankey-diagram"
        links={links}
        className="full-size-svg"
      />
    </div>
  );
};

export default EmbeddedSankey;
