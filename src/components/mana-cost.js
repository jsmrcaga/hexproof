import React from 'react';

import '../styles/mana-cost.css';

export default function ManaCost({ cost=null }) {
	// parse and render svgs
	if(!cost) {
		return null;
	}

	const cost_reg = /{.{1}}/g;

	let costs = cost.match(cost_reg).map(e => e.replace('{', '').replace('}', ''));

	let images = costs.map((cost, i) => (
		<img key={i} className="cost" alt={cost} src={`https://img.scryfall.com/symbology/${cost}.svg`}/>
	));

	return (
		<div className="dex-mana-cost">
			{ images }
		</div>
	);
}
