import React from 'react';

import UserBadge from './user-badge';

export default function Header({ children, title="Dex", history }) {
	return (
		<div className="dex-header">
			{children}
			<div className="dex-header-title">{title}</div>
			<UserBadge history={history}/>
		</div>
	);
}
