import React from 'react';
import User from './User';

function Header () {
    return (
        <header>
            <div className="logo">
                <h1>
                    <a href="https://github.com/Turfjs/turf" target="_blank" rel="noreferrer noopener">
                        TURF
                    </a>
                    <small>sandbox</small>
                </h1>
            </div>
            <div className="tools">
                <User />
            </div>
        </header>
    );
}

export default Header;
