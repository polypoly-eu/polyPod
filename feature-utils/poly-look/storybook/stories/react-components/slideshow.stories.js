import React from "react";
import { withDesign } from "storybook-addon-designs";
import { Slideshow } from "../../../src/react-components";

export default {
  title: "Visuals/Molecules/Slideshow",
  component: Slideshow,
  decorators: [withDesign],
};

const Template = (args) => <Slideshow {...args} />;

export const Default = Template.bind({});

Default.args = {
  images: [
    "https://s3-alpha-sig.figma.com/img/56a2/f9d8/22779d5792ae1755031b4d0169c896a6?Expires=1656892800&Signature=BOg4PLlO6KIf3GKgyquseoKYICncb6fj2voz8yH2c1IHlt-l5jD9z-n0LWmPSZoHLMgjxxx6TTfxFG-YCED2jgKCXw9eyaxRg~4Fm3PZnvAAluTFw~5X-fHgH3GkJNuENHGpC3BDmN5fVPDhUH3R44FiTzO8tv0HyHnMtSDU~8dZhBTRVcMrtj1BUKz~6bAkb6wG0oZBzRvdfFaBbCcNIAtt9nC3OjUMoGKYKqaID~UcJtXwpSwqu9PO0dsZXg36aG8~-pIJfga7zh9u84eppIaUafk3ohX6LORHP~x1uZ9BXzx-IGNthUIZ0T0WVOG93cN30pApdYDHMZtgyaZnRg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
    "https://s3-alpha-sig.figma.com/img/56a2/f9d8/22779d5792ae1755031b4d0169c896a6?Expires=1656892800&Signature=BOg4PLlO6KIf3GKgyquseoKYICncb6fj2voz8yH2c1IHlt-l5jD9z-n0LWmPSZoHLMgjxxx6TTfxFG-YCED2jgKCXw9eyaxRg~4Fm3PZnvAAluTFw~5X-fHgH3GkJNuENHGpC3BDmN5fVPDhUH3R44FiTzO8tv0HyHnMtSDU~8dZhBTRVcMrtj1BUKz~6bAkb6wG0oZBzRvdfFaBbCcNIAtt9nC3OjUMoGKYKqaID~UcJtXwpSwqu9PO0dsZXg36aG8~-pIJfga7zh9u84eppIaUafk3ohX6LORHP~x1uZ9BXzx-IGNthUIZ0T0WVOG93cN30pApdYDHMZtgyaZnRg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
    "https://s3-alpha-sig.figma.com/img/56a2/f9d8/22779d5792ae1755031b4d0169c896a6?Expires=1656892800&Signature=BOg4PLlO6KIf3GKgyquseoKYICncb6fj2voz8yH2c1IHlt-l5jD9z-n0LWmPSZoHLMgjxxx6TTfxFG-YCED2jgKCXw9eyaxRg~4Fm3PZnvAAluTFw~5X-fHgH3GkJNuENHGpC3BDmN5fVPDhUH3R44FiTzO8tv0HyHnMtSDU~8dZhBTRVcMrtj1BUKz~6bAkb6wG0oZBzRvdfFaBbCcNIAtt9nC3OjUMoGKYKqaID~UcJtXwpSwqu9PO0dsZXg36aG8~-pIJfga7zh9u84eppIaUafk3ohX6LORHP~x1uZ9BXzx-IGNthUIZ0T0WVOG93cN30pApdYDHMZtgyaZnRg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA",
  ],
};
Default.parameters = {
  design: {
    type: "figma",
    url: "https://www.figma.com/file/qSTY8cZ6gbSMx7kPc599fy/MAIN-pod-feature-preview?node-id=2%3A2273",
  },
};
