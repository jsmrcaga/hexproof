import React from 'react';

export default function InfinityScroller({ children, className='', onEnd }) {
	const scrollerRef = React.useRef(null);
	const offset = React.useRef(null);
	const debounce = React.useRef(null);

	const handleScroll = React.useCallback(() => {
		let { height } = scrollerRef.current.getBoundingClientRect();
		if((window.scrollY - height) - offset.current + window.innerHeight >= 0) {
			if(debounce.current) {
				clearTimeout(debounce.current);
			}

			debounce.current = setTimeout(() => {
				return onEnd();
			}, 500);
		}
	}, [ scrollerRef, onEnd, offset ]);

	React.useEffect(() => {
		window.addEventListener('scroll', handleScroll);

		return () => window.removeEventListener('scroll', handleScroll);
	}, [ handleScroll ]);

	React.useEffect(() => {
		offset.current = scrollerRef.current.getBoundingClientRect().y;
	}, []);

	return (
		<div className={`${className}`} ref={scrollerRef}>
			{children}
		</div>
	);
}
