import React from "react";
import "./chip.css";

const Chip = ({ id, translation, handleChipClick, isChipActive }) => {
  return (
    <button
      className={isChipActive(id) ? "chip selected" : "chip"}
      onClick={() => handleChipClick(id)}
      key={id}
    >
      {translation || id}
    </button>
  );
};

export default Chip;
