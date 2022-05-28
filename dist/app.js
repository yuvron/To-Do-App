var icons;
(function (icons) {
    icons["edit"] = "<i class='fa-solid fa-pen'></i>";
    icons["delete"] = "<i class='fa-solid fa-trash'></i>";
    icons["up"] = "<i class='fa-solid fa-angle-up'>";
    icons["down"] = "<i class='fa-solid fa-angle-down'>";
})(icons || (icons = {}));
const newTaskContent = document.getElementById("new-content");
const newTaskButton = document.getElementById("new-button");
newTaskButton.addEventListener("click", () => {
    if (newTaskContent.value.length > 0)
        addTask(newTaskContent.value, false);
});
document.addEventListener("keydown", (event) => {
    if (document.activeElement === newTaskContent && event.code === "Enter" && newTaskContent.value.length > 0)
        addTask(newTaskContent.value, false);
});
// Add a new task to the list of tasks
function addTask(taskContent, isStoraged) {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.appendChild(createTask(taskContent));
    newTaskContent.value = "";
    updateTasksCounter();
    if (!isStoraged)
        addToStorage(taskContent);
}
// Create new Task
function createTask(text) {
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
    up.addEventListener("click", () => moveUp(newTask));
    down.addEventListener("click", () => moveDown(newTask));
    newTask.appendChild(arrowsCotainer);
    return newTask;
}
function updateTasksCounter() {
    const counter = document.getElementById("counter");
}
function toggleCheckbox(checkbox) {
    if (!checkbox.parentElement.classList.toggle("completed"))
        checkbox.checked = false;
}
function editTask(task) { }
function deleteTask(task, taskContent) {
    updateTasksCounter();
    removeFromStorage(taskContent.innerHTML);
    task.remove();
}
function moveUp(task) {
    const allTasks = [...document.querySelectorAll(".task")];
    const indexOfTask = allTasks.indexOf(task);
    if (indexOfTask > 0) {
        task.parentElement.insertBefore(task, allTasks[indexOfTask - 1]);
    }
}
function moveDown(task) {
    const allTasks = [...document.querySelectorAll(".task")];
    allTasks.push(document.getElementsByClassName("new")[0]);
    const indexOfTask = allTasks.indexOf(task);
    if (indexOfTask < allTasks.length - 2) {
        task.parentElement.insertBefore(task, allTasks[indexOfTask + 2]);
    }
}
function formatText(text) {
    return text.charAt(0).toUpperCase() + text.substring(1);
}
function addToStorage(taskContent) {
    let i = 0;
    while (localStorage.getItem(i.toString()) !== null) {
        i++;
    }
    localStorage.setItem(i.toString(), taskContent.toLowerCase());
}
function removeFromStorage(taskContent) {
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
function swapInStorage(keyA, keyB) {
    const tmp = localStorage.getItem(keyA);
    localStorage.setItem(keyA, localStorage.getItem(keyB));
    localStorage.setItem(keyB, tmp);
}
window.addEventListener("load", () => {
    const keys = [];
    for (const key in localStorage) {
        if (!isNaN(+key))
            keys.push(+key);
    }
    keys.sort((a, b) => a - b).forEach((key) => addTask(localStorage[key], true));
});
