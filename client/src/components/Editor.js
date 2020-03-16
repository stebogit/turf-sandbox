import React, { useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools' // for auto-completion

function Editor (props) {
    const [code, setCode] = useState();

    function onChange (newCode) {
        setCode(newCode);
        props.onChange(newCode);
    }
    return (
        <div className="" style={{ height: '100%', width: '50%' }}>
            <AceEditor
                placeholder=""
                defaultValue={`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          10, 50
        ]
      }
    }
  ]
}`}
                height="100%"
                width="auto"
                mode="javascript"
                theme="solarized_dark"
                debounceChangePeriod={500}
                onChange={onChange}
                value={code}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
            />
        </div>
    )
}

export default Editor;
