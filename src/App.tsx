import React from 'react';
/*import ColorPicker from './ColorPicker';*/
import ColorPicker from './CP';
import './App.css';

function App() {
    //const target = useRef<HTMLDivElement | null>(null);

    return (
        <div className="App">
            <h1>Color Picker</h1>
            <ColorPicker />
            {/*<ColorPicker target={target} />*/}
            {/*<div ref={target} id="target"></div>*/}
        </div>
    );
}

export default App;