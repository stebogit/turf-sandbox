import React, { useEffect, useRef, useState } from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import BlockingMethods from './blockingMethods';

function App () {
    const [geojson, setGeojson] = useState();
    const [error, setError] = useState();
    const [width, setWidth] = useState('50%');
    const container = useRef(null);
    const divider = useRef(null);
    const iframe = useRef(null);

    function onChange (code, options) {
        console.clear();
        const [geojson, error] = executeCode(code);
        setGeojson(geojson);
        setError(error);
    }

    useEffect(() => {
        divider.current.addEventListener('mousedown', activate);

        function activate (e) {
            e.preventDefault();
            // we need to disable mouse events on the iframe otherwise we won't receive the `onmouseup` event back
            disableMouseEvent();
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }

        function resize (e) {
            setWidth(e.pageX - container.current.getBoundingClientRect().left);
        }

        function stopResize () {
            window.removeEventListener('mousemove', resize);
            enableMouseEvent();
        }

        return function cleanup () {
            divider.current.removeEventListener('mousedown', activate);
            window.removeEventListener('mouseup', stopResize);
            window.removeEventListener('mousemove', resize);
        };
    }, []);

    function disableMouseEvent () {
        iframe.current.style.pointerEvents = 'none';
    }

    function enableMouseEvent () {
        iframe.current.style.pointerEvents = 'auto';
    }

    return (
        <>
            <Header/>
            <main>
                <div className="resizable" ref={container} style={{ width }}>
                    <Editor onChange={onChange}/>
                    <div className="divider" ref={divider}/>
                </div>

                <Output
                    geojson={geojson} error={error} ref={iframe}
                    width={width === '50%' ? width : `calc(100% - ${width}px)`}
                />
            </main>
        </>
    );
}

function executeCode (code) {
    let result = null;
    let error = null;
    BlockingMethods.kill();
    try {
        /* eslint-disable-next-line no-new-func */
        result = (new Function(code))();
    } catch (e) {
        error = 'Invalid GeoJSON output';
        console.error(e);
    }
    BlockingMethods.restore();
    return [result, error];
}

export default App;
