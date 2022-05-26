enum icons {
	edit = "<i class='fa-solid fa-pen'></i>",
	delete = "<i class='fa-solid fa-trash'></i>",
}

const newTaskContent = document.getElementById("new-content") as HTMLInputElement;
const newTaskButton = document.getElementById("new-button");

newTaskButton.addEventListener("click", () => {
	if (newTaskContent.value.length > 0) {
		const tasks = document.getElementsByClassName("task");
		const lastTask = [...tasks].pop();
		lastTask.insertAdjacentElement("afterend", createTask(newTaskContent.value));
		newTaskContent.value = "";
	}
});

// Create new Task
function createTask(text: string): HTMLElement {
	const newTask = document.createElement("div");
	newTask.classList.add("task");
	// Create checkbox
	const checkbox = document.createElement("input");
	checkbox.type = "radio";
	checkbox.classList.add("checkbox");
	newTask.appendChild(checkbox);
	// Create text
	const taskContent = document.createElement("span");
	text = formatText(text);
	taskContent.innerText = text;
	newTask.appendChild(taskContent);
	// Create edit button
	const edit = document.createElement("button");
	edit.classList.add("edit");
	edit.innerHTML = icons.edit;
	edit.addEventListener("click", () => deleteTask(newTask));
	newTask.appendChild(edit);
	// Create trash button
	const trash = document.createElement("button");
	trash.classList.add("delete");
	trash.innerHTML = icons.delete;
	trash.addEventListener("click", () => deleteTask(newTask));
	newTask.appendChild(trash);
	return newTask;
}

function deleteTask(task: HTMLElement) {
	task.remove();
}

function formatText(text: string): string {
	return text.charAt(0).toUpperCase() + text.substring(1);
}
