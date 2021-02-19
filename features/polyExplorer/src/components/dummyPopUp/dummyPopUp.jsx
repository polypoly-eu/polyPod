import React from "react";

const DummyPopUp = ({ text, onPopUpClose }) => {
    const style = {
        container: {
            backgroundColor: "#eaeaea",
            position: "absolute",
            top: "10%",
            left: "10%",
            bottom: "10%",
            right: "10%",
            zIndex: "200",
            borderRadius: "20px",
        },
        text: {
            color: "#000000",
            textAlign: "center",
        },
        button: {
            backgroundColor: "#9e9e9e",
            height: "10%",
            width: "20%",
            position: "absolute",
            top: "85%",
            padding: "8px",
            color: "#ffffff",
            left: "40%",
            borderRadius: "8px",
            border: "transparent",
        },
        background: {
            position: "absolute",
            backgroundColor: "#0F1938",
            width: "100%",
            height: "100%",
        },
    };

    console.log("popup");
    return (
        <div style={style.background}>
            <div style={style.container}>
                <h2 style={style.text}>{text}</h2>
                <button onClick={() => onPopUpClose()} style={style.button}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default DummyPopUp;
