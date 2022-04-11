import React, { useState } from "react";
import SideSlider from "../../../src/react-components/overlays/sideSlider.jsx";
import "../../../src/css/index.js";
import "./fontFamily.css";
import "./demo.css";

export default {
  component: SideSlider,
  title: "Visuals/Organisms/SideSlider",
};

const Template = (args) => {
  const [open, setOpen] = useState(false);

  const SliderComponent = (props) => {
    let buttonClick = (ev) => {
      ev.stopPropagation();
      console.log("click inside comp, no close");
    };
    return (
      <div className="demo-slider" {...props}>
        <button onClick={buttonClick}>Clickable</button>
        {args.filler && (
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nisi
            elit, eleifend vel urna non, egestas rutrum quam. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Nunc venenatis sem ac dui convallis consequat.
            Curabitur quam lacus, lacinia at leo vel, condimentum iaculis velit.
            In laoreet accumsan dignissim. Integer vitae massa feugiat risus
            hendrerit rutrum et ut nisi. Aenean urna nisl, sollicitudin at
            rhoncus at, convallis ut neque. Donec sit amet laoreet felis. Aenean
            cursus aliquam aliquam. Aliquam in lectus libero. Pellentesque a
            odio libero. Donec sem magna, fermentum a vehicula vel, porta sed
            est. Etiam a finibus dolor. Nam nec commodo dui. Sed placerat id
            erat vel dictum. Quisque scelerisque felis magna, in porttitor enim
            placerat sed. Ut aliquet urna malesuada sem mattis vehicula. Vivamus
            ut suscipit tellus. In hac habitasse platea dictumst. In pretium
            cursus lacus nec mollis. Duis ut convallis metus.
          </p>
        )}
        <button
          onClick={props.onClose}
          className={args.filler && "last-visible"}
        >
          Close
        </button>
      </div>
    );
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </button>

      {open && (
        <SideSlider
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          lastChildSelector=".last-visible"
          Component={SliderComponent}
        />
      )}
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  onClose: () => console.log("closed"),
};
export const WithScroll = Template.bind({});
WithScroll.args = {
  ...Default.args,
  filler: true,
};
