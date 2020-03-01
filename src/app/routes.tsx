import { History, LocationState } from 'history';
import { Route, Switch } from 'react-router-dom';

import App from './App';
import { ConnectedRouter } from 'connected-react-router';
import Home from './components/Home';
import React from 'react';

const Routes = (props: { history: History<LocationState> }) => (
	<ConnectedRouter history={props.history}>
		<App>
			<Switch>
				<Route
					component={Home}
					exact
					path={'/'}
				/>

				{/* <Route
					component={Browser}
					path={'/'}
				/> */}

				{/* 404 */}
				<Route component={() => <div>{'this page doesn\'t exists 🙈'}</div>}/>
			</Switch>
		</App>
	</ConnectedRouter>
);

export default Routes;
