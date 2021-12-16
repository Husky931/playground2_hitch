//https://github.com/microsoft/monaco-languages/blob/master/src/javascript/javascript.ts

import { languages } from "monaco-editor/esm/vs/editor/editor.api"

export default <languages.LanguageConfiguration>{
	wordPattern:
		/(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

	comments: {
		lineComment: '//',
		blockComment: ['/*', '*/']
	},

	brackets: [
		['{', '}'],
		['[', ']'],
		['(', ')']
	],

	onEnterRules: [
		{
			// e.g. /** | */
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			afterText: /^\s*\*\/$/,
			action: {
				indentAction: languages.IndentAction.IndentOutdent,
				appendText: ' * '
			}
		},
		{
			// e.g. /** ...|
			beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
			action: {
				indentAction: languages.IndentAction.None,
				appendText: ' * '
			}
		},
		{
			// e.g.  * ...|
			beforeText: /^(\t|(\ \ ))*\ \*(\ ([^\*]|\*(?!\/))*)?$/,
			action: {
				indentAction: languages.IndentAction.None,
				appendText: '* '
			}
		},
		{
			// e.g.  */|
			beforeText: /^(\t|(\ \ ))*\ \*\/\s*$/,
			action: {
				indentAction: languages.IndentAction.None,
				removeText: 1
			}
		}
	],

	autoClosingPairs: [
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
		{ open: '(', close: ')' },
		{ open: '"', close: '"', notIn: ['string'] },
		{ open: "'", close: "'", notIn: ['string', 'comment'] },
		{ open: '`', close: '`', notIn: ['string', 'comment'] },
		{ open: '/**', close: ' */', notIn: ['string'] }
	],

	folding: {
		markers: {
			start: new RegExp('^\\s*//\\s*#?region\\b'),
			end: new RegExp('^\\s*//\\s*#?endregion\\b')
		}
	}
}