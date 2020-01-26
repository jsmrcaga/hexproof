import React from 'react';

import { useBlockstack } from '../utils/useBlockstack';
import Utils from '../utils/utils';

import CardsColumn from '../components/card-column';
import { ManaFilter, FormatDropDown, SetDropdown } from '../components/filters';

import Header from '../components/header';
import CardSearch from '../components/card-search';
import CardStats from '../components/stats';
import Input from '../components/input';

import IconExport from '../images/icon-export.png';
import IconImport from '../images/icon-import.png';
import IconStats from '../images/icon-stats.png';
import IconRefresh from '../images/icon-refresh.svg';
import IconSave from '../images/icon-save.svg';
import IconDelete from '../images/icon-delete.svg';
import IconFullscreen from '../images/icon-fullscreen.svg';

import '../styles/builder.css';

function LoadingImage({ className='', loading=false, icon, onClick=()=>{} }) {
	let saveClassname = className;

	// exclusive
	if(loading) {
		saveClassname = `animation-spin`;
	}

	return <img className={saveClassname} src={loading ? IconRefresh : icon} onClick={onClick}/>
}

function ActionButtons({ needsSaving=false, deleteDisabled=false, onImport=()=>{}, onExport=()=>{}, onStats=()=>{}, onSave=()=>Promise.resolve(), onDelete=()=>{}, onFullscreen=()=>{} }) {
	const [ saveLoading, setSaveLoading ] = React.useState(false);
	const [ deleteLoading, setDeleteLoading ] = React.useState(false);

	const save = React.useCallback(() => {
		if(saveLoading) {
			return;
		}

		setSaveLoading(true);
		let promise = onSave();
		if(!(promise instanceof Promise)){
			return setSaveLoading(false);
		}

		promise.finally(() => {
			setSaveLoading(false);
		});
	}, [ onSave ]);

	const _delete = React.useCallback(() => {
		if(deleteDisabled || deleteLoading) {
			return;
		}

		setDeleteLoading(true);

		let promise = onDelete();
		if(!(promise instanceof Promise)) {
			return setDeleteLoading(false);
		}

		promise.finally(() => {
			setDeleteLoading(false);
		});
	}, [ onDelete, deleteDisabled ]);



	return (
		<div className="dex-builder-buttons">
			<div className="dex-builder-button full-screen">
				<img src={IconFullscreen} onClick={onFullscreen}/>
			</div>
			<div className="dex-builder-button save">
				<LoadingImage className={needsSaving ? 'animation-danger' : ''} icon={IconSave} loading={saveLoading} onClick={save}/>
			</div>
			<div className="dex-builder-button stats">
				<img src={IconStats} onClick={onStats}/>
			</div>
			<div className="dex-builder-button import">
				<img src={IconImport} onClick={onImport}/>
			</div>
			<div className="dex-builder-button export">
				<img src={IconExport} onClick={onExport}/>
			</div>
			<div className="dex-builder-button delete">
				<LoadingImage icon={IconDelete} loading={deleteLoading} onClick={_delete}/>
			</div>
		</div>
	);
}

// Duplicate logic beacause its simpler on the columns

function DeckBuilder({ deck=null, showingStats=false, filters: { query, mana } = {}, onChange=()=>{}, fullscreen=false, isMobile=false}) {
	const [ main, setMain ] = React.useState(deck ? deck.main : []);
	const [ sideboard, setSideboard ] = React.useState(deck ? deck.sideboard : []);

	const set_main = React.useCallback(cards => {
		setMain([...cards]);
		onChange({ main: [...cards], sideboard });
	}, [ setMain, onChange, sideboard, main ]);

	const set_sideboard = React.useCallback(cards => {
		setSideboard([...cards]);
		onChange({ main, sideboard: [...cards] });
	}, [ setSideboard, onChange, sideboard, main ]);

	const addCard = React.useCallback(card => {
		let newCards = [...main];
		let exists = newCards.find(c => c.id === card.id);
		if(exists) {
			exists.qtty++;
		} else {
			card.qtty = card.qtty || 1;
			newCards.push(card);
		}

		setMain(newCards);
		onChange({ main: newCards, sideboard });
	}, [ main, sideboard, onChange ]);

	return (
		<React.Fragment>
			<div className="dex-builder-cards">
				{
					showingStats && <CardStats cards={main}/>
				}
				{
					!showingStats && !isMobile && <CardSearch onCardClicked={addCard} query={query} mana={mana}/>
				}
			</div>
			{
				!fullscreen &&
				<div className="dex-builder-columns">
					<CardsColumn danger types title="Main" cards={main} setCards={set_main}/>
					<CardsColumn title="Sideboard" cards={sideboard} setCards={set_sideboard}/>
				</div>
			}
		</React.Fragment>
	);
}

function CollectionBuilder({ collection=null, showingStats=false, filters: { query, mana } = {}, onChange=()=>{}, fullscreen=false, isMobile=false}) {
	const [ cards, setCards ] = React.useState(collection ? collection.cards : []);

	const set_cards = React.useCallback(cards => {
		setCards(cards);
		onChange(cards);
	}, [ setCards, onChange ]);

	const addCard = React.useCallback(card => {
		let newCards = [...cards];
		let exists = newCards.find(c => c.id === card.id);
		if(exists) {
			exists.qtty++;
		} else {
			card.qtty = card.qtty || 1;
			newCards.push(card);
		}

		setCards(newCards);
		onChange(newCards);
	}, [ cards, onChange ]);

	return (
		<React.Fragment>
			<div className="dex-builder-cards">
				{
					showingStats && <CardStats cards={cards}/>
				}
				{
					!showingStats && !isMobile && <CardSearch onCardClicked={addCard} query={query} mana={mana}/>
				}
			</div>
			{
				!fullscreen &&
				<div className="dex-builder-columns">
					<CardsColumn
						filter
						types
						title="Collection"
						cards={cards}
						setCards={set_cards}/>
				</div>
			}
		</React.Fragment>
	);
}

export default function Builder({ type='deck', collection=null, history }) {
	const FILENAME = 'dex-collections.json';

	const [ session, { putFile, getFile, deleteFile } ] = useBlockstack();
	
	const [ showingStats, setStats ] = React.useState(false);
	const [ fullscreen, setFullscreen ] = React.useState(false);
	
	const [ deck, setDeck ] = React.useState(collection);
	const [ needsSaving, setNeedsSaving ] = React.useState(false);
	
	const [ name, setName ] = React.useState(collection ? collection.name : `New ${type}`);
	const id = React.useRef(collection ? collection.id : Utils.UUID());

	const GenericBuilder = type === 'deck' ? DeckBuilder : CollectionBuilder;

	const [ filters, setFilters ] = React.useState(undefined);

	const updateDeck = React.useCallback(deck => {
		setDeck(deck);
		setNeedsSaving(true);
	});

	React.useEffect(() => {
		if(needsSaving) {
			window.onbeforeunload = () => {
				return '1';
			};

			return () => window.onbeforeunload = null;
		}
	}, [ needsSaving ]);

	const filterScryfall = React.useCallback(query => {
		let newFilters = {
			...filters,
			query
		};
		setFilters(newFilters);
	}, [ filters ]);

	const filterMana = React.useCallback(mana => {
		let newFilters = {
			...filters,
			mana
		};
		setFilters(newFilters);
	}, [ filters ]);

	const deleteCollection = React.useCallback(() => {
		// Remove from list
		return getFile(FILENAME).then(json => {
			let collections = JSON.parse(json) || {};
			let _type = collections[`${type}s`] || [];
			let exists = _type.findIndex(c => c.id === id.current);
			if(exists === -1) {
				return Promise.resolve();
			}

			_type.splice(exists, 1);
			collections[`${type}s`] = _type;
			return putFile(FILENAME, JSON.stringify(collections));
		}).then(() => {
			return deleteFile(id.current);
		}).then(() => {
			history.push('/');
		}).catch(e => {
			console.error(e);
		});
	}, [ collection ]);

	const save = React.useCallback(() => {
		if(!deck) {
			return;
		}

		let cards = type === 'deck' ? deck.main : deck;
		if(!cards.length) {
			return;
		}

		const save_deck = {
			id: id.current,
			name,
			card_count: cards.reduce((sum, { qtty }) => sum + qtty, 0),
			entity: Array.from(new Set(cards.map(c => c.colors).flat(2))).map(c => `{${c}}`).join(''),
			format: '',
			image: collection ? collection.image : cards[0].image_uris.art_crop
		};

		return getFile(FILENAME).then(json => {
			let data = JSON.parse(json) || {};
			let decks = data[`${type}s`] || [];
			// Remove last deck or collection
			if(collection) {
				let old = decks.findIndex(c => c.id === collection.id);
				decks.splice(old, 1);
			}

			// if deck is collection just take the cards
			decks.push(save_deck);

			data[`${type}s`] = decks;
			return putFile(FILENAME, JSON.stringify(data));
		}).then(() => {
			let save_cards = type === 'deck' ? { ...save_deck, ...deck }: { ...save_deck, cards: deck };
			return putFile(id.current, JSON.stringify(save_cards));
		}).then(() => {
			setNeedsSaving(false);
			if(!collection) {
				history.push(`/${type}s/${id.current}`);
			}
		}).catch(e => {
			console.error(e);
		});
	}, [ deck, name, type ]);

	// <div className="dex-dropdown-filters">
	// 	<FormatDropDown onChange={filter}/>
	// 	<SetDropdown onChange={filter}/>
	// </div>

	return (
		<React.Fragment>
			<Header
				editable
				title={name}
				onChange={setName}
				history={history}
			/>
			<div className="dex-builder-container">
				<div className="dex-builder-filters-container">
					<span className="dex-builder-title">Filters /</span>
					<div className="dex-builder-filters">
						<div className="dex-left-filters">
							<ManaFilter onChange={filterMana}/>
							<div className="dex-scryfall-query">
								<Input onChange={filterScryfall}/>
							</div>
						</div>
						<ActionButtons
							needsSaving={needsSaving}
							deleteDisabled={!Boolean(collection)}
							onSave={save}
							onDelete={deleteCollection}
							onImport={()=>{}}
							onExport={()=>{}}
							onStats={() => setStats(!showingStats)}
							onFullscreen={() => setFullscreen(!fullscreen)}
						/>
					</div>
				</div>
				<div className="dex-builder-content">
					<GenericBuilder
						collection={collection}
						deck={collection}
						showingStats={showingStats}
						filters={filters}
						onChange={updateDeck}
						fullscreen={fullscreen}
						isMobile={window.innerWidth <= 900}
					/>
				</div>
			</div>
		</React.Fragment>
	);
}
