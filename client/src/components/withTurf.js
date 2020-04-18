import React, {useEffect, useState} from 'react';

export default function withTurf (WrappedComponent) {
    return function () {
        const [state, setState] = useState({
            version: '',
            turf: '',
            turfLoading: true,
        });

        useEffect(() => {
            async function fetchData () {
                const [turf, npmData] = await Promise.all([
                    // import Turf and package info
                    fetch('https://npmcdn.com/@turf/turf', {redirect: 'follow'}).then(r => r.text()),
                    fetch('https://api.npms.io/v2/package/%40turf%2Fturf').then(r => r.json()),
                ]);

                setState(s => ({
                    ...s,
                    turf,
                    version: npmData.collected.metadata.version,
                    turfLoading: false
                }));
            }

            fetchData().catch(e => {
                console.error(e);
                alert('Sorry, an error occurred loading Turf.');
                setState(s => ({...s, turfLoading: false,}));
            });
        }, []);

        return <WrappedComponent {...state}/>;
    };
}
