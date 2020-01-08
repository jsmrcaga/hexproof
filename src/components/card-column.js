import React from 'react';

import CardInput from './card-input';

export default function CardColumn({ title='', showCardsQtty=true, onCardAdded=()=>{}, onCardRemoved=()=>{}, sort=false }) {
	const [ cards, setCards ] = React.useState([]);

	if(sort) {	
		cards.sort((a, b) => a < b ? 1 : (a > b ? -1 : 0));
	}

	const addCard = React.useCallback(card => {
		let newCards = [...cards];
		let exists = newCards.find(c => c.id === card.id);
		if(exists) {
			exists.qtty++;
		} else {
			card.qtty = 1;
			newCards.push(card);
		}

		setCards(newCards);
	}, [ cards ]);

	const removeCard = React.useCallback(card => {
		let newCards = [...cards];
		let index = newCards.findIndex(c => c.id === card.id);
		if(index === -1) {
			return; //wtf?
		}

		newCards.splice(index, 1);
		setCards(newCards);
	}, [ cards ])

	const updateQtty = React.useCallback((card, qtty) => {
		let newCards = [...cards];
		let exists = newCards.find(c => c.id === card.id);
		if(!exists) {
			return; // wtf?
		}

		exists.qtty = qtty;
		setCards(newCards);
	}, [ cards ]);

	const cardInputs = cards.map(card => {
		return <CardInput key={card.id} card={card} onQttyUpdated={updateQtty} onCardRemoved={removeCard}/>
	});

	const cardqtty = cards.reduce((sum, card) => sum + (card.qtty ? card.qtty : 1), 0);

	return (
		<div className="dex-card-column">
			<div className="dex-card-column-title">
				<span className="title">{ title } /</span>
				{showCardsQtty && <span className="card-count">{ cardqtty } cards</span>}
			</div>
			{ cardInputs }
			<CardInput onCardFound={addCard} />
		</div>
	);
}
