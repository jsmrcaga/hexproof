import React from 'react';

import '../styles/card-preview.css';

export function Preview({ card, children }) {
	const [ preview, showPreview ] = React.useState(false);
 	return (
 		<div
 			onMouseOver={() => !preview && showPreview(true)}
 			onMouseLeave={() => preview && showPreview(false)}
 		>
 			{preview && <CardPreview card={card}/>}
 			{children}
 		</div>
 	);
	 
}

export default function CardPreview({ card }) {
	const height = 450;
	const offset = 30;
	const [ mousePosition, setMousePosition ] = React.useState({
		x: 0,
		y: 0
	});

	React.useEffect(() => {
		const listener = ({ x, y }) => {
			setMousePosition({
				x: x + offset,
				y: y + offset
			});
		};
		window.addEventListener('mousemove', listener);
		return () => window.removeEventListener('mousemove', listener);
	}, []);

	let { x, y } = mousePosition;

	if(!x && !y) {
		return null;
	}

	if(!card.image_uris) {
		return null;
	}

	if( y + height > window.innerHeight) {
		y -= (height + (offset * 2));
	}

	return (
		<div className="dex-card-preview" style={{ left: x, top: y }}>
			<img alt={card.name} src={card.image_uris?.large}/>
		</div>
	);
}
