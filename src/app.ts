enum icons {
	edit = "<i class='fa-solid fa-pen'></i>",
	delete = "<i class='fa-solid fa-trash'></i>",
	up = "<i class='fa-solid fa-angle-up'>",
	down = "<i class='fa-solid fa-angle-down'>",
}

const newTaskContent = document.getElementById("new-content") as HTMLInputElement;
const newTaskButton = document.getElementById("new-button");

let tasksCounter = 0;

newTaskButton.addEventListener("click", () => {
	if (newTaskContent.value.length > 0) addTask(newTaskContent.value, false);
});

document.addEventListener("keydown", (event: KeyboardEvent) => {
	if (document.activeElement === newTaskContent && event.code === "Enter" && newTaskContent.value.length > 0) {
		addTask(newTaskContent.value, false);
	}
});

// Add a new task to the list of tasks
function addTask(taskContent: string, isStoraged: boolean): void {
	if (!isStoraged && isTask(taskContent)) {
		alert(`You already have a task saying: ${taskContent.toLowerCase()}`);
		return;
	}
	const tasksContainer = document.getElementById("tasks-container");
	tasksContainer.appendChild(createTask(taskContent));
	newTaskContent.value = "";
	updateTasksCounter(1);
	if (!isStoraged) addToStorage(taskContent);
}

function isTask(taskContent: string): boolean {
	for (const key in localStorage) {
		if (!isNaN(+key) && localStorage.getItem(key) === taskContent.toLowerCase()) return true;
	}
	return false;
}

// Create new Task
function createTask(text: string): HTMLElement {
	const newTask = document.createElement("div");
	newTask.classList.add("task");
	// Create checkbox
	const checkbox = document.createElement("input");
	checkbox.type = "radio";
	checkbox.classList.add("checkbox");
	checkbox.addEventListener("click", () => toggleCheckbox(checkbox));
	newTask.appendChild(checkbox);
	// Create text
	const taskContent = document.createElement("span");
	taskContent.classList.add("task-content");
	text = formatText(text);
	taskContent.innerText = text;
	newTask.appendChild(taskContent);
	// Create edit button
	const edit = document.createElement("button");
	edit.classList.add("edit");
	edit.innerHTML = icons.edit;
	edit.addEventListener("click", () => editTask(newTask));
	newTask.appendChild(edit);
	// Create trash button
	const trash = document.createElement("button");
	trash.classList.add("delete");
	trash.innerHTML = icons.delete;
	trash.addEventListener("click", () => deleteTask(newTask, taskContent));
	newTask.appendChild(trash);
	// Create Arrow buttons
	const arrowsCotainer = document.createElement("div");
	arrowsCotainer.classList.add("move");
	const up = document.createElement("button");
	const down = document.createElement("button");
	arrowsCotainer.appendChild(up);
	arrowsCotainer.appendChild(down);
	// up.classList.add("");
	// down.classList.add("");
	up.innerHTML = icons.up;
	down.innerHTML = icons.down;
	up.addEventListener("click", () => moveTask(newTask, "up"));
	down.addEventListener("click", () => moveTask(newTask, "down"));
	newTask.appendChild(arrowsCotainer);
	return newTask;
}

function updateTasksCounter(increment: 1 | -1): void {
	const counter = document.getElementById("counter");
	tasksCounter += increment;
	if (tasksCounter === 0) counter.innerHTML = "You don't have any open tasks";
	else counter.innerHTML = `You have ${tasksCounter} open tasks`;
}

function toggleCheckbox(checkbox: HTMLInputElement): void {
	if (!checkbox.parentElement.classList.toggle("completed")) checkbox.checked = false;
}

function editTask(task: HTMLElement): void {}

function deleteTask(task: HTMLElement, taskContent: HTMLElement) {
	updateTasksCounter(-1);
	removeFromStorage(taskContent.innerHTML);
	task.remove();
}

function formatText(text: string): string {
	return text.charAt(0).toUpperCase() + text.substring(1);
}

function moveTask(task: HTMLElement, direction: "up" | "down"): void {
	const allTasks = [...document.querySelectorAll(".task")];
	const indexOfTask = allTasks.indexOf(task);
	if (direction === "up" && indexOfTask > 0) allTasks[indexOfTask - 1].insertAdjacentElement("beforebegin", task);
	else if (direction === "down" && indexOfTask < allTasks.length - 1) allTasks[indexOfTask + 1].insertAdjacentElement("afterend", task);
	swapInStorage(indexOfTask.toString(), (direction === "up" ? +indexOfTask - 1 : +indexOfTask + 1).toString());
}

function addToStorage(taskContent: string): void {
	let i = 0;
	while (localStorage.getItem(i.toString()) !== null) {
		i++;
	}
	localStorage.setItem(i.toString(), taskContent.toLowerCase());
}

function removeFromStorage(taskContent: string): void {
	for (let key in localStorage) {
		if (!isNaN(+key) && localStorage[key] === taskContent.toLowerCase()) {
			localStorage.removeItem(key);
			key = (+key + 1).toString();
			while (localStorage.getItem(key) !== null) {
				localStorage.setItem((+key - 1).toString(), localStorage.getItem(key));
				localStorage.removeItem(key);
				key = (+key + 1).toString();
			}
			break;
		}
	}
}

function swapInStorage(keyA: string, keyB: string): void {
	const tmp = localStorage.getItem(keyA);
	localStorage.setItem(keyA, localStorage.getItem(keyB));
	localStorage.setItem(keyB, tmp);
}

window.addEventListener("load", () => {
	const keys: number[] = [];
	for (const key in localStorage) {
		if (!isNaN(+key)) keys.push(+key);
	}
	keys.sort((a, b) => a - b).forEach((key) => addTask(localStorage[key], true));
});
