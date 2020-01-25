import React from 'react';

import { useBlockstack } from '../utils/useBlockstack';

import { Input } from '../components/card-input';
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

function CardsContainer({ title, link, collections=[], history, onChange=()=>{} }) {
	const cards = collections.sort((a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)).map(collection => (
		<CollectionCard
			key={collection.id}
			name={collection.name}
			image={collection.image}
			format={collection.format}
			cards={collection.card_count}
			entity={collection.entity}
			onClick={() => history.push(`${link}/${collection.id}`)}
		/>
	));

	return (
		<div className="dex-collection-section">
			<div className="dex-collection-section-title">
				<span className="dex-collection-section-name">
					{`${title} /`}
				</span>
				<Input
					debounce={false}
					placeholder="Filter..."
					onChange={onChange}
					className="dex-collection-filter"
				/>
				{collections.length ? <span className="dex-collection-section-count">{collections.length} {title}</span> : null}
			</div>
			<div className="dex-collection-section-content">
				<NewCollection name={title} link={link} history={history}/>
				{cards}
			</div>
		</div>
	);
}

export default function Home({ history }) {
	const FILENAME = 'dex-collections.json';
	const [ loading, setLoading ] = React.useState(true);
	const [ collections, setCollections ] = React.useState({ decks: [], collections: [] });
	const [ decks, setDecks ] = React.useState([]);
	const [ cols, setCols ] = React.useState([]);

	const [ session, { getFile, putFile }] = useBlockstack();

	const filter = (what=[], value='') => {
		if(!value || value === '') {
			return what;
		}

		return what.filter(deck => {
			let reg = new RegExp(value, 'gi');
			return reg.test(deck.name);
		});
	};

	const filterDecks = React.useCallback(value => {
		return setDecks(filter(collections.decks, value));
	}, [ collections ]);

	const filterCollections = React.useCallback(value => {
		return setCols(filter(collections.collections, value));
	}, [ collections ]);

	React.useEffect(() => {
		getFile(FILENAME).then(json => {
			let collections = JSON.parse(json);
			setLoading(false);

			if(!collections) {
				// First time
				let main_uuid = Utils.UUID();
				collections = {
					decks: [],
					collections: [{
						name: 'Main Collection',
						cards: 0,
						id: main_uuid,
						image: MagicLogo
					}]
				};

				putFile(FILENAME, JSON.stringify(collections));
				putFile(main_uuid, JSON.stringify({
					...collections.collections[0],
					cards: []
				}));
			}

			setCollections(collections);
			setDecks(collections.decks);
			setCols(collections.collections);
		}).catch(e => {
			// Show notification ?
		});
	}, []);

	if(loading) {
		return <Loader/>
	}

	return (
		<React.Fragment>
			<Header name="Dex" history={history} decks={decks.length} collections={cols.length}/>
			<div className="dex-container">
				<CardsContainer	
					title="Decks"
					link="/decks"
					collections={decks}
					history={history}
					onChange={filterDecks}
				/>
				<CardsContainer	
					title="Collections"
					link="/collections"
					collections={cols}
					history={history}
					onChange={filterCollections}
				/>
			</div>
		</React.Fragment>
	);
}
