const fs = require('fs-extra');
const path = require('path');
const navigation = require('../navigation/navigation.service');

function createFile(name, type) {
				const dir = navigation.getCurrentPath();
				const filePath = path.join(dir, `${name}.${type}`);

				fs.writeFileSync(filePath, '');
				return `Arquivo -> ${name}.${type} <- criado`;
}

function deleteFile(name, type, force = false) {
				const dir = navigation.getCurrentPath();
				const filePath = path.join(dir, `${name}.${type}`);

				if (!fs.existsSync(filePath)) return 'Arquivo não encontrado...';

				if (!force) {
								return 'Ação bloqueada. Use --force para confirmar.';
				}

				fs.removeSync(filePath);
				return `Arquivo -> ${name}.${type} <- deletado`;
}

module.exports = {
				createFile,
				deleteFile
};