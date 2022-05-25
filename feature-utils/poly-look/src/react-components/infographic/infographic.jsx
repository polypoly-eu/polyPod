import React from "react";
import "./infographic.css";

/** Renders an image and a numbered legend that contains descriptions
 *  for different elements in the image.
 * @param {Object} props
 * @param {string} [props.imageSrc] - src of the image we want to render
 * @param {Array[string]} [props.legend] - a simple array with descriptions
 * @returns {JSX.Element}
 */
const Infographic = ({ imageSrc, legend }) => {
  return (
    <div className="poly-infographic">
      <div className="image-container">
        <img src={imageSrc} />
      </div>
      <div className="legend-container">
        {legend.map((entry, idx) => {
          return (
            <div
              className="entry"
              key={idx}
              data-testid="infographic-entry-test"
            >
              <div className="number">
                <span>{idx}</span>
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
