import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import BlockingMethods from './blockingMethods';
import Resizable from './Resizable';
import withTurf from './withTurf';
import Loader from './Loader';
import Footer from './Footer';

const defaultState = {
    geojson: null,
    loading: true,
    error: '',
};

// you can style your results using simplestyle (https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0)

const initialCode = `// simply return a valid GeoJSON and it will be rendered on the map!

const poly = turf.polygon([[
  [11.339607, 44.505626], [11.326990, 44.499382], [11.329479, 44.490382],
  [11.339693, 44.486402], [11.356258, 44.484443], [11.358060, 44.485729],
  [11.356172, 44.501035], [11.347761, 44.504280], [11.339607, 44.505626]
]], {
  stroke: '#F00',
  fill: '#F00',
  'fill-opacity': 0.3,
});

const point = turf.point([11.342, 44.495], {
  'marker-color': '#F00',
  'marker-symbol': 'B',
});

return turf.featureCollection([poly, point]);
`;

function App ({turf, version, loading, error}) {
    const [state, setState] = useState({...defaultState, error});
    const iframe = useRef(null);

    const onChange = useCallback((code, options = {}) => {
        console.clear();
        const [geojson, error] = executeCode(turf + ' ' + code);
        setState(s => ({ ...s, geojson, error }));
    }, [turf]);

    useEffect(() => {
        // load initial code after Turf is loaded
        turf && onChange(initialCode);
    }, [turf, onChange]);

    // we need to disable mouse events on the iframe otherwise we won't receive the `onmouseup` event back
    const disableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'none', []);
    const enableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'auto', []);

    return (
        <>
            <Header />
            <main>
                <Resizable onBeforeResize={disableMouseEvent} onAfterResize={enableMouseEvent} leftElement={
                    <Editor defaultCode={initialCode} onChange={onChange}/>} rightElement={
                    <Output geojson={state.geojson} error={state.error} ref={iframe}/>}
                />
            </main>
            <Footer version={version}/>
            <Loader show={loading} />
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

export default withTurf(App);
