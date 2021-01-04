import React from 'react';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/ext-language_tools';
import AceEditor from 'react-ace';

function Editor ({code, onChange, width}) {
    return (
        <div className="editor-container">
            <AceEditor
                placeholder=""
                defaultValue={code}
                height="100%"
                width={width}
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
