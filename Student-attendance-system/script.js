const app = document.getElementById("app");

let students = [];

let nextId = 4;

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function renderApp() {
  app.innerHTML = "";

  const container = createElement("section", "container");
  const title = createElement("h1", "title", "Student Attendance System");

  const controls = createElement("div", "controls");
  const input = createElement("input", "student-input");
  input.type = "text";
  input.placeholder = "Enter Student Name";
  input.id = "studentName";

  const addButton = createElement("button", "btn btn-add", "Add Student");
  const saveButton = createElement("button", "btn btn-save", "Save Attendance");

  addButton.addEventListener("click", addStudent);
  saveButton.addEventListener("click", saveAttendance);
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addStudent();
    }
  });

  controls.append(input, addButton, saveButton);

  const tableWrap = createElement("div", "table-wrap");
  const table = createElement("table", "attendance-table");
  const thead = createElement("thead");
  const tbody = createElement("tbody");

  const headerRow = createElement("tr");
  ["ID", "Student Name", "Status", "Attendance", "Action"].forEach(function (heading) {
    headerRow.appendChild(createElement("th", "", heading));
  });

  thead.appendChild(headerRow);
  renderRows(tbody);
  table.append(thead, tbody);
  tableWrap.appendChild(table);

  const summary = createElement("div", "summary");
  summary.id = "summary";

  const toast = createElement("div", "toast");
  toast.id = "toast";

  container.append(title, controls, tableWrap, summary);
  app.append(container, toast);

  updateSummary();
}

function renderRows(tbody) {
  tbody.innerHTML = "";

  if (students.length === 0) {
    const emptyRow = createElement("tr", "empty-row");
    const emptyCell = createElement("td", "", "No students added yet");
    emptyCell.colSpan = 5;
    emptyRow.appendChild(emptyCell);
    tbody.appendChild(emptyRow);
    return;
  }

  students.forEach(function (student, index) {
    const row = createElement("tr");
    row.dataset.id = student.id;

    const idCell = createElement("td", "", String(index + 1));
    const nameCell = createElement("td", "", student.name);
    const statusCell = createElement(
      "td",
      "status " + student.status.toLowerCase(),
      student.status
    );

    const attendanceCell = createElement("td");
    const toggleButton = createElement(
      "button",
      "btn btn-toggle",
      student.status === "Present" ? "Mark Absent" : "Mark Present"
    );
    toggleButton.addEventListener("click", function () {
      toggleAttendance(student.id);
    });
    attendanceCell.appendChild(toggleButton);

    const actionCell = createElement("td");
    const deleteButton = createElement("button", "btn btn-delete", "Delete");
    deleteButton.addEventListener("click", function () {
      deleteStudent(student.id);
    });
    actionCell.appendChild(deleteButton);

    row.append(idCell, nameCell, statusCell, attendanceCell, actionCell);
    tbody.appendChild(row);
  });
}

function addStudent() {
  const input = document.getElementById("studentName");
  const name = input.value.trim();

  if (name === "") {
    showToast("Please enter student name");
    input.focus();
    return;
  }

  students.push({
    id: nextId,
    name: name,
    status: "Present"
  });

  nextId++;
  input.value = "";
  input.focus();
  refreshTable();
  showToast("Student added");
}

function toggleAttendance(id) {
  students = students.map(function (student) {
    if (student.id === id) {
      return {
        ...student,
        status: student.status === "Present" ? "Absent" : "Present"
      };
    }

    return student;
  });

  refreshTable();
}

function deleteStudent(id) {
  students = students.filter(function (student) {
    return student.id !== id;
  });

  refreshTable();
  showToast(" ");
}

function refreshTable() {
  const tbody = document.querySelector(".attendance-table tbody");
  renderRows(tbody);
  updateSummary();
}

function updateSummary() {
  const summary = document.getElementById("summary");
  const totalStudents = students.length;
  const presentStudents = students.filter(function (student) {
    return student.status === "Present";
  }).length;
  const absentStudents = totalStudents - presentStudents;

  summary.innerHTML = "";
  summary.append(
    createElement("div", "summary-item", "Total Students: " + totalStudents),
    createElement("div", "summary-item", "Present: " + presentStudents),
    createElement("div", "summary-item", "Absent: " + absentStudents)
  );
}

function saveAttendance() {
  localStorage.setItem("attendanceData", JSON.stringify(students));
  showToast("Attendance saved");
}

function loadAttendance() {
  const savedData = localStorage.getItem("");

  if (savedData) {
    students = JSON.parse(savedData);
    nextId = students.length
      ? Math.max(...students.map(function (student) {
          return student.id;
        })) + 1
      : 1;
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}

loadAttendance();
renderApp();
