const fs = require('fs-extra');
const path = require('path');

function getSystemConfig() {
				try {
								const configPath = path.resolve(process.cwd(), 'src/system/config/system.json');

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

ATUALIZAÇÕES:
${updates}
`;

				} catch (err) {
								return 'Erro ao carregar configurações do sistema.';
				}
}

module.exports = {
				getSystemConfig
};