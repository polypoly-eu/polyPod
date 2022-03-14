import React from "react";
import AnswerChoicePreview from "./AnswerChoicePreview";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AnswerChoiceGroupPreview(props: any = {}) {
    const { choices = [], labelExtractor = (item) => item } = props;

    return (
        <div>
            <ol>
                {choices.map((item) => (
                    <li>
                        <AnswerChoicePreview answer={labelExtractor(item)} />
                    </li>
                ))}
            </ol>
        </div>
    );
}
