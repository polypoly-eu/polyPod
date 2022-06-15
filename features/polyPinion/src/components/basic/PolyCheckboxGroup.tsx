import { useState } from "react";
import React from "react";
import PolyCheckbox from "./PolyCheckbox";
import { compareMaps } from "../../util/compare-maps";

const indices = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PolyCheckboxGroup(props: any = {}) {
    const {
        options = [],
        label = (_item, _index) => _item,
        value = (_item, _index) => _item,
        checked = (_item, _index) => false,
        disabled = (_item, _index) => false,
        onChecked = () => {},
    } = props;

    const newChecked = new Map(options.map((each, index) => [index, checked(each, index)]));

    const newDisabled = new Map(options.map((each, index) => [index, disabled(each, index)]));

    const [selectedCheckboxes, setSelectedCheckboxes] = useState(newChecked);
    const [disabledCheckboxes, setDisabledCheckboxes] = useState(newDisabled);

    /*
      Unfortunately React does not understand when checked or disabled map was changed,
      so we have to do it manually here
     */
    if (!compareMaps(newChecked, selectedCheckboxes)) {
        setSelectedCheckboxes(newChecked);
    }

    if (!compareMaps(newDisabled, disabledCheckboxes)) {
        setDisabledCheckboxes(newChecked);
    }

    const onSelect = React.useCallback(
        (checkbox) => {
            const newSelected = new Map(selectedCheckboxes);
            newSelected.set(checkbox.index, checkbox.checked);
            setSelectedCheckboxes(newSelected);
            onChecked(checkbox);
        },
        [onChecked, selectedCheckboxes]
    );

    return (
        <div className="checkbox-group">
            {options.map((item, index) => (
                <PolyCheckbox
                    index={index}
                    key={index.toString()}
                    indexExtractor={
                        options.length > indices.length
                            ? () => null
                            : (_index) => indices.charAt(_index)
                    }
                    label={label(item, index)}
                    value={value(item, index)}
                    item={item}
                    checked={!!selectedCheckboxes.get(index)}
                    disabled={!!disabledCheckboxes.get(index)}
                    grouped={true}
                    onChecked={onSelect}
                />
            ))}
        </div>
    );
}
