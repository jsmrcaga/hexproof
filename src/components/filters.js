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
	const [ open, setOpen ] = React.useState(false);
	const [ value, setValue ] = React.useState(false);

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
			actions.push(<div className="dex-dropdown-group">{group}</div>);
			let filtered = options.filter(o => o.group === group).map(option => {
				return <div className="dex-dropdown-option" onClick={() => setOption(option)}>{option.label}</div>;
			});
			actions.push(...filtered);
		}
	} else {
		actions.push(options.map(option => {
			return <div className="dex-dropdown-option" onClick={() => setOption(option)}>{option.label}</div>;
		}));
	}

	return (
		<div className="dex-dropdown">
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
	}, [currentFilter]);

	return (
		<div className="dex-mana-filter">
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('red') ? 'active' : ''}src={ManaRed} onClick={() => filter('red')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('white') ? 'active' : ''}src={ManaWhite} onClick={() => filter('white')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('black') ? 'active' : ''}src={ManaBlack} onClick={() => filter('black')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('blue') ? 'active' : ''}src={ManaBlue} onClick={() => filter('blue')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('green') ? 'active' : ''}src={ManaGreen} onClick={() => filter('green')}/>
			</div>
			<div className="dex-mana-mana">
				<img className={currentFilter.includes('colorless') ? 'active' : ''}src={ManaColorless} onClick={() => filter('colorless')}/>
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
