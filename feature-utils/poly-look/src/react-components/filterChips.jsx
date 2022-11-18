import React, { useState, useEffect } from "react";
import Chip from "./chip.jsx";

import "./filterChips.css";

const chipId = (e) => e.id || e.title || e;

const othersId = "othersChip";
const allId = "allChip";

/**
 * Callback for handling the click event on chip.
 *
 * @callback onChipClickCallback
 * @param {React.MouseEventHandler<HTMLDivElement>} clickEvent - chip onClick action.
 */

/**
 * Group of chips
 * It renders a list of chips, and when you click on a chip, it calls a callback function with the id
 * of the chip that was clicked
 * @component
 * @param {Object} props
 * @param {(Array.<string> | Array.<Object>)} props.chipsContent -  Content of the Chips
 * @param {Object} props.chipsContent.id - Id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} props.chipsContent.title - Alternative for id of the chip (if chipsContent is an array of strings they act as id)
 * @param {Object} props.chipsContent.translation - Translation of the chip (if chipsContent is an array of strings they act as translation)
 * @param {Array.<string>} [props.defaultActiveChips = []] - Chips that are active on load
 * @param {onChipClickCallback} props.onChipClick - Chips onClick function (id of clicked chip, all active chips ids)
 * @param {boolean} [props.exclusive = true] - Determines whether chips are active exclusively
 * @param {string} props.theme - Sets the theme in this component (preferably done in parent component)
 * @param {Object} props.allChip - Indicated whether an all chip exists (exclusive to the other chips, activates all)
 * @param {string} props.allChip.translation = "All" - Translation for chips text ("All")
 * @param {Object} props.othersChip - Indicated whether an others chip exists (groups multiple chips in "Others" chip)
 * @param {string} props.othersChip.translation = "Others" - Translation for chips text ("Others")
 * @param {string[]} props.othersChip.ids - Ids of the chips grouped by others
 * @param {boolean} props.othersChip.exclusive - Indicates whether the others chips is exclusive to the rest
 * @returns  A function that returns a `div` component with the content
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

  useEffect(() => {
    setActiveChips(defaultActiveChips);
  }, [JSON.stringify(defaultActiveChips)]);

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

export default FilterChips;
