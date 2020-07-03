import { useState } from "react";
import React from "react";
import PolyCheckbox from "./PolyCheckbox";

const indices = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function compareMaps(map1, map2) {
    let testVal;
    if (map1.size !== map2.size) {
        return false;
    }
    for (const [key, val] of map1) {
        testVal = map2.get(key);
        // in cases of an undefined value, make sure the key
        // actually exists on the object so there are no false positives
        if (testVal !== val || (testVal === undefined && !map2.has(key))) {
            return false;
        }
    }
    return true;
}

export default function PolyCheckboxGroup(props: any = {}) {
    const {
        detoxindex = 0,
        options = [],
        label = (_item, _index) => _item,
        value = (_item, _index) => _item,
        checked = (_item, _index) => false,
        disabled = (_item, _index) => false,
        spacing = 16,
        onChecked = () => {},
    } = props;

    let newChecked = new Map(
        options.map((each, index) => [index, checked(each, index)]),
    );

    let newDisabled = new Map(
        options.map((each, index) => [index, disabled(each, index)]),
    );

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
        checkbox => {
            const newSelected = new Map(selectedCheckboxes);
            newSelected.set(checkbox.index, checkbox.checked);
            setSelectedCheckboxes(newSelected);
            onChecked(checkbox);
        },
        [onChecked, selectedCheckboxes],
    );

    return (
        <div>
            {options.map((item, index) => (
                <div key={index.toString()}>
                    <PolyCheckbox
                        index={index}
                        detoxindex={detoxindex}
                        indexExtractor={
                            options.length > indices.length
                                ? () => null
                                : _index => indices.charAt(_index)
                        }
                        label={label(item, index)}
                        value={value(item, index)}
                        item={item}
                        checked={!!selectedCheckboxes.get(index)}
                        disabled={!!disabledCheckboxes.get(index)}
                        grouped={true}
                        onChecked={onSelect}
                    />
                </div>
            ))}
        </div>
    );
}