import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from './views/home';
import Builder from './views/deck-builder';
import CollectionLoader from './components/collection-loader';
import Loader from './components/loader';
import ScryfallBanner from './components/scryfall-banner';

import { useBlockstack } from './utils/useBlockstack';

function App() {
	const [ session, { login } ] = useBlockstack();
	if(!session) {
		login();
		return <Loader/>;
	}

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
					path="/decks/new"
					render={({ history }) => (
						<Builder history={history} type="deck"/>
					)}
				/>

				<Route
					exact
					path="/decks/:id"
					render={({ history, match }) => (
						<CollectionLoader id={match.params.id}>
							<Builder history={history} id={match.params.id} type="deck"/>
						</CollectionLoader>
					)}
				/>

				<Route
					exact
					path="/collections/new"
					render={({ history }) => (
						<Builder history={history} type="collection"/>
					)}
				/>

				<Route
					exact
					path="/collections/:id"
					render={({ history, match }) => (
						<CollectionLoader id={match.params.id}>
							<Builder history={history} id={match.params.id} type="collection"/>
						</CollectionLoader>
					)}
				/>
			</Switch>
			<ScryfallBanner/>
		</BrowserRouter>
	);
}

export default App;
