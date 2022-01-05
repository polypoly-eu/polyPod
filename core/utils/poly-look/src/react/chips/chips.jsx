import React, { useState } from "react";

import "./chips.css";

const chipsId = (e) => e.id || e.title || e;

const othersId = "others";
const allId = "all";

/**
 *
 * Chips group
 * @param {string[] || Object[]} chipsContent -  Content of the Chips
 * @param {Object} [chipsContent.id] - Id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} [chipsContent.title] - Alternative for id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} [chipsContent.translation] - Translation of the chip (if chipsContent is an array of strings they act as translation)
 * @param {string[]} defaultActiveChips - Chips that are active on load
 * @param {callback} onChipClick - Chips onClick function (id of clicked chip, all active chips ids)
 * @param {boolean = true} [exclusive] - Determines whether chips are active exclusively
 * @param {string} [theme] - Sets the theme in this component (preferably done in parent component)
 * @param {Object} [all] - Indicated whether an all chip exists (exclusive to the other chips, activates all)
 * @param {string = "All"} [all.translation] - Translation for chips text ("All")
 * @param {Object} [others] - Indicated whether an others chip exists (groups multiple chips in "Others" chip)
 * @param {string} [others.translation] - Translation for chips text ("Others")
 * @param {string[]} [others.ids] - Ids of the chips grouped by others
 * @param {boolean} [others.exclusive] - Indicates whether the others chips is exclusive to the rest
 * @returns
 */
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
