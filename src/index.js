import React from 'react';
import {createRoot} from 'react-dom/client';
import './index.scss';
import App from './components/App';
import {initConsole} from './components/Console';
import * as serviceWorker from './serviceWorker';

initConsole();

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
