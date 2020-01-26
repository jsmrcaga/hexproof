import React from 'react';

import ScryfallLogo from '../images/scryfall-logo.svg';

import '../styles/scryfall-banner.css';

export default function ScryfallBanner() {
	return (
		<div className="scryfall-banner">
			<a href="https://scryfall.com" target="_blank">
				<img src={ScryfallLogo} alt="Scryfall"/>
				<span>
					Data and images provided by Scryfall
				</span>
			</a>
		</div>
	);
}
