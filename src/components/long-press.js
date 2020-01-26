import React from 'react';

export default function LongPress({ onLongPress=()=>{}, children }) {
	const timer = React.useRef(null);

	const down = React.useCallback((event) => {
		if(timer.current) {
			clearTimeout(timer.current);
		}

		timer.current = setTimeout(() => {
			onLongPress(event);
		}, 500);
	}, [ onLongPress ]);

	const up = React.useCallback((event) => {
		clearTimeout(timer.current);
	}, [ onLongPress ]);

	// clear timeout in case re-render
	React.useEffect(() => {
		clearTimeout(timer.current);
	}, [ onLongPress ]);

	let child = React.Children.only(children);

	let propsDown = down;
	if(child.props.onMouseDown) {
		let oldHandler = child.props.onMouseDown;
		propsDown = (...args) => {
			oldHandler(...args);
			down(...args);
		};
	}

	let propsUp = up;
	if(child.props.onMouseUp) {
		let oldHandler = child.props.onMouseUp;
		propsUp = (...args) => {
			oldHandler(...args);
			up(...args);
		};
	}

	let handlerProps = {
		onMouseUp: up,
		onMouseDown: down,
		onTouchStart: down,
		onTouchEnd: up
	};

	return React.cloneElement(children, { ...children.props, ...handlerProps});
}
