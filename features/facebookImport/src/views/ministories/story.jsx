import React, { Component } from "react";

class Story extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.state === Story.state.DETAILS)
            return this.renderDetails();
        return this.renderSummary();
    }
}

export default Story;

Story.LABELS = Object.freeze({
    NONE: null,
    TECH_DEMO: "techDemo",
});

Story.MODES = Object.freeze({
    DETAILS: "details",
    SUMMARY: "summary",
});
