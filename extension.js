'use strict';

module.exports = function(nodecg) {
	const OBSWebSocket = require('obs-websocket-js');

	// If there is an address and/or password in the config, use it.
	var settings = {
		address: nodecg.bundleConfig.address || "localhost:4444",
		password: nodecg.bundleConfig.password || undefined
	}

	// Do the startup stuff.
	const obs = new OBSWebSocket();
	connect();
	function connect() {
		obs.connect(settings).then(() => {
			nodecg.log.info('OBS connection successful.');
		}).catch((err) => {});
	}

	// We need to try and reconnect if the connection is closed.
	// This also fires if we can't successfully connect in the first place.
	obs.on('ConnectionClosed', data => {
		nodecg.log.warn('OBS connection lost, retrying in 5 seconds.');
		setTimeout(connect, 5000);
	});

	// Error catching.
	obs.on('error', err => {
		nodecg.log.warn('OBS connection error: ', err);
		// I don't know if we need to reconnect here?
		// I don't think so, an error doesn't always mean a disconnect.
	});

	// Allows other bundles to access this connection.
	// nodecg.extensions['nodecg-obs-util']
	return obs;
}