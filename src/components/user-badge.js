import React from 'react';

import { useBlockstack } from '../utils/useBlockstack';

function Link({ history, children, to="/" }) {
	return <a href={to} onClick={(event) => {
		event.preventDefault();
		history.push(to);
	}}>{children}</a>
}

export default function UserBadge({decks=0, collections=0, history}) {
	const [ session ] = useBlockstack();
	const picture = session.profile.image && session.profile.image.length && session.profile.image[0].contentUrl;
	return (
		<div className="dex-user-badge">
			<div className="dex-user-badge-picture">
				<img src={picture || ""}/>
			</div>

			<div className="dex-user-badge-titles">
				<span className="dex-user-badge-name">
					{session.username}
				</span>
				<span className="dex-user-badge-stats">
					<Link history={history} to="/decks">{decks} decks</Link> | <Link history={history} to="/collections">{collections} collections</Link>
				</span>
			</div>
		</div>
	);
}
