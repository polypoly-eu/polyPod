import { html } from "lit-element";
import "../src/tabs";
import { themeConfiguration } from "./themeConfiguration";

export default {
  title: "Visuals/Molecule/Tabs",
  component: "poly-tabs",
  argTypes: {
    theme: { control: "text" },
  },
};

function Template({ theme = "dark" }) {
  return html`
    ${themeConfiguration()}
    ${theme === "light"
      ? html`<style>
          body {
            background-color: #0f1938;
          }
          * {
            color: #f7fafc;
          }
        </style>`
      : ""}
    <poly-tabs .theme=${theme}>
      <poly-tab label="Tab 01" tabId="01" active>
        <poly-tab-content>
          <h1>Tab 01</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet
            pellentesque diam, id rhoncus tortor. Sed vestibulum porta ante,
            eget consequat ipsum. Morbi sodales tristique massa, nec gravida
            tortor lacinia et. Vestibulum felis diam, hendrerit quis ipsum non,
            scelerisque viverra arcu. In ut elit in enim consectetur fermentum.
            Ut velit neque, eleifend sed eros porttitor, maximus pellentesque
            lectus. Etiam consequat risus et ullamcorper scelerisque. Sed
            dignissim nibh eu tortor consectetur, a pharetra quam efficitur.
            Nulla eleifend tortor vel justo pulvinar, nec laoreet lorem cursus.
            Nulla neque urna, malesuada in ligula nec, suscipit dignissim nunc.
            Sed tincidunt ornare tortor et dictum. Nam et posuere dui. Aliquam
            interdum libero sed eros sodales aliquam. Vestibulum vitae auctor
            tellus. Morbi semper sit amet tellus in accumsan. Sed mollis
            accumsan erat, ut ultrices est porta sit amet. Donec vitae pulvinar
            nisl, ut scelerisque orci. Mauris lacinia dignissim interdum. Fusce
            sed odio blandit, luctus purus sed, sagittis enim. Suspendisse id
            dapibus lorem. Nam bibendum malesuada justo, eu dictum arcu ornare
            id. Vivamus maximus elit id semper bibendum. Mauris sit amet mauris
            nulla. Mauris vulputate viverra risus, id pulvinar metus. Aenean
            eget fermentum odio. Aenean tempor, eros vel vehicula dapibus, ipsum
            eros rhoncus risus, a convallis nisi velit vitae ligula. Morbi
            aliquam eros augue, vel sollicitudin lacus porta quis.
          </p>
        </poly-tab-content>
      </poly-tab>
      <poly-tab label="Tab 02" tabId="02">
        <poly-tab-content>
          <h1>Tab 02</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet
            pellentesque diam, id rhoncus tortor. Sed vestibulum porta ante,
            eget consequat ipsum. Morbi sodales tristique massa, nec gravida
            tortor lacinia et. Vestibulum felis diam, hendrerit quis ipsum non,
            scelerisque viverra arcu. In ut elit in enim consectetur fermentum.
            Ut velit neque, eleifend sed eros porttitor, maximus pellentesque
            lectus. Etiam consequat risus et ullamcorper scelerisque. Sed
            dignissim nibh eu tortor consectetur, a pharetra quam efficitur.
            Nulla eleifend tortor vel justo pulvinar, nec laoreet lorem cursus.
            Nulla neque urna, malesuada in ligula nec, suscipit dignissim nunc.
            Sed tincidunt ornare tortor et dictum. Nam et posuere dui. Aliquam
            interdum libero sed eros sodales aliquam. Vestibulum vitae auctor
            tellus. Morbi semper sit amet tellus in accumsan. Sed mollis
            accumsan erat, ut ultrices est porta sit amet. Donec vitae pulvinar
            nisl, ut scelerisque orci. Mauris lacinia dignissim interdum. Fusce
            sed odio blandit, luctus purus sed, sagittis enim. Suspendisse id
            dapibus lorem. Nam bibendum malesuada justo, eu dictum arcu ornare
            id. Vivamus maximus elit id semper bibendum. Mauris sit amet mauris
            nulla. Mauris vulputate viverra risus, id pulvinar metus. Aenean
            eget fermentum odio. Aenean tempor, eros vel vehicula dapibus, ipsum
            eros rhoncus risus, a convallis nisi velit vitae ligula. Morbi
            aliquam eros augue, vel sollicitudin lacus porta quis.
          </p>
        </poly-tab-content>
      </poly-tab>
      <poly-tab label="Tab 03" tabId="03">
        <poly-tab-content>
          <h1>Tab 03</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet
            pellentesque diam, id rhoncus tortor. Sed vestibulum porta ante,
            eget consequat ipsum. Morbi sodales tristique massa, nec gravida
            tortor lacinia et. Vestibulum felis diam, hendrerit quis ipsum non,
            scelerisque viverra arcu. In ut elit in enim consectetur fermentum.
            Ut velit neque, eleifend sed eros porttitor, maximus pellentesque
            lectus. Etiam consequat risus et ullamcorper scelerisque. Sed
            dignissim nibh eu tortor consectetur, a pharetra quam efficitur.
            Nulla eleifend tortor vel justo pulvinar, nec laoreet lorem cursus.
            Nulla neque urna, malesuada in ligula nec, suscipit dignissim nunc.
            Sed tincidunt ornare tortor et dictum. Nam et posuere dui. Aliquam
            interdum libero sed eros sodales aliquam. Vestibulum vitae auctor
            tellus. Morbi semper sit amet tellus in accumsan. Sed mollis
            accumsan erat, ut ultrices est porta sit amet. Donec vitae pulvinar
            nisl, ut scelerisque orci. Mauris lacinia dignissim interdum. Fusce
            sed odio blandit, luctus purus sed, sagittis enim. Suspendisse id
            dapibus lorem. Nam bibendum malesuada justo, eu dictum arcu ornare
            id. Vivamus maximus elit id semper bibendum. Mauris sit amet mauris
            nulla. Mauris vulputate viverra risus, id pulvinar metus. Aenean
            eget fermentum odio. Aenean tempor, eros vel vehicula dapibus, ipsum
            eros rhoncus risus, a convallis nisi velit vitae ligula. Morbi
            aliquam eros augue, vel sollicitudin lacus porta quis.
          </p>
        </poly-tab-content>
      </poly-tab>
    </poly-tabs>
  `;
}

export const Regular = Template.bind({});
export const TabsLight = Template.bind({});
TabsLight.args = {
  theme: "light",
};
