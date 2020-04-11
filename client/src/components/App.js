import React, {useRef, useCallback, useContext} from 'react';
import Editor from './Editor';
import Output from './Output';
import Header from './Header';
import Resizable from './Resizable';
import Loader from './Loader';
import Footer from './Footer';
import {AppContext, AppContextProvider} from '../context';

function Container () {
    const {loading} = useContext(AppContext);
    const iframe = useRef(null);

    // we need to disable mouse events on the iframe otherwise we won't receive the `onmouseup` event back
    const disableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'none', []);
    const enableMouseEvent = useCallback(() => iframe.current.style.pointerEvents = 'auto', []);

    return (
        <AppContextProvider>
            <Header />
            <main>
                <Resizable onBeforeResize={disableMouseEvent} onAfterResize={enableMouseEvent} leftElement={
                    <Editor />} rightElement={
                    <Output ref={iframe}/>}
                />
            </main>
            <Footer />
            <Loader show={loading} size="lg"/>
        </AppContextProvider>
    );
}

export default function App() {
    return (
        <AppContextProvider>
            <Container />
        </AppContextProvider>
    );
}
