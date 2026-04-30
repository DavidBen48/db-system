const fs = require('fs-extra');
const path = require('path');
const navigation = require('../navigation/navigation.service');

const adminFolders = [
				'AppData',
				'ProgramData',
				'Windows',
				'Windows64',
				'System32',
				'System64',
				'Temp'
];

function getLabel(item, stats, denied = false, parentIsAdmin = false) {
				if (denied) {
								return stats?.isDirectory()
												? `[PASTA]=[NEGADO] ${item}`
												: `[ARQUIVO]=[NEGADO] ${item}`;
				}

				if (stats.isDirectory()) {
								if (adminFolders.includes(item)) {
												return `[PASTA-ADMIN]=[CRÍTICO] ${item}`;
								}
								return `[PASTA] ${item}`;
				}

				if (parentIsAdmin) {
								return `[ARQUIVO-ADMIN]=[CRÍTICO] ${item}`;
				}

				return `[ARQUIVO] ${item}`;
}

function listDetailed(type = null) {
				try {
								const dir = navigation.getCurrentPath();

								if (!fs.existsSync(dir)) return 'Diretório não existe.';

								const items = fs.readdirSync(dir);
								let result = [];

								items.forEach(item => {
												const fullPath = path.join(dir, item);

												try {
																const stats = fs.statSync(fullPath);
																const parentIsAdmin = adminFolders.includes(path.basename(dir));

																if (stats.isFile() && (!type || type === 'a')) {
																				result.push(getLabel(item, stats, false, parentIsAdmin));
																}

																if (stats.isDirectory() && (!type || type === 'p')) {
																				result.push(getLabel(item, stats));
																}

												} catch {
																result.push(getLabel(item, null, true));
												}
								});

								return result.length ? result.join('\n') : 'Diretório vazio.';

				} catch {
								return 'Erro ao acessar diretório.';
				}
}

function listSpecific(folderName, type = null) {
				try {
								const current = navigation.getCurrentPath();
								const target = path.join(current, folderName);

								if (!fs.existsSync(target)) {
												return `Pasta '${folderName}' não existe.`;
								}

								const items = fs.readdirSync(target);
								let result = [];

								items.forEach(item => {
												const fullPath = path.join(target, item);

												try {
																const stats = fs.statSync(fullPath);
																const parentIsAdmin = adminFolders.includes(folderName);

																if (stats.isFile() && (!type || type === 'a')) {
																				result.push(getLabel(item, stats, false, parentIsAdmin));
																}

																if (stats.isDirectory() && (!type || type === 'p')) {
																				result.push(getLabel(item, stats));
																}

												} catch {
																result.push(getLabel(item, null, true));
												}
								});

								return result.length ? result.join('\n') : 'Diretório vazio.';

				} catch {
								return 'Erro ao acessar diretório.';
				}
}

function createFolder(name) {
				const dir = navigation.getCurrentPath();
				fs.ensureDirSync(path.join(dir, name));
				return `Pasta -> ${name} <- criada`;
}

function deleteFolder(name, force = false) {
				const dir = navigation.getCurrentPath();
				const folderPath = path.join(dir, name);

				if (!fs.existsSync(folderPath)) return 'Pasta não encontrada...';

				if (!force) {
								return 'Ação bloqueada. Use --force para confirmar.';
				}

				fs.removeSync(folderPath);
				return `Pasta -> ${name} <- deletada`;
}

module.exports = {
				listDetailed,
				listSpecific,
				createFolder,
				deleteFolder
};