import React from "react";

export default function PolyIconButton({
                                           icon = <div />,
                                           onPress,
                                           disabled = false
                                       }) {
    return (
        <button
            disabled={disabled}
            onClick={onPress} >
            {icon}
        </button>
    );
}