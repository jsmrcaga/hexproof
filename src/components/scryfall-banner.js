import React from 'react';

import ScryfallLogo from '../images/scryfall-logo.svg';

import '../styles/scryfall-banner.css';

export default function ScryfallBanner() {
	return (
		<div className="scryfall-banner">
			<a href="https://scryfall.com?ref=hexproof" target="_blank" rel="noopener noreferrer">
				<img src={ScryfallLogo} alt="Scryfall"/>
				<span>
					Data and images provided by Scryfall
				</span>
			</a>
		</div>
	);
}
