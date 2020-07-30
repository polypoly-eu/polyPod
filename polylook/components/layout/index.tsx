import React from "react";

export default function Layout({ header, footer, children }) {
    return (
        <div className="layout">
            {header}
            {children}
            {footer}
        </div>
    );
}
