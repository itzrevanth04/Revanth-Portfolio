// To-Do List App - Created by Revanth Kumar
// Thiranex Internship Task 3 - JavaScript Logic & State Management
console.log('To-Do App loaded - Revanth');

const inputBox = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");
const listContainer = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

let taskArray = JSON.parse(localStorage.getItem("myTasks")) || [];
let activeFilter = "all";

/* SAVE TASKS TO LOCAL STORAGE */
function storeTasks() {
  localStorage.setItem("myTasks", JSON.stringify(taskArray));
}

/* SHOW TASKS ON SCREEN */
function displayTasks(filter = "all") {
  listContainer.innerHTML = "";

  let visibleTasks = taskArray;
  if (filter === "active") {
    visibleTasks = taskArray.filter(item => !item.completed);
  }
  if (filter === "completed") {
    visibleTasks = taskArray.filter(item => item.completed);
  }

  visibleTasks.forEach(item => {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task-item");
    
    if (item.completed) {
      taskElement.classList.add("completed");
    }

    // ADDED EXTRA FEATURE: Checkbox for toggle
    taskElement.innerHTML = `
      <input type="checkbox" ${item.completed ? 'checked' : ''} class="check-box">
      <span>${item.text}</span>
      <div class="task-buttons">
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    /* TOGGLE COMPLETE - USING CHECKBOX */
    taskElement.querySelector(".check-box").addEventListener("click", (e) => {
      e.stopPropagation();
      item.completed = !item.completed;
      storeTasks();
      displayTasks(activeFilter);
    });

    /* DELETE TASK */
    taskElement.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      taskArray = taskArray.filter(t => t.id !== item.id);
      storeTasks();
      displayTasks(activeFilter);
    });

    /* EDIT TASK */
    taskElement.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const newText = prompt("Edit your task:", item.text);
      if (newText && newText.trim() !== "") {
        item.text = newText.trim();
        storeTasks();
        displayTasks(activeFilter);
      }
    });

    listContainer.appendChild(taskElement);
  });
}

/* ADD NEW TASK */
addButton.addEventListener("click", () => {
  const taskText = inputBox.value.trim();
  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const newItem = {
    id: Date.now(),
    text: taskText,
    completed: false
  };

  taskArray.push(newItem);
  storeTasks();
  displayTasks(activeFilter);
  inputBox.value = "";
});

/* FILTER BUTTONS */
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    displayTasks(activeFilter);
  });
});

/* LOAD TASKS ON PAGE LOAD */
displayTasks();