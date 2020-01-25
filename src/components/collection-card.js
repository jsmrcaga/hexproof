import React from 'react';
import ManaCost from './mana-cost';

import '../styles/collection-card.css';

export default function CollectionCard({ name, image=null, format=null, cards=0, entity=null, onClick=()=>{} }) {
	return (
		<div className="dex-collection-card" onClick={onClick}>
			{
				image &&
				<div className="dex-collection-card-image">
					<img src={image}/>
				</div>
			}
			<div className="dex-collection-card-mana-cost">
				<ManaCost cost={entity}/>
			</div>
			<div className="dex-collection-card-name">
				{name}
			</div>
			<div className="dex-collection-card-description">
				{`${cards} cards` + (format ? ` | ${format} cards` : '')}
			</div>
		</div>
	);
}
