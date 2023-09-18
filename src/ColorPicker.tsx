import React, { useState, useRef, useEffect } from "react";
import './ColorPicker.css';


const ColorPicker: React.FC<{ target: any }> = ({ target }) => {
    const [mouseDownOnPicker, setMouseDownOnPicker] = useState(false);
    const [mouseDownOnTint, setMouseDownOnTint] = useState(false);
    const [mouseDownOnAlpha, setMouseDownOnAlpha] = useState(false);
    const [color, setColor] = useState<string>("#fff");
    const colorAlphaRef = useRef<HTMLDivElement | null>(null);
    const colorTintRef = useRef<HTMLDivElement | null>(null);
    const colorPickerRef = useRef<HTMLDivElement | null>(null);
    const hexRef = useRef<HTMLInputElement | null>(null);
    const rRef = useRef<HTMLInputElement | null>(null);
    const gRef = useRef<HTMLInputElement | null>(null);
    const bRef = useRef<HTMLInputElement | null>(null);
    const aRef = useRef<HTMLInputElement | null>(null);
    const pointerRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<HTMLDivElement | null>(null);
    const [percentX, setPercentX] = useState(0);
    const [percentY, setPercentY] = useState(0);

    const hexToRgba = (hex: string) => {
        // Rimuovi il carattere "#" se presente
        hex = hex.replace(/^#/, "");

        // Verifica la lunghezza corretta dell'HEX
        if (hex.length !== 3 && hex.length !== 6) {
            throw new Error("L'HEX deve essere di 3 o 6 cifre.");
        }

        // Estendi l'HEX a 6 cifre se è di 3 cifre (es. "#abc" diventa "#aabbcc")
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        // Estrai i componenti RGB
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const a = aRef.current != null ? aRef.current.value.toString() : "255";
        return { r, g, b, a };
    };


    useEffect(() => {
        const colorTintDiv = colorTintRef.current;
        const colorPickerDiv = colorPickerRef.current;
        const frameDiv = frameRef.current;
        const colorAlphaDiv = colorAlphaRef.current;
        const hexText = hexRef.current;
        const rText = rRef.current;
        const gText = gRef.current;
        const bText = bRef.current;
        const aText = aRef.current;

        if (!colorPickerDiv) return;
        if (!colorTintDiv) return;
        if (!colorAlphaDiv) return;
        if (!frameDiv) return;
        if (!hexText) return;
        if (!rText) return;
        if (!gText) return;
        if (!bText) return;
        if (!aText) return;

        const handleMouseMoveInTint = (event: MouseEvent) => {
            if (mouseDownOnTint) {
                const y = event.clientY - colorTintDiv.getBoundingClientRect().top;
                const gradientHeight = colorTintDiv.clientHeight;
                const percentage = (y / gradientHeight) * 100;
                const hue = (percentage / 100) * 360;
                const colorHEX = hslToHex(hue, 100, 50);
                hexText.value = colorHEX;
                setColor(colorHEX);
            }
        };

        const handleMouseMoveInAlpha = (event: MouseEvent) => {
            console.log(mouseDownOnAlpha);
            if (mouseDownOnAlpha) {
                const y = event.clientY - colorTintDiv.getBoundingClientRect().top;
                const gradientHeight = colorTintDiv.clientHeight;
                const percentage = Math.round((y / gradientHeight) * 255);
                aText.value = percentage.toString();
            }
        };

        const handlePointer = (event: MouseEvent) => {

            if (pointerRef.current && mouseDownOnPicker) {
                const colorPickerRect = colorPickerDiv.getBoundingClientRect();
                const pointerWidth = pointerRef.current.clientWidth;
                const pointerHeight = pointerRef.current.clientHeight;
                const left = Math.max(-pointerWidth / 2, Math.min(event.clientX - colorPickerRect.left - pointerWidth / 2, colorPickerRect.width - pointerWidth));
                const top = Math.max(-pointerHeight / 2, Math.min(event.clientY - colorPickerRect.top - pointerHeight / 2, colorPickerRect.height - pointerHeight));

                pointerRef.current.style.left = left + "px";
                pointerRef.current.style.top = top + "px";

                const y = event.clientY - colorPickerDiv.getBoundingClientRect().top;
                const gradientHeight = colorPickerDiv.clientHeight;
                const x = event.clientX - colorPickerDiv.getBoundingClientRect().left;
                const gradientWidth = colorPickerDiv.clientWidth;
                setPercentY(1 - (y / gradientHeight));
                setPercentX((x / gradientWidth));
                console.log(percentX + "   " + percentY);
                if (target.current)
                    target.current.style.backgroundColor = pointerRef.current.style.backgroundColor;
            }
        };

        const handleMouseDownOnPicker = (event: MouseEvent) => {

            setMouseDownOnPicker(true);
        }

        const handleMouseDownOnTint = (event: MouseEvent) => {

            setMouseDownOnTint(true);
        }

        const handleMouseDownOnAlpha = (event: MouseEvent) => {

            setMouseDownOnAlpha(true);
        }


        const handleMouseUp = (event: MouseEvent) => {
            setMouseDownOnPicker(false);
            setMouseDownOnTint(false);
            setMouseDownOnAlpha(false);
        }



        colorTintDiv.addEventListener("mousemove", handleMouseMoveInTint);
        colorAlphaDiv.addEventListener("mousemove", handleMouseMoveInAlpha);
        document.body.addEventListener("mousemove", handlePointer);
        colorPickerDiv.addEventListener("mousedown", handleMouseDownOnPicker);
        colorTintDiv.addEventListener("mousedown", handleMouseDownOnTint);
        colorAlphaDiv.addEventListener("mousedown", handleMouseDownOnAlpha)
        document.body.addEventListener("mouseup", handleMouseUp);

        return () => {
            colorTintDiv.removeEventListener("mousemove", handleMouseMoveInTint);
            document.body.removeEventListener("mousemove", handlePointer);
            colorPickerDiv.removeEventListener("mousedown", handleMouseDownOnPicker);
            colorTintDiv.removeEventListener("mousedown", handleMouseDownOnTint);
            colorAlphaDiv.removeEventListener("mousedown", handleMouseDownOnAlpha)
            colorAlphaDiv.removeEventListener("mousemove", handleMouseMoveInAlpha)
            document.body.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseDownOnPicker, mouseDownOnTint, mouseDownOnAlpha, color]);

    const hslToHex = (h: number, s: number, l: number) => {
        h /= 360;
        s /= 100;
        l /= 100;

        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);

            if (rRef.current) rRef.current.value = Math.round(r * 255).toString();
            if (gRef.current) gRef.current.value = Math.round(g * 255).toString();
            if (bRef.current) bRef.current.value = Math.round(b * 255).toString();
            if (aRef.current) aRef.current.value = Math.round(0).toString();
        }

        const toHex = (x: number) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const gradientStyleGS = {
        background: `linear-gradient(to right, white 0%, rgba(255,255,255,0) 100%)`,
        zIndex: 0
    };
    const gradientStyleGS2 = {
        background: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, black 100%)`,
        zIndex: 1
    };

    const gradientStyle = {
        background: `${color}`
    };
    const rgba = hexToRgba(color);

    const xxx = 0;// Math.max(percentX *2, 1);
    const yyy = 0;// Math.max(percentY * -2, 1);

    const pointerStyle = {
        backgroundColor: `rgba(${rgba.r * percentX * percentY + 255 * Math.max(xxx + yyy, (percentY - percentX))},
                         ${rgba.g * percentX * percentY + 255 * Math.max(xxx + yyy, (percentY - percentX))},
                         ${rgba.b * percentX * percentY + 255 * Math.max(xxx + yyy, (percentY - percentX))},
         ${rgba.a})`,
    };



    return (
        <>
            <div ref={frameRef} className="frame">
                <div className="row_1">
                    <div ref={colorPickerRef} className="colorPicker" style={gradientStyle}>
                        <div className="colorPickerGS" style={gradientStyleGS}> </div>
                        <div className="colorPickerGS2" style={gradientStyleGS2}> </div>
                        <div ref={pointerRef} style={pointerStyle} className="pointer">
                        </div>
                    </div>
                    <div ref={colorTintRef} className="colorTint"> </div>
                    <div ref={colorAlphaRef} className="colorSaturation"></div>
                </div>
                <div className="row_2">
                    <input ref={hexRef} type="text" className="t tc"></input>
                    <input ref={rRef} type="text" className="t tc"></input>
                    <input ref={gRef} type="text" className="t tc"></input>
                    <input ref={bRef} type="text" className="t tc"></input>
                    <input ref={aRef} type="text" className="t tc"></input>
                </div>
                <div className="row_3">
                    <p className="t">HEX</p>
                    <p className="t">R</p>
                    <p className="t">G</p>
                    <p className="t">B</p>
                    <p className="t">A</p>
                </div>
            </div>
        </>
    );

};
export default ColorPicker;