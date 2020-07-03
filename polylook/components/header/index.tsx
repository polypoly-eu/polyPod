import React from "react";

export function SmallHeader({ left = <div/>, children, right = <div/> }) {
  return <header className="small-header">
    {left}
    {children}
    {right}
  </header>;
}
