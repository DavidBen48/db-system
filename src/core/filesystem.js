// system -> machine
const os = require('os');
const { execSync } = require('child_process');

// path global
const fs = require('fs-extra');
const path = require('path');

// executável
const { exec } = require('child_process');

// .env
require('dotenv').config();

// modo
let mode = 'local';

// caminhos
const storagePath = path.join(__dirname, '../../storage'); // -> localstorage
const realPath = 'C:\\Users'; // -> machine

const filesJsonPath = path.join(__dirname, '../data/files.json');

// pastas sensíveis
const adminFolders = [
				'AppData',
				'ProgramData',
				'Windows',
				'Windows64',
				'System32',
				'Temp'
];

// ESTRUTURAR DEPOIS/OUTRO DIA
// const adminFile = [
// 				'sys'
// ]
// ---------------------------

// estado
function getState() {
				return fs.readJsonSync(filesJsonPath);
}

function saveState(state) {
				fs.writeJsonSync(filesJsonPath, state, { spaces: 2 });
}

// modo
function setMode(newMode) {
				mode = newMode;

				const state = getState();

				state.current = mode === 'admin'
								? 'C:\\Users'
								: 'C:\\DB\\user';

				saveState(state);
}

// path atual
function getCurrentPath() {
				const state = getState();

				if (mode === 'admin') {
								let relative = state.current.replace('C:\\Users', '');

								if (relative.startsWith('\\')) {
												relative = relative.slice(1);
								}

								return relative
												? path.join(realPath, relative)
												: realPath;
				}

				const relative = state.current.replace('C:\\', '');
				return path.join(storagePath, relative);
}

// label
function getLabel(item, stats, denied = false, parentIsAdmin = false) {

				if (denied) {
								return stats?.isDirectory()
												? `[PASTA]=[NEGADO] ${item}`
												: `[ARQUIVO]=[NEGADO] ${item}`;
				}

				// pasta
				if (stats.isDirectory()) {

								if (adminFolders.includes(item)) {
												return `[PASTA-ADMIN]=[CRÍTICO] ${item}`;
								}

								return `[PASTA] ${item}`;
				}

				// arquivo
				if (parentIsAdmin) {
								return `[ARQUIVO-ADMIN]=[CRÍTICO] ${item}`;
				}

				return `[ARQUIVO] ${item}`;
}

// listar pasta específica
function listSpecific(folderName, type = null) {
				try {
								const current = getCurrentPath();
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

// listar atual
function listDetailed(type = null) {
				try {
								const dir = getCurrentPath();

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

// navegar
function changeDirectory(folderName) {
				const state = getState();
				const currentPath = getCurrentPath();

				const targetPath = path.join(currentPath, folderName);

				if (!fs.existsSync(targetPath)) return `Pasta -> ${folderName} <- não existe.`;

				state.current += `\\${folderName}`;
				saveState(state);

				return `Diretório alterado para -> ${state.current}`;
}

// voltar
function goBack() {
				const state = getState();
				const parts = state.current.replace('C:\\', '').split('\\');

				if (parts.length <= 2 && mode === 'local') return 'Você já está no diretório raiz permitido.';

				parts.pop();

				state.current = 'C:\\' + parts.join('\\');
				saveState(state);

				return `Diretório alterado para -> ${state.current}`;
}

// config -> system
function getSystemConfig() {
				try {
								const configPath = path.join(__dirname, '../config/system.json');

								if (!fs.existsSync(configPath)) {
												return 'Arquivo de configuração não encontrado.';
								}

								const data = fs.readJsonSync(configPath);

								let updates = 'Nenhuma atualização encontrada.';

								if (Array.isArray(data.updates) && data.updates.length > 0) {
												updates = data.updates.map(u => {
																const version = u.version || 'N/A';
																const desc = u.description || 'Sem descrição';
																const beta = u.beta !== undefined ? u.beta : 'N/A';
																const local = u.local || 'N/A';

																return `--> v${version}\n${desc}\nbeta: ${beta} | local: ${local}\n`;
												}).join('\n');
								}

								return `
-------------------------------------
| SISTEMA
| Nome.............: ${process.env.NOME_SYS}
| Descrição........: ${data.description || 'N/A'}
|
| INFORMAÇÕES
| Versão Atual.....: ${data.version || 'N/A'}
| Empresa..........: ${data.enterprise || 'N/A'}
| Fundador.........: ${data.ceo || 'N/A'}
|
| LANÇAMENTOS
| Beta.............: ${process.env.DATA_LOCALSTORAGE}
| Machine..........: ${process.env.DATA_MACHINE}
-------------------------------------

ATUALIZAÇÕES:
${updates}
`;

				} catch (err) {
								return 'Erro ao carregar configurações do sistema.';
				}
}

// config -> máquina
function getMachineInfo() {
				try {

								const hostname = os.hostname();
								const platform = os.platform();
								const arch = os.arch();
								const release = os.release();

								let manufacturer = 'N/A';
								let model = 'N/A';
								let serial = 'N/A';

								try {
												manufacturer = execSync('wmic computersystem get manufacturer')
																.toString().split('\n')[1].trim();

												model = execSync('wmic computersystem get model')
																.toString().split('\n')[1].trim();

												serial = execSync('wmic bios get serialnumber')
																.toString().split('\n')[1].trim();

								} catch {
												// fallback silencioso
								}

								return `
-------------------------------------
| MACHINE INFO
| Nome.............: ${hostname}
| Sistema..........: ${platform}
| Versão...........: ${release}
| Arquitetura......: ${arch}
|
| Fabricante.......: ${manufacturer}
| Modelo...........: ${model}
| Serial...........: ${serial}
-------------------------------------
`;

				} catch {
								return 'Erro ao obter informações da máquina.';
				}
}

// criar pasta
function createFolder(name) {
				const dir = getCurrentPath();

				fs.ensureDirSync(path.join(dir, name));

				return `Pasta -> ${name} <- criada`;
}

// criar arquivo
function createFile(name, type) {
				const dir = getCurrentPath();
				const filePath = path.join(dir, `${name}.${type}`);

				fs.writeFileSync(filePath, '');

				return `Arquivo -> ${name}.${type} <- criado`;
}

// deletar arquivo
function deleteFile(name, type, force = false) {
				const dir = getCurrentPath();
				const filePath = path.join(dir, `${name}.${type}`);

				if (!fs.existsSync(filePath)) return 'Arquivo não encontrado...';


				if (mode === 'admin' && !force) {
								return 'Ação bloqueada. Use --force para confirmar.';
				}

				fs.removeSync(filePath);

				return `Arquivo -> ${name}.${type} <- deletado`;
}

// deletar pasta
function deleteFolder(name, force = false) {
				const dir = getCurrentPath();
				const folderPath = path.join(dir, name);

				if (!fs.existsSync(folderPath)) return 'Pasta não encontrada...';

				if (mode === 'admin' && !force) {
								return 'Ação bloqueada. Use --force para confirmar.';
				}

				fs.removeSync(folderPath);

				return `Pasta -> ${name} <- deletada`;
}

// abrir pasta especificada
function openFolder(targetPath) {
				try {
								if(!fs.existsSync(targetPath)) {
												return `Caminho -> ${targetPath} <- não encontrado...`;
								}

								// executar no windows
								exec(`start "" "${targetPath}`);

								return `Abrindo ${targetPath}...`;

				} catch {
								return "Erro ao abrir pasta."
				}
}

// ação para abrir pasta atual/de um diretório
function startCommand(param) {
				const current = getCurrentPath();

				// start=local
				if(param === 'local') {
								return openFolder(current);
				}

				// start --p=pasta
				if (param?.startsWith('--p')) {
								const folder = param.split('=')[1];
								const target = path.join(current, folder);

								return openFolder(target);
				}

				// else
				return "Erro no comando start. Reparar erro."
}

module.exports = {
				setMode,
				listSpecific,
				listDetailed,
				changeDirectory,
				goBack,
				getSystemConfig,
				getMachineInfo,
				createFolder,
				createFile,
				deleteFile,
				deleteFolder,
				startCommand,
};