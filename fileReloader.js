const fs = require('fs');

const partial = (fn, ...args) => (...rest) => fn(...args, ...rest);

const cacheFile = (cache, path, fileName) => {
	const filePath = `${path}\\${fileName}`;
	try {
		const modulePath = require.resolve(filePath);

		delete require.cache[modulePath];
	} catch (err) {
		console.log(err);
		return;
	}
	try {
		const mod = require(filePath);
		cache.set(fileName, mod);
	} catch (err) {
		cache.delete(fileName);
	}
}

const watch = (path, callback) => {
	fs.watch(path, (event, fileName) =>{
		console.log(`Event: ${event}; target: ${fileName}`);
		callback(fileName);
	 })
}

const readDir = (path, callback) => {
	fs.readdir(path, (err, files) => {
		if (err) {
			console.log(err);
			return;
		};		
		files.forEach(callback);
	})
}

const fileReloader = (dirName) => {
	const cache = new Map();
	const partialCache = partial(cacheFile, cache, dirName);
	readDir(dirName, partialCache);
	watch(dirName, partialCache);
	return cache;
}

module.exports = fileReloader;