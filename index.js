const {Buffer} = require('buffer');
const {promisify} = require('util');
const path = require('path');
const fs = require('graceful-fs');
const FileType = require('file-type');
const fg = require('fast-glob');
const replaceExt = require('replace-ext');
const junk = require('junk');
const convertToUnixPath = require('slash');

const fsPromises = fs.promises;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const handleFile = async (sourcePath, {destination, plugins = []}) => {
	if (plugins && !Array.isArray(plugins)) {
		throw new TypeError('The `plugins` option should be an `Array`');
	}

	let data = await readFile(sourcePath);
	if (plugins.length > 0) {
		data = await plugins.reduce(async (previous, current) => current(previous), data);
	}

	const {ext} = await FileType.fromBuffer(data) || {ext: path.extname(sourcePath)};
	let destinationPath = destination ? path.join(destination, path.basename(sourcePath)) : undefined;
	destinationPath = ext === 'webp' ? replaceExt(destinationPath, '.webp') : destinationPath;

	const returnValue = {
		data,
		sourcePath,
		destinationPath,
	};

	if (!destinationPath) {
		return returnValue;
	}

	await fsPromises.mkdir(path.dirname(returnValue.destinationPath), {recursive: true});
	await writeFile(returnValue.destinationPath, returnValue.data);

	return returnValue;
};

async function imagemin(input, {glob = true, ...options} = {}) {
	if (!Array.isArray(input)) {
		throw new TypeError(`Expected an \`Array\`, got \`${typeof input}\``);
	}

	const unixFilePaths = input.map(path => convertToUnixPath(path));
	const filePaths = glob ? await fg(unixFilePaths, {onlyFiles: true}) : input;

	return Promise.all(
		filePaths
			.filter(filePath => junk.not(path.basename(filePath)))
			.map(async filePath => {
				try {
					return await handleFile(filePath, options);
				} catch (error) {
					error.message = `Error occurred when handling file: ${input}\n\n${error.stack}`;
					throw error;
				}
			}),
	);
}

imagemin.buffer = async (input, {plugins = []} = {}) => {
	if (!Buffer.isBuffer(input)) {
		throw new TypeError(`Expected a \`Buffer\`, got \`${typeof input}\``);
	}

	if (plugins.length === 0) {
		return input;
	}

	return plugins.reduce(async (previous, current) => current(previous), input);
};

module.exports = imagemin;
