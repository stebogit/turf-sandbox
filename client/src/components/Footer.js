import React, {useContext} from 'react';
import AppContext from '../context';

function Footer () {
    const {version} = useContext(AppContext);
    return (
        <footer>
            {version && <span className="version">Running Turf <strong>v{version}</strong></span>}
            <a href="https://github.com/stebogit/turf-sandbox" target="_blank" rel="noreferrer noopener">
                <i className="fab fa-github fa-lg" />
            </a>
        </footer>
    );
}

export default Footer;
