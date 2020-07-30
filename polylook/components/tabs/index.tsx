import * as React from "react";

export function Tabs({ children }) {
    return (
        <nav className="tabs">
            <ul>{children}</ul>
        </nav>
    );
}

export function Tab({ children, active = false }) {
    return <li className={active ? "tabs-active" : null}>{children}</li>;
}
