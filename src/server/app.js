const express = require('express');
const fsys = require('../filesystem');

const app = express();

app.use(express.json());

// =========================
// SYSTEM
// =========================

app.get('/system', (req, res) => {
				try {
								const data = fsys.getSystemConfig();
								res.send(data);
				} catch {
								res.status(500).send('Erro ao obter system config');
				}
});

// =========================
// MACHINE
// =========================

app.get('/machine', (req, res) => {
				try {
								const data = fsys.getMachineInfo();
								res.send(data);
				} catch {
								res.status(500).send('Erro ao obter machine info');
				}
});

// =========================
// FILESYSTEM
// =========================

// listar atual
app.get('/fs/list', (req, res) => {
				const { tipo } = req.query;

				try {
								const data = fsys.listDetailed(tipo || null);
								res.send(data);
				} catch {
								res.status(500).send('Erro ao listar diretório');
				}
});

// listar pasta específica
app.get('/fs/list/:folder', (req, res) => {
				const { folder } = req.params;
				const { tipo } = req.query;

				try {
								const data = fsys.listSpecific(folder, tipo || null);
								res.send(data);
				} catch {
								res.status(500).send('Erro ao listar pasta');
				}
});

// criar pasta
app.post('/fs/folder', (req, res) => {
				const { name } = req.body;

				try {
								const result = fsys.createFolder(name);
								res.send(result);
				} catch {
								res.status(500).send('Erro ao criar pasta');
				}
});

// criar arquivo
app.post('/fs/file', (req, res) => {
				const { name, type } = req.body;

				try {
								const result = fsys.createFile(name, type);
								res.send(result);
				} catch {
								res.status(500).send('Erro ao criar arquivo');
				}
});

// deletar pasta
app.delete('/fs/folder', (req, res) => {
				const { name, force } = req.body;

				try {
								const result = fsys.deleteFolder(name, force);
								res.send(result);
				} catch {
								res.status(500).send('Erro ao deletar pasta');
				}
});

// deletar arquivo
app.delete('/fs/file', (req, res) => {
				const { name, type, force } = req.body;

				try {
								const result = fsys.deleteFile(name, type, force);
								res.send(result);
				} catch {
								res.status(500).send('Erro ao deletar arquivo');
				}
});

// navegação
app.post('/fs/cd', (req, res) => {
				const { folder } = req.body;

				try {
								const result = fsys.changeDirectory(folder);
								res.send(result);
				} catch {
								res.status(500).send('Erro ao navegar');
				}
});

app.post('/fs/back', (req, res) => {
				try {
								const result = fsys.goBack();
								res.send(result);
				} catch {
								res.status(500).send('Erro ao voltar');
				}
});

// start (abrir pasta)
app.post('/fs/start', (req, res) => {
				const { param } = req.body;

				try {
								const result = fsys.startCommand(param);
								res.send(result);
				} catch {
								res.status(500).send('Erro no start');
				}
});

// =========================

const PORT = 3000;

app.listen(PORT, () => {
				console.log(`API rodando em http://localhost:${PORT}`);
});