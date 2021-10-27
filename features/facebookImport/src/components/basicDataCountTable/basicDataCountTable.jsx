import React from "react";

const BasicDataCountTable = ({ title = null, items = [] }) => {
    return (
        <>
            {title || ""}
            <table>
                <tbody>
                    {items.map(({ title, count }, index) => (
                        <tr key={index}>
                            <td>{title}</td>
                            <td>{count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default BasicDataCountTable;
