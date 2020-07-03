import {useTranslation} from "react-i18next";
import React from "react";

export default function PolyButton({
                                       title = 'generic.button.okay',
                                       childrenBefore = [],
                                       childrenAfter = [],
                                       onPress = () => {},
                                   }) {
    const {t} = useTranslation();

    return (
        <button onClick={onPress}>
            {childrenBefore}
            {t(title)}
            {childrenAfter}
        </button>
    );
}