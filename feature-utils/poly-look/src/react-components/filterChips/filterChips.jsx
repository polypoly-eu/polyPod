import React, { useState } from "react";
import * as propTypes from "prop-types";
console.log("propes", propTypes);
import Chip from "../chip/chip.jsx";

import "./filterChips.css";

const chipId = (e) => e.id || e.title || e;

const othersId = "othersChip";
const allId = "allChip";

/**
 *
 * Group of chips
 * @param { (string[] | Object[]) } chipsContent -  Content of the Chips
 * @param {Object} [chipsContent.id] - Id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} [chipsContent.title] - Alternative for id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} [chipsContent.translation] - Translation of the chip (if chipsContent is an array of strings they act as translation)
 * @param {string[]} [defaultActiveChips = []] - Chips that are active on load
 * @param {callback} onChipClick - Chips onClick function (id of clicked chip, all active chips ids)
 * @param {boolean} [exclusive = true] - Determines whether chips are active exclusively
 * @param {string} [theme] - Sets the theme in this component (preferably done in parent component)
 * @param {Object} [allChip] - Indicated whether an all chip exists (exclusive to the other chips, activates all)
 * @param {string} [allChip.translation = "All"] - Translation for chips text ("All")
 * @param {Object} [othersChip] - Indicated whether an others chip exists (groups multiple chips in "Others" chip)
 * @param {string} [othersChip.translation = "Others"] - Translation for chips text ("Others")
 * @param {string[]} [othersChip.ids] - Ids of the chips grouped by others
 * @param {boolean} [othersChip.exclusive] - Indicates whether the others chips is exclusive to the rest
 * @returns A `div` with the content
 */
const FilterChips = ({
  chipsContent,
  defaultActiveChips = [],
  onChipClick,
  exclusive = true,
  theme,
  allChip,
  othersChip,
}) => {
  const chipsContentIds = chipsContent.map((e) => chipId(e));

  let extendedChipsContent = [...chipsContent].filter((e) =>
    othersChip ? othersChip.ids.indexOf(chipId(e)) == -1 : e
  );
  if (othersChip) {
    extendedChipsContent.push({
      id: othersId,
      translation: othersChip.translation || "Others",
    });
  }
  if (allChip)
    extendedChipsContent.push({
      id: allId,
      translation: allChip.translation || "All",
    });

  const [activeChips, setActiveChips] = useState(
    allChip && !defaultActiveChips
      ? chipsContentIds
      : defaultActiveChips.filter((e) =>
          othersChip ? othersChip.ids.indexOf(chipId(e)) == -1 : e
        )
  );

  const isChipActive = (id) => activeChips.indexOf(id) !== -1;

  const replaceOthers = (chipsIds) =>
    chipsIds.indexOf(othersId) !== -1
      ? [...chipsIds.filter((e) => e !== othersId), ...othersChip.ids]
      : chipsIds;

  const toggleAll = (id) => {
    setActiveChips([allId]);
    onChipClick(id, chipsContentIds);
  };

  const toggleOthers = (id) => {
    if (exclusive || othersChip.exclusive) {
      setActiveChips(othersChip.ids);
      onChipClick(id, othersChip.ids);
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
        exclusive || (activeChips.length == 1 && activeChips[0] == allId)
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
        const id = chipId(e);
        return (
          <div className="chip-container" key={id}>
            <Chip
              id={id}
              translation={e.translation}
              handleClick={handleChipClick}
              active={isChipActive(id)}
            />
          </div>
        );
      })}
    </div>
  );
};

FilterChips.propTypes = {
  chipsContent: propTypes.oneOfType([propTypes.string, propTypes.object])
    .isRequired,
  defaultActiveChips: propTypes.array,
  onChipClick: propTypes.func,
  exclusive: propTypes.bool,
  theme: propTypes.string,
  allChip: propTypes.object,
  othersChip: propTypes.object,
};

export default FilterChips;
