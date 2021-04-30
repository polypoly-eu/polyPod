import { useTranslation } from "react-i18next";
import React from "react";

export default function PolyButton({
    title = "generic.button.okay",
    inverted = false,
    childrenBefore = [],
    childrenAfter = [],
    onPress = () => {},
}) {
    const { t } = useTranslation();

    return (
        <button onClick={onPress} className={inverted ? "inverted" : null}>
            {childrenBefore}
            {t(title)}
            {childrenAfter}
        </button>
    );
}
