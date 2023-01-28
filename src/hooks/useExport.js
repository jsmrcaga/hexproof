import React from 'react';

// Can be used for json as well
export function useTextExport() {
	return React.useCallback((text, { type='text/plain', ...rest }={}) => {
		let blob = new Blob([text], { type, ...rest });
		let url = URL.createObjectURL(blob);
		window.open(url, '_blank');
	}, []);
}
