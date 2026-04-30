const commands = [
				'c',
				'd',
				'lr',
				'vai-para',
				'voltar',
				'config',
				'manual',
				'encerrar',
				'exit',
				'start',
				'limpar',
				'cls'
];

// normalização básica (evita erro por maiúscula ou espaço)
function normalize(str) {
				return str
								.toLowerCase()
								.trim();
}

// levenshtein otimizado (menos memória)
function levenshtein(a, b) {
				const lenA = a.length;
				const lenB = b.length;

				if (lenA === 0) return lenB;
				if (lenB === 0) return lenA;

				let prev = new Array(lenB + 1);
				let curr = new Array(lenB + 1);

				for (let j = 0; j <= lenB; j++) prev[j] = j;

				for (let i = 1; i <= lenA; i++) {
								curr[0] = i;

								for (let j = 1; j <= lenB; j++) {
												const cost = a[i - 1] === b[j - 1] ? 0 : 1;

												curr[j] = Math.min(
																prev[j] + 1,        // remoção
																curr[j - 1] + 1,    // inserção
																prev[j - 1] + cost  // substituição
												);
								}

								[prev, curr] = [curr, prev];
				}

				return prev[lenB];
}

// similaridade relativa (melhora precisão)
function similarity(a, b) {
				const dist = levenshtein(a, b);
				const maxLen = Math.max(a.length, b.length);
				return 1 - dist / maxLen;
}

function suggest(input) {
				const normalizedInput = normalize(input);

				let best = null;
				let bestScore = 0;

				for (const cmd of commands) {
								const score = similarity(normalizedInput, cmd);

								if (score > bestScore) {
												bestScore = score;
												best = cmd;
								}
				}

				// threshold mais inteligente
				if (bestScore >= 0.5 && best !== normalizedInput) {
								return `você errou ao digitar "${input}". Você quis dizer "${best}"?`;
				}

				return `você errou ao digitar "${input}" e o sistema não reconhece.`;
}

module.exports = suggest;