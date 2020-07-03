import React from "react";
import PolyIconButton from "./PolyIconButton";

export default function PolyRangeButton({
                                            label = '1',
                                            index = 1,
                                            item,
                                            onChecked = range => {},
                                            disabled = false,
                                            checked = false,
                                        }) {
    return (
        <PolyIconButton
            icon={<strong>{label}</strong>}
            disabled={disabled}
            onPress={() => {
                onChecked({
                    index: index,
                    item,
                    checked: !checked,
                });
            }}
        />
    );
}