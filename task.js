document.addEventListener('DOMContentLoaded', function () {
    const taskForm = document.getElementById('task-form');
    const taskTable = document.getElementById('task-table').getElementsByTagName('tbody')[0];
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-timer');
    const stopButton = document.getElementById('stop-timer');
    const filterInput = document.getElementById('task-filter');
    const taskNamesDatalist = document.getElementById('task-names');
    let timerInterval;
    let startTime;

    taskForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        const taskName = document.getElementById('task-name').value;
        const taskDesc = document.getElementById('task-desc').value;

        if (!taskName || !taskDesc) {
            alert('Please fill in all fields.');
            return;
        }
        
        addTaskToTable(taskName, taskDesc);
        taskForm.reset(); // Reset the form after adding task
        updateTaskNamesDatalist(); // Update task names for autocomplete
    });

    filterInput.addEventListener('input', function () {
        filterTasks(filterInput.value.trim().toLowerCase());
    });

    function addTaskToTable(name, desc, duration) {
        const newRow = taskTable.insertRow();
        const nameCell = newRow.insertCell(0);
        const descCell = newRow.insertCell(1);
        const durationCell = newRow.insertCell(2);
        const editCell = newRow.insertCell(3);
        const deleteCell = newRow.insertCell(4);

        nameCell.textContent = name;
        descCell.textContent = desc;
        durationCell.textContent = duration || ''; // If duration is not provided, set it to empty string
        
        // Create edit button
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', function() {
            const newName = prompt('Enter new task name:');
            const newDesc = prompt('Enter new task description:');
            if (newName !== null && newDesc !== null) {
                nameCell.textContent = newName;
                descCell.textContent = newDesc;
            }
        });
        editCell.appendChild(editButton);

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
            newRow.remove();
        });
        deleteCell.appendChild(deleteButton);
    }

    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimerDisplay, 1000);
    }

    function stopTimer() {
        if (startTime) {
            const endTime = Date.now();
            const durationInSeconds = Math.floor((endTime - startTime) / 1000);
            const formattedTime = formatTime(durationInSeconds);
            const taskName = document.getElementById('task-name').value;
            const taskDesc = document.getElementById('task-desc').value;
            addTaskToTable(taskName, taskDesc, formattedTime);
            clearInterval(timerInterval); // Stop the timer
            timerDisplay.textContent = '00:00:00'; // Reset timer display
            startTime = null; // Reset start time
        }
    }

    function updateTimerDisplay() {
        const elapsedTimeInSeconds = Math.floor((Date.now() - startTime) / 1000);
        const formattedTime = formatTime(elapsedTimeInSeconds);
        timerDisplay.textContent = formattedTime;
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function filterTasks(filterValue) {
        const rows = taskTable.querySelectorAll('tr');
        rows.forEach(row => {
            const taskName = row.cells[0].textContent.trim().toLowerCase();
            if (taskName.includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    function updateTaskNamesDatalist() {
        // Get all task names from table
        const taskNames = [...new Set([...taskTable.querySelectorAll('td:first-child')].map(td => td.textContent.trim()))];
        // Clear previous options
        taskNamesDatalist.innerHTML = '';
        // Add task names as options to datalist
        taskNames.forEach(taskName => {
            const option = document.createElement('option');
            option.value = taskName;
            taskNamesDatalist.appendChild(option);
        });
    }

    startButton.addEventListener('click', startTimer);
    stopButton.addEventListener('click', stopTimer);
});
