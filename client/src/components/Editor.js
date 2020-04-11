import React, {useContext, useEffect, useState} from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import {AppContext} from '../context';
import BlockingMethods from './blockingMethods';

function Editor () {
    const {code, turf, setState} = useContext(AppContext);

    function runCode (newCode) {
        console.clear();
        const [geojson, error] = executeCode(turf + ' ' + newCode);
        setState(s => ({...s, code: newCode, geojson, error}));
    }

    useEffect(() => {
        if (turf) runCode(code);
    }, [turf]);

    return (
        <div className="editor-container">
            <AceEditor
                placeholder=""
                defaultValue={code}
                height="100%"
                width="100%"
                mode="javascript"
                theme="solarized_dark"
                debounceChangePeriod={1000}
                onChange={runCode}
                value={code}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                wrapEnabled
                showPrintMargin={false}
            />
        </div>
    )
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

export default Editor;
