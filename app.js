const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
				res.send('DBLS SYSTEM 1.1.1 rodando');
});

app.listen(3000, () => {
				console.log('Servidor rodando em http://localhost:3000');
});	