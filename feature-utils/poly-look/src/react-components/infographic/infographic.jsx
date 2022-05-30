import React from "react";
import "./infographic.css";
import { InfographicLegend } from "./";

/** Renders an image and a numbered legend that contains descriptions
 *  for different elements in the image.
 * @param {Object} props
 * @param {string} [props.imageSrc] - src of the image we want to render
 * @param {Array[string]} [props.explanation] - a simple array with descriptions
 * @param {Array[Object]} [props.legend] - an array of objects that will render an
 * InfographicLegend component. Check storybook for an example that showcases different
 * combinations.
 * @returns {JSX.Element}
 */
const Infographic = ({ imageSrc, explanation, legend = {} }) => {
  return (
    <div className="poly-infographic">
      <div className="image-container">
        <InfographicLegend legend={legend} />
        <img src={imageSrc} />
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
