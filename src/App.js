import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './views/home';
import Builder from './views/deck-builder';

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route
					exact
					path="/"
					render={({ history }) => <Home history={history}/>}
				/>

				<Route
					exact
					path="/decks"

				/>

				<Route
					exact
					path="/decks/new"
					render={({ history }) => (
						<Builder history={history} type="deck"/>
					)}
				/>

				<Route
					exact
					path="/collections"

				/>

				<Route
					exact
					path="/collections/new"
					render={({ history }) => (
						<Builder history={history} type="collection"/>
					)}
				/>
			</Switch>
		</BrowserRouter>
	);
}

export default App;
