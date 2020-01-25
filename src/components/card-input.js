import React from 'react';

import Scryfall from '../api/scryfall';
import ManaCost from './mana-cost';
import CardPreview from './card-preview';

import '../styles/inputs.css';

export function Input({ value=null, onChangeImmediate=()=>{}, onChange=()=>{}, disabled=false, placeholder='', debounce=false, className='', ...otherprops }) {
	const debounceTimeout = React.useRef(null);

	let props = {};

	// Control if needed only
	if(value !== null) {
		props.value = value;
	}

	const change = React.useCallback(event => {
		// If event does not persist, it will be lost on timeout
		event.persist();
		let { target: { value }} = event;

		onChangeImmediate(value);

		if(debounce) {
			if(debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			// Debounce 700ms by default, else debounce qtty
			return debounceTimeout.current = setTimeout(() => {
				onChange(value, event);
			}, debounce);
		}

		return onChange(value, event);
	}, [ onChange ]);

	return (
		<input
			type="text"
			className={`dex-text-input ${className}`}
			onChange={change}
			disabled={disabled}
			placeholder={placeholder}
			{...props}
			{...otherprops}
		/>
	);
}

export function CardItem({ card=null, onQttyUpdated=()=>{}, danger=false }) {
	const updateQtty = React.useCallback(({ target: { value }}) => {
		onQttyUpdated(card, +value);
	}, [ onQttyUpdated ]);

	return (
		<React.Fragment>
			<input type="number" min="1" className={card.qtty > 4 && danger ? 'danger' : ''} onChange={updateQtty} value={card.qtty}/>
			<span> { card.name } </span>
			<ManaCost cost={card.mana_cost}/>
		</React.Fragment>
	);
}

export default function CardInput({ card=null, onCardFound=()=>{}, onCardError=()=>{}, onQttyUpdated=()=>{}, onError=()=>{}, onCardRemoved=()=>{} }) {
	const [ error, setError ] = React.useState(null);
	const [ preview, showPreview ] = React.useState(false);
	const [ value, setValue ] = React.useState('');

	const searchCard = React.useCallback((value, event) => {
		if(!value) {
			return;
		}

		Scryfall.search(value).then(card => {
			if(!card) {
				onCardError();
			}

			setValue('');
			onCardFound(card);
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

	const remove = React.useCallback((event) => {
		if(!(event.ctrlKey || event.metaKey) || !card) {
			return;
		}

		return onCardRemoved(card);
	}, [onCardRemoved])

	if(card) {
		return (
			<div className="dex-card-input" onClick={remove} onMouseOver={() => !preview && showPreview(true)} onMouseLeave={() => preview && showPreview(false)}>
				{preview && <CardPreview card={card}/>}
				<CardItem quantity={card.qtty} card={card} onQttyUpdated={onQttyUpdated}/>
			</div>
		);
	}

	return (
		<div className="dex-card-input">
			<Input
				debounce={700}
				value={value}
				onChangeImmediate={setValue}
				onChange={searchCard}
				onKeyUp={enter}
				placeholder="Type the name of your card..."
			/>
		</div>
	);
}
