export default class Card {
	constructor({ id,
		oracle_id,
		multiverse_ids,
		tcgplayer_id,
		cmc,
		name,
		type_line,
		colors,
		mana_cost,
		card_faces,
		image_uris,
		types,
		qtty,
		prices,
		...rest
	}) {
		this.id = id;
		this.oracle_id = oracle_id;
		this.multiverse_ids = multiverse_ids;
		this.tcgplayer_id = tcgplayer_id;
		this.name = name;
		this.type_line = type_line;
		this.type = this.type_line;
		this.colors = colors;
		this.mana_cost = mana_cost || (card_faces ? card_faces[0].mana_cost : null);
		this.card_faces = card_faces;
		this.image_uris = image_uris;
		this.types = types;
		this.cmc = cmc;
		this.prices = prices;
		this.qtty = qtty;

		for(const [k, v] of Object.entries(rest)) {
			this[k] = v;
		}
	}

	get __image_uri() {
		return this.image_uris?.large || this.card_faces?.[0]?.image_uris?.large || null;
	}

	get __faces() {
		if(this.image_uris) {
			return [this.image_uris.large];
		}

		return this.card_faces.map(face => face.image_uris.large);
	}
}
