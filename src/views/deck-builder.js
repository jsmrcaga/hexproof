import React from 'react';

import CardsColumn from '../components/card-column';
import { ManaFilter, FormatDropDown, SetDropdown } from '../components/filters';

import Header from '../components/header';
import CardSearch from '../components/card-search';

import IconExport from '../images/icon-export.png';
import IconImport from '../images/icon-import.png';
import IconStats from '../images/icon-stats.png';
import IconRefresh from '../images/icon-refresh.svg';
import IconSave from '../images/icon-save.svg';

import '../styles/builder.css';

function ActionButtons({ onImport=()=>{}, onExport=()=>{}, onStats=()=>{}, onSave=()=>Promise.resolve() }) {
	const [ saveLoading, setSaveLoading ] = React.useState(false);
	const save = React.useCallback(() => {
		setSaveLoading(true);
		onSave().finally(() => {
			setSaveLoading(false);
		});
	}, [ onSave ]);

	return (
		<div className="dex-builder-buttons">
			<div className="dex-builder-button">
				<img className={saveLoading ? 'animation-spin' : ''} src={saveLoading ? IconRefresh : IconSave} onClick={save}/>
			</div>
			<div className="dex-builder-button">
				<img src={IconStats} onClick={onStats}/>
			</div>
			<div className="dex-builder-button">
				<img src={IconImport} onClick={onImport}/>
			</div>
			<div className="dex-builder-button">
				<img src={IconExport} onClick={onExport}/>
			</div>
		</div>
	);
}

function DroppableCard({ children, onCardDropped=()=>{} }) {
	return (
		<div className="dex-droppable-card">
			{ children }
		</div>
	);
}

function DeckBuilder({ deck=null }) {
	return (
		<React.Fragment>
			<DroppableCard>
				<CardsColumn title="Main"/>
			</DroppableCard>
			<DroppableCard>
				<CardsColumn title="Sideboard"/>
			</DroppableCard>
		</React.Fragment>
	);
}

function CollectionBuilder({ collection=null }) {
	return (
		<DroppableCard>
			<CardsColumn title="Collection"/>
		</DroppableCard>
	);
}

export default function Builder({ type='deck', collection, history}) {
	const [ showingStats, showStats ] = React.useState(false);
	const GenericBuilder = type === 'deck' ? DeckBuilder : CollectionBuilder;

	const filter = React.useCallback((filters) => {

	}, []);

	return (
		<React.Fragment>
			<Header name={collection ? collection.name : `New ${type}`} history={history}/>
			<div className="dex-builder-container">
				<div className="dex-builder-filters-container">
					<span className="dex-builder-title">Filters /</span>
					<div className="dex-builder-filters">
						<ManaFilter onChange={filter}/>
						<FormatDropDown onChange={filter}/>
						<SetDropdown onChange={filter}/>
						<ActionButtons onImport={()=>{}} onExport={()=>{}} onStats={()=>{}}/>
					</div>
				</div>
				<div className="dex-builder-content">
					<div className="dex-builder-cards">
						{
							showingStats && <div>STATS</div>	
						}
						{
							!showingStats && <CardSearch/>
						}
					</div>
					<div className="dex-builder-columns">
						<GenericBuilder collection={collection} deck={collection}/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}
