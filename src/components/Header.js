import React from 'react';
import User from './User';
import {url} from '../constants';
import {Button} from 'reactstrap';

function Header () {
    const withGist = url.searchParams.has('gist');

    const reset = () => {
        localStorage.removeItem('gist');
        url.searchParams.delete('gist');
        window.location.href = url.origin + url.search;
    };

    return (
        <header>
            <div className="logo">
                <h1>
                    <span>TURF</span><small>sandbox</small>{' '}
                    <a href="https://github.com/stebogit/turf-sandbox" target="_blank" rel="noreferrer noopener">
                        <i className="fab fa-github fa-fw"/>
                    </a>
                </h1>
            </div>
            <div className="tools">
                {withGist &&
                    <Button color="link" className="login" title="Remove gist" onClick={reset}>
                        <i className="far fa-trash-alt"/> Clear
                    </Button>}
                <User />
            </div>
        </header>
    );
}

export default Header;
