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
	const offset = 30;
	const previewRef = React.useRef(null);

	React.useEffect(() => {
		const listener = ({ x, y }) => {
			// In case this component returned null
			if(!previewRef.current) {
				return;
			}

			// Move card without react for more performance
			const element = previewRef.current;

			const { width, height } = element.getBoundingClientRect();

			// Add offset immediately

			const computedX = x + width + offset > window.innerWidth ?
				// Reverse X (to prevent it hiding the actual element)
				(x - offset - width)
				: (x + offset);

			const computedY = y + height + offset > window.innerHeight ?
				// Max to bottom
				(window.innerHeight - height)
				: (y + offset);

			element.style.left = `${computedX}px`;
			element.style.top = `${computedY}px`;
		};

		window.addEventListener('mousemove', listener);
		return () => window.removeEventListener('mousemove', listener);
	}, [previewRef]);

	// TODO: Get double sided cards as well
	const card_images = card.__faces?.map((uri, index) => {
		return <img key={uri} alt={`${card.name} face ${index + 1}`} src={uri}/>
	}) || null;

	if(!card_images) {
		return null;
	}

	return (
		<div className="dex-card-preview" ref={previewRef}>
			{card_images}
		</div>
	);
}
