import React, {createContext, useEffect, useState} from 'react';

export const AppContext = createContext();

const NPM_URL = 'https://npmcdn.com/@turf/turf@6.2.0-alpha.1/dist/turf.min.js';


const initialCode = `// simply return a valid GeoJSON and it will be rendered on the map!
// you can style your results using simplestyle (https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0)

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
  'marker-symbol': 'B',
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
        // import Turf
        fetch(NPM_URL, {redirect: 'follow',})
            .then(async (response) => {
                if (response.status !== 200) {
                    throw new Error();
                }

                const version = (new URL(response.url)).pathname.split('/@turf/turf@')[1].split('/')[0];
                const turf = await response.text();
                setState(s => ({...s, turf, version, loading: false}));
            })
            .catch((e) => {
                console.error(e);
                setState(s => ({...s, error: 'Sorry, an error occurred.', loading: false}));
            });
    }, []);

    return (
        <AppContext.Provider value={{...state, setState}}>
            {children}
        </AppContext.Provider>
    );
}
