import * as Objects from './objects';

import { RouterState, connectRouter } from 'connected-react-router';
import { all, fork } from 'redux-saga/effects';
import { applyMiddleware, createStore } from 'redux';

import { History } from 'history';
import { combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';

export interface ApplicationState {
	router?: RouterState;

	objects: Objects.ObjectsState;
}

export const createRootReducer = (history: History) => combineReducers<ApplicationState>({
	router: connectRouter(history),

	objects: Objects.objectsReducers,
});

export function* rootSaga() {
	yield all([
		fork(Objects.objectsSaga),
	]);
}

export const configureStore = (history: History) => {
	const composeEnhancers = composeWithDevTools({});
	const sagaMiddleware = createSagaMiddleware();

	const initialState: ApplicationState = {
		objects: Objects.initialObjectsState,
	};

	// TODO: add real AWS client to context
	const context = {};
	const store = createStore(
		createRootReducer(history),
		initialState,
		composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history))),
	);

	sagaMiddleware.setContext(context);
	sagaMiddleware.run(rootSaga);

	return store;
}
