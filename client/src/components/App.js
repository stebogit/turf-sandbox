import React, {useState} from 'react';
import Editor from './Editor';
import Output from './Output';

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
            {/*<div className="status-bar" style="height: 36px;"></div>*/}
            <main style={{height: '100vh', display:'flex'}}>
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
    try {
        result = (new Function(code))();
    } catch (e) {
        error = 'Invalid GeoJSON output';
        console.error(e);
    }
    return [result, error];
}

export default App;
