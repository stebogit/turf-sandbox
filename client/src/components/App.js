import React, {Component, createRef} from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import Resizable from './Resizable';
import Loader from './Loader';
import Footer from './Footer';
import AppContext from '../context';
import BlockingMethods from './blockingMethods';
import withTurf from './withTurf';
import {GIST_FILENAME, url} from '../constants';

// you can style your results using simplestyle (https://github.com/mapbox/simplestyle-spec/tree/master/1.1.0)
const initialCode = `// simply return a valid GeoJSON and it will be rendered on the map!
`;

class App extends Component {
    state = {
        geojsonError: false,
        geojson: '',
        code: initialCode,
    };

    iframeRef = createRef();

    componentDidMount () {
        if (url.searchParams.has('gist')) {
            this.loadGist();
        }
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.props.turf !== prevProps.turf) {
            this.runCode(this.state.code);
        }
    }

    runCode = (code) => {
        // console.clear();
        const [geojson, geojsonError] = executeCode(this.props.turf + ' ' + code);
        this.setState({
            geojson,
            geojsonError,
            code
        });
    };

    loadGist = async () => {
        const gist = url.searchParams.get('gist');
        try {
            const res = await fetch(`https://api.github.com/gists/${gist}`).then(r => r.json());
            const code = res.files[GIST_FILENAME].content;
            this.setState({code});
        } catch (e) {
            console.error(e);
            alert('Sorry, an error occurred loading your Gist.');
        }
    };

    // we need to disable mouse events on the iframe otherwise we won't receive the `onmouseup` event back
    disableMouseEvent = () => this.iframeRef.current.style.pointerEvents = 'none';
    enableMouseEvent = () => this.iframeRef.current.style.pointerEvents = 'auto';

    render () {
        const {turfVersion, turfLoading} = this.props;
        const {code, geojsonError, geojson} = this.state;

        return (
            <AppContext.Provider value={{code}}>
                <Header/>
                <main>
                    <Resizable onBeforeResize={this.disableMouseEvent} onAfterResize={this.enableMouseEvent} leftElement={
                        <Editor code={code} onChange={this.runCode}/>} rightElement={
                        <Output geojson={geojson} error={geojsonError} ref={this.iframeRef}/>}
                    />
                </main>
                <Footer version={turfVersion}/>
                <Loader show={turfLoading} size="lg"/>
            </AppContext.Provider>
        );
    }
}

function executeCode (code) {
    let result = null;
    let error = null;
    BlockingMethods.kill();
    try {
        /* eslint-disable-next-line no-new-func */
        result = (new Function(code))();
    } catch (e) {
        error = 'Invalid GeoJSON output';
        console.error(e);
    }
    BlockingMethods.restore();
    return [result, error];
}

export default withTurf(App);
