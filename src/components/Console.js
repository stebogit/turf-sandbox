import React, {useState, useEffect} from 'react';

function getConsoleCount(type) {
    return console.everything.filter(itm => itm.type === type).length;
}

function Console () {
    const [show, setShow] = useState(false);
    const [, updateState] = useState();

    const toggleConsole = () => setShow(!show);

    useEffect(() => {
        // https://stackoverflow.com/a/53215514/4530144
        const forceUpdate = () => updateState({});
        document.addEventListener('console-updated', forceUpdate);
        return () => document.removeEventListener('console-updated', forceUpdate);
    }, []);

    return (
        <div id="console">
            <div className="console-header">
                <span className="title" onClick={toggleConsole}>
                    <i className={`fas fa-terminal `}/> Console
                </span>

                <span className="icons" onClick={toggleConsole}>
                    <strong className="log">
                        <i className="fas fa-comment" /> {getConsoleCount('log')}
                    </strong>
                    <strong className="warn">
                        <i className="fas fa-exclamation-triangle"/> {getConsoleCount('warn')}
                    </strong>
                    <strong className="error">
                        <i className="fas fa-bomb"/> {getConsoleCount('error')}
                    </strong>
                </span>

                {!!console.everything.length &&
                <span className="clear-console" onClick={console.clear}>
                        <i className="far fa-trash-alt"/> clear
                    </span>}

                {show &&
                <span className="tools">
                    <span className="close-console" onClick={toggleConsole}>
                        <i className="fas fa-times"/>
                    </span>
                </span>}
            </div>

            {show &&
            <div className="console-output">
                <ul>
                    {console.everything.map((line, i) =>
                        <li key={i} className={line.type}>
                            {line.value.map((v, j) =>
                                <span key={j}>{v.toString()}</span>)}
                        </li>)}
                    {!console.everything.length &&
                        <li style={{borderBottom: 'none'}}><em>empty</em></li>}
                </ul>
            </div>}
        </div>
    );
}

export default Console;

// https://stackoverflow.com/a/55603620/4530144
export function initConsole () {
    if (console.everything === undefined) {
        console.everything = [];

        console.defaultLog = console.log.bind(console);
        console.log = function () {
            console.everything.push({
                'type': 'log',
                'datetime': Date().toLocaleString(),
                'value': Array.from(arguments)
            });
            console.defaultLog.apply(console, arguments);
            document.dispatchEvent(new CustomEvent('console-updated'));
        };

        console.defaultError = console.error.bind(console);
        console.error = function () {
            console.everything.push({
                'type': 'error',
                'datetime': Date().toLocaleString(),
                'value': Array.from(arguments)
            });
            console.defaultError.apply(console, arguments);
            document.dispatchEvent(new CustomEvent('console-updated'));
        };

        console.defaultWarn = console.warn.bind(console);
        console.warn = function () {
            console.everything.push({
                'type': 'warn',
                'datetime': Date().toLocaleString(),
                'value': Array.from(arguments)
            });
            console.defaultWarn.apply(console, arguments);
            document.dispatchEvent(new CustomEvent('console-updated'));
        };

        console.defaultClear = console.clear.bind(console);
        console.clear = function () {
            console.everything = [];
            console.defaultClear.apply(console, arguments);
            document.dispatchEvent(new CustomEvent('console-updated'));
        };
    }
}
