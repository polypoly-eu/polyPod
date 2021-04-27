import * as React from "react";

export type LayoutProps = {
    header: React.ReactNode;
    footer: React.ReactNode;
};

export const Layout: React.FC<LayoutProps> = (props) => {
    const { header, footer, children } = props;
    return (
        <div className="layout">
            {header}
            {children}
            {footer}
        </div>
    );
};
