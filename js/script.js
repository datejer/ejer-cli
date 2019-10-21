const output = document.querySelector(".output");
const input = document.querySelector(".input");
const tilde = document.querySelector(".tilde");

let currentDir = "~";
let user = `<span class="user"><span class="green username">guest@ejer.ga</span><span class="colon">:</span><span
class="blue tilde">~</span>$&nbsp;</span>`;

let directories = {
	"~": {

	},
	"~/projects": {

	}
};

input.addEventListener("keypress", event => {
	if (event.keyCode === 13 && input.value) execute(input.value);
});

function execute(inputted) {
	let args = inputted.split(/ +/g);
	let command = args.shift();
	let allArgs = args.join(" ");

	input.value = "";
	sendOutput(`${user}${inputted}`);

	switch (command) {
		case "clear":
			clear();
			break;
		case "exit":
			exit();
			break;
		case "help":
			help();
			break;
		case "ls":
			ls();
			break;
		case "cd":
			cd(allArgs);
			break;
		default:
			sendOutput(`<span>-bash: ${command}: command not found</span>`);
			break;
	}
}

function help() {
	sendOutput(
		`<span class="tabbed">
			<br>
			help - lists all commands <br>
			ls - list directory contents <br>
			cd - list directory contents <br>
			clear - clears the terminal window <br>
			exit - exits out of the terminal window <br>
		</span>`
	);
}

function changeDirs(dir) {
	return new Promise(resolve => {
		Object.keys(directories).forEach(key => {
			if (dir === key.replace(`${currentDir}`, "") || dir === key.replace(`${currentDir}/`, "")) {
				currentDir = `${currentDir}/${dir}`;
				user = `<span class="user"><span class="green username">guest@ejer.ga</span><span class="colon">:</span><span
class="blue tilde">${currentDir}</span>$&nbsp;</span>`;
				tilde.innerHTML = currentDir;
			}
		});
		resolve('resolved');
	});
}

async function cd(dir) {
	let temp = currentDir;

	if (dir === "..") {
		if (currentDir === "~") return sendOutput(`<span>-bash: cd: ${dir}: No such file or directory</span>`);
		currentDir = currentDir.substr(0, currentDir.lastIndexOf("\/"));
		user = `<span class="user"><span class="green username">guest@ejer.ga</span><span class="colon">:</span><span
class="blue tilde">${currentDir}</span>$&nbsp;</span>`;
		tilde.innerHTML = currentDir;
		return;
	} else if (!dir || dir === "~") {
		currentDir = "~";
		user = `<span class="user"><span class="green username">guest@ejer.ga</span><span class="colon">:</span><span
class="blue tilde">${currentDir}</span>$&nbsp;</span>`;
		tilde.innerHTML = currentDir;
		return;
	} else {
		await changeDirs(dir);
	}

	if (currentDir === temp) sendOutput(`<span>-bash: cd: ${dir}: No such file or directory</span>`);
}

function ls() {
	switch (currentDir) {
		case "~":
			Object.keys(directories).forEach(key => {
				sendOutput(JSON.parse(directories[key]));
			});
			break;
		default:
			break;
	}
}

function exit() {
	window.close();
}

function clear() {
	output.innerHTML = "";
}

function sendOutput(data) {
	output.innerHTML += `${data}<br>`;
}