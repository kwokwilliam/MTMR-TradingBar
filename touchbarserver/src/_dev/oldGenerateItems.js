const fs = require('fs');

const stocksToWatch = ["SPY", "AAPL", "BA", "TSLA", "IZEA"];

const persistentRight = [
	// {
	// 	type: "shellScriptTitledButton",
	// 	autoResize: true,
	// 	width: 100,
	// 	refreshInterval: 0.5,
	// 	source: {
	// 		inline: `curl -s "http://localhost:42069/v1/display"`
	// 	},
	// 	align: "right"
	// },
	// {
	// 	"type": "staticButton",
	// 	"title": "ADD COUNT",
	// 	"align": "right",
	// 	"width": 100,
	// 	"action": "shellScript",
	// 	"executablePath": "/Users/williamk/go/bin/testbed",
	// 	"shellArguments": ["ADD"]
	// },

	{
		"type": "staticButton",
		"title": "e",
		align: "right",
		width: 20,
		"action": "appleScript",
		"actionAppleScript": {
			"inline": `activate application "Visual Studio Code"\rtell application "Visual Studio Code" to open ("/Users/williamk/Utils/Tickers" as POSIX file)\rtell application "Visual Studio Code" to open ("Users/williamk/Library/Application Support/MTMR" as POSIX file)`
		}
	}, {
		"type": "brightness",
		"width": 80,
		"image": {
			"base64": "iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAGUExURffLOPfLNyaSVzUAAAACdFJOU/kBxOqnWgAAAbJJREFUSMfVljtyhDAQBVulQCFH4CgcDR1NR9ERFBKoeA5GfGddtkNvwFINFKP5tED22+Zxwviv6QVKfIEc/iNoF5gkpLIeYI8SUp4PsAUJiekADQntF6isQjvxCTrhAJlFqMMBeIH9BMsD7DAb2BhvYbIyNAOCZIWqYKGTpDZJFQu9EKVd44RxQRq3IrULWD62C8wSssWUZEsR0k6wcDOrJZmoBpMKI+s5qkBQCQOUJADVOECdOsDS0gDbsgHMfT4rVwHSrZQFIN5ABka8BgDgAeZ+BztBgvUEnSgVlhNsTFJjvoF5HAZorBpdYKAiSRbqNyBIUr6AjZMdPwO72R40MElS+wZUWA+wQ6LAYkFvdIhkmA+wQSDDdIAGAZ6A34H0x0fca11gBZZsIHSIfnE/5+NjCn/OuiuUB+/aunZwDeNayjXdTpDN0wlY+r1PfWu75nfj8RogN2JuCN2Y5qgMwTI0wGPUnQw6Qarx0sVNKA5Mn6VUL22lIbZoYitDbPmlvocc9Umfl2D7adz1reC3pF8av4m+DCenp/ndZuG3E7fhuC3pH2+vnz8V3MfE+bnxBTXuuIMTrLWHAAAAAElFTkSuQmCC"
		},
		"align": "right"
	},
	{
		"type": "volume",
		"width": 80,
		"align": "right"
	},
	{
		"type": "timeButton",
		"formatTemplate": "HH:mm",
		width: 50,
		"align": "right",
		"bordered": false
	}];

const generateStocksButton = () => {
	let finalGroup = {
		type: "group",
		align: "center",
		bordered: true,
		title: "stonks 📈📉📈",
		items: [
			{
				type: "close",
				width: 64
			},
			{
				type: "shellScriptTitledButton",
				width: 50,
				bordered: false,
				autoResize: true,
				source: {
					inline: "curl http://localhost:9999/v1/fetch/start"
				}
			},
		]
	};
	stocksToWatch.forEach(stock => {
		finalGroup.items.push({
			action: "openUrl",
			url: `https://robinhood.com/stocks/${stock}`,
			longAction: "openUrl",
			longUrl: `https://www.barchart.com/stocks/quotes/${stock}`,
			type: "shellScriptTitledButton",
			autoResize: true,
			width: 120,
			refreshInterval: 1,
			source: {
				// inline: `sh ~/Utils/Tickers/main.sh ${stock} | python ~/Utils/Tickers/parser.py`
				inline: `curl http://localhost:9999/v1/ticker/${stock}`
			}
		})
	});

	persistentRight.forEach(button => {
		finalGroup.items.push(button);
	})

	return [finalGroup, {
		type: "shellScriptTitledButton",
		autoResize: true,
		width: 50,
		bordered: false,
		source: {
			inline: "curl http://localhost:9999/v1/fetch/stop"
		}
	},
		// {
		// 		type: "shellScriptTitledButton",
		// 		autoResize: true,
		// 		width: 50,
		// 		bordered: true,
		// 		source: {
		// 			inline: "curl http://localhost:9999/v1/tester/show"
		// 		},
		// 		action: "shellScript",
		// 		executablePath: "/usr/bin/curl",
		// 		shellArguments: [
		// 			"http://localhost:9999/v1/tester/increment"
		// 		],
		// 		refreshInterval: 1
		// 	}
	]
}

const finalCompiled = [
	generateStocksButton(),
	persistentRight
]

const compile = () => {
	let final = [];
	final = final.concat(...finalCompiled);
	return final;
}

if (fs.existsSync(`${__dirname}/items.json`)) {
	fs.copyFileSync(`${__dirname}/items.json`, `${__dirname}/items_backup.json`);
}
fs.writeFileSync(`${__dirname}/items.json`, JSON.stringify(compile(), null, 2));