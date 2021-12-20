import React from "react";

import "./chips.css";

const Chips = ({ chipsContent, activeChip, onChipClick, theme = "light" }) => {
  return (
    <div className={`poly-theme-${theme} chips-container`}>
      {chipsContent.map(({ id, translation }) => {
        return (
          <button
            className={activeChip == id ? "chip selected" : "chip"}
            onClick={() => onChipClick(id)}
            key={id}
          >
            {translation || id}
          </button>
        );
      })}
    </div>
  );
};

export default Chips;
