import React, { useEffect } from "react";
import * as d3 from "d3";
import InfographicLegend from "./infographicLegend.jsx";
import "./infographic.css";

/** Renders an image and a numbered legend that contains descriptions
 *  for different elements in the image.
 * @param {Object} props
 * @param {Object} [props.image] - Object containing the svg we want to use and translations
 * @param {Object} [props.image.svg] - the svg that we want to render
 * @param {Object} [props.image.texts] - an object where the key corresponds to a
 * <text ../> id found in the svg while the value is a string that will replace the text.
 * @param {Array[string]} [props.explanation] - a simple array with descriptions
 * @param {Array[Object]} [props.legend] - an array of objects that will render an
 * InfographicLegend component. Check storybook for an example that showcases different
 * combinations.
 * @returns {JSX.Element}
 */
const Infographic = ({ image, explanation, legend = {} }) => {
  function scaleFactor(viewBox, svg) {
    return Math.min(svg.width / viewBox.width, svg.height / viewBox.height);
  }
  useEffect(() => {
    const container = d3.select("svg");

    Object.keys(image.texts).forEach((key) => {
      const textField = container.select(`#${key}`);

      if (!textField.node()) return;
      const box = textField.node().getBBox();
      textField.remove();
      const svg = container.node();
      const viewbox = svg.viewBox.baseVal;
      const foreignObject = container
        .append("foreignObject")
        .attr("x", box.x)
        .attr("width", box.width);
      const div = foreignObject
        .append("xhtml:div")
        .html(image.texts[key])
        .attr("class", "svg-field");
      const divHeight =
        div.node().getBoundingClientRect().height /
        scaleFactor(viewbox, svg.getBoundingClientRect());
      foreignObject
        .attr("y", box.y + box.height / 2 - divHeight / 2)
        .attr("height", divHeight);
    });
  });

  return (
    <div className="poly-infographic">
      <div className="image-container">
        <InfographicLegend legend={legend} />
        <div
          className="infographic-svg"
          dangerouslySetInnerHTML={{ __html: image.svg }}
        ></div>
      </div>
      <div className="explanation-container">
        {explanation.map((entry, index) => {
          return (
            <div
              className="entry"
              key={index}
              data-testid="infographic-entry-test"
            >
              <div className="number">
                <span>{index + 1}</span>
              </div>
              <div className="text">{entry}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Infographic;
