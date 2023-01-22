import React from 'react';
import MagicLogo from '../images/magic-logo.png';
import Utils from '../utils/utils';

import Card from '../models/card';

class GenericCollection {
	constructor({
		id,
		name='',
		entity=null,
		format='',
		image='',
	}) {
		this.id = id;
		this.name = name;
		this.entity = entity;
		this.format = format;
		this.image = image;

		// Will automatically be 'deck' or 'collection'
		this.type = this.constructor.name.toLowerCase();
	}

	get card_count() {
		throw new Error('card_count must be overriden');
	}

	toLibrary() {
		const { id, name, entity, format, image, type } = this;
		return {
			id,
			name,
			entity,
			format,
			image,
			type
		};
	}

	update() {
		throw new Error('update must be overriden');
	}
}

export class Deck extends GenericCollection {
	constructor({ main=[], sideboard=[], commander=null, ...rest }) {
		super(rest);
		
		this.main = main.map(card => new Card(card));
		this.sideboard = sideboard.map(card => new Card(card));
		this.commander = commander ? new Card(commander) : null;
	}

	get card_count() {
		return this.main.length + this.sideboard.length;
	}

	update({ main=[], sideboard=[], commander=null }) {
		this.main = main;
		this.sideboard = sideboard;
		this.commander = commander;
		return new Deck(this);
	}
}

export class Collection extends GenericCollection {
	constructor({ cards=[], ...rest }) {
		super(rest);

		this.cards = cards.map(card => new Card(card));
	}

	get card_count() {
		return this.cards.length;
	}

	update({ cards=[] }) {
		this.cards = cards;
		return new Collection(this);
	}
}

export class Library {
	constructor({ decks={}, collections={} }) {
		this.decks = Object.entries(decks).reduce((res, [id, deck]) => {
			res[id] = new Deck(deck);
			return res;
		}, {});

		this.collections = Object.entries(collections).reduce((res, [id, deck]) => {
			res[id] = new Collection(deck);
			return res;
		}, {});
	}

	addCollection(genericCollection) {
		if(genericCollection instanceof Deck) {
			this.decks[genericCollection.id] = genericCollection.toLibrary();
			return;
		}

		if(genericCollection instanceof Collection) {
			this.collections[genericCollection.id] = genericCollection.toLibrary();
			return;
		}

		throw new Error('generic collection must be an instance of Deck or Collection');
	}

	removeCollection(genericCollection) {
		if(genericCollection instanceof Deck) {
			delete this.decks[genericCollection.id];
			return;
		}

		if(genericCollection instanceof Collection) {
			delete this.collections[genericCollection.id];
			return;
		}
	}
}

const read_library = () => {
	const library_json = window.localStorage.getItem('hexproof-library');
	const library = library_json ? JSON.parse(library_json) : null;
	return library ? new Library(library) : null;
};

const write_library = (library) => {
	if(!(library instanceof Library)) {
		throw new Error('library must be an instanceof Library');
	}
	window.localStorage.setItem('hexproof-library', JSON.stringify(library));
};

const read_collection = (id) => {
	const collection_json = window.localStorage.getItem(`hexproof-collection-${id}`);
	if(!collection_json) {
		throw new Error(`Collection ${id} does not exist`);
	}

	const collection = JSON.parse(collection_json);

	return collection.type === 'deck' ? new Deck(collection) : new Collection(collection);
};

const write_collection = (collection) => {
	if(!(collection instanceof GenericCollection)) {
		throw new Error('collection must be an instanceof Deck or Collection');
	}

	window.localStorage.setItem(`hexproof-collection-${collection.id}`, JSON.stringify(collection));
};

const delete_collection = (collection) => {
	if(!collection.id) {
		return;
	}

	window.localStorage.removeItem(`hexproof-collection-${collection.id}`);
}


export const useLibrary = () => {
	const library = read_library();

	const saveLibrary = React.useCallback((saver) => {
		const current_library = read_library();
		const new_library = saver(current_library);
		return write_library(new_library);
	}, []);

	// save deck or collection
	const saveCollection = React.useCallback((collection) => {
		const current_library = read_library();

		// Necessary to prevent adding too much stuff
		current_library.addCollection(collection);

		// Save library with new collection
		write_library(current_library);

		// Save collection
		write_collection(collection);
	}, []);

	const deleteCollection = React.useCallback((collection) => {
		const current_library = read_library();
		current_library.removeCollection(collection);
		write_library(current_library);
		delete_collection(collection);
	}, []);

	return [library, { saveLibrary, saveCollection, deleteCollection }];
};

export const useCollection = (id) => {
	const collection = React.useRef(read_collection(id));
	return collection.current;
};

export const useInitLibrary = (callback=()=>{}) => {
	React.useEffect(() => {
		let library = read_library();

		if(!library) {
			let main_uuid = Utils.UUID();
			library = new Library({
				decks: [],
				collections: {
					[main_uuid]: {
						name: 'Main Collection',
						card_count: 0,
						id: main_uuid,
						image: MagicLogo
					}
				}
			});

			write_library(library);
			
			window.localStorage.setItem(`hexproof-collection-${main_uuid}`, JSON.stringify({
				...library.collections[0],
				cards: []
			}));
		}

		callback(library);
	// eslint-disable-next-line
	}, []);
};
