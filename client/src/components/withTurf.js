import React, { useEffect, useState } from 'react';

const NPM_URL = 'https://npmcdn.com/@turf/turf@6.2.0-alpha.1/dist/turf.min.js';

export default function withTurf (WrappedComponent) {
    return function () {
        const [state, setState] = useState({
            error: '',
            version: '',
            turf: '',
            loading: true,
        });

        useEffect(() => {
            // import Turf
            fetch(NPM_URL, { redirect: 'follow', })
                .then(async (response) => {
                    if (response.status !== 200) {
                        return setState(s => ({ ...s, error: 'Sorry, an error occurred.', loading: false }));
                    }

                    const version = (new URL(response.url)).pathname.split('/@turf/turf@')[1].split('/')[0];
                    const turf = await response.text();
                    setState(s => ({...s, turf, version, loading: false}));
                })
                .catch(console.error);
        }, []);

        return <WrappedComponent {...state}/>;
    }
}
