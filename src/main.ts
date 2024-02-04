import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	message: string;
}

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "levenshteinDistance",
			description: "calculates the Levenshtein distance between two strings, with a normalization process to make it case insensitive and remove special characters.",
			author: "Oshimia",
			version: "2.0",
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
				description: "Takes in two strings and tells you how many single digit changes it would take to turn one into the other, if set to true will ignore case and special characters. Will also remove 'a', 'an' and 'the' from the start of a string.",
				usage: "levenshteinDistance[arg1, arg2]",
				examples: [
					{
						usage: "levenshteinDistance[this, that]",
						description: "expected output of 2, the number of changes to turn one string into another."
					},
					{
						usage: "levenshteinDistance[This!!@&*, that, true]",
						description: "expected output of 2, the number of changes to turn one string into another after ignoring special characters and case."
					},
					{
						usage: "levenshteinDistance[This!!@&*, an that, true]",
						description: "expected output of 2, the number of changes to turn one string into another after ignoring special characters, case and removing 'a', 'an' or 'the' from the start of the string."
					},
					{
						usage: "levenshteinDistance[$customVariable[exampleVariable1], $customVariable[exampleVariable2]]",
						description: "will compare two variables in a case sensitive manner and including special characters"
					},
					{
						usage: "levenshteinDistance[$customVariable[exampleVariable1], $customVariable[exampleVariable2]], true",
						description: "will compare two variables in a case insensitive manner, without including special characters and removing 'a', 'an' or 'the' from the start of a string"
					}
				],
				possibleDataOutput: ["number"],
			},
			evaluator: (_, s1, s2, normalize = false) => {

				console.log("test", normalize)

				if (normalize === "true" || normalize === "true") {
					s1 = s1.toLowerCase().replace(/[!@#$%^&*()_+\-=\[\]\{\}';"\\|,.<>\/?`~:]/g, "").replace(/\s+/g, " ").replace(/\b(a|an|the)\s+/i, "").trim();
					s2 = s2.toLowerCase().replace(/[!@#$%^&*()_+\-=\[\]\{\}';"\\|,.<>\/?`~:]/g, "").replace(/\s+/g, " ").replace(/\b(a|an|the)\s+/i, "").trim();
				}

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