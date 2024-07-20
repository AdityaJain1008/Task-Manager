// Retrieve tasks from local storage or initialize an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskManagerContainer = document.querySelector(".taskManager");
const confirmEl = document.querySelector(".confirm");
const confirmedBtn = confirmEl.querySelector(".confirmed");
const cancelledBtn = confirmEl.querySelector(".cancel");
let indexToBeDeleted = null

// Add event listener to the form submit event
document.getElementById('taskForm').addEventListener('submit', handleFormSubmit);

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const categorySelect = document.getElementById('category'); // Get the category select element
    const taskText = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const selectedCategory = categorySelect.value; // Get the selected category

    if (taskText !== '' && isValidDate(dueDate) && selectedCategory !== 'Select') {
        const newTask = {
            text: taskText,
            completed: false,
            dueDate: dueDate,
            category: selectedCategory // Assign the selected category to the new task
        };

        tasks.push(newTask);
        saveTasks();
        taskInput.value = '';
        dueDateInput.value = ''; // Clear the due date input
        categorySelect.value = 'Select'; // Reset the category select

        renderTasks(tasks);
    }
    renderTasks(tasks);
}

// Function to check if a date string is valid
function isValidDate(dateString) {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject) && dateString.length === 10; // Check for valid date and format
}

// Function to save tasks to local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initial rendering of tasks
renderTasks(tasks);

// Function to render tasks
function renderTasks(filteredTasks, selectedCategory) {
    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        // Check if the task's category matches the selected category or if no category is selected
        if (task.category === selectedCategory || selectedCategory === 'All' || !selectedCategory) {
            // Create and display the task card
        }

        // Create the "Edit Category" button
        const editCategoryButton = document.createElement('button');
        editCategoryButton.classList.add("button-box", "edit-category");
        const editCategoryContent = document.createElement("span");
        editCategoryContent.classList.add("purple");
        editCategoryContent.innerText = 'Edit Category';
        editCategoryButton.appendChild(editCategoryContent);
        editCategoryButton.addEventListener('click', () => {
            const newCategory = prompt('Edit category', task.category);
            if (newCategory !== null && newCategory.trim() !== "") {
                tasks[index].category = newCategory;
                saveTasks();
                renderTasks(tasks, selectedCategory);
            }
        });
        //---//

        const taskCard = document.createElement('div');
        taskCard.classList.add('taskCard');
        let classVal = "pending";
        let textVal = "Pending"
        if (task.completed) {
            classVal = "completed";
            textVal = "Completed";
        }
        taskCard.classList.add(classVal);

        const taskText = document.createElement('p');
        taskText.innerText = task.text;

        const taskStatus = document.createElement('p');
        taskStatus.classList.add('status');
        taskStatus.innerText = textVal;

        const toggleButton = document.createElement('button');
        toggleButton.classList.add("button-box");
        const btnContentEl = document.createElement("span");
        btnContentEl.classList.add("green");
        btnContentEl.innerText = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.appendChild(btnContentEl);
        toggleButton.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks(tasks);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add("button-box");
        const delBtnContentEl = document.createElement("span");
        delBtnContentEl.classList.add("red");
        delBtnContentEl.innerText = 'Delete';
        deleteButton.appendChild(delBtnContentEl);
        deleteButton.addEventListener('click', () => {
            indexToBeDeleted = index;
            confirmEl.style.display = "block";
            taskManagerContainer.classList.add("overlay");
        });

        const editButton = document.createElement('button');
        editButton.classList.add("button-box");
        const edbtn = document.createElement("span");
        edbtn.classList.add("blue");
        edbtn.innerText = 'Edit';
        editButton.appendChild(edbtn);
        editButton.addEventListener('click', () => {
            const newTaskText = prompt('Edit task', task.text);
            if (newTaskText !== null && newTaskText.trim() !== "") {
                tasks[index].text = newTaskText;
                saveTasks();
                renderTasks(tasks, selectedCategory);
            }
        });

        const taskCategory = document.createElement('p');
        taskCategory.classList.add('category'); // You can style this class as needed
        taskCategory.innerText = `Category: ${task.category}`;

        // date
        const dueDateDisplay = document.createElement('p');
        dueDateDisplay.classList.add('due-date');
        dueDateDisplay.innerText = task.dueDate || 'No Due Date';
        taskCard.appendChild(dueDateDisplay);

        taskCard.appendChild(taskText);
        taskCard.appendChild(taskStatus);
        taskCard.appendChild(toggleButton);
        taskCard.appendChild(deleteButton);
        taskCard.appendChild(editButton);
        taskCard.appendChild(editCategoryButton);
        taskCard.appendChild(taskCategory);
        taskContainer.appendChild(taskCard);
    });
}

// function to delete the selected task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(tasks);
}

confirmedBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
    deleteTask(indexToBeDeleted)
});

cancelledBtn.addEventListener("click", () => {
    confirmEl.style.display = "none";
    taskManagerContainer.classList.remove("overlay");
});

// search tasks
const searchInputEl = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = [];
    for (let t = 0; t < tasks.length; t++) {
        let ts = tasks[t].text.toLowerCase();
        if (ts.indexOf(searchTerm) >= 0) {
            filteredTasks.push(tasks[t]);
        }
    }
    renderTasks(filteredTasks);

});

// search by category
const categorySearchInput = document.getElementById("categorySearch");
categorySearchInput.addEventListener("input", function () {
    const searchCategory = categorySearchInput.value.trim();
    const filteredTasksByCategory = tasks.filter(task => {
        return task.category.toLowerCase().includes(searchCategory.toLowerCase());
    });
    renderTasks(filteredTasksByCategory);
});

// Get the sorting buttons
const sortByDateButton = document.getElementById("sortByDate");
const sortByStatusButton = document.getElementById("sortByStatus");
const sortByCategoryButton = document.getElementById("sortByCategory");

// Add event listeners for sorting buttons
sortByDateButton.addEventListener("click", () => {
    tasks.sort((a, b) => {
        if (a.dueDate < b.dueDate) return -1;
        if (a.dueDate > b.dueDate) return 1;
        return 0;
    });
    renderTasks(tasks);
});

sortByStatusButton.addEventListener("click", () => {
    tasks.sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
    });
    renderTasks(tasks);
});

sortByCategoryButton.addEventListener("click", () => {
    tasks.sort((a, b) => {
        const categoryA = a.category.toLowerCase();
        const categoryB = b.category.toLowerCase();
        if (categoryA < categoryB) return -1;
        if (categoryA > categoryB) return 1;
        return 0;
    });
    renderTasks(tasks);

});