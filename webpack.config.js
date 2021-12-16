const path = require("path")
module.exports = (env, argv) => ({
	"module": {
		"rules": [
			// {
			// 	test: /monaco-editor\/esm\/vs\/editor\/contrib\/suggest\/suggestWidget\.js$/,
			// 	loader: 'string-replace-loader',
			// 	options: {
			// 		search: 'var expandSuggestionDocsByDefault = false;',
			// 		replace: 'var expandSuggestionDocsByDefault = true;'
			// 	}
			// },
			{
				"oneOf": [
					{
						"test": /\.(ts|tsx|jsx|js)$/i,
						"exclude": [/webpack/, /babel/, /core-js/],
						"use": [
							{
								"loader": "babel-loader",
								"options": {
									"babelrc": false,
									"presets": [
										[
											"@babel/preset-env",
											{
												"useBuiltIns": "usage",
												"corejs": "core-js@3",
												"targets": {
													"chrome": "49"
												}
											}
										],
										"@babel/preset-react",
      									"@babel/preset-typescript"
									],
									"sourceType": "unambiguous"
								}
							}
						]
					},
					{
						"test": /\.css$/i,
						"use": [
							"style-loader",
							{
								"loader": "css-loader",
								"options": {
									"importLoaders": 1,
									"modules": true
								}
							},
							{
								"loader": "postcss-loader",
								"options": {
									"postcssOptions": {
										"plugins": [
											require('tailwindcss'),
											require('autoprefixer')
										]
									}
								}
							}
						],
						"include": /\.module.css$/i
					},
					{
						"test": /\.css$/i,
						"use": [
							"style-loader",
							{
								"loader": "css-loader",
								"options": {
									"importLoaders": 1
								}
							},
							{
								"loader": "postcss-loader",
								"options": {
									"postcssOptions": {
										"plugins": [
											require('tailwindcss'),
											require('autoprefixer')
										]
									}
								}
							}
						]
					},
					{
						"type": "asset/resource",
						"exclude": [/.(js|mjs|jsx|ts|tsx)$/, /.json$/]
					}
				]
			}
		]
	},
	"resolve": {
		"extensions": [
			".js",
			".ts",
			".jsx",
			".tsx",
			".css"
		],
        "fallback": {
            "fs": false
        }
	},
	"plugins": [
        new (require('html-webpack-plugin'))({
            meta: {
                viewport: 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no'
            },
            templateContent:
`<head>
	<title>Lingo3D</title>
	<script>window.VERSION = "${env.VERSION}"</script>
</head>
<body>
	<div id="app"></div>
</body>`
        }),
		new (require('webpack-notifier'))({ alwaysNotify: true }),
		// new (require('webpack-bundle-analyzer').BundleAnalyzerPlugin)(),
		new (require("monaco-editor-webpack-plugin"))({ languages: ["javascript", "typescript", "python", "html", "css"] }),
		new (require("node-polyfill-webpack-plugin"))()
	],
    "experiments": {
        "asyncWebAssembly": true 
    },
	"optimization": {
		"minimizer": [
			new (require('terser-webpack-plugin'))({
                terserOptions: {
                    safari10: true
                }
            })
		]
	},
	"mode": "development",
	"stats": {
		"children": true
	},
	"devtool": argv.mode === 'production' ? undefined : 'eval-cheap-source-map',
	"devServer": {
		"compress": true,
		"open": true,
		"host": "localhost",
		"port": 3000,
		"https": false,
		"hot": true
	}
})