import React, { useEffect, useRef, useState } from 'react';

function Resizable ({ rightElement, leftElement, onBeforeResize, onAfterResize}) {
    const [width, setWidth] = useState(null);

    const container = useRef(null);
    const divider = useRef(null);

    useEffect(() => {
        // save ref value locally: see react-hooks/exhaustive-deps eslint rule
        const localDivider = divider.current;
        const localContainer = container.current;

        localDivider.addEventListener('mousedown', activate);

        function activate (e) {
            e.preventDefault();
            onBeforeResize();
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        }

        function resize (e) {
            setWidth(e.pageX - localContainer.getBoundingClientRect().left);
        }

        function stopResize () {
            window.removeEventListener('mousemove', resize);
            onAfterResize();
        }

        return function cleanup () {
            localDivider.removeEventListener('mousedown', activate);
            window.removeEventListener('mouseup', stopResize);
            window.removeEventListener('mousemove', resize);
        };
    }, [onBeforeResize, onAfterResize]);

    return (
        <>
            <div className="resizable" ref={container} style={{ width: width || '50%' }}>
                {React.cloneElement(leftElement, {width: `${width || '100%'}`})}
                <div className="divider" ref={divider}/>
            </div>
            <div className="iframe-container" style={{ width: width ? `calc(100% - ${width}px)` : '50%'}}>
                {rightElement}
            </div>
        </>
    );
}

export default Resizable;
