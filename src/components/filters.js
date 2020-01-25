import React from 'react';

import ManaBlack from '../images/mana-black.svg';
import ManaBlue from '../images/mana-blue.svg';
import ManaRed from '../images/mana-red.svg';
import ManaGreen from '../images/mana-green.svg';
import ManaWhite from '../images/mana-white.svg';
import ManaColorless from '../images/mana-colorless.svg';

import ArrowDropdown from '../images/arrow-dropdown.svg';

import '../styles/dropdown.css';

function Dropdown({ options, placeholder='Select an option', onChange=()=>{} }) {
	const ref = React.useRef(null);
	const [ open, setOpen ] = React.useState(false);
	const [ value, setValue ] = React.useState(false);

	const windowClick = (event) => {
		if(open && (!ref.current.contains(event.target) || event.target === document.body)) {
			setOpen(false);
		}
	};

	// window listener
	React.useEffect(() => {
		window.addEventListener('click', windowClick);

		return () => window.removeEventListener('click', windowClick);
	}, [])

	const setOption = React.useCallback(option => {
		setValue(option);
		setOpen(false);
		onChange(option);
	});

	const groups = Array.from(new Set(options.map(option => option.group).filter(e => e)));

	groups.sort((a, b) => a < b ? 1 : (a > b ? -1 : 0));

	let actions = [];
	if(groups.length) {
		for(let group of groups) {
			actions.push(<div className="dex-dropdown-group" key={group}>{group}</div>);
			let filtered = options.filter(o => o.group === group).map(option => {
				return <div key={option.label} className="dex-dropdown-option" onClick={() => setOption(option)}>{option.label}</div>;
			});
			actions.push(...filtered);
		}
	} else {
		actions.push(options.map(option => {
			return <div key={option.label} className="dex-dropdown-option" onClick={() => setOption(option)}>{option.label}</div>;
		}));
	}

	return (
		<div className="dex-dropdown" ref={ref}>
			<div className="dex-dropdown-value">
				{
					value.group && <span className="dex-dropdown-value-group">{value.group} / </span>
				}
				<span className={`dex-dropdown-value-value ${value ? '' : 'placeholder'}`}>{value ? value.label : placeholder}</span>
			</div>
			<div className="dex-dropdown-dropper" onClick={() => setOpen(!open)}>
				<img src={ArrowDropdown}/>
			</div>
			<div className={`dex-dropdown-dropdown ${open ? 'open' : ''}`}>
				{ actions }
			</div>
		</div>
	);
}

export function ManaFilter({ onChange=()=>{} }) {
	const [currentFilter, setCurrentFilter] = React.useState([]);

	const filter = React.useCallback((color) => {
		let currents = [...currentFilter];
		if(currents.includes(color)) {
			let i = currents.indexOf(color);
			currents.splice(i, 1);
		} else {
			currents.push(color);
		}

		setCurrentFilter(currents);
		onChange(currents);
	}, [ currentFilter, onChange ]);

	return (
		<div className="dex-mana-filter">
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('R') ? 'active' : ''}src={ManaRed} onClick={() => filter('R')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('W') ? 'active' : ''}src={ManaWhite} onClick={() => filter('W')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('B') ? 'active' : ''}src={ManaBlack} onClick={() => filter('B')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('U') ? 'active' : ''}src={ManaBlue} onClick={() => filter('U')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('G') ? 'active' : ''}src={ManaGreen} onClick={() => filter('G')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('C') ? 'active' : ''}src={ManaColorless} onClick={() => filter('C')}/>
			</div>
		</div>
	);
}

export function FormatDropDown({ onChange=()=>{} }) {
	const formats = ['Standard', 'Commander', 'Brawl'];
	const options = formats.map(f => ({ group: 'Format', label: f, id: f }));
	return (
		<Dropdown options={options} onChange={onChange}/>
	);
}

export function SetDropdown({ onChange=()=>{} }) {
	const sets = ['Standard', 'Commander', 'Brawl'];
	const options = sets.map(f => ({ group: 'Set', label: f, id: f }));
	return (
		<Dropdown options={options} onChange={onChange}/>
	);
}
