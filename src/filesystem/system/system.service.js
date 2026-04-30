const fs = require('fs-extra');
const path = require('path');

function getSystemConfig() {
				try {
								const configPath = path.join(__dirname, '../../system/config/system.json');

								if (!fs.existsSync(configPath)) {
												return 'Arquivo de configuração não encontrado.';
								}

								const data = fs.readJsonSync(configPath);

								return `
-------------------------------------
| SISTEMA -> DB-SYSTEM
| Nome.............: ${data.name}
| Descrição........: ${data.description || 'N/A'}
|
| INFORMAÇÕES
| Versão Atual.....: ${data.version || 'N/A'}
| Empresa..........: ${data.enterprise || 'N/A'}
| Fundador.........: ${data.ceo || 'N/A'}
|
| LANÇAMENTOS
| Beta.............: ${data.startBeta}
| Machine..........: ${data.startMachine}
-------------------------------------
`;
				} catch {
								return 'Erro ao carregar configurações do sistema.';
				}
}

module.exports = { getSystemConfig };