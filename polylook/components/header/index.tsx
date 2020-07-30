import React from "react";

export function SmallHeader({ children }) {
    return <header className="small-header">{children}</header>;
}

export function BigHeader({ children }) {
    return <header className="big-header">{children}</header>;
}
