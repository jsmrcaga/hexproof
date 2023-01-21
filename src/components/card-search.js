import React from 'react';

import Scryfall from '../api/scryfall';
import InfinityScroller from './infinity-scroll';
import { Preview } from './card-preview';

import '../styles/card-search.css';

const DEFAULT_FILTER ='(c=w or c=b) f=standard';

function LoaderCard() {
	return (
		<div className="dex-card-image">
			<div className="animation-load dex-card-loader"/>
		</div>
	);
}

function LoadingCards() {
	let cards = [];
	for(let i =0; i < 5; i++) {
		cards.push(<LoaderCard key={i}/>);
	}

	return cards;
}

function Card({ card, onClick=()=>{} }) {
	const drag = React.useCallback((event) => {
		event.nativeEvent.dataTransfer.setData('card', JSON.stringify(card));
	}, [ card ]);

	const click = React.useCallback(() => {
		return onClick(card);
	}, [onClick, card]);

	return (
		<div className="dex-card-image" onDragStart={drag} onClick={click}>
			<img src={card.image_uris ? card.image_uris.large : null} alt={card.name}/>
		</div>
	);
}

export default function CardSearch({ onCardClicked=()=>{}, query=DEFAULT_FILTER, mana }) {
	const page = React.useRef(1);
	const [ allCards, setAllCards ] = React.useState();
	const [ currentCards, setCards ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(true);

	const filter = React.useCallback((cards) => {
		if(!mana || !mana.length) {
			return setCards(cards);
		}

		let filtered = cards.filter(card => {
			for(let color of mana) {
				if(card.colors.includes(color)) {
					return true;
				}
			}
			return false;
		});
		setCards(filtered);
	}, [ mana ]);

	const search = React.useCallback((add=false) => {
		let currentPage = add ? page.current : 1;
		setLoading(true);
		Scryfall.query(query, { page: currentPage }).then(cards => {
			setAllCards(currentCards => {
				const newCards = add ? [...currentCards, ...cards] : cards;
				filter(newCards);
				return newCards;
			});

			if(add) {
				page.current++;
			}

		}).catch(e => {
			console.error(e);

		}).finally(() => {
			setLoading(false);
		});
	}, [ query, page, filter ]);

	const addSearch = React.useCallback(() => {
		return search(true);
	}, [ search ])

	React.useEffect(() => {
		setAllCards([]);
		setCards([]);
		search();
	}, [search]);

	React.useEffect(() => {
		if(!allCards) {
			return;
		}
		filter(allCards);
	}, [ mana, allCards, filter ]);

	let images = currentCards.map(card => {
		return (
			<Preview card={card}>
				<Card key={card.id} card={card} onClick={onCardClicked}/>
			</Preview>
		);
	});

	return (
		<InfinityScroller onEnd={addSearch}>
			<div className="dex-card-search">
				{ !images.length && !loading && 'Your search returned no results.' }
				{ images }
				{ loading && <LoadingCards/>}
			</div>
		</InfinityScroller>
	);
}
