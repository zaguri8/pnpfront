import React, { CSSProperties } from "react";

export default function Button(props: { title: string, onClick: () => void, type: 'button' | 'submit' | 'reset', style?: CSSProperties }) {
    function createRipple(event: React.MouseEvent) {
        const button = event.currentTarget as HTMLButtonElement;

        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];

        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    return (<button type={props.type}
        style={{ ...props.style }} onClick={(e) => {
            createRipple(e)
            props.onClick && props.onClick()
        }}>{props.title}</button>)
}