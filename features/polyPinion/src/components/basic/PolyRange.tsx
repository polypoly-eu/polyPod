import { compareMaps } from "../../util/compare-maps";
import { useState } from "react";
import React from "react";
import PolyRangeButton from "./PolyRangeButton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PolyRange(props: any = {}) {
    const {
        options = [],
        limits = [],
        label = (_item, _index) => _item,
        checked,
        disabled = (_item, _index) => false,
        onChecked = () => {},
    } = props;

    const newChecked = checked
        ? new Map(options.map((each, index) => [index, checked(each, index)]))
        : new Map();

    const newDisabled = new Map(options.map((each, index) => [index, disabled(each, index)]));

    const [selectedCheckboxes, setSelectedCheckboxes] = useState(newChecked);
    const [disabledCheckboxes, setDisabledCheckboxes] = useState(newDisabled);

    /*
      Unfortunately React does not understand when checked or disabled map was changed,
      so we have to do it manually here
     */
    if (checked && !compareMaps(newChecked, selectedCheckboxes)) {
        setSelectedCheckboxes(newChecked);
    }

    if (!compareMaps(newDisabled, disabledCheckboxes)) {
        setDisabledCheckboxes(newChecked);
    }

    const onSelect = (checkbox) => {
        const newSelected = new Map(selectedCheckboxes);
        newSelected.set(checkbox.index, checkbox.checked);
        setSelectedCheckboxes(newSelected);
        onChecked(checkbox);
    };

    return (
        <div>
            {options.map((item, index) => (
                <PolyRangeButton
                    label={label(item, index)}
                    index={index}
                    key={index.toString()}
                    item={item}
                    checked={!!selectedCheckboxes.get(index)}
                    disabled={!!disabledCheckboxes.get(index)}
                    onChecked={onSelect}
                />
            ))}
            {limits[0]}
            {limits[1]}
        </div>
    );
}
