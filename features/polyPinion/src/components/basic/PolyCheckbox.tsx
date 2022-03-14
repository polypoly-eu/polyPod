import React, { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function PolyCheckbox(props: any = {}) {
    const {
        item = undefined,
        index = 1,
        indexExtractor = (_index) => _index,

        label = "Checkbox",
        onChecked = (_checkbox) => {},
        checked = false,
        disabled = false,
        grouped = false,
    } = props;

    const [isChecked, setIsChecked] = useState(checked);

    const amChecked = React.useCallback(
        () => (grouped ? checked : isChecked),
        [checked, grouped, isChecked]
    );

    const onPress = React.useCallback(() => {
        if (!disabled) {
            if (!grouped) {
                setIsChecked(!amChecked());
            }
            onChecked({
                checked: !amChecked(),
                index: index,
                label: label,
                props: props,
                item: item,
            });
        }
    }, [amChecked, disabled, grouped, index, item, label, onChecked, props]);

    return (
        <div className="choice">
            <input
                id={`choice-${index}`}
                className="choice-input"
                type="checkbox"
                checked={amChecked()}
                onChange={onPress}
            />
            <label className="choice-label" htmlFor={`choice-${index}`}>
                <div className="choice-index">{indexExtractor(index)}</div>
                <div className="choice-text">{label}</div>
            </label>
        </div>
    );
}
