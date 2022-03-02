import React from "react";
import { withDesign } from "storybook-addon-designs";
import {
    Tabs,
    Tab,
} from "../../../../feature-utils/poly-look/src/react-components/tabs.jsx";

import "../../../../feature-utils/poly-look/src/css/index.js";

// This is just a quick and dirty example to check that the configuration works.
// Once we start adding other stories we should either remove this
// or refactor it into a proper Tabs story.

export default {
    title: "Tabs example",
    component: Tabs,
    decorators: [withDesign],
};

const Template = (args) => <Tabs {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: [
        <Tab id="0" key="0" label="Tab0"></Tab>,
        <Tab id="1" key="1" label="Tab1"></Tab>,
        <Tab id="2" key="2" label="Tab2"></Tab>,
    ],
};
Default.parameters = {
    design: {
        type: "figma",
        url: "https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File",
    },
};
