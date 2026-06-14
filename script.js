if(
localStorage.getItem("loggedIn")
!== "true"
){

window.location.href =
"login.html";

}
const API_URL = "http://localhost:5000";

let tasks = [];

function updateDashboard() {

    let total = tasks.length;

    let completed = tasks.filter(
        task => task.status === "Completed"
    ).length;

    let progress = tasks.filter(
        task => task.status === "In Progress"
    ).length;

    let pending = total - completed - progress;

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressTasks").textContent = progress;

}

function renderTasks() {

    let taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach((task) => {

        let taskCard = document.createElement("div");

        taskCard.classList.add(
            "task",
            (task.priority || "low").toLowerCase()
        );

        taskCard.innerHTML = `

        <div class="task-info">

        <h3>${task.title}</h3>

        <p><strong>Category:</strong> ${task.category}</p>

        <p><strong>Priority:</strong> ${task.priority}</p>

        <p><strong>Status:</strong> ${task.status}</p>

        <p><strong>Due Date:</strong> ${task.due_date}</p>

        </div>

        <div class="task-actions">

        <button
        class="complete-btn"
        onclick="completeTask(${task.id})">
        Complete
        </button>

        <button
        class="delete-btn"
        onclick="deleteTask(${task.id})">
        Delete
        </button>

        </div>

        `;

        taskList.appendChild(taskCard);

    });

    updateDashboard();

}

async function loadTasks() {

    try {

        const response = await fetch(
            "http://localhost:5000/tasks"
        );

        tasks = await response.json();

        renderTasks();

    }
    catch (error) {

        console.log(error);

    }

}

async function addTask() {

    let title =
        document.getElementById("taskInput").value;

    let category =
        document.getElementById("category").value;

    let priority =
        document.getElementById("priority").value;

    let status =
        document.getElementById("status").value;

    let dueDate =
        document.getElementById("dueDate").value;

    if (title.trim() === "") {
        alert("Enter task title");
        return;
    }

    if (dueDate === "") {
        alert("Please select a due date");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/add-task",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    category,
                    priority,
                    status,
                    due_date: dueDate
                })
            }
        );

        const data = await response.text();

        alert(data);

        document.getElementById("taskInput").value = "";
        document.getElementById("dueDate").value = "";

        await loadTasks();

    }
    catch (error) {

        console.log(error);
        alert("Error adding task");

    }

}

async function deleteTask(id) {

    try {

        await fetch(
            `http://localhost:5000/delete-task/${id}`
        );

        loadTasks();

    }
    catch (error) {

        console.log(error);

    }

}

async function completeTask(id) {

    try {

        await fetch(
            `http://localhost:5000/complete-task/${id}`
        );

        loadTasks();

    }
    catch (error) {

        console.log(error);

    }

}

async function clearAllTasks(){

    if(!confirm("Delete all tasks?")){
        return;
    }

    try{

        const response =
        await fetch(
        "http://localhost:5000/clear-all"
        );

        const data =
        await response.text();

        alert(data);

        loadTasks();

    }
    catch(error){

        console.log(error);

    }

}
function searchTasks() {

    let search =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    document
        .querySelectorAll(".task")
        .forEach(card => {

            let text =
                card.innerText.toLowerCase();

            if (text.includes(search)) {
                card.style.display = "flex";
            }
            else {
                card.style.display = "none";
            }

        });

}

async function testBackend() {

    const response =
        await fetch("http://localhost:5000/ping");

    const data =
        await response.text();

    console.log(data);

}

testBackend();
loadTasks();
function logoutUser(){

    localStorage.removeItem("loggedIn");

    window.location.href =
    "login.html";

}