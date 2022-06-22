import React, {useEffect, useState} from 'react';
import {getAbbreviatedPackument} from 'query-registry';

export default function withTurf (WrappedComponent) {
    return function () {
        const [state, setState] = useState({
            turfVersion: '',
            turf: '',
            turfLoading: true,
        });

        useEffect(() => {
            async function fetchData () {
                const [turf, npmData] = await Promise.all([
                    // import Turf and package info
                    fetch('https://npmcdn.com/@turf/turf', {redirect: 'follow'}).then(r => r.text()),
                    getAbbreviatedPackument({name: '@turf/turf'}),
                ]);

                setState(s => ({
                    ...s,
                    turf,
                    turfVersion: npmData.distTags.latest,
                    turfLoading: false
                }));
            }

            try {
                fetchData();
            } catch (e) {
                console.error(e);
                alert('Sorry, an error occurred loading Turf.');
                setState(s => ({...s, turfLoading: false,}));
            }
        }, []);

        return <WrappedComponent {...state}/>;
    };
}
