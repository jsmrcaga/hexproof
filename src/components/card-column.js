import React from 'react';

import IconExport from '../images/icon-export.png';
import { CARD_TYPES } from '../api/scryfall';

import { Input } from './card-input';

import CardInput from './card-input';

import '../styles/card-column.css';

function DroppableCard({ children, onCardDropped=()=>{} }) {
	const [overlay, showOverlay] = React.useState(false);
	const dragOver = React.useCallback(event => {
		event.nativeEvent.preventDefault();
		showOverlay(true);
	}, []);

	const dragOut = React.useCallback(event => {
		event.nativeEvent.preventDefault();
		showOverlay(false);
	}, []);

	const drop = React.useCallback((event) => {
		event.persist();
		let card = JSON.parse(event.dataTransfer.getData('card'));
		return onCardDropped(card, event);
	}, [ onCardDropped ]);

	return (
		<div className="dex-droppable-card" onDragOver={dragOver} onDrop={drop}>
			<div className={`dex-drop-here ${overlay ? 'active' : ''}`} onDragLeave={dragOut} onDrop={dragOut}>
				<img src={IconExport}/>
			</div>
			{ children }
		</div>
	);
}

export function TypeCounter({ cards }) {
	let types = [];
	for(let _type of CARD_TYPES) {
		let typed_cards = cards.filter(({ type_line }) => {
			let reg = new RegExp(_type.description, 'gi');
			return reg.test(type_line);
		});

		types.push({
			symbol: _type.symbol,
			description: _type.description,
			count: typed_cards.reduce((sum, { qtty }) => sum + qtty, 0)
		});
	}

	types = types.map(({ symbol, count, description }) => (
		<div className="dex-type-count-count" key={description}>
			<img src={symbol} alt={description}/>
			<span>{count}</span>
		</div>
	));

	return (
		<div className="dex-type-count">
			{types}
		</div>
	);
}

export default function CardColumn({ filter=false, types=false, title='', showCardsQtty=true, onCardAdded=()=>{}, onCardRemoved=()=>{}, sort=false, cards=[], setCards, danger=false }) {
	const [ filteredCards, setFilteredCards ] = React.useState(cards);

	if(sort) {	
		cards.sort((a, b) => a < b ? 1 : (a > b ? -1 : 0));
	}

	const _filter = React.useCallback((value) => {
		if(!value) {
			return setFilteredCards(cards);
		}

		let newCards = cards.filter(({ name }) => {
			let reg = new RegExp(value, 'gi');
			return reg.test(name);
		});

		setFilteredCards(newCards);
	}, [ cards ]);

	// Filter new cards
	React.useEffect(() => {
		_filter();
	}, [ cards ]);

	const addCard = React.useCallback((card, qtty=false) => {
		let newCards = [...cards];
		let exists = newCards.find(c => c.id === card.id);
		if(exists) {
			exists.qtty = qtty ? qtty : exists.qtty + 1;
		} else {
			card.qtty = qtty ? qtty : 1;
			newCards.push(card);
		}

		setCards(newCards);
	}, [ cards, setCards ]);

	const removeCard = React.useCallback(card => {
		let newCards = [...cards];
		let index = newCards.findIndex(c => c.id === card.id);
		if(index === -1) {
			return; //wtf?
		}

		let [deleted_card] = newCards.splice(index, 1);
		card.qtty = 0;
		setCards(newCards);
	}, [ cards, setCards ])

	const updateQtty = React.useCallback((card, qtty) => {
		let newCards = [...cards];
		let exists = newCards.find(c => c.id === card.id);
		if(!exists) {
			return; // wtf?
		}

		exists.qtty = qtty;
		setCards(newCards);
	}, [ cards ]);

	const cardDropped = React.useCallback((card, event) => {
		let qtty = false;
		if(event.shiftKey) {
			qtty = 4;
		}

		return addCard(card, qtty);
	}, [ addCard ]);

	const cardInputs = filteredCards.sort((a, b) => a < b ? 1 : ( a > b ? -1 : 0 )).map(card => {
		return <CardInput danger={danger} key={card.id} card={card} onQttyUpdated={updateQtty} onCardRemoved={removeCard}/>
	});

	const cardqtty = cards.reduce((sum, card) => sum + (card.qtty ? card.qtty : 1), 0);

	return (
		<div className="dex-card-column">
			{
				filter &&
				<Input placeholder="Filter..." onChange={_filter}/>
			}
			{
				types &&
				<TypeCounter cards={cards}/>
			}
			<DroppableCard onCardDropped={cardDropped}>
				<div className="dex-card-column-title">
					<span className="title">{ title } /</span>
					{showCardsQtty && <span className="card-count">{ cardqtty } cards</span>}
				</div>
				{cards.length > 5 && <CardInput onCardFound={addCard} />}
				<div className="dex-column">
					{ cardInputs }
				</div>
				<CardInput onCardFound={addCard} />
			</DroppableCard>
		</div>
	);
}
