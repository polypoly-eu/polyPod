import { html } from "lit-element";
import "../../../../feature-utils/poly-look/src/lit-components/inputs";
import { themeConfiguration } from "./themeConfiguration";

export default {
    title: "Visuals/Atoms/InputClear",
    component: "poly-input-clear",
    argTypes: {
        theme: { control: "text" },
        placeHolder: { control: "text" },
        onPolyInputChange: {
            action: "polyInputChange",
        },
    },
};

function Template({
    theme = "dark",
    placeHolder = "Test input",
    onPolyInputChange,
}) {
    return html`
        ${themeConfiguration()}
        ${theme === "light"
            ? html`<style>
                  body {
                      background-color: #0f1938;
                  }
              </style>`
            : ""}
        <poly-input-clear
            .theme=${theme}
            .placeHolder=${placeHolder}
            @poly-input=${onPolyInputChange}
        ></poly-input-clear>
    `;
}

export const Regular = Template.bind({});
export const InputDark = Template.bind({});
InputDark.args = {
    theme: "dark",
};

export const InputLight = Template.bind({});
InputLight.args = {
    theme: "light",
};
