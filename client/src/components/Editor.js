import React, { useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/ext-language_tools' // for auto-completion

const defaultCode = `// simply return a valid GeoJSON and it will be rendered on the map!
return {
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [11.339607, 44.505626], [11.326990, 44.499382], [11.329479, 44.490382],
        [11.339693, 44.486402], [11.356258, 44.484443], [11.358060, 44.485729],
        [11.356172, 44.501035], [11.347761, 44.504280], [11.339607, 44.505626]
      ]
    ]
  }
}
`;

function Editor (props) {
    const [code, setCode] = useState(defaultCode);

    function onChange (newCode) {
        setCode(newCode);
        props.onChange(newCode);
    }

    return (
        <div className="editor-container">
            <AceEditor
                placeholder=""
                defaultValue={defaultCode}
                height="100%"
                width="100%"
                mode="javascript"
                theme="solarized_dark"
                debounceChangePeriod={1000}
                onChange={onChange}
                onLoad={() => props.onChange(defaultCode)}
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
