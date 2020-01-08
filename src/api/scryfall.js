import fetcher from '../utils/fetcher';

class Scryfall {
	querybuilder({ name }) {
		return {
			q: name
		};
	}

	search(params) {
		return fetcher.request({
			query: this.querybuilder(params),
			endpoint: 'https://api.scryfall.com',
			path: '/cards/search',
		}).then(res => {
			return res.data;
		}).catch(e => {
			console.error(e);
		});
	}
}

const scryfall = new Scryfall();
export default scryfall;
