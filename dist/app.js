var icons;
(function (icons) {
    icons["edit"] = "<i class='fa-solid fa-pen'></i>";
    icons["doneEditing"] = "<i class='fa-solid fa-circle-check'></i>";
    icons["delete"] = "<i class='fa-solid fa-trash'></i>";
    icons["up"] = "<i class='fa-solid fa-angle-up'>";
    icons["down"] = "<i class='fa-solid fa-angle-down'>";
})(icons || (icons = {}));
const newTaskContent = document.getElementById("new-content");
const newTaskButton = document.getElementById("new-button");
let tasksCounter = 0;
let editedTask = undefined;
let editedContent = undefined;
// Adds a new task to the tasks panel
function addTask(taskContent, isStoraged) {
    if (!isStoraged && isTask(taskContent)) {
        alert(`You already have a task saying: ${taskContent.toLowerCase()}`);
        return;
    }
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.appendChild(createTask(taskContent));
    newTaskContent.value = "";
    updateTasksCounter(1);
    if (!isStoraged)
        addToStorage(taskContent);
}
// Returns wheter a task already exists
function isTask(taskContent) {
    for (const key in localStorage) {
        if (!isNaN(+key) && localStorage.getItem(key) === taskContent.toLowerCase())
            return true;
    }
    return false;
}
// Create a new task with all its attributes and returns it
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
    text = formatTask(text);
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
// Updates the tasks counter according to a given increment
function updateTasksCounter(increment) {
    const counter = document.getElementById("counter");
    tasksCounter += increment;
    if (tasksCounter === 0)
        counter.innerHTML = "You don't have any open tasks";
    else
        counter.innerHTML = `You have ${tasksCounter} open tasks`;
}
// Toggles the checkbox of a given task's input element
function toggleCheckbox(checkbox) {
    if (!checkbox.parentElement.classList.toggle("checked"))
        checkbox.checked = false;
}
// Opens the editor for a given task or finishes editing an edited task
function editTask(task) {
    if (editedTask) {
        const newTaskContent = editedTask.children[1];
        let finalTask = formatTask(newTaskContent.value);
        if (finalTask === "")
            finalTask = editedContent.innerHTML;
        else if (isTask(finalTask)) {
            alert(`You already have a task saying: ${finalTask.toLowerCase()}`);
            finalTask = editedContent.innerHTML;
        }
        editedTask.replaceChild(editedContent, editedTask.children[1]);
        editedTask.children[1].innerHTML = finalTask;
        editedTask.children[2].innerHTML = icons.edit;
        updateStorage([...document.querySelectorAll(".task")].indexOf(editedTask).toString(), finalTask);
        const editAnotherTask = editedTask === task;
        editedTask = undefined;
        editedContent = undefined;
        if (editAnotherTask)
            return;
    }
    const input = document.createElement("input");
    input.id = "edit-box";
    input.value = task.children[1].innerHTML;
    editedTask = task;
    editedContent = task.children[1];
    task.replaceChild(input, task.children[1]);
    input.focus();
    input.select();
    task.children[2].innerHTML = icons.doneEditing;
}
// Deletes a task from the tasks panel
function deleteTask(task, taskContent) {
    updateTasksCounter(-1);
    removeFromStorage(taskContent.innerHTML);
    task.remove();
}
// Gets an input and returns a formatted version of it
function formatTask(text) {
    return text.charAt(0).toUpperCase() + text.substring(1);
}
// Moves a task around the tasks panel according to a given direction
function moveTask(task, direction) {
    const allTasks = [...document.querySelectorAll(".task")];
    const indexOfTask = allTasks.indexOf(task);
    if (direction === "up" && indexOfTask > 0) {
        allTasks[indexOfTask - 1].insertAdjacentElement("beforebegin", task);
        swapInStorage(indexOfTask.toString(), (indexOfTask - 1).toString());
    }
    else if (direction === "down" && indexOfTask < allTasks.length - 1) {
        allTasks[indexOfTask + 1].insertAdjacentElement("afterend", task);
        swapInStorage(indexOfTask.toString(), (indexOfTask + 1).toString());
    }
}
// Adds a new task to the local storage
function addToStorage(taskContent) {
    let i = 0;
    while (localStorage.getItem(i.toString()) !== null) {
        i++;
    }
    localStorage.setItem(i.toString(), taskContent.toLowerCase());
}
// Removes a task from the local storage
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
// Swaps the places of two tasks in the local storage
function swapInStorage(keyA, keyB) {
    const tmp = localStorage.getItem(keyA);
    localStorage.setItem(keyA, localStorage.getItem(keyB).toLowerCase());
    localStorage.setItem(keyB, tmp.toLowerCase());
}
// Updates a task's content in the local storage
function updateStorage(taskIndex, newValue) {
    localStorage.setItem(taskIndex, newValue.toLowerCase());
}
// Add a new task when the add button is pressed
newTaskButton.addEventListener("click", () => {
    if (newTaskContent.value.length > 0)
        addTask(newTaskContent.value, false);
});
// Add a new task when the enter key is pressed
document.addEventListener("keydown", (event) => {
    if (document.activeElement === newTaskContent && event.code === "Enter" && newTaskContent.value.length > 0) {
        addTask(newTaskContent.value, false);
    }
});
// Adds all the tasks in the local storage when the window loads
window.addEventListener("load", () => {
    const keys = [];
    for (const key in localStorage) {
        if (!isNaN(+key))
            keys.push(+key);
    }
    keys.sort((a, b) => a - b).forEach((key) => addTask(localStorage[key], true));
});
