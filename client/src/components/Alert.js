import React from 'react';

function Alert ({message}) {
    return (
        <div className="alert alert-danger" role="alert"
            style={{position: 'absolute', top: 20, right: 20}}>
            {message}
        </div>
    )
}

export default Alert;
