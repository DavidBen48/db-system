const fsys = require('./filesystem');
const suggest = require('./smartError');

function parseCommand(input) {
				try {
								input = input.trim();

								if (input.startsWith('vai-para')) {
												const parts = input.split('->');
												if (parts.length < 2) {
																return 'Erro de sintaxe. Use: vai-para -> nome_da_pasta';
												}
												return fsys.changeDirectory(parts[1].trim());
								}

								const parts = input.split(' ');
								const cmd = parts[0];

								// criar
								if (cmd === 'c') {
												if (parts[1]?.startsWith('p=')) {
																return fsys.createFolder(parts[1].split('=')[1]);
												}

												if (parts[1]?.startsWith('a=')) {
																const name = parts[1].split('=')[1];
																const tipo = parts.find(p => p.startsWith('tipo='));

																if (!tipo) return 'Erro: tipo não informado';

																return fsys.createFile(name, tipo.split('=')[1]);
												}
								}

								// listar
								if (cmd === 'lr') {
												const tipoArg = parts.find(p => p.startsWith('--tipo='));
												const tipo = tipoArg ? tipoArg.split('=')[1] : null;

												// lr nome --tipo=x
												if (parts[1] && !parts[1].startsWith('--')) {
																return fsys.listSpecific(parts[1], tipo);
												}

												return fsys.listDetailed(tipo);
								}

								// deletar
								if (cmd === 'd') {

												const force = parts.includes('--force');

												if (parts[1]?.startsWith('p=')) {
																return fsys.deleteFolder(parts[1].split('=')[1], force);
												}

												if (parts[1]?.startsWith('a=')) {
																const name = parts[1].split('=')[1];
																const tipo = parts.find(p => p.startsWith('tipo='));

																if (!tipo) return 'Erro: tipo não informado';

																return fsys.deleteFile(name, tipo.split('=')[1], force);
												}
								}

								if (cmd === 'voltar') return fsys.goBack();

								if (cmd === 'config') {

												// config --machine
												if (parts.includes('--machine')) {
																return fsys.getMachineInfo();
												}

												return fsys.getSystemConfig();
								}

								if (cmd === 'limpar') return { action: 'clear' };
								if (cmd === 'encerrar') return { action: 'exit' };

								// start
								if (cmd.startsWith('start')) {
												// start=local
												if(cmd.includes('=')) {
																return fsys.startCommand(cmd.split('=')[1]);
												}

												// start --p=nome
												const param = parts[1];
												return fsys.startCommand(param);
								}

								if (cmd === 'manual') {
												return `
c p=nome => Criar pasta
c a=nome tipo=txt => Criar arquivo

lr => Listar atual
lr nome => Listar pasta

lr nome --tipo=a => Apenas arquivos
lr nome --tipo=p => Apenas pastas

lr --tipo=a => Arquivos
lr --tipo=p => Pastas

vai-para -> pasta => Entrar
voltar => Voltar

start=local => Abrir pasta do diretório atual
start --p=pasta => Abrir uma pasta específica do diretório atual  

d a=nome tipo=txt => Deletar arquivo
d p=nome => Deletar pasta

--force => obrigatório no modo admin

config => Ver sistema
config --machine => Ver informações da máquina

encerrar => Sair
`;
								}

								return suggest(cmd);

				} catch {
								return 'Erro interno no sistema.';
				}
}

module.exports = parseCommand;