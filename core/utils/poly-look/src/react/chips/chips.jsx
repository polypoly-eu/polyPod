import React from "react";

import "./chips.css";

const Chips = ({ chipsContent, activeChip, onChipClick, theme }) => {
  return (
    <div className={`${theme ? `poly-theme-${theme}` : ""} poly-chips`}>
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
