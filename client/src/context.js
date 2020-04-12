import React, {createContext, useEffect, useState} from 'react';
import {GIST_FILENAME, url} from './constants';

export const AppContext = createContext();

// you can style your results using simplestyle (https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0)
const initialCode = `// simply return a valid GeoJSON and it will be rendered on the map!

const poly = turf.polygon([[
  [11.339607, 44.505626], [11.326990, 44.499382], [11.329479, 44.490382],
  [11.339693, 44.486402], [11.356258, 44.484443], [11.358060, 44.485729],
  [11.356172, 44.501035], [11.347761, 44.504280], [11.339607, 44.505626]
]], {
  stroke: '#F00',
  fill: '#F00',
  'fill-opacity': 0.3,
});

const point = turf.point([11.342, 44.495], {
  'marker-color': '#F00',
  'marker-symbol': 'bus',
});

return turf.featureCollection([poly, point]);
`;

const initialState = {
    geojson: null,
    loading: true,
    error: '',
    version: '',
    turf: '',
    code: initialCode,
};

export function AppContextProvider ({children}) {
    const [state, setState] = useState(initialState);

    useEffect(() => {
        async function fetchData () {
            const [turf, npmData] = await Promise.all([
                // import Turf and package info
                fetch('https://npmcdn.com/@turf/turf', {redirect: 'follow'}).then(r => r.text()),
                fetch('https://api.npms.io/v2/package/%40turf%2Fturf').then(r => r.json()),
            ]);

            const version = npmData.collected.metadata.version;

            const state = {turf, version, loading: false};

            if (url.searchParams.has('gist')) {
                // import Gist
                const gist = url.searchParams.get('gist');
                const res = await fetch(`https://api.github.com/gists/${gist}`).then(r => r.json());
                state.code = res.files[GIST_FILENAME].content;
            }

            setState(s => ({...s, ...state}));
        }

        try {
            fetchData();
        } catch (e) {
            console.error(e);
            setState(s => ({...s, error: 'Sorry, an error occurred.', loading: false}));
        }
    }, []);

    return (
        <AppContext.Provider value={{...state, setState}}>
            {children}
        </AppContext.Provider>
    );
}
