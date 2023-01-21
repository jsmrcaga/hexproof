import React from 'react';

import '../styles/input.css';

export default function Input({ value=null, placeholder='Scryfall query', onChange=()=>{}, onQueryChange=()=>{}, debounce=1000 }) {
	const debounceTimeout = React.useRef(null);
	const change = React.useCallback(event => {
		let { target: { value }} = event;
		event.persist();
		
		// If event does not persist, it will be lost on timeout
		if(!event.target.value || event.target.value.length < 3) {
			return;
		}

		// parse query from value, only set and colors
		let color = /(c:)|(c=)|(color:)|(color=)/gi;
		let colors = value.match(color) || [];
		colors = colors.map(c => c.replace(color, ''));

		let set = /(s:)|(s=)|(set:)|(set=)/gi;
		let sets = value.match(set) || [];
		sets = sets.map(s => s.replace(set, ''));

		let format = /(f:)|(f=)|(format:)|(format=)/gi;
		let formats = value.match(format) || [];
		formats = formats.map(s => s.replace(format, ''));

		if(debounce) {
			if(debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			// Debounce 700ms by default, else debounce qtty
			return debounceTimeout.current = setTimeout(() => {
				onChange(value);
				onQueryChange({ colors, sets, formats }); 
			}, debounce);
		}

		onChange(value);
		return onQueryChange({ colors, sets, formats }); 
	}, [ onChange, onQueryChange, debounce ]);

	const enter = React.useCallback(({ keyCode, target: { value }}) => {
		if(keyCode !== 13) {
			return;
		}

		return onChange(value);
	}, [onChange]);

	// Allows for both controlled and not controlled components
	let props = {};
	if(value !== null) {
		props.value = value;
	}

	return (
		<div className="dex-input">
			<input tpye="text" placeholder={placeholder} onChange={change} onKeyUp={enter} {...props}/>
		</div>
	);
}
