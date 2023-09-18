import React, { useState, useRef, useEffect } from "react";
import './CP.css';

const ColorPicker = () => {

    const [tint, setTint] = useState<string>();
    const [Hex, setHex] = useState<string>();
    const [R, setR] = useState<number>();
    const [G, setG] = useState<number>();
    const [B, setB] = useState<number>();
    const [A, setA] = useState<number>();

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const lightPointerRef = useRef<HTMLDivElement>(null);
    const lightRef = useRef<HTMLDivElement>(null);
    const huePointerRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const alphaPointerRef = useRef<HTMLDivElement>(null);
    const alphaRef = useRef<HTMLDivElement>(null);

    useEffect(() => CalculateColor(), []);

    function CalculateColor() {
        const hueY = huePointerRef.current!.offsetTop - hueRef.current!.getBoundingClientRect().top + hueRef.current!.clientTop;
        const hueGradientHeight = hueRef.current!.clientHeight;
        const huePercent = (hueY / hueGradientHeight) * 100;
        const hue = (huePercent / 100) * 360;

        const lightGradientWidth = lightRef.current!.clientWidth;
        const x = (lightPointerRef.current!.offsetLeft+8)  / lightGradientWidth;
        const lightGradientHeight = lightRef.current!.clientHeight;
        const y = 1-((lightPointerRef.current!.offsetTop + 8) / lightGradientHeight);//  1 - (lightY / lightGradientHeight);

        const saturation = x;
        const lightness = (1 - 0.5 * x) * y;// y + (0.5 - Math.abs(0.5 - x));

        //console.log("x "+x+" y "+y+" s "+saturation + " l " + lightness);

        const alphaY = alphaPointerRef.current!.offsetTop - alphaRef.current!.getBoundingClientRect().top + alphaRef.current!.clientTop;
        const alphaGradientHeight = alphaRef.current!.clientHeight;
        const alphaPercent = 1 - (alphaY / alphaGradientHeight);
        const alpha = Math.round(alphaPercent * 255); // Alfa va da 0 a 255

        let color = hslToRgba(hue / 360, 1, 0.5, alpha);

        // Aggiorna le variabili di stato
        setTint(`rgba(${color.r}, ${color.g}, ${color.b}, 255)`);
         color = hslToRgba(hue / 360, saturation, lightness, alpha);
        setHex(rgbToHex(color.r, color.g, color.b, color.a));
        setR(color.r);
        setG(color.g);
        setB(color.b);
        setA(alpha / 255);
    }

    function OnLightChange(e: MouseEvent) {
        e.preventDefault();
        const lightRect = colorPickerRef.current!.getBoundingClientRect();
        const pointerWidth = lightPointerRef.current!.clientWidth;
        const pointerHeight = lightPointerRef.current!.clientHeight;
        const left = Math.max(-pointerWidth / 2, Math.min(e.clientX - lightRect.left - pointerWidth / 2, lightRect.width - pointerWidth / 2));
        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - lightRect.top - pointerHeight / 2, lightRect.height - pointerHeight / 2));

        lightPointerRef.current!.style.left = left + "px";
        lightPointerRef.current!.style.top = top + "px";

        CalculateColor();
    }

    function hslToRgba(h: number, s: number, l: number, a: number) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // Grayscale
        } else {
            const hueToRgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hueToRgb(p, q, h + 1 / 3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1 / 3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
    }

    function rgbToHex(r: number, g: number, b: number, a: number) {
        const componentToHex = (c: number) => {
            const hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        };

        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${componentToHex(a)}`;
    }

    function hexToRGBA(hex: string) {
        // Rimuovi l'eventuale simbolo "#" dalla stringa esadecimale
        hex = hex.replace(/^#/, '');

        // Controlla la lunghezza della stringa esadecimale per determinare se è RGB o RGBA
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);

            return `rgba(${r}, ${g}, ${b}, 1)`;
        } else if (hex.length === 8) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            const a = (parseInt(hex.slice(6, 8), 16) / 255).toFixed(2);

            return `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
            // Restituisci un messaggio di errore se la stringa hex non è valida
            return "Formato hex non valido";
        }
    }

    function OnHueChange(e: MouseEvent) {
        e.preventDefault();
        const hueRect = hueRef.current!.getBoundingClientRect();
        const pointerHeight = huePointerRef.current!.clientHeight;

        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - hueRect.top - pointerHeight / 2, hueRect.height - pointerHeight));

        huePointerRef.current!.style.top = top + "px";

        CalculateColor();
    }

    function OnAlphaChange(e: MouseEvent) {
        e.preventDefault();
        const alphaRect = alphaRef.current!.getBoundingClientRect();
        const pointerHeight = alphaPointerRef.current!.clientHeight;

        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - alphaRect.top - pointerHeight / 2, alphaRect.height - pointerHeight));

        alphaPointerRef.current!.style.top = top + "px";

        CalculateColor();
    }

    const colorPickerStyle = {
        backgroundColor: `${tint}`
    }

    const alphaControlStyle = {
        backgroundImage: `linear-gradient(to top, rgba(${R}, ${G}, ${B}, 0), rgba(${R}, ${G}, ${B}, 255)), url("https://img.freepik.com/premium-vector/grid-transparency-effect-seamless-pattern-png-photoshop_194360-315.jpg")`
    }

    const lightPointerStyle = {
        backgroundColor: `${Hex}`
    }
    const huePointerStyle = {
        backgroundColor: `${Hex}`
    }
    const alphaPointerStyle = {
        backgroundColor: `rgba(${R}, ${G}, ${B}, 255)`
    }

    function bindLight(e: React.MouseEvent<HTMLDivElement>) {
        document.addEventListener("mousemove", OnLightChange);
        document.addEventListener("mouseup", unbindLight);
        OnLightChange(e.nativeEvent);
    }

    function bindHue(e: React.MouseEvent<HTMLDivElement>) {
        document.addEventListener("mousemove", OnHueChange);
        document.addEventListener("mouseup", unbindHue);
        OnHueChange(e.nativeEvent);
    }

    function bindAlpha(e: React.MouseEvent<HTMLDivElement>) {
        document.addEventListener("mousemove", OnAlphaChange);
        document.addEventListener("mouseup", unbindAlpha);
        OnAlphaChange(e.nativeEvent);
    }

    function unbindLight(e: MouseEvent) {
        document.removeEventListener("mousemove", OnLightChange);
        document.removeEventListener("mouseup", unbindLight);
    }

    function unbindHue(e: MouseEvent) {
        document.removeEventListener("mousemove", OnHueChange);
        document.removeEventListener("mouseup", unbindHue);
    }

    function unbindAlpha(e: MouseEvent) {
        document.removeEventListener("mousemove", OnAlphaChange);
        document.removeEventListener("mouseup", unbindAlpha);
    }

    function onHexChange(e: React.ChangeEvent<HTMLInputElement>) {

    }

    function onRChange(e: React.ChangeEvent<HTMLInputElement>) {

    }

    function onGChange(e: React.ChangeEvent<HTMLInputElement>) {

    }

    function onBChange(e: React.ChangeEvent<HTMLInputElement>) {

    }

    function onHAhange(e: React.ChangeEvent<HTMLInputElement>) {

    }

    return (
        <div className="color-picker">
            <div className="color-picker-row-1">
                <div onMouseDown={bindLight} ref={colorPickerRef} className="color-picker-control-frame">
                    <div className="container">
                        <div ref={lightRef} style={colorPickerStyle} className="color-picker-control"></div>
                        <div className="color-picker-grayscale-1"></div>
                        <div className="color-picker-grayscale-2"> </div>
                    </div>
                    <div ref={lightPointerRef} style={lightPointerStyle} className="pointer"></div>
                </div>

                <div onMouseDown={bindHue} ref={hueRef} className="color-picker-spectrum-control">
                    <div onMouseMove={() => OnHueChange} ref={huePointerRef} style={huePointerStyle} className="pointer"></div>
                </div>
                <div onMouseDown={bindAlpha} ref={alphaRef} style={alphaControlStyle} className="color-picker-alpha-control">
                    <div onMouseMove={() => OnAlphaChange} ref={alphaPointerRef} style={alphaPointerStyle} className="pointer"></div>
                </div>
            </div>
            <div className="color-picker-row-2">
                <input onChange={onHexChange} type="text" className="color-picker-field" value={Hex}></input>
                <input type="text" className="color-picker-field" value={R}></input>
                <input type="text" className="color-picker-field" value={G}></input>
                <input type="text" className="color-picker-field" value={B}></input>
                <input type="text" className="color-picker-field" value={A?.toFixed(2)}></input>
            </div>
            <div className="color-picker-row-3">
                <p className="color-picker-label">HEX</p>
                <p className="color-picker-label">R</p>
                <p className="color-picker-label">G</p>
                <p className="color-picker-label">B</p>
                <p className="color-picker-label">A</p>
            </div>
        </div>
    );
};

export default ColorPicker;