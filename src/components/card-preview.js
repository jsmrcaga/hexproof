import React from 'react';

import '../styles/card-preview.css';

export default function CardPreview({ card }) {
	const height = 350;
	const offset = 30;
	const [ mousePosition, setMousePosition ] = React.useState({
		x: 0,
		y: 0
	});

	const listener = React.useCallback(({ x, y }) => {
		setMousePosition({
			x: x + offset,
			y: y + offset
		});
	}, []);

	React.useEffect(() => {
		window.addEventListener('mousemove', listener);
		return () => window.removeEventListener('mousemove', listener);
	}, []);

	let { x, y } = mousePosition;

	if(!x && !y) {
		return null;
	}

	if( y + height > window.innerHeight) {
		y -= (height + (offset * 2));
	}

	return (
		<div className="dex-card-preview" style={{ left: x, top: y }}>
			<img alt={card.name} src={card.image_uris.large}/>
		</div>
	);
}
