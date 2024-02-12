import { Firebot } from "@crowbartools/firebot-custom-scripts-types";

interface Params {
	message: string;
}

function normalizeFunction(text: string) {
	return text
		.toLowerCase().replace(/[!@#$%^&*()_+\-=\[\]\{\}';"\\|,.<>\/?`~:]/g, "").replace(/\s+/g, " ").replace(/\b(a|an|the)\s+/i, "").trim();
}

function calculateLevenshteinDistance(s1: string, s2: string) {
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

const script: Firebot.CustomScript<Params> = {
	getScriptManifest: () => {
		return {
			name: "levenshteinDistance",
			description: "calculates the Levenshtein distance between two strings, with a normalization process to make it case insensitive and remove special characters. Can accept and choose between multiple answers that are separated by the '/' character",
			author: "Oshimia",
			version: "3.0",
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
				description: "Takes in two strings and tells you how many single digit changes it would take to turn one into the other. If multiAnswer is set to true will separate the answer string with the '/' delimiter and compare only against the most similar string. If normalize is set to true will ignore case and special characters and remove 'a', 'an' and 'the' from the start of a string.",
				usage: "levenshteinDistance[arg1, arg2]",
				examples: [
					{
						usage: "levenshteinDistance[this, that]",
						description: "expected output of 2, the number of changes to turn one string into another."
					},
					{
						usage: "levenshteinDistance[This!!@&*, that, false, true]",
						description: "expected output of 2, the number of changes to turn one string into another after ignoring special characters and case."
					},
					{
						usage: "levenshteinDistance[This!!@&*, an that, false, true]",
						description: "expected output of 2, the number of changes to turn one string into another after ignoring special characters, case and removing 'a', 'an' or 'the' from the start of the string."
					},
					{
						usage: "levenshteinDistance[$customVariable[exampleVariable1], $customVariable[exampleVariable2]]",
						description: "will compare two variables in a case sensitive manner and including special characters"
					},
					{
						usage: "levenshteinDistance[$customVariable[exampleVariable1], $customVariable[exampleVariable2]], false, true",
						description: "will compare two variables in a case insensitive manner, without including special characters and removing 'a', 'an' or 'the' from the start of a string"
					},
					{
						usage: "levenshteinDistance[this, that/or that, true, false]",
						description: "will separate the second string by the '/' symbol and compare the first string only against the answer with the closest Levenshtein distance in a case sensitive manner and including special characters."
					},
					{
						usage: "levenshteinDistance[this, that/or that, true, true]",
						description: "will separate the second string by the '/' symbol and compare the first string only against the answer with the closest Levenshtein distance in a case insensitive manner and not including any special characters."
					}
				],
				possibleDataOutput: ["number"],
			},
			evaluator: (_, chatInput, correctAnswer, multiAnswer = false, normalize = false) => {
				
				if (multiAnswer === true || multiAnswer === "true") {
					const possibleAnswers: string[] = correctAnswer.split("/").map((answer: string) => answer.trim());
					let minDistance = Infinity;
					let mostSimilarIndex = -1;

					for (let i = 0; i < possibleAnswers.length; i++) {
						const currentAnswer = possibleAnswers[i];
						const distance = calculateLevenshteinDistance(normalizeFunction(chatInput), normalizeFunction(currentAnswer));

						if (distance < minDistance) {
							minDistance = distance;
							mostSimilarIndex = i;
						}
					}

					// Update correctAnswer after the loop completes
					correctAnswer = possibleAnswers[mostSimilarIndex];
				}

				if (normalize === true || normalize === "true") {
					chatInput = normalizeFunction(chatInput);
					correctAnswer = normalizeFunction(correctAnswer);
				}

				return calculateLevenshteinDistance(chatInput, correctAnswer);
			}
		});
	},
};

export default script;