import * as React from "react";
import * as ReactDOM from "react-dom";
import { pod } from "@polypoly-eu/feature-bootstrap";
/* import {Button} from "@polypoly-eu/poly-look"; */

const view = (
  <div>
    <span className="helloWorldStyle">
      Hello Welt!
    </span>
  </div>
);

ReactDOM.render(
  view,
  document.getElementById("feature")
);

pod.then(async pod => {
  let response = await pod.polyOut.fetch("http://example.org");
  let content = await response.text();
  console.log(content);
});
