import React from "react";

export const SmallHeader: React.FC = ({ children }) => (
    <header className="small-header">{children}</header>
);

export const BigHeader: React.FC = ({ children }) => (
    <header className="big-header">{children}</header>
);
