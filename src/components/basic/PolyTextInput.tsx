import { useTranslation } from "react-i18next";
import { useState } from "react";
import React from "react";

function TextInput({ onChangeText, value, placeholder, maxLength, multiline, numberOfLines }) {
    if (multiline)
        return (
            <textarea
                onChange={(event) => onChangeText(event.target.value)}
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                rows={numberOfLines}
            />
        );

    return (
        <input
            onChange={(event) => onChangeText(event.target.value)}
            type="text"
            value={value}
            placeholder={placeholder}
            maxLength={maxLength}
        />
    );
}

export default function PolyTextInput({
    initialText = "",
    onChangeText = (_text) => {},
    maxLength = undefined,
    multiline = undefined,
    numberOfLines = undefined,
    oneWord = false,
}) {
    const { t } = useTranslation();
    const [value, setValue] = useState(initialText || "");
    const [errMessage, setErrMessage] = useState("");

    const inputValid = (text) => {
        return !oneWord || text.indexOf(" ") < 0;
    };

    let validText;

    return (
        <>
            <TextInput
                onChangeText={(text) => {
                    if (inputValid(text)) {
                        setErrMessage("");
                        setValue(text);
                        onChangeText(text);
                    } else {
                        validText = text.replace(/\s/g, "");
                        setErrMessage(t("validation.only-one-word"));
                        setValue(validText);
                        onChangeText(validText);
                    }
                }}
                value={value}
                placeholder={t("general.text-input-shadow-text")}
                maxLength={maxLength}
                multiline={multiline}
                numberOfLines={numberOfLines}
            />
            {errMessage}
        </>
    );
}
