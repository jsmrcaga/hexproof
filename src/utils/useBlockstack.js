import React from 'react';
import * as blockstack from 'blockstack';

const BlockstackContext = React.createContext(null);

export function Blockstack({ children }) {
	const [ session, setSession ] = React.useState(null);

	return (
		<BlockstackContext.Provider value={{
			session,
			setSession
		}}>
			{children}
		</BlockstackContext.Provider>
	);
}

export function useBlockstack({ origin=window.location.origin, onSignInError=()=>{} }={}) {
	const user_session_ref = React.useRef(new blockstack.UserSession());
	const user_session = user_session_ref.current;

	// Set as state to force refreshes
	const context = React.useContext(BlockstackContext);

	if(!context) {
		throw new Error(`[useBlockstack] useBlockstack must have <Blockstack> as a parent component`);
	}

	const { session, setSession } = context;
	
	const login = React.useCallback(() => {
		if(!user_session.isUserSignedIn() && user_session.isSignInPending()) {
			return;
		}

		return user_session.redirectToSignIn(origin);
	}, [user_session, origin]);

	const logout = React.useCallback(() => {
		setSession(null);
		return user_session.signUserOut();
	}, [user_session, setSession]);

	const putFile = React.useCallback((name, data, params={}) => {
		if(!user_session.isUserSignedIn()) {
			return Promise.reject(new Error('Blockstack user not signed in'));
		}

		return user_session.putFile(name, data, params);
	}, [user_session]);

	const getFile = React.useCallback((name, params={}) => {
		if(!user_session.isUserSignedIn()) {
			return Promise.reject(new Error('Blockstack user not signed in'));
		}

		return user_session.getFile(name, params);
	}, [user_session]);

	const deleteFile = React.useCallback((name, params={}) => {
		if(!user_session.isUserSignedIn()) {
			return Promise.reject(new Error('Blockstack user not signed in'));
		}

		return user_session.deleteFile(name, params);
	});

	if(!user_session.isUserSignedIn() && user_session.isSignInPending()) {
		user_session.handlePendingSignIn().then(() => {
			if (window.history && window.location.search) {
				window.history.replaceState(
					{},
					document.title,
					window.location.pathname
				);
			}

			let user_data = user_session.loadUserData();
			setSession(user_data);
		}).catch(e => {
			console.error(e);
			onSignInError(e);
		});
	}

	// Allows auto-logins by not waiting a render cycle
	let tmpSession = null;
	if(!session && user_session.isUserSignedIn()) {
		let user_data = user_session.loadUserData();
		tmpSession = user_data;
		setSession(user_data);
	}

	return [ session || tmpSession, { putFile, getFile, login, logout, deleteFile } ];
};

export default BlockstackContext;
