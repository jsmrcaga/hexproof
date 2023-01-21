import React from 'react';

import { useCollection } from '../hooks/useCollection';

export default function CollectionLoader({ children, id=null }) {
	const collection = useCollection(id);

	let child = React.cloneElement(children, { defaultCollection: collection });
	return child;
}
