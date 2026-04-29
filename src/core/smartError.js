const commands = ['c', 'd', 'lr', 'vai-para', 'voltar', 'config', 'manual', 'encerrar'];

function levenshtein(a, b) {
				const matrix = [];

				for (let i = 0; i <= b.length; i++) matrix[i] = [i];
				for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

				for (let i = 1; i <= b.length; i++) {
								for (let j = 1; j <= a.length; j++) {
												if (b.charAt(i - 1) === a.charAt(j - 1)) {
																matrix[i][j] = matrix[i - 1][j - 1];
												} else {
																matrix[i][j] = Math.min(
																				matrix[i - 1][j - 1] + 1,
																				matrix[i][j - 1] + 1,
																				matrix[i - 1][j] + 1
																);
												}
								}
				}

				return matrix[b.length][a.length];
}

function suggest(input) {
				let best = null;
				let bestScore = Infinity;

				for (let cmd of commands) {
								const dist = levenshtein(input, cmd);
								if (dist < bestScore) {
												bestScore = dist;
												best = cmd;
								}
				}

				if (bestScore <= 2 && best !== input) {
								return `você errou ao digitar "${input}". Você quis dizer "${best}"?`;
				}

				return `você errou ao digitar "${input}" e o sistema não reconhece.`;
}

module.exports = suggest;