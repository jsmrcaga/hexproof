import React from 'react';

import { useBlockstack } from '../utils/useBlockstack';

import Header from '../components/header';
import CollectionCard from '../components/collection-card';
import Loader from '../components/loader';

import MagicLogo from '../images/magic-logo.png'

import Utils from '../utils/utils';

function NewCollection({ name, link, history }) {
	return (
		<div className="dex-collection-card" onClick={() => history.push(`${link}/new`)}>
			<div>
				<img src=""/>
			</div>
			<span>
				{`New ${name.slice(0, name.length - 1)}`}
			</span>
		</div>
	);
}

function CardsContainer({ title, link, collections=[], history }) {
	const cards = collections.map(collection => (
		<CollectionCard
			key={collection.id}
			name={collection.name}
			image={collection.image}
			format={collection.format}
			cards={collection.card_count}
			entity={collection.entity}
		/>
	));

	return (
		<div className="dex-collection-section">
			<div className="dex-collection-section-title">
				<span className="dex-collection-section-name">
					{`${title} /`}
				</span>
				<span className="dex-collection-view-all" onClick={() => history.push(link)}>View All</span>
				{collections.length ? <span className="dex-collection-section-count">{collections.length} {title}</span> : null}
			</div>
			<div className="dex-collection-section-content">
				{cards}
				<NewCollection name={title} link={link} history={history}/>
			</div>
		</div>
	);
}

export default function Home({ history }) {
	const FILENAME = 'dex-collections.json';
	const [ loading, setLoading ] = React.useState(true);
	const [ collections, setCollections ] = React.useState(null);

	const [ session, { getFile, putFile }] = useBlockstack();

	React.useEffect(() => {
		getFile(FILENAME).then(json => {
			let collections = JSON.parse(json);
			setLoading(false);

			if(!collections) {
				// First time
				collections = {
					decks: [],
					collections: [{
						name: 'Main Collection',
						cards: 0,
						id: Utils.UUID(),
						image: MagicLogo
					}]
				};

				putFile(FILENAME, JSON.stringify(collections));
			}

			setCollections(collections);
		}).catch(e => {
			// Show notification ?
		});
	}, []);

	if(loading) {
		return <Loader/>
	}

	return (
		<React.Fragment>
			<Header name="Dex" history={history}/>
			<div className="dex-container">
				<CardsContainer	
					title="Decks"
					link="/decks"
					collections={collections ? collections.decks : []}
					history={history}
				/>
				<CardsContainer	
					title="Collections"
					link="/collections"
					collections={collections ? collections.collections : []}
					history={history}
				/>
			</div>
		</React.Fragment>
	);
}
