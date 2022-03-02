import { html } from "lit-element";
import "../../../../feature-utils/poly-look/src/lit-components/tabs";
import { themeConfiguration } from "./themeConfiguration";

export default {
    title: "Visuals/Atoms/TabContent",
    component: "poly-tab-content",
    argTypes: {
        active: { control: "boolean" },
        tabId: { control: "text" },
    },
};

function Template({ active = false, tabId = "01" }) {
    return html`
        ${themeConfiguration()}
        <poly-tab-content .active=${active} .tabId=${tabId}>
            <h1>Lorem Ipsum</h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
                ligula lacus, vehicula in pellentesque quis, elementum nec
                sapien. Ut consequat nisi ex, in bibendum dolor rutrum vel.
                Etiam justo lorem, aliquet quis posuere id, iaculis quis erat.
                Morbi at condimentum justo. Interdum et malesuada fames ac ante
                ipsum primis in faucibus. Curabitur vitae ipsum tortor. Class
                aptent taciti sociosqu ad litora torquent per conubia nostra,
                per inceptos himenaeos. Curabitur at dictum tellus, ac consequat
                ante. Ut sollicitudin blandit porttitor. Mauris ullamcorper
                condimentum dictum. In at tortor a elit varius auctor vel
                accumsan metus. Nullam nec odio arcu. Nullam et volutpat erat,
                at porttitor arcu. Nam ut lacinia lorem, quis laoreet quam.
                Mauris tellus ante, viverra ac sollicitudin volutpat, lacinia ut
                purus. Pellentesque sodales lobortis luctus. Fusce tortor felis,
                placerat in urna ut, pretium molestie mauris. Curabitur in
                posuere enim. Suspendisse dui ante, bibendum eget lacinia ut,
                porttitor sed purus. Quisque sed lacus sed justo tincidunt
                mattis. Morbi convallis commodo placerat. Vestibulum hendrerit
                mattis leo, a luctus elit volutpat sit amet. Quisque eu dapibus
                lectus, non pharetra massa. Aenean id cursus nibh, ut laoreet
                ex. Duis a tristique augue. Nulla dui purus, tempus at nunc
                eget, efficitur aliquet augue. Suspendisse egestas eros neque,
                non rutrum magna commodo a. Mauris sed neque nunc. Curabitur
                faucibus turpis ut ante venenatis sagittis. Nullam lobortis
                posuere volutpat. Pellentesque ullamcorper sapien et sagittis
                hendrerit. Integer pulvinar laoreet elementum. Vestibulum
                venenatis hendrerit commodo. Vestibulum sit amet mi eget lacus
                commodo euismod vel sed massa. Quisque eget sem orci. Nullam
                sagittis ultrices ligula, rhoncus ultrices ex semper
                condimentum. Sed euismod, arcu a tincidunt finibus, ex velit
                iaculis nibh, et faucibus velit mi eu nisi. Morbi facilisis
                velit mauris, sit amet scelerisque leo finibus a. Ut eu
                consequat lacus, id vestibulum sem. Quisque venenatis nisi
                consectetur, luctus arcu eu, blandit nulla. Phasellus sit amet
                faucibus leo. Integer sodales erat sapien. Fusce condimentum,
                neque ac dictum pellentesque, mi dolor volutpat risus, id
                pretium dolor nunc sit amet est. Mauris dignissim est eu
                pulvinar ultrices. Ut eget dui aliquet, scelerisque quam at,
                porta lectus. Nam est arcu, bibendum at lorem at, pellentesque
                aliquam urna. Suspendisse egestas ultrices ultricies. Donec
                fringilla, purus ut congue venenatis, dolor mi blandit massa,
                nec porttitor purus dui nec nisi. Vivamus pharetra lacus tortor,
                in sollicitudin tortor gravida eu. Aliquam facilisis euismod
                venenatis. Ut commodo augue magna, eget bibendum ipsum bibendum
                a. Vivamus pharetra posuere ex. In mi quam, tincidunt in felis
                non, rutrum facilisis erat. Phasellus bibendum metus at metus
                laoreet euismod. Fusce leo sem, hendrerit nec finibus ut, dictum
                in lorem. In sed blandit nibh.
            </p>
        </poly-tab-content>
    `;
}

export const Regular = Template.bind({});
