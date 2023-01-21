import React from 'react';

import UserBadge from './user-badge';

import '../styles/header.css';

export default function Header({ decks=0, collections=0, editable=false, children, title="Hexproof", history, onChange=()=>{} }) {
	const [ editing, setEditing ] = React.useState(false);
	const [ _title, setTitle ] = React.useState(title);

	const change = React.useCallback(({ target: { value }}) => {
		setTitle(value);
	}, []);

	const apply = React.useCallback(({ type, keyCode }) => {
		if(type === 'keyup' && keyCode !== 13) {
			return;
		}

		setEditing(false);
		onChange(_title);
	}, [ _title, onChange ]);

	return (
		<div className="dex-header">
			{children}
			{
				editing &&
				<input
					className="dex-title-edit"
					value={_title}
					onChange={change}
					onKeyUp={apply}
					onBlur={apply}
				/>
			}
			{
				!editing &&
				<div className={`dex-header-title ${editable ? 'editable' : ''}`} onClick={() => editable && setEditing(true)}>{title}</div>
			}
			<UserBadge history={history} decks={decks} collections={collections}/>
		</div>
	);
}
