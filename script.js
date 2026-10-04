// ---------- State ----------
const STORAGE_KEY = "student-task-manager.tasks";
let tasks = loadTasks();

// ---------- DOM elements ----------
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const searchInput = document.getElementById("search-input");
const taskList = document.getElementById("task-list");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");

// ---------- Storage ----------
function loadTasks() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save tasks:", error);
  }
}

// ---------- Actions ----------
function addTask(title, description) {
  tasks.unshift({
    id: Date.now().toString(),
    title: title,
    description: description,
    completed: false
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  const task = tasks.find(function (t) { return t.id === id; });
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(function (t) { return t.id !== id; });
  saveTasks();
  renderTasks();
}

// ---------- Rendering ----------
function renderTasks() {
  const query = searchInput.value.trim().toLowerCase();

  const visibleTasks = tasks.filter(function (task) {
    return (
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query)
    );
  });

  taskList.innerHTML = "";

  visibleTasks.forEach(function (task) {
    taskList.appendChild(createTaskElement(task));
  });

  taskCount.textContent = tasks.length;

  if (visibleTasks.length === 0) {
    emptyMessage.classList.remove("hidden");
    emptyMessage.textContent = tasks.length === 0
      ? "No tasks yet. Add your first one above."
      : "No tasks match your search.";
  } else {
    emptyMessage.classList.add("hidden");
  }
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item" + (task.completed ? " completed" : "");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark task as completed");
  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  const content = document.createElement("div");
  content.className = "task-content";

  const title = document.createElement("div");
  title.className = "task-title";
  title.textContent = task.title;
  content.appendChild(title);

  if (task.description) {
    const desc = document.createElement("div");
    desc.className = "task-desc";
    desc.textContent = task.description;
    content.appendChild(desc);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", function () {
    deleteTask(task.id);
  });

  li.appendChild(checkbox);
  li.appendChild(content);
  li.appendChild(deleteBtn);

  return li;
}

// ---------- Events ----------
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descInput.value.trim();

  if (!title) return;

  addTask(title, description);
  form.reset();
  titleInput.focus();
});

searchInput.addEventListener("input", renderTasks);

// ---------- Init ----------
renderTasks();
