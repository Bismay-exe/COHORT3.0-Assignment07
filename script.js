const addBtn = document.querySelector("#add-task-btn");
const formSection = document.querySelector("#form-section");
const closeBtn = document.querySelector("#form-close-btn");
const form = document.querySelector("form");
const tasksList = document.querySelector("#tasks");

const tasksArr = [];

let taskIndex = null;

let taskCard = () => {
    tasksList.innerHTML = "";
    tasksArr.forEach((elem, index) => {
        tasksList.innerHTML += `<div id="task-card">
                    <div class="card-left">
                        <button class="check-box-btn">
                            <i class="ri-checkbox-blank-circle-line check-box unchecked"></i>
                            <i class="ri-checkbox-circle-line check-box checked"></i>
                        </button>
                    </div>
                    <div class="card-center">
                        <h3 class="task-text">${elem.taskName}</h3>
                        <h4 class="subject-text">#${elem.taskCategory}</h4>
                    </div>
                    <div class="card-btns">
                        <button onClick="editTask(${elem.id})" id="edit" class="btn green-btn">
                            <i class="ri-edit-2-line"></i> <span class="clear-text">Edit</span>
                        </button>
                        <button onClick="deleteTask(${index})" id="delete" class="btn red-btn">
                            <i class="ri-delete-bin-line"></i> <span class="clear-text">Delete</span>
                        </button>
                    </div>
                </div>`
    })
}

addBtn.addEventListener("click", () => {
    formSection.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
    formSection.style.display = "none";
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let taskName = document.querySelector("#task-input").value;
    let taskCategory = document.querySelector("#task-category-select").value;

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

    let obj = {
        id: Date.now(),
        taskName,
        taskCategory,
    };

    console.log(obj)

    if (taskIndex != null) {
        tasksArr[taskIndex] = obj;
        taskIndex = null;
    } else {
        tasksArr.push(obj);
    }

    taskCard();



    form.reset();
    formSection.style.display = "none";
});


const editTask = (id) => {
    formSection.style.display = "flex";
    let task = tasksArr.find((elem) => elem.id === id);
    taskIndex = tasksArr.indexOf(task);

    document.querySelector("#task-input").value = task.taskName;
    document.querySelector("#task-category-select").value = task.taskCategory;
};

const deleteTask = (index) => {
    tasksArr.splice(index, 1);
    taskCard();
}

tasksList.addEventListener("click", (e) => {
    const btn = e.target.closest(".check-box-btn");

    if (!btn) return;

    const card = btn.closest("#task-card");
    const taskText = card.querySelector(".task-text");
    const unchecked = btn.querySelector(".unchecked");
    const checked = btn.querySelector(".checked");

    taskText.classList.toggle("task-done");

    unchecked.classList.toggle("checked-hidden");
    checked.classList.toggle("checked-visible");
});