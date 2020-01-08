import React from 'react';

import Scryfall from '../api/scryfall';
import ManaCost from './mana-cost';

import '../styles/inputs.css';

export function Input({ value=null, onChange=()=>{}, disabled=false, placeholder='', debounce=false, ...otherprops }) {
	const debounceTimeout = React.useRef(null);

	let props = {};

	// Control if needed only
	if(value !== null) {
		props.value = value;
	}

	const change = React.useCallback(event => {
		// If event does not persist, it will be lost on timeout
		event.persist();
		if(!event.target.value || event.target.value.length < 3) {
			return;
		}

		if(debounce) {
			if(debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			// Debounce 700ms by default, else debounce qtty
			return debounceTimeout.current = setTimeout(() => {
				onChange(event.target.value, event);
			}, debounce);
		}

		return onChange(event.target.value, event);
	}, [ onChange ]);

	return (
		<input
			type="text"
			className="dex-text-input"
			onChange={change}
			disabled={disabled}
			placeholder={placeholder} 
			{...otherprops}
		/>
	);
}

export function CardItem({ quantity=1, card=null, onQttyUpdated=()=>{} }) {
	const updateQtty = React.useCallback(({ target: { value }}) => {
		onQttyUpdated(card, +value);
	}, [ onQttyUpdated ]);

	return (
		<React.Fragment>
			<input type="number" onChange={updateQtty} value={quantity}/>
			<span> { card.name } </span>
			<ManaCost cost={card.mana_cost || card.card_faces[0].mana_cost}/>
		</React.Fragment>
	);
}

export default function CardInput({ card=null, onCardFound=()=>{}, onCardError=()=>{}, onQttyUpdated=()=>{}, onError=()=>{}, onCardRemoved=()=>{} }) {
	const [ error, setError ] = React.useState(null);
	
	const searchCard = React.useCallback((value, event) => {
		Scryfall.search({ name: value }).then(cards => {
			if(!cards.length) {
				onCardError();
			}

			onCardFound(cards[0]);
		}).catch(e => {
			console.error(e);
			onError(e);
		});
	}, [ onCardError, onCardFound, onError ]);
	
	const enter = React.useCallback((event) => {
		if(event.keyCode !== 13) {
			return;
		}

		const { target: { value }} = event;

		return searchCard(value, event);
	});

	if(card) {
		return (
			<div className="dex-card-input">
				<CardItem quantity={card.qtty} card={card} onQttyUpdated={onQttyUpdated} onCardRemoved={onCardRemoved}/>
			</div>
		);
	}

	return (
		<div className="dex-card-input">
			<Input
				debounce={700}
				onChange={searchCard}
				onKeyUp={enter}
				placeholder="Type the name of your card..."
			/>
		</div>
	);
}
