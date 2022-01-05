import React, { useState } from "react";

import "./chips.css";

const chipsId = (e) => e.id || e.title || e;

const othersId = "others";
const allId = "all";

const Chips = ({
  chipsContent,
  defaultActiveChips,
  onChipClick,
  exclusive = true,
  theme,
  all,
  others,
}) => {
  const chipsContentIds = chipsContent.map((e) => chipsId(e));

  let extendedChipsContent = [...chipsContent].filter((e) =>
    others ? others.ids.indexOf(chipsId(e)) == -1 : e
  );
  if (others) {
    extendedChipsContent.push({
      id: othersId,
      translation: others.translation || "Others",
    });
  }
  if (all)
    extendedChipsContent.push({
      id: allId,
      translation: all.translation || "All",
    });

  const [activeChips, setActiveChips] = useState(
    all && !defaultActiveChips
      ? chipsContentIds
      : defaultActiveChips.filter((e) =>
          others ? others.ids.indexOf(chipsId(e)) == -1 : e
        )
  );

  const isChipActive = (id) => activeChips.indexOf(id) !== -1;

  const replaceOthers = (chipsIds) =>
    chipsIds.indexOf(othersId) !== -1
      ? [...chipsIds.filter((e) => e !== othersId), ...others.ids]
      : chipsIds;

  const toggleAll = (id) => {
    setActiveChips([allId]);
    onChipClick(id, chipsContentIds);
  };

  const toggleOthers = (id) => {
    if (exclusive || others.exclusive) {
      setActiveChips(others.ids);
      onChipClick(id, others.ids);
      return;
    }
    let newActiveChips;
    if (activeChips.indexOf(othersId) == -1) {
      newActiveChips = [...activeChips, othersId];
    } else {
      if (activeChips.length == 1) return;
      newActiveChips = activeChips.filter((e) => e != othersId);
    }
    setActiveChips(newActiveChips);
    onChipClick(othersId, replaceOthers(newActiveChips));
  };

  const toggleChip = (id) => {
    let newActiveChips = activeChips;
    if (isChipActive(id)) {
      if (activeChips.length > 1)
        newActiveChips = activeChips.filter((e) => e !== id);
    } else
      newActiveChips =
        exclusive || (activeChips.length == 1 && activeChips[0] == "all")
          ? [id]
          : [...activeChips, id];
    setActiveChips(newActiveChips);
    onChipClick(id, replaceOthers(newActiveChips));
  };

  const handleChipClick = (id) => {
    if (id == allId) {
      toggleAll(id);
      return;
    }
    if (id == othersId) {
      toggleOthers(id);
      return;
    }
    toggleChip(id);
  };

  return (
    <div className={`${theme ? `poly-theme-${theme}` : ""} poly-chips`}>
      {extendedChipsContent.map((e) => {
        const id = chipsId(e);
        return (
          <button
            className={isChipActive(id) ? "chip selected" : "chip"}
            onClick={() => handleChipClick(id)}
            key={id}
          >
            {e.translation || id}
          </button>
        );
      })}
    </div>
  );
};

export default Chips;
