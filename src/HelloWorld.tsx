import * as React from "react";
import * as ReactDOM from "react-dom";
import { downloadActiveQuestionnairesMetadata } from "./server/questionnaire-download";

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

(async function() {
	let result = await downloadActiveQuestionnairesMetadata();
	console.log(result);
})();
