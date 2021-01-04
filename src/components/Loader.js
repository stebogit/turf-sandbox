import React from 'react';

function Loader ({show, size}) {
    if (!show) return null;
    let multiplier = size === 'lg' ? 5 : (size === 'md' ? 3 : 2);
    return <div className="overlay"><i className={`spinner far fa-compass fa-spin fa-${multiplier}x`}/></div>;
}

export default Loader;
