import * as Client from './client';
import * as Objects from './objects';

import { AWSClient, AWSConfig } from '@lib/client';
import { RouterState, connectRouter } from 'connected-react-router';
import { all, fork } from 'redux-saga/effects';
import { applyMiddleware, createStore } from 'redux';

import { History } from 'history';
import LocalStorage from '@lib/local-storage';
import { combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { credentialsKey } from '../constants/local-storage';
import { routerMiddleware } from 'connected-react-router';

export interface ApplicationState {
	router?: RouterState;

	objects: Objects.ObjectsState;
	client: Client.ClientState;
}

export const createRootReducer = (history: History) => combineReducers<ApplicationState>({
	router: connectRouter(history),

	objects: Objects.objectsReducers,
	client: Client.clientReducers,
});

export function* rootSaga() {
	yield all([
		fork(Objects.objectsSaga),
		fork(Client.clientSaga),
	]);
}

export const configureStore = (history: History) => {
	const composeEnhancers = composeWithDevTools({});
	const sagaMiddleware = createSagaMiddleware();

	const initialState: ApplicationState = {
		objects: Objects.initialState,
		client: Client.initialState,
	};

	const localStorage = new LocalStorage<AWSConfig>(credentialsKey);
	const context = {
		aws: new AWSClient(localStorage),
	};

	const store = createStore(
		createRootReducer(history),
		initialState,
		composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history))),
	);

	sagaMiddleware.setContext(context);
	sagaMiddleware.run(rootSaga);

	store.dispatch(Client.clientActions.init.request(void 0));

	return store;
}
