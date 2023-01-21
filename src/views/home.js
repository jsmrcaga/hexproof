import React from 'react';

import { Input } from '../components/card-input';
import Header from '../components/header';
import CollectionCard from '../components/collection-card';

import { useInitLibrary } from '../hooks/useCollection';


function NewCollection({ name, link, history }) {
	return (
		<div className="dex-collection-card" onClick={() => history.push(`${link}/new`)}>
			<div className="dex-collection-card-image">
				<img alt="Hexproof logo" src="/hexproof.png"/>
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

const filter = (what=[], value='') => {
	if(!value || value === '') {
		return what;
	}

	return what.filter(({ name }) => {
		let reg = new RegExp(value, 'gi');
		return reg.test(name);
	});
};

export default function Home({ history }) {
	const [ library, setLibrary ] = React.useState({ decks: [], collections: [] });
	const [ deckFilter, setDeckFilter ] = React.useState(null);
	const [ collectionsFilter, setCollectionFilter ] = React.useState(null);

	useInitLibrary(library => {
		setLibrary(library);
	});

	const filteredDecks = React.useMemo(() => {
		return filter(Object.values(library.decks), deckFilter);
	}, [ library, deckFilter ]);

	const filteredCollections = React.useMemo(() => {
		return filter(Object.values(library.collections), collectionsFilter);
	}, [ library, collectionsFilter ]);

	return (
		<React.Fragment>
			<Header name="Hexproof" history={history} decks={library?.decks.length} collections={library?.collections.length}/>
			<div className="dex-container">
				<CardsContainer	
					title="Decks"
					link="/decks"
					collections={filteredDecks}
					history={history}
					onChange={value => setDeckFilter(value)}
				/>
				<CardsContainer	
					title="Collections"
					link="/collections"
					collections={filteredCollections}
					history={history}
					onChange={value => setCollectionFilter(value)}
				/>
			</div>
		</React.Fragment>
	);
}
