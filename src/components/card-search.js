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

	const click = React.useCallback((e) => {
		if(e.altKey) {
			return window.open(
				`https://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${card.multiverse_ids[0]}`,
				'_blank',
				'noopener, noreferrer'
			);
		}

		if(e.metaKey) {
			return window.open(
				card.scryfall_uri,
				'_blank',
				'noopener, noreferrer'
			);
		}
		return onClick(card);
	}, [onClick, card]);

	return (
		<div className="dex-card-image" onDragStart={drag} onClick={click}>
			<img src={card.__image_uri} alt={card.name}/>
		</div>
	);
}

export default function CardSearch({ onCardClicked=()=>{}, query=DEFAULT_FILTER, mana }) {
	const page = React.useRef(1);
	const [ allCards, setAllCards ] = React.useState([]);
	const [ loading, setLoading ] = React.useState(true);

	const currentCards = React.useMemo(() => {
		if(!mana || !mana.length) {
			return allCards;
		}

		return allCards.filter(card => {
			for(let color of mana) {
				if(card.colors?.includes(color)) {
					return true;
				}
			}
			return false;
		});
	}, [allCards, mana]);

	const search = React.useCallback((add=false) => {
		let currentPage = add ? page.current : 1;
		setLoading(true);
		Scryfall.query(query, { page: currentPage }).then(cards => {
			setAllCards(currentCards => {
				return add ? [...currentCards, ...cards] : cards;
			});

			if(add) {
				page.current++;
			}

		}).catch(e => {
			console.error(e);

		}).finally(() => {
			setLoading(false);
		});
	}, [ query, page ]);

	const addSearch = React.useCallback(() => {
		return search(true);
	}, [ search ])

	React.useEffect(() => {
		setAllCards([]);
		search();
	}, [search]);

	const images = currentCards.map(card => {
		return (
			<Preview key={card.id} card={card}>
				<Card card={card} onClick={onCardClicked}/>
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
