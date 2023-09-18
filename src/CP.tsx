import React, { useState, useRef, useEffect } from "react";
import './CP.css';

const ColorPicker = () => {

    const [tint, setTint] = useState<string>();
    const [Hex, setHex] = useState<string>();
    const [R, setR] = useState<string | number>();
    const [G, setG] = useState<string | number>();
    const [B, setB] = useState<string | number>();
    const [A, setA] = useState<string | number>();

    const colorPickerRef = useRef<HTMLDivElement>(null);
    const lightPointerRef = useRef<HTMLDivElement>(null);
    const lightRef = useRef<HTMLDivElement>(null);
    const huePointerRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const alphaPointerRef = useRef<HTMLDivElement>(null);
    const alphaRef = useRef<HTMLDivElement>(null);

    useEffect(() =>  CalculateColor,[]);



    function CalculateColor()
    {
        const hueY = huePointerRef.current!.offsetTop - hueRef.current!.getBoundingClientRect().top;
        const hueGradientHeight = hueRef.current!.clientHeight;
        const huePercent = (hueY / hueGradientHeight) * 100;
        const hue = (huePercent / 100) * 360;

        const lightX = lightPointerRef.current!.offsetLeft;// - lightRef.current!.getBoundingClientRect().left;
        const lightGradientWidth = lightRef.current!.clientWidth;
        const lightPercentX = lightX / lightGradientWidth;

        const lightY = lightPointerRef.current!.offsetTop;// - lightRef.current!.getBoundingClientRect().top;
        const lightGradientHeight = lightRef.current!.clientHeight;
        const lightPercentY =1- (lightY / lightGradientHeight);

        console.log(lightPercentX + " " + lightPercentY);


        const alphaY = alphaPointerRef.current!.offsetTop - alphaRef.current!.getBoundingClientRect().top;
        const alphaGradientHeight = alphaRef.current!.clientHeight;
        const alphaPercent = (alphaY / alphaGradientHeight);

        const color = HSLToRGBA(hue, lightPercentX, lightPercentY, alphaPercent);
        setR(color.r);
        setG(color.g);
        setB(color.b);
        setA(color.a);
        setHex(color.hex);
        setTint(color
            .lightnessAdjustedHex);
    }

    function OnLightChange(e: MouseEvent) {
        const lightRect = colorPickerRef.current!.getBoundingClientRect();
        const pointerWidth = lightPointerRef.current!.clientWidth;
        const pointerHeight = lightPointerRef.current!.clientHeight;
        const left = Math.max(-pointerWidth / 2, Math.min(e.clientX - lightRect.left - pointerWidth / 2, lightRect.width - pointerWidth));
        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - lightRect.top - pointerHeight / 2, lightRect.height - pointerHeight));

        lightPointerRef.current!.style.left = left + "px";
        lightPointerRef.current!.style.top = top + "px";

        CalculateColor();
    }

    function OnHueChange(e: MouseEvent) {
        const hueRect = hueRef.current!.getBoundingClientRect();
        const pointerHeight = huePointerRef.current!.clientHeight;

        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - hueRect.top - pointerHeight / 2, hueRect.height - pointerHeight));

        huePointerRef.current!.style.top = top + pointerHeight / 4 + "px";

        CalculateColor();
    }

    function OnAlphaChange(e: MouseEvent) {
        const alphaRect = alphaRef.current!.getBoundingClientRect();
        const pointerHeight = alphaPointerRef.current!.clientHeight;
      
        const top = Math.max(-pointerHeight / 2, Math.min(e.clientY - alphaRect.top - pointerHeight / 2, alphaRect.height - pointerHeight));

        alphaPointerRef.current!.style.top = top + pointerHeight / 4 + "px";

        CalculateColor();
    }

    function HSLToRGBA(hue: number, saturation: number, lightness: number, alpha: number) {
        // Convert HSL values to RGB
        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const huePrime = hue / 60;
        const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
        let r, g, b;

        if (huePrime >= 0 && huePrime < 1) {
            r = chroma;
            g = x;
            b = 0;
        } else if (huePrime >= 1 && huePrime < 2) {
            r = x;
            g = chroma;
            b = 0;
        } else if (huePrime >= 2 && huePrime < 3) {
            r = 0;
            g = chroma;
            b = x;
        } else if (huePrime >= 3 && huePrime < 4) {
            r = 0;
            g = x;
            b = chroma;
        } else if (huePrime >= 4 && huePrime < 5) {
            r = x;
            g = 0;
            b = chroma;
        } else {
            r = chroma;
            g = 0;
            b = x;
        }
        //const lightnessAdjustment = lightness - chroma / 2;
        //r += lightnessAdjustment;
        //g += lightnessAdjustment;
        //b += lightnessAdjustment;

        // Assicurati che i valori siano all'interno dell'intervallo valido
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);

        // Convert RGB values to RGBA
        const rgbaColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        // Convert the decimal values to hexadecimal
        const hexR = r.toString(16).padStart(2, '0');
        const hexG = g.toString(16).padStart(2, '0');
        const hexB = b.toString(16).padStart(2, '0');
        const hexA = Math.round(alpha * 255).toString(16).padStart(2, '0'); // Convert alpha to 0-255 range

        // Combine the hex values
        const hexColor = `#${hexR}${hexG}${hexB}${hexA}`;

        // Calculate the RGBA color with lightness set to 0.5
        const lightnessAdjustedRGBA = `rgba(${r}, ${g}, ${b}, ${alpha})`;

        // Calculate the hexadecimal color with lightness set to 0.5
        const lightnessAdjustedHex = `#${hexR}${hexG}${hexB}`;

        return {
            hex: hexColor,
            rgba: rgbaColor,
            r: r,
            g: g,
            b: b,
            a: alpha.toFixed(2),
            lightnessAdjustedHex: lightnessAdjustedHex,
            lightnessAdjustedRGBA: lightnessAdjustedRGBA
        };
    }

    const colorPickerStyle = {
        backgroundColor: `${tint}`
    }

    const alphaControlStyle = {
        backgroundImage: `linear-gradient(to bottom, rgba(${R}, ${G}, ${B}, 0), rgba(${R}, ${G}, ${B}, 255)), url("https://img.freepik.com/premium-vector/grid-transparency-effect-seamless-pattern-png-photoshop_194360-315.jpg")`
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
        console.log("bind light");
        document.addEventListener("mousemove", OnLightChange);
        document.addEventListener("mouseup", unbindLight);
    }

    function bindHue(e: React.MouseEvent<HTMLDivElement>) {
        console.log("bind hue");
        document.addEventListener("mousemove", OnHueChange);
        document.addEventListener("mouseup", unbindHue);
    }

    function bindAlpha(e: React.MouseEvent<HTMLDivElement>) {
        console.log("bind alpha");
        document.addEventListener("mousemove", OnAlphaChange);
        document.addEventListener("mouseup", unbindAlpha);
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

    return (
        <div className="color-picker">
            <div className="color-picker-row-1">
                <div onMouseDown={bindLight} ref={colorPickerRef} className="color-picker-control-frame">
                    <div className="container">
                        <div ref={lightRef} style={colorPickerStyle} className="color-picker-control"></div>
                        <div className="color-picker-grayscale-1"></div>
                        <div className="color-picker-grayscale-2"> </div>
                    </div>
                    <div  ref={lightPointerRef} style={lightPointerStyle} className="pointer"></div>
                </div>

                <div onMouseDown={bindHue} ref={hueRef} className="color-picker-spectrum-control">     <div onMouseMove={() => OnHueChange} ref={huePointerRef} style={huePointerStyle} className="pointer"></div> </div>
                <div onMouseDown={bindAlpha} ref={alphaRef} style={alphaControlStyle} className="color-picker-alpha-control">     <div onMouseMove={() => OnAlphaChange} ref={alphaPointerRef} style={alphaPointerStyle} className="pointer"></div></div>
            </div>
            <div className="color-picker-row-2">
                <input type="text" className="color-picker-field" value={Hex}></input>
                <input type="text" className="color-picker-field" value={R}></input>
                <input type="text" className="color-picker-field" value={G}></input>
                <input type="text" className="color-picker-field" value={B}></input>
                <input type="text" className="color-picker-field" value={A}></input>
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