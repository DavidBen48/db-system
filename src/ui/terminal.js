#!/usr/bin/env node

const blessed = require('neo-blessed');
const parseCommand = require('../core/parser');

const fsys = require('../filesystem');
const fs = require('fs-extra');

const path = require('path');
const filesJsonPath = path.join(__dirname, '../data/files.json');

function getPrompt() {
				const state = fs.readJsonSync(filesJsonPath);
				return state.current + '>';
}

// tela
const screen = blessed.screen({
				smartCSR: true,
				title: 'DB.System'
});

// terminal
const terminal = blessed.box({
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				scrollable: true,
				alwaysScroll: true,
				keys: true,
				mouse: true,
				style: {
								fg: 'green',
								bg: 'black'
				}
});

screen.append(terminal);

// buffer
let content = [];
let currentInput = '';
let initialized = false;

// print
function print(text = '') {
				if (!text) return;
				content.push(...text.split('\n'));
}

// prompt
function addPrompt() {
				content.push(getPrompt());
}

// render
function render() {
				content[content.length - 1] = getPrompt() + currentInput;
				terminal.setContent(content.join('\n'));
				terminal.setScrollPerc(100);
				screen.render();
}

// inicial
content.push('DB.SYSTEM 1');
content.push('');
content.push('[Servidor Teste]  -> digite "localstorage"');
content.push('[Sua Máquina]     -> digite "admin"');
content.push('');
addPrompt();
render();

// input
screen.on('keypress', (ch, key) => {

				if (key.name === 'enter') {
								const input = currentInput.trim();
								currentInput = '';

								// escolha modo
								if (!initialized) {
												if (input === 'localstorage') {
																fsys.setMode('local');
																print('Modo local ativado');
																initialized = true;
												} else if (input === 'admin') {
																fsys.setMode('admin');
																print('Modo ADMIN ativado');
																initialized = true;
												} else {
																print('Escolha inválida');
												}

												addPrompt();
												render();
												return;
								}

								const result = parseCommand(input);

								if (typeof result === 'object') {
												if (result.action === 'clear') {
																content = ['DB.SYSTEM 1'];
																addPrompt();
																render();
																return;
												}

												if (result.action === 'exit') {
																print('Encerrando...');
																render();
																setTimeout(() => process.exit(0), 500);
																return;
												}
								}

								print(result);
								addPrompt();
								render();
								return;
				}

				if (key.name === 'backspace') {
								currentInput = currentInput.slice(0, -1);
								render();
								return;
				}

				if (!ch) return;

				currentInput += ch;
				render();
});

// scroll
screen.key(['up'], () => {
				terminal.scroll(-1);
				screen.render();
});

screen.key(['down'], () => {
				terminal.scroll(1);
				screen.render();
});

// sair
screen.key(['escape', 'C-c'], () => process.exit(0));

screen.render();