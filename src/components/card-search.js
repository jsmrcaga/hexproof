import React from 'react';

import Scryfall from '../api/scryfall';

import '../styles/card-search.css';

function Card({ card }) {
	return (
		<div className="dex-card-image">
			<img src={card.image_uris.png}/>
		</div>
	);
}

export default function CardSearch({ query={ name: 'c:w set:ELD' } }) {
	const [ currentCards, setCards ] = React.useState([]);
	React.useEffect(() => {
		Scryfall.search(query).then(cards => {
			setCards(cards);
		}).catch(e => {
			console.error(e);
		});
	}, [ ]);

	let images = currentCards.map(card => <Card card={card}/>);

	return (
		<div className="dex-card-search">
			{ !images.length && 'Your search returned no results.' }
			{ images }
		</div>
	);
}
