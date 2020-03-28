import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/ext-language_tools'; // for auto-completion

function Editor (props) {
    const [code, setCode] = useState(props.defaultCode);

    function onChange (newCode) {
        setCode(newCode);
        props.onChange(newCode);
    }

    return (
        <div className="editor-container">
            <AceEditor
                placeholder=""
                defaultValue={props.defaultCode}
                height="100%"
                width="100%"
                mode="javascript"
                theme="solarized_dark"
                debounceChangePeriod={1000}
                onChange={onChange}
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

export default Editor;
