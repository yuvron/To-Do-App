const newTaskContent = document.getElementById("new-content");
const newTaskButton = document.getElementById("new-button");
newTaskButton.addEventListener("click", () => {
    const tasks = document.getElementsByClassName("task");
    const lastTask = [...tasks].pop();
    lastTask.insertAdjacentElement("afterend", createTask(newTaskContent.value));
    newTaskContent.value = "";
});
// Create new Task
function createTask(text) {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checkbox");
    newTask.appendChild(checkbox);
    // Create text
    const taskContent = document.createElement("span");
    taskContent.innerText = text;
    newTask.appendChild(taskContent);
    // Create trash button
    const trash = document.createElement("button");
    trash.innerHTML = "<i class='fa-solid fa-trash'></i>";
    trash.addEventListener("click", () => deleteTask(newTask));
    newTask.appendChild(trash);
    return newTask;
}
function deleteTask(task) {
    task.remove();
}
