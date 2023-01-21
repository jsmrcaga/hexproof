import React from 'react';

import '../styles/mana-cost.css';

import { ManaMap } from './mana';

export function SingleManaCost({ cost=null }) {
	// parse and render svgs
	if(!cost) {
		return null;
	}

	// const cost_reg = /{(.{1}\/.{1}\/.{1})|(.{1}\/.{1})|(.{1})|(\d{1,2})}/g;
	const cost_reg = /{[^}]+}/g;

	let costs_match = cost.match(cost_reg);
	if(!costs_match) {
		return null;
	}

	let costs = costs_match.map(e => e.replace('{', '').replace('}', '').replace(/\//g,''));

	let images = costs.map((cost, i) => (
		<img key={i} className="cost" alt={cost} src={ManaMap[cost]}/>
	));

	return (
		<div className="dex-single-mana-cost">
			{ images }
		</div>
	);
}

export default function ManaCost({ cost=null }) {
	if(!cost) {
		return null;
	}

	const costs = cost.split('//').map(c => c.trim());
	const mana_costs = costs.map((c, i) => [<SingleManaCost key={i} cost={c}/>, <span>{'//'}</span>]).flat(2);

	// Remove last span
	mana_costs.splice(mana_costs.length - 1, 1);

	return (
		<div className="dex-mana-cost">
			{ mana_costs }
		</div>
	);
}
