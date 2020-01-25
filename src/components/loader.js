import React from 'react';

import '../styles/loader.css';

export default function Loader() {
	return (
		<div className="dex-loader">
			<div class="lds-ripple">
				<div/>
				<div/>
			</div>
		</div>
	);
}
