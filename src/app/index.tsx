import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import { configureStore } from './store';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();
const store = configureStore(history);

// Render to the DOM
ReactDOM.render(
	<Provider store={store}>
		<Routes history={history} />
	</Provider>,
	document.getElementById('root')
);
