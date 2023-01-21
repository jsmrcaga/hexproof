import React from 'react';

import { CARD_TYPES, CARD_COLORS } from '../api/scryfall';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';

import '../styles/charts.css';
// Mana Curves
	// Bar chart (column by card type)	// Curve chart
	
// Color stats
	// Curve by Color 	// Color bars

// Card types
	// Types Pie   // Rarity pie

function get_colors(cost) {
	if(!cost) {
		return [];
	}

	const cost_reg = /{(.{1}\/.{1})|(.{1})}/g;

	let costs = cost.match(cost_reg).map(c => c.replace('{', '').replace('}', ''));
	costs = costs.map(c => c.indexOf('/') ? c.split('/') : c).flat(2);
	costs = costs.filter(c => {
		let ignore = /[0-9XYZP]+/g;
		return !ignore.test(c);
	});
	costs = costs.reduce((res, c) => {
		res[c] = res[c] ? res[c] + 1 : 1;
		return res;
	}, {});

	return costs;
};

function ManaCurves({ cards }) {
	const mana_counts_typed = [];
	const mana_counts = [];

	// Caclualte bar chart data, cards with multiple types are counted multiple times
	for(let card of cards) {
		console.log(card.name, card.cmc, card);
		// Typed count
		let typed_count = mana_counts_typed.find(c => c.cmc === card.cmc);
		if(!typed_count) {
			typed_count = {
				cmc: card.cmc,
			};
			mana_counts_typed.push(typed_count);
		}

		for(let _type of card.types) {
			typed_count[_type] = typed_count[_type] || 0;
			typed_count[_type] += card.qtty;
		}

		// Normal count
		let count = mana_counts.find(c => c.cmc === card.cmc);
		if(!count) {
			count = {
				cmc: card.cmc,
				count: card.qtty
			};
			mana_counts.push(count);
		} else {
			count.count += card.qtty;
		}
	}

	console.warn('TYPED COUNT', mana_counts_typed, mana_counts);

	// Add missing
	let max = [...cards].sort((a, b) => b.cmc - a.cmc)[0];
	max = max ? max.cmc : 0;
	for(let i = 0; i < max; i++) {
		let typed = mana_counts_typed.find(c => c.cmc === i);
		if(!typed) {
			mana_counts_typed.push({
				cmc: i
			});
		}

		let count = mana_counts.find(c => c.cmc === i);
		if(!count) {
			mana_counts.push({
				cmc: i,
				count: 0
			});
		}
	}

	mana_counts_typed.sort((a, b) => a.cmc - b.cmc);
	mana_counts.sort((a, b) => a.cmc - b.cmc);

	const typed_bars = CARD_TYPES.map(type => (
		<Bar dataKey={type.description} stackId="a" fill={type.color} />
	));

	return (
		<div className="dex-stat-section">
			<div className="dex-stat-section-title">Mana /</div>
			<div className="dex-stats-stats-section">
				<div className="dex-stat-stats">
					<BarChart 
						width={450}
						height={300}
						data={mana_counts_typed}
						margin={{
							top: 20, right: 30, left: 20, bottom: 5,
						}}
					>
						<XAxis dataKey="cmc" />
						<YAxis />
						<Tooltip />
						<Legend />
						{typed_bars}
					</BarChart>
				</div>
				<div className="dex-stat-stats">
					<LineChart
						width={450}
						height={300}
						data={mana_counts}
						margin={{
						  top: 5, right: 30, left: 20, bottom: 5,
						}}
					>
						<XAxis dataKey="cmc" />
						<YAxis />
						<Tooltip />
						<Legend />
						<Line type="monotone" dataKey="count" stroke="#82ca9d" />
					</LineChart>
				</div>
			</div>
		</div>
	);
}

function ColorStats({ cards }) {
	const color_count = CARD_COLORS.map(color => ({ ...color, count: 0 }));

	for(let card of cards) {
		let card_colors = get_colors(card.mana_cost);

		// Color count
		for(let [col, count] of Object.entries(card_colors)) {
			let color = color_count.find(c => c.symbol === col);
			color.count += count;
		}
	}

	color_count.sort((a, b) => a.count - b.count);

	let cells = color_count.map(({ color, description }) => (
		<Cell key={description} fill={color}/>
	));

	let color_percentages = color_count.filter(({ count }) => count);
	const color_sum = color_percentages.reduce((sum, { count }) => sum + count, 0);
	color_percentages = color_percentages.map(c => ({
		...c,
		p: Math.round((c.count / color_sum) * 10000) / 100
	}));

	const pie_cells = color_percentages.map(({ color, description }) => (
		<Cell key={description} fill={color}/>
	));


	// Color bars (simple count)
	return (
		<div className="dex-stat-section">
			<div className="dex-stat-section-title">Colors /</div>
			<div className="dex-stats-stats-section">
				<div className="dex-stat-stats">
					<BarChart 
						width={450}
						height={300}
						data={color_count}
						margin={{
							top: 20, right: 30, left: 20, bottom: 5,
						}}
					>
						<XAxis dataKey="description" />
						<YAxis />
						<Tooltip itemStyle={{ color: 'white' }}/>
						<Bar dataKey="count">
							{cells}
						</Bar>
					</BarChart>
				</div>
				<div className="dex-stat-stats">
					<PieChart width={400} height={400}>
						<Tooltip itemStyle={{ color: 'white' }} formatter={x => `${x}%`}/>
						<Pie data={color_percentages} dataKey="p" outerRadius={130} innerRadius={80} cx={260} cy={140} nameKey="description">
							{pie_cells}
						</Pie>
					</PieChart>
				</div>
			</div>
		</div>
	);
}

// function CardTypes({ cards }) {
// 	return (
// 		<div className="dex-stat-section">
// 			<div className="dex-stat-section-title">Types /</div>
// 			<div className="dex-stats-stats-section">
// 				<div className="dex-stat-stats">
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

export default function CardStats({ cards }) {
	return (
		<React.Fragment>
			<ManaCurves cards={cards}/>
			<ColorStats cards={cards}/>
			{/*<CardTypes cards={cards}/>*/}
		</React.Fragment>
	);
}
