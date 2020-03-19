import React, { useState } from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import BlockingMethods from './blockingMethods';

function App () {
    const [geojson, setGeojson] = useState();
    const [error, setError] = useState();

    function onChange (code, options) {
        console.clear();
        const [geojson, error] = executeCode(code);
        setGeojson(geojson);
        setError(error);
    }

    return (
        <div className="app">
            <Header />
            <main>
                <Editor onChange={onChange}/>
                {/*<div className="gutter gutter-horizontal" style="width: 2px;"></div>*/}
                <Output geojson={geojson} error={error}/>
            </main>
        </div>
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
