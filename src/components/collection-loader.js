import React from 'react';

import { useBlockstack } from '../utils/useBlockstack';
import Loader from './loader';

export default function CollectionLoader({ children, id=null }) {
	const [ loading, setLoading ] = React.useState(true);
	const [ collection, setCollection ] = React.useState(null);
	const [ session, { getFile } ] = useBlockstack();

	React.useEffect(() => {
		if(!id) {
			return setLoading(false);
		}

		setLoading(true);
		getFile(id).then(json => {
			setCollection(JSON.parse(json));
		}).catch(e => {
			// toast
		}).finally(() => {
			setLoading(false);
		});
	}, []);

	if(loading) {
		return <Loader/>;
	}

	let child = React.cloneElement(children, { collection: collection });
	return child;
}
