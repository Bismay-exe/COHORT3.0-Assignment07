const addBtn = document.querySelector("#add-task-btn");
const formSection = document.querySelector("#form-section");
const closeBtn = document.querySelector("#form-close-btn");
const form = document.querySelector("form");
const tasksList = document.querySelector("#tasks");
const formTitle = document.querySelector("#form-title");
const formSubmitBtn = document.querySelector("#form-submit-btn");

const clearAllBtn = document.querySelector("#clearall-btn");

const themeBtn = document.querySelector("#theme-btn");
const themeIcon = document.querySelector("#theme-btn i");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");
const pendingCount = document.querySelector("#pending-count");

let tasksArr = [];
let taskIdCounter = 0;
let editingTaskId = null;


// LOCAL STORAGE - save tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasksArr));
    localStorage.setItem("taskIdCounter", taskIdCounter);
}

// LOCAL STORAGE - load tasks on page load
function loadTasks() {
    let saved = localStorage.getItem("tasks");
    if (saved) {
        tasksArr = JSON.parse(saved);
    }
    let savedCounter = localStorage.getItem("taskIdCounter");
    if (savedCounter) {
        taskIdCounter = parseInt(savedCounter);
    }

    // load saved theme
    let savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
        if (savedTheme === "dark") {
            themeIcon.className = "ri-moon-line";
        } else {
            themeIcon.className = "ri-sun-line";
        }
    }

    renderTasks();
    updateCounters();
}


// UPDATE COUNTERS
function updateCounters() {
    let total = tasksArr.length;
    let completed = 0;

    for (let i = 0; i < tasksArr.length; i++) {
        if (tasksArr[i].status === "completed") {
            completed++;
        }
    }

    let pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
}


// 1. TASK CREATION MODULE
// Uses createElement(), createTextNode(), append(), appendChild()

function renderTasks() {
    tasksList.innerHTML = "";

    tasksArr.forEach(function (task) {

        tasksList.innerHTML += `
            <div class="task-card"
                data-id="${task.id}"
                data-status="${task.status}"
                data-category="${task.category}">

                <div class="card-left">
                    <button class="check-box-btn" data-action="complete">
                        <i class="ri-checkbox-blank-circle-line check-box unchecked ${task.status === "completed" ? "checked-hidden" : ""}"></i>
                        <i class="ri-checkbox-circle-line check-box checked ${task.status === "completed" ? "checked-visible" : ""}"></i>
                    </button>
                </div>

                <div class="card-center">
                    <h3 class="task-text ${task.status === "completed" ? "task-done" : ""}">
                        ${task.name}
                    </h3>

                    <h4 class="subject-text">
                        #${task.category}
                    </h4>
                </div>

                <div class="card-btns">
                    <button class="btn green-btn" data-action="edit">
                        <i class="ri-edit-2-line"></i> Edit
                    </button>

                    <button class="btn red-btn" data-action="delete">
                        <i class="ri-delete-bin-line"></i> Delete
                    </button>
                </div>

            </div>
        `;
    });
}


// OPEN FORM
addBtn.addEventListener("click", function () {
    editingTaskId = null;
    formTitle.textContent = "Add New Task";
    formSubmitBtn.textContent = "Add Task";
    form.reset();
    formSection.style.display = "flex";
});

// CLOSE FORM
closeBtn.addEventListener("click", function () {
    formSection.style.display = "none";
    editingTaskId = null;
    form.reset();
});

// Close if clicked outside the form box
formSection.addEventListener("click", function (e) {
    if (e.target === formSection) {
        formSection.style.display = "none";
        editingTaskId = null;
        form.reset();
    }
});


// 2. ATTRIBUTES VS PROPERTIES DEMO
// Demonstration: input.value vs input.getAttribute("value")
//
// input.value: This is a PROPERTY. It gives the CURRENT value typed by the user. It reflects the live state of the input field right now.
//
// input.getAttribute("value"): This is an ATTRIBUTE. It gives the INITIAL value set in the HTML markup. Even if the user types something new, getAttribute("value") still returns the original HTML attribute value.
//
// Example:
//   <input type="text" id="task-input" value="Go school">
//   User types "Go sleep" in the input.
//   input.value: "Go sleep" (current value, the property)
//   input.getAttribute("value"): "Go school" (original HTML attribute)


// FORM SUBMIT (Add or Edit)
form.addEventListener("submit", function (e) {
    e.preventDefault();

    let taskInput = document.querySelector("#task-input");
    let categorySelect = document.querySelector("#task-category-select");

    let taskName = taskInput.value;
    let taskCategory = categorySelect.value;

    // Demonstrating input.value vs input.getAttribute("value")
    console.log("input.value (property - current value):", taskInput.value);
    console.log("input.getAttribute('value') (attribute - original HTML value):", taskInput.getAttribute("value"));

    if (taskName.trim() === "" && taskCategory === "") {
        alert("Please enter a task and select a category!");
        return;
    } else if (taskName.trim() === "") {
        alert("Please enter a task!");
        return;
    } else if (taskCategory === "") {
        alert("Please select a category!");
        return;
    }

    if (editingTaskId !== null) {
        // EDIT MODE
        // Find the task in array and update it
        let taskIndex = tasksArr.findIndex(function (t) { return t.id === editingTaskId; });
        if (taskIndex !== -1) {
            tasksArr[taskIndex].name = taskName;
            tasksArr[taskIndex].category = taskCategory;

            let oldCard = document.querySelector('[data-id="' + editingTaskId + '"]');
            if (oldCard) {
                let tempDiv = document.createElement("div");
                tempDiv.id = "temp-placeholder";
                oldCard.replaceWith(tempDiv);
            }
        }
        editingTaskId = null;
    } else {
        taskIdCounter++;
        let newTask = {
            id: taskIdCounter,
            name: taskName,
            category: taskCategory,
            status: "pending"
        };
        tasksArr.push(newTask);
    }

    renderTasks();
    updateCounters();
    saveTasks();
    form.reset();
    formSection.style.display = "none";
});


// 6. EVENT DELEGATION
// Instead of attaching separate listeners to every edit/delete/complete button,
// we attach ONE listener to the parent container (#tasks).

tasksList.addEventListener("click", function (e) {
    let actionBtn = e.target.closest("[data-action]");
    if (!actionBtn) return;

    let action = actionBtn.dataset.action;
    let card = actionBtn.closest(".task-card");
    if (!card) return;

    let taskId = parseInt(card.getAttribute("data-id"));

    if (!card.hasAttribute("data-id")) {
        console.log("This card has no data-id attribute!");
        return;
    }

    // DELETE
    if (action === "delete") {
        let index = tasksArr.findIndex(function (t) { return t.id === taskId; });
        if (index !== -1) {
            tasksArr.splice(index, 1);
        }
        card.remove();
        updateCounters();
        saveTasks();
    }

    // COMPLETE
    if (action === "complete") {
        let task = tasksArr.find(function (t) { return t.id === taskId; });
        if (!task) return;

        if (task.status === "pending") {
            task.status = "completed";
            card.setAttribute("data-status", "completed");
        } else {
            task.status = "pending";
            card.setAttribute("data-status", "pending");
        }

        // Toggle visual styles
        let taskText = card.querySelector(".task-text");
        let unchecked = card.querySelector(".unchecked");
        let checked = card.querySelector(".checked");

        taskText.classList.toggle("task-done");
        unchecked.classList.toggle("checked-hidden");
        checked.classList.toggle("checked-visible");
        updateCounters();
        saveTasks();
    }

    // EDIT
    if (action === "edit") {
        let task = tasksArr.find(function (t) { return t.id === taskId; });
        if (!task) return;

        editingTaskId = task.id;
        formTitle.textContent = "Edit Task";
        formSubmitBtn.textContent = "Save Changes";

        document.querySelector("#task-input").value = task.name;
        document.querySelector("#task-category-select").value = task.category;

        formSection.style.display = "flex";
    }
});


// CLEAR ALL TASKS
clearAllBtn.addEventListener("click", function () {
    tasksArr.length = 0;
    tasksList.innerHTML = "";
    updateCounters();
    saveTasks();
});


// 4. THEME TOGGLE
// Uses classList, dataset, setAttribute()
// The current theme is stored in a custom data attribute: data-theme="dark" or "light"

themeBtn.addEventListener("click", function () {
    // dataset: reading current theme
    let currentTheme = document.documentElement.dataset.theme;

    if (currentTheme === "light") {
        // setAttribute()
        document.documentElement.setAttribute("data-theme", "dark");
        themeIcon.className = "ri-moon-line";
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "ri-sun-line";
        localStorage.setItem("theme", "light");
    }
});


// 7. EVENT PROPAGATION DEMONSTRATION
// This demonstrates Event Bubbling and Event Capturing.
//
// Structure:
//   Grandparent (div#grandparent)
//     └── Parent (div#parent)
//           └── Child (button#child)
//
// EVENT BUBBLING:
//   When the Child button is clicked, events fire from inside → outside:
//   Child → Parent → Grandparent
//
// EVENT CAPTURING:
//   Events fire from outside → inside:
//   Grandparent → Parent → Child

let grandparent = document.querySelector("#grandparent");
let parent = document.querySelector("#parent");
let child = document.querySelector("#child");

if (grandparent && parent && child) {
    // BUBBLING
    // Child → Parent → Grandparent
    grandparent.addEventListener("click", function () {
        console.log("BUBBLING: Grandparent clicked");
    });

    parent.addEventListener("click", function () {
        console.log("BUBBLING: Parent clicked");
    });

    child.addEventListener("click", function () {
        console.log("BUBBLING: Child clicked");
    });

    // CAPTURING
    // Grandparent → Parent → Child
    grandparent.addEventListener("click", function () {
        console.log("CAPTURING: Grandparent clicked");
    }, true);

    parent.addEventListener("click", function () {
        console.log("CAPTURING: Parent clicked");
    }, true);

    child.addEventListener("click", function () {
        console.log("CAPTURING: Child clicked");
    }, true);
}

// When you click the Child button, the console will show:
// CAPTURING: Grandparent clicked   (capturing phase - outside to inside)
// CAPTURING: Parent clicked
// CAPTURING: Child clicked
// BUBBLING: Child clicked          (bubbling phase - inside to outside)
// BUBBLING: Parent clicked
// BUBBLING: Grandparent clicked


// Load everything when page opens
loadTasks();