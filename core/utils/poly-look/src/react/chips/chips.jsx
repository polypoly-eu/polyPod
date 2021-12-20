import React from "react";

import "./chips.css";

const Chips = ({ chipsContent, activeChip, onChipClick, theme = "light" }) => {
  return (
    <div className={`poly-theme-${theme} chips-container`}>
      {chipsContent.map((e) => {
        const title = e.title || e.id || e;
        return (
          <button
            className={activeChip == title ? "chip selected" : "chip"}
            onClick={() => onChipClick(title)}
            key={title}
          >
            {e.translation || title}
          </button>
        );
      })}
    </div>
  );
};

export default Chips;
