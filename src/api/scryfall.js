import fetcher from '../utils/fetcher';

import SymbolInstant from '../images/symbol-instant.svg';
import SymbolCreature from '../images/symbol-creature.svg';
import SymbolEnchantment from '../images/symbol-enchantment.svg';
import SymbolPlaneswalker from '../images/symbol-planeswalker.svg';
import SymbolLand from '../images/symbol-land.svg';
import SymbolSorcery from '../images/symbol-sorcery.svg';
import SymbolArtifact from '../images/symbol-artifact.svg';

import Card from '../models/card';

const ENDPOINT = 'https://api.scryfall.com';

export const CARD_TYPES = [
	{
		reg: new RegExp('Artifact', 'gi'),
		description: 'Artifact',
		color: '#75DDDD',
		symbol: SymbolArtifact
	},
	{
		reg: new RegExp('Creature', 'gi'),
		description: 'Creature',
		color: '#9368B7',
		symbol: SymbolCreature
	},
	{
		reg: new RegExp('Enchantment', 'gi'),
		description: 'Enchantment',
		color: '#FFCF9C',
		symbol: SymbolEnchantment
	},
	{
		reg: new RegExp('Instant', 'gi'),
		description: 'Instant',
		color: '#CA054D',
		symbol: SymbolInstant
	},
	{
		reg: new RegExp('Sorcery', 'gi'),
		description: 'Sorcery',
		color: '#8075FF',
		symbol: SymbolSorcery
	},
	{
		reg: new RegExp('Land', 'gi'),
		description: 'Land',
		color: '#FFEE93',
		symbol: SymbolLand
	},
	{
		reg: new RegExp('Planeswalker', 'gi'),
		description: 'Planeswalker',
		color: '#F4F7F5',
		symbol: SymbolPlaneswalker
	},
];

export const CARD_COLORS = [
	{
		symbol: 'W',
		description: 'White',
		color: '#FFF'
	},
	{
		symbol: 'R',
		description: 'Red',
		color: '#FF0000'
	},
	{
		symbol: 'U',
		description: 'Blue',
		color: '#0000FF'
	},
	{
		symbol: 'G',
		description: 'Green',
		color: '#00FF00'
	},
	{
		symbol: 'B',
		description: 'Black',
		color: '#000'
	},
	{
		symbol: 'S',
		description: 'Snow',
		color: '#00EEFF'
	},
	{
		symbol: 'C',
		description: 'Colorless',
		color: '#EEE'
	},
];

class Scryfall {
	querybuilder({ query, page=1 }) {
		return {
			page,
			q: query
		};
	}

	typify(cards) {
		const _type = (card) => {
			const types = [];
			for(let type of CARD_TYPES) {
				// reset regex
				type.reg.lastIndex = 0;
				if(type.reg.test(card.type_line)) {
					types.push(type.description);
				}
			}

			card.types = types;
			return new Card(card);
		};

		if(!Array.isArray(cards)) {
			return _type(cards);
		}

		return cards.map(card => _type(card));
	}

	query(query, { page }) {
		return fetcher.request({
			query: this.querybuilder({ query, page }),
			endpoint: ENDPOINT,
			path: '/cards/search',
		}).then(res => {
			// Filter colors later
			return this.typify(res.data);
		}).catch(e => {
			console.error(e);
			throw e;
		});
	}

	search(name) {
		return fetcher.request({
			method: 'GET',
			endpoint: ENDPOINT,
			path: '/cards/named',
			query: {
				fuzzy: name
			}
		}).then(res => {
			return this.typify(res);
		}).catch(e => {
			console.error(e);
			throw e;
		});
	}

	catalog() {

	}
}

const scryfall = new Scryfall();
export default scryfall;
