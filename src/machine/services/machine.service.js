const os = require('os');
const { execSync } = require('child_process');

function getMachineInfo() {
				try {
								const hostname = os.hostname();
								const platform = os.platform();
								const arch = os.arch();
								const release = os.release();

								const cpus = os.cpus();
								const cpuModel = cpus[0]?.model || 'N/A';
								const cpuCores = cpus.length;

								const totalRam = os.totalmem();
								const freeRam = os.freemem();
								const usedRam = totalRam - freeRam;
								const ramUsage = (usedRam / totalRam) * 100;

								let diskTotal = 'N/A';
								let diskFree = 'N/A';
								let diskUsage = null;

								try {
												const disk = execSync('wmic logicaldisk get size,freespace,caption')
																.toString().split('\n')[1];

												const parts = disk.trim().split(/\s+/);

												const free = parseInt(parts[1]);
												const total = parseInt(parts[2]);

												diskTotal = (total / 1024 / 1024 / 1024).toFixed(2) + ' GB';
												diskFree = (free / 1024 / 1024 / 1024).toFixed(2) + ' GB';

												diskUsage = ((total - free) / total) * 100;
								} catch {}

								function getStatus(value) {
												if (value === null || value === undefined) return 'UNDEFINED';
												if (value < 50) return 'EXCELENTE';
												if (value < 80) return 'MÉDIO';
												return 'RUIM';
								}

								const cpuLoad = os.loadavg()[0] * 100;

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
								} catch {}

								return `
-------------------------------------
| MINHA MÁQUINA
| Nome.............: ${hostname}
| Sistema..........: ${platform}
| Versão...........: ${release}
| Arquitetura......: ${arch}
|
| Fabricante.......: ${manufacturer}
| Modelo...........: ${model}
| Serial...........: ${serial}
|
| CPU..............: ${cpuModel}
| Núcleos..........: ${cpuCores}
| Uso..............: ${cpuLoad.toFixed(2)}%
| Status...........: [${getStatus(cpuLoad)}]
|
| RAM Total........: ${(totalRam / 1024 / 1024 / 1024).toFixed(2)} GB
| RAM Uso..........: ${ramUsage.toFixed(2)}%
| Status...........: [${getStatus(ramUsage)}]
|
| Disco Total......: ${diskTotal}
| Disco Livre......: ${diskFree}
| Uso..............: ${diskUsage ? diskUsage.toFixed(2) + '%' : 'N/A'}
| Status...........: [${getStatus(diskUsage)}]
-------------------------------------
`;

				} catch {
								return 'Erro ao obter informações da máquina.';
				}
}

module.exports = {
				getMachineInfo
};