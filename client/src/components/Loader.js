import React from 'react';

function Loader ({show, size}) {
    let multiplier = size === 'lg' ? 5 : (size === 'md' ? 3 : 2);
    if (!show) return null;
    return <div className="overlay"><i className={`spinner far fa-compass fa-spin fa-${multiplier}x`}/></div>;
}

export default Loader;
