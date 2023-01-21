class RequestError extends Error {
	constructor(message, url, status, response) {
		super(message);
		this.url = url;
		this.status = status;
		this.response = response;
	}

	toString() {
		let { message, status, response } = this;
		return `[RequestError] ${message} (${status})\n${response}`;
	}
}

const QueryString = {
	stringify: (query={}) => {
		return Object.entries(query).map(([k, v]) => v ? `${encodeURIComponent(k)}=${encodeURIComponent(v)}` : '').join('&');
	},
	parse: query => {

	}
};

class Fetcher {
	request({ method='GET', path='', endpoint='', data=null, query=null, headers={} }) {
		if(!endpoint) {
			throw new Error('[Fetcher] Endpoint required');
		}

		if(method === 'POST' && data && data instanceof Object && !headers['Content-Type']) {
			headers['Content-Type'] = 'application/json; charset=utf-8';
		}

		const _path = path + (query ? `?${QueryString.stringify(query)}` : '');
		const url = `${endpoint}${_path}`;

		return fetch(url, {
			method,
			body: data || undefined,
			headers
		}).then(response => {
			if(response.status < 200 || response.status > 299) {
				return response.text().then(resp => {
					throw new RequestError('Error requesting resource', url, response.status, resp);
				});
			}

			return response.json();
		}).catch(e => {
			console.error(e);
			throw e;
		});
	}
}

const fetcher = new Fetcher();

export default fetcher;
