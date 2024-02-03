import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	message: string;
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "levenshteinDistance",
			description: "calculates the Levenshtein distance between two strings",
			author: "Oshimia",
			version: "1.0",
			firebotVersion: "5",
			startupOnly: true,
		};
	},
	getDefaultParameters: null,
	run: (runRequest) => {
		const { replaceVariableManager } = runRequest.modules;

		replaceVariableManager.registerReplaceVariable({
			definition: {
				handle: "levenshteinDistance",
				description: "Takes in two strings and tells you how many single digit changes it would take to turn one into the other.",
				usage: "levenshteinDistance[arg1, arg2]",
				examples: [
					{
						usage: "levenshteinDistance[this, that]",
						description: "expected output of 2, the number of changes to turn one string into another"
					}
				],
				possibleDataOutput: ["number"],
			},
			evaluator: (_, s1, s2) => {
				const m = s1.length;
				const n = s2.length;
				const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

				for (let i = 0; i <= m; i++) {
					for (let j = 0; j <= n; j++) {
						if (i === 0) {
							dp[i][j] = j;
						} else if (j === 0) {
							dp[i][j] = i;
						} else {
							dp[i][j] = Math.min(
								dp[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1),
								dp[i - 1][j] + 1,
								dp[i][j - 1] + 1
							);
						}
					}
				}

				return dp[m][n];
			}
		});
	},
};

export default script;