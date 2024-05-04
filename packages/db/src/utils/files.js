const fs = require("fs");
const fsPromises = require("fs").promises;

function saveFile(data, filePath) {
	fs.writeFile(filePath, JSON.stringify(data), "utf-8", (error) => {
		if (error) {
			console.error(error);
		} else {
			console.log("💾 Data saved to file : ", filePath);
		}
	});
}

async function readFile(filePath) {
	let data = await fsPromises.readFile(filePath, "utf-8", "binary");
	data = Buffer.from(data).toString();
	data = JSON.parse(data);
	return data;
}

function fileStats(file) {
	let { mtime } = fs.statSync(file);
	mtime = setUTCTimezone(mtime);
	return { modified: mtime };
}

module.exports = {
	saveFile,
	readFile,
	fileStats
};
