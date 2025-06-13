const inputBox = document.getElementById("input-box");
const addTaskBtn = document.querySelector(".todo__add-btn");
const todoList = document.querySelector(".todo__list");
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
};

const displayTasks = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  todoList.innerHTML = "";
  if (tasks.length === 0) return;
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="todo__task">
        <span class="todo__task-time">${task.timestamp}</span>
        <span class="todo__task-text">${task.text}</span>
      </div>
      <button class="todo__update-btn" data-index="${index}">Update</button>
      <button class="todo__delete-btn" data-index="${index}">Delete</button>
    `;

    todoList.appendChild(li);
  });
  document.querySelectorAll(".todo__delete-btn").forEach((button) => {
    button.addEventListener("click", deleteTask);
  });
  document.querySelectorAll(".todo__update-btn").forEach((button) => {
    button.addEventListener("click", updateTask);
  });
};

const addTask = () => {
  const taskText = inputBox.value.trim();
  if (taskText === "") {
    alert("You must write something!");
    return;
  }
  const now = new Date();
  const formattedDateTime = now.toLocaleString("en-US");

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text: taskText, timestamp: formattedDateTime });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  inputBox.value = "";
  displayTasks();
};

const deleteTask = (e) => {
  const index = e.target.getAttribute("data-index");
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
};

const updateTask = (e) => {
  const index = e.target.getAttribute("data-index");
  const li = e.target.closest("li");
  const taskTextSpan = li.querySelector(".todo__task-text");
  const updateButton = e.target;

  // If already in edit mode, treat this as "Save"
  if (taskTextSpan.isContentEditable) {
    const updatedText = taskTextSpan.textContent.trim();

    if (updatedText === "") {
      alert("Task text cannot be empty!");
      return;
    }

    // Get fresh timestamp at the time of update
    const now = new Date();
    const updatedTimestamp = now.toLocaleString("en-US");

    // Update the task in localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].text = updatedText;
    tasks[index].timestamp = updatedTimestamp;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Exit edit mode
    taskTextSpan.contentEditable = false;
    taskTextSpan.style.border = "none";
    taskTextSpan.style.padding = "0";

    // Change button text back to "Update"
    updateButton.textContent = "Update";

    // Refresh the task list
    displayTasks();
  } else {
    // Enter edit mode
    taskTextSpan.contentEditable = true;
    taskTextSpan.focus();

    taskTextSpan.style.border = "1px solid #ccc";
    taskTextSpan.style.padding = "2px";

    // Change button text to "Save"
    updateButton.textContent = "Save";
    updateButton.style.backgroundColor = "#2a812a";
  }
};

addTaskBtn.addEventListener("click", addTask);
inputBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Optional: prevents form submission or page reload
    addTask();
  }
});
window.addEventListener("DOMContentLoaded", displayTasks);
