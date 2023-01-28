import React from 'react';

import Utils from '../utils/utils';
import { useHistory } from 'react-router-dom';

import CardsColumn from '../components/card-column';
import { ManaFilter } from '../components/filters';

import Header from '../components/header';
import CardSearch from '../components/card-search';
import CardStats from '../components/stats';
import Input from '../components/input';

import IconExport from '../images/icon-export.png';
// import IconImport from '../images/icon-import.png';
import IconStats from '../images/icon-stats.png';
import IconRefresh from '../images/icon-refresh.svg';
import IconSave from '../images/icon-save.svg';
import IconDelete from '../images/icon-delete.svg';
import IconFullscreen from '../images/icon-fullscreen.svg';

import { useLibrary, Deck, Collection } from '../hooks/useCollection';
import { useTextExport } from '../hooks/useExport';

import '../styles/builder.css';

function LoadingImage({ className='', loading=false, icon, onClick=()=>{}, alt='' }) {
	let saveClassname = className;

	// exclusive
	if(loading) {
		saveClassname = `animation-spin`;
	}

	return <img alt={alt} className={saveClassname} src={loading ? IconRefresh : icon} onClick={onClick}/>
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
	}, [ onSave, saveLoading ]);

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
	}, [ onDelete, deleteDisabled, deleteLoading ]);

	return (
		<div className="dex-builder-buttons">
			<div className="dex-builder-button full-screen">
				<img alt="Fullscreen" src={IconFullscreen} onClick={onFullscreen}/>
			</div>
			<div className="dex-builder-button save">
				<LoadingImage alt="Save" className={needsSaving ? 'animation-danger' : ''} icon={IconSave} loading={saveLoading} onClick={save}/>
			</div>
			<div className="dex-builder-button stats">
				<img alt="Show/Hide stats" src={IconStats} onClick={onStats}/>
			</div>
			{/*<div className="dex-builder-button import">
				<img alt="Import" src={IconImport} onClick={onImport}/>
			</div>*/}
			<div className="dex-builder-button export">
				<img alt="Export" src={IconExport} onClick={onExport}/>
			</div>
			<div className="dex-builder-button delete">
				<LoadingImage alt="Delete" icon={IconDelete} loading={deleteLoading} onClick={_delete}/>
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
	}, [ setMain, onChange, sideboard ]);

	const set_sideboard = React.useCallback(cards => {
		setSideboard([...cards]);
		onChange({ main, sideboard: [...cards] });
	}, [ setSideboard, onChange, main ]);

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
		onChange({ cards });
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
		onChange({ cards: newCards });
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

export default function Builder({ type='deck', defaultCollection=null }) {	
	const GenericBuilder = type === 'deck' ? DeckBuilder : CollectionBuilder;
	const GenericCollection = type === 'deck' ? Deck : Collection;

	const id = React.useRef(defaultCollection ? defaultCollection.id : Utils.UUID());
	const history = useHistory();

	const [ showingStats, setStats ] = React.useState(false);
	const [ fullscreen, setFullscreen ] = React.useState(false);
	
	const [ collection, setCollection ] = React.useState(defaultCollection || new GenericCollection({ id: id.current }));
	const [ needsSaving, setNeedsSaving ] = React.useState(false);
	
	const [ name, setName ] = React.useState(defaultCollection ? defaultCollection.name : `New ${type}`);

	const [ filters, setFilters ] = React.useState(undefined);

	const [, { saveCollection, deleteCollection: _deleteCollection }] = useLibrary();

	const export_text = useTextExport();

	const updateCollection = React.useCallback(params => {
		setCollection(collection.update(params));
		setNeedsSaving(true);
	}, [collection]);

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
		return _deleteCollection(collection);
	}, [ collection, _deleteCollection ]);

	const save = React.useCallback(() => {
		if(!collection) {
			return;
		}

		collection.name = name;

		saveCollection(collection);
		history.push(`/${collection.type}s/${collection.id}`);
	}, [ collection, name, saveCollection, history ]);

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
							onExport={() => export_text(collection.export())}
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
						onChange={updateCollection}
						fullscreen={fullscreen}
						isMobile={window.innerWidth <= 900}
					/>
				</div>
			</div>
		</React.Fragment>
	);
}
