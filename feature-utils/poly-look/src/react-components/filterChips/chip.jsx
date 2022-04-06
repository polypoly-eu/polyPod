import React from "react";
import "./chip.css";

/**
 * Individual chip
 * @param {string} [id] - Text in chip's label, which is also acting as an if for the chip.
 * @param {string} [translation] - Translation for the text in chip's label.
 * @param {callback} [handleClick] - Chip's handleClick function (id of clicked chip).
 * @param {boolean} [active] - Indicates whether the chip is selected (active) or not.
 */

const Chip = ({ id, translation, handleClick, active }) => {
  return (
    <button
      className={active ? "chip selected" : "chip"}
      onClick={() => (handleClick ? handleClick(id) : {})}
    >
      {translation || id}
    </button>
  );
};

export default Chip;
