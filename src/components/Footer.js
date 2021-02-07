import React from 'react';

function Footer ({version}) {
    return (
        <footer>
            {version &&
            <span className="version">
                Running{' '}
                <a href="https://github.com/Turfjs/turf" target="_blank" rel="noreferrer noopener">
                    Turf <strong>v{version}</strong> <i className="fas fa-external-link-alt" />
                </a>
            </span>}
        </footer>
    );
}

export default Footer;
