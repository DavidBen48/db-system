const os = require('os');

function getMachineInfo() {
				try {
								const hostname = os.hostname();
								const platform = os.platform();
								const arch = os.arch();

								return `
-------------------------------------
| MINHA MÁQUINA
| Nome.............: ${hostname}
| Sistema..........: ${platform}
| Arquitetura......: ${arch}
-------------------------------------
`;
				} catch {
								return 'Erro ao obter informações da máquina.';
				}
}

module.exports = { getMachineInfo };