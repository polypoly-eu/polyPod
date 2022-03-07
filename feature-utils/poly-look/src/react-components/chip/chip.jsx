import React from "react";
import "./chip.css";

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
