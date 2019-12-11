import { Context } from "../context/context";
import find from 'find-process';
import runApplescript from 'run-applescript';

export const startCheckMTMRRunning = (context: Context) => {
	checkMTMRRunning();
	setInterval(() => {
		checkMTMRRunning()
	}, 10000);
}

async function checkMTMRRunning() {
	const list = await find('name', 'MTMR');
	let found = false;
	list.forEach(item => {
		if (item.name === "MTMR") {
			found = true;
		}
	})
	if (!found) {
		console.log("Opening MTMR...");
		try {
			const result = await runApplescript('tell application "MTMR" to activate');
			console.log(result);
		} catch (e) {
			console.log(e);
		}
	}
}