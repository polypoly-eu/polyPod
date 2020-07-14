import React from "react";

export default function Loader(
    { loading } : { loading: boolean }
) {
    // TODO this should be a spinner
    return (
        <div className={ loading ? "" : "invisible" }>
            Loading ...
        </div>
    );
}