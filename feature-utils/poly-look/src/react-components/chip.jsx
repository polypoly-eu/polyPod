import React from "react";
import "./chip.css";

/**
 * Individual chip.
 * It returns a button with a "chip" or "chip selected" depending on the active prop, and
 * when clicked, it calls the handleClick function with the id prop as an argument
 * @component
 * @param {Object} props
 * @param {string} props.id - Text in chip's label, which is also acting as an if for the chip.
 * @param {string} props.translation - Translation for the text in chip's label.
 * @param {callback} props.handleClick - Chip's handleClick function (id of clicked chip).
 * @param {boolean} props.active - Indicates whether the chip is selected (active) or not.
 * @returns A React component
 */
const Chip = ({ id, translation, handleClick, active }) => {
  return (
    <button
      className={active ? "chip selected" : "chip"}
      onClick={handleClick ? () => handleClick(id) : () => {}}
    >
      {translation || id}
    </button>
  );
};

export default Chip;
