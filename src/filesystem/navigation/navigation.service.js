const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

let mode = 'local';

const storagePath = path.join(__dirname, '../../../storage');
const realPath = 'C:\\Users';
const filesJsonPath = path.join(__dirname, '../../data/files.json');

function getState() {
				return fs.readJsonSync(filesJsonPath);
}

function saveState(state) {
				fs.writeJsonSync(filesJsonPath, state, { spaces: 2 });
}

function setMode(newMode) {
				mode = newMode;

				const state = getState();
				state.current = mode === 'admin' ? 'C:\\Users' : 'C:\\DB\\user';

				saveState(state);
}

function getCurrentPath() {
				const state = getState();

				if (mode === 'admin') {
								let relative = state.current.replace('C:\\Users', '');

								if (relative.startsWith('\\')) {
												relative = relative.slice(1);
								}

								return relative ? path.join(realPath, relative) : realPath;
				}

				const relative = state.current.replace('C:\\', '');
				return path.join(storagePath, relative);
}

function changeDirectory(folderName) {
				const state = getState();
				const currentPath = getCurrentPath();

				const targetPath = path.join(currentPath, folderName);

				if (!fs.existsSync(targetPath)) {
								return `Pasta -> ${folderName} <- não existe.`;
				}

				state.current += `\\${folderName}`;
				saveState(state);

				return `Diretório alterado para --> ${state.current}`;
}

function goBack() {
				const state = getState();
				const parts = state.current.replace('C:\\', '').split('\\');

				if (parts.length <= 2 && mode === 'local') {
								return 'Você já está no diretório raiz permitido.';
				}

				parts.pop();

				state.current = 'C:\\' + parts.join('\\');
				saveState(state);

				return `Diretório alterado para -> ${state.current}`;
}

function openFolder(targetPath) {
				try {
								if (!fs.existsSync(targetPath)) {
												return `Caminho -> ${targetPath} <- não encontrado...`;
								}

								exec(`start "" "${targetPath}"`);
								return `Abrindo ${targetPath}...`;

				} catch {
								return "Erro ao abrir pasta.";
				}
}

function startCommand(param) {
				const current = getCurrentPath();

				if (param === 'local') {
								return openFolder(current);
				}

				if (param?.startsWith('--p')) {
								const folder = param.split('=')[1];
								const target = path.join(current, folder);
								return openFolder(target);
				}

				return "Erro no comando start. Reparar erro.";
}

module.exports = {
				setMode,
				changeDirectory,
				goBack,
				getCurrentPath,
				startCommand
};