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

const tasksArr = [];
let taskIdCounter = 0;
let editingTaskId = null;


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
        // createElement()
        let card = document.createElement("div");
        card.classList.add("task-card");

        // setAttribute(): setting custom data attributes
        card.setAttribute("data-id", task.id);
        card.setAttribute("data-status", task.status);
        card.setAttribute("data-category", task.category);

        // Card left (checkbox)
        let cardLeft = document.createElement("div");
        cardLeft.classList.add("card-left");

        let checkBtn = document.createElement("button");
        checkBtn.classList.add("check-box-btn");
        // Using dataset to set action
        checkBtn.dataset.action = "complete";

        let uncheckedIcon = document.createElement("i");
        uncheckedIcon.className = "ri-checkbox-blank-circle-line check-box unchecked";

        let checkedIcon = document.createElement("i");
        checkedIcon.className = "ri-checkbox-circle-line check-box checked";

        // append(): appending multiple children at once
        checkBtn.append(uncheckedIcon, checkedIcon);
        cardLeft.appendChild(checkBtn);

        // Card center (task info)
        let cardCenter = document.createElement("div");
        cardCenter.classList.add("card-center");

        let taskText = document.createElement("h3");
        taskText.classList.add("task-text");
        // createTextNode()
        let textNode = document.createTextNode(task.name);
        taskText.appendChild(textNode);

        let subjectText = document.createElement("h4");
        subjectText.classList.add("subject-text");
        let categoryNode = document.createTextNode("#" + task.category);
        subjectText.appendChild(categoryNode);

        cardCenter.append(taskText, subjectText);

        // Card right (action buttons)
        let cardBtns = document.createElement("div");
        cardBtns.classList.add("card-btns");

        // Edit button
        let editBtn = document.createElement("button");
        editBtn.classList.add("btn", "green-btn");
        editBtn.dataset.action = "edit";
        let editIcon = document.createElement("i");
        editIcon.className = "ri-edit-2-line";
        let editText = document.createTextNode(" Edit");
        editBtn.append(editIcon, editText);

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "red-btn");
        deleteBtn.dataset.action = "delete";
        let deleteIcon = document.createElement("i");
        deleteIcon.className = "ri-delete-bin-line";
        let deleteText = document.createTextNode(" Delete");
        deleteBtn.append(deleteIcon, deleteText);

        cardBtns.append(editBtn, deleteBtn);

        // If task is completed, add the done styles
        if (task.status === "completed") {
            taskText.classList.add("task-done");
            uncheckedIcon.classList.add("checked-hidden");
            checkedIcon.classList.add("checked-visible");
        }

        // appendChild()
        card.appendChild(cardLeft);
        card.appendChild(cardCenter);
        card.appendChild(cardBtns);

        // append() to parent container
        tasksList.append(card);
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
        // classList
        themeIcon.className = "ri-moon-line";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        themeIcon.className = "ri-sun-line";
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