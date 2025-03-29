// Initialize variables
let attendanceData = [];
let currentDate = new Date().toLocaleDateString();
const dateInput = document.getElementById('date-input');
const changeDateBtn = document.getElementById('change-date-btn');
const dateElement = document.getElementById('current-date');
const tableBody = document.querySelector('#attendance-table tbody');
const saveBtn = document.getElementById('save-btn');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');

// Set current date
dateElement.textContent = currentDate;

dateInput.value = currentDate; // Set the date input to the current date

// Function to update the date
function updateDate() {
    const selectedDate = new Date(dateInput.value).toLocaleDateString();
    if (selectedDate) {
        currentDate = selectedDate;
        dateElement.textContent = currentDate;
        attendanceData.forEach(student => {
            student.date = currentDate; // Update each student's date
        });
        saveAttendance(); // Save updated attendance data
        alert('Date updated successfully!');
    } else {
        alert('Please select a valid date.');
    }
}

// Event listener for date change
changeDateBtn.addEventListener('click', updateDate);
const sampleStudents = [
    'John Doe',
    'Jane Smith',
    'Michael Johnson',
    'Emily Davis',
    'Robert Wilson'
];

// Initialize attendance sheet
function initializeAttendance() {
    // Load saved data from localStorage
    const savedData = localStorage.getItem('attendanceData');
    if (savedData) {
        attendanceData = JSON.parse(savedData);
    } else {
        // Create new attendance records for sample students
        attendanceData = sampleStudents.map(student => ({
            name: student,
            present: true,
            date: currentDate
        }));
    }
    renderAttendanceTable();
}

// Render attendance table
function renderAttendanceTable() {
    tableBody.innerHTML = '';
    attendanceData.forEach((student, index) => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;
        
        const presentCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = student.present;
        checkbox.addEventListener('change', () => {
            attendanceData[index].present = checkbox.checked;
        });
        presentCell.appendChild(checkbox);
        
        row.appendChild(nameCell);
        row.appendChild(presentCell);
        tableBody.appendChild(row);
    });
}

// Save attendance data
function saveAttendance() {
    localStorage.setItem('attendanceData', JSON.stringify(attendanceData));
    alert('Attendance data saved successfully!');
}

// Add new student
const addStudentBtn = document.getElementById('add-student-btn');
const newStudentInput = document.getElementById('new-student');

function addStudent() {
    const name = newStudentInput.value.trim();
    if (name && !attendanceData.some(student => student.name === name)) {
        attendanceData.push({
            name: name,
            present: true,
            date: currentDate
        });
        newStudentInput.value = '';
        renderAttendanceTable();
        saveAttendance();
    } else if (name) {
        alert('Student already exists!');
    }
}

// Export to Excel (CSV format)
function exportAttendance() {
    // Create CSV header
    let csv = 'Student Name,Status,Date\n';
    
    // Add each student's data
    attendanceData.forEach(student => {
        const status = student.present ? 'Present' : 'Absent';
        csv += `"${student.name}",${status},${student.date}\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${currentDate.replace(/\//g, '-')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
}

// Import attendance data
function importAttendance() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        
        reader.onload = readerEvent => {
            try {
                const content = readerEvent.target.result;
                attendanceData = JSON.parse(content);
                renderAttendanceTable();
                alert('Attendance data imported successfully!');
            } catch (error) {
                alert('Error importing file: Invalid format');
            }
        };
    };
    
    input.click();
}

// Event listeners
saveBtn.addEventListener('click', saveAttendance);
exportBtn.addEventListener('click', exportAttendance);
importBtn.addEventListener('click', importAttendance);
addStudentBtn.addEventListener('click', addStudent);
newStudentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStudent();
});

// Initialize the app
initializeAttendance();