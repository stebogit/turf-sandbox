import React from 'react';

function Loader ({show}) {
    if (show) return <div className="overlay"><i className="far fa-compass fa-spin fa-5x"/></div>;
    return null;
}

export default Loader;
