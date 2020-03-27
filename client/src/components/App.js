import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import BlockingMethods from './blockingMethods';
import Resizable from './Resizable';

const NPM_URL = 'https://unpkg.com/@turf/turf/dist/turf.min.js';

const defaultState = {
    geojson: null,
    error: null,
    version: '',
    turf: '',
    loading: true,
};

function App () {
    const [state, setState] = useState(defaultState);
    const iframe = useRef(null);

    function onChange (code, options) {
        console.clear();
        const [geojson, error] = executeCode(state.turf + code);
        setState({...state, geojson, error});
    }

    useEffect(() => {
        // import Turf
        fetch(NPM_URL, {redirect: 'follow'})
            .then(response => {
                const version = (new URL(response.url)).pathname.split('/@turf/turf@')[1].split('/')[0];
                setState(s => ({ ...s, version }));
                return response.text()
            })
            .then(turf => setState(s => ({ ...s, turf, loading: false })))
            .catch(console.error);
    }, []);

    // we need to disable mouse events on the iframe otherwise we won't receive the `onmouseup` event back
    const disableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'none', []);
    const enableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'auto', []);

    return (
        <>
            <Header version={state.version} />
            <main>
                <Resizable onBeforeResize={disableMouseEvent} onAfterResize={enableMouseEvent} leftElement={
                    <Editor onChange={onChange}/>} rightElement={
                    <Output geojson={state.geojson} error={state.error} ref={iframe}/>}
                />
            </main>
            {state.loading &&
                <div className="overlay"><i className="far fa-compass fa-spin fa-5x"/></div>}
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
