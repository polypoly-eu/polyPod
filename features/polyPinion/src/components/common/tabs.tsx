import * as React from "react";

export const Tabs: React.FC = ({ children }) => (
    <nav className="tabs">
        <ul>{children}</ul>
    </nav>
);

export type TabProps = {
    active?: boolean;
};

export const Tab: React.FC<TabProps> = (props) => {
    const { children, active = false } = props;
    return <li className={active ? "tabs-active" : undefined}>{children}</li>;
};
