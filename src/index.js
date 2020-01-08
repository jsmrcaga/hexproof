import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import { Blockstack } from './utils/useBlockstack';
import './styles/main.css';
import './styles/animations.css';

ReactDOM.render(
	<Blockstack>
		<App />
	</Blockstack>,
document.getElementById('root'));
