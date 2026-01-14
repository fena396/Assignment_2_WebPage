// ================= ADMIN PASSWORDS =================
// List of valid admin / access passwords
const ADMIN_PASSWORDS = ["college@123","eyn2024","student@pass","access@uni"];

// Stores the current theme (default is light)
let theme = "light";

// ================= DATE & TIME FUNCTION =================
// Updates the date and time displayed on the page
function updateDateTime() {
  const el = document.getElementById("datetime");
  if (el) el.textContent = new Date().toLocaleString();
}

// Updates the date and time every second
setInterval(updateDateTime, 1000);

// ================= USER NAME FUNCTION =================
// Saves and displays the user's name
function applyName() {
  const input = document.getElementById("username");
  if (!input) return;

  const name = input.value.trim();
  if (name !== "") {
    document.getElementById("helloText").textContent = `Hello, ${name}`;
    localStorage.setItem("username", name);
  }
}

// ================= THEME FUNCTIONS =================
// Sets the theme (light or dark)
function setTheme(mode) {
  if (mode === "dark") {
    document.body.classList.add("darkmode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("darkmode");
    localStorage.setItem("theme", "light");
  }
  updateThemeUI();
}

// Updates active state of theme buttons
function updateThemeUI() {
  const light = document.getElementById("lightMode");
  const dark = document.getElementById("darkMode");
  if (!light || !dark) return;

  if (document.body.classList.contains("darkmode")) {
    dark.classList.add("active");
    light.classList.remove("active");
  } else {
    light.classList.add("active");
    dark.classList.remove("active");
  }
}

// ================= LOAD SAVED PREFERENCES =================
// Loads saved username and theme from localStorage
function loadPreferences() {
  updateDateTime();

  const savedName = localStorage.getItem("username");
  if (savedName && document.getElementById("helloText")) {
    document.getElementById("helloText").textContent = `Hello, ${savedName}`;
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
}

// ================= PASSWORD SUBMISSION =================
// Handles user password submission
function submitPassword() {
  const input = document.getElementById("passwordInput");
  const error = document.getElementById("errorText");
  if (!input || !error) return;

  const pass = input.value.trim();

  // Validation for empty password
  if (!pass) {
    error.textContent = "Password cannot be empty";
    error.style.display = "block";
    return;
  }

  // Retrieve existing stored passwords
  const data = JSON.parse(localStorage.getItem("userPasswords")) || [];

  // Save password with timestamp
  data.push({ password: pass, time: new Date().toLocaleString() });
  localStorage.setItem("userPasswords", JSON.stringify(data));

  // Check if password is valid
  if (ADMIN_PASSWORDS.includes(pass)) {
    window.location.href = "goals.html";
  } else {
    error.textContent = "Incorrect password";
    error.style.display = "block";
    input.value = "";
  }
}

// ================= ADMIN LOGIN =================
// Allows admin to view stored user passwords
function adminLogin() {
  const id = document.getElementById("adminId");
  const pass = document.getElementById("adminPass");
  const error = document.getElementById("adminError");
  const panel = document.getElementById("adminPanel");
  const list = document.getElementById("passwordList");

  if (!id || !pass || !error || !panel || !list) return;

  // Admin authentication
  if (id.value !== "admin" || pass.value !== "admin123") {
    error.textContent = "Wrong admin ID or password";
    error.style.display = "block";
    return;
  }

  // Show admin panel
  error.style.display = "none";
  panel.style.display = "block";

  // Load stored passwords
  const data = JSON.parse(localStorage.getItem("userPasswords")) || [];
  if (data.length === 0) {
    list.textContent = "No passwords found.";
    return;
  }

  // Display passwords
  list.textContent = "";
  data.forEach((item, index) => {
    list.textContent += `${index + 1}. ${item.password} (${item.time})\n`;
  });
}

// ================= GOALS FUNCTIONS =================
// Loads saved goals from localStorage
function loadGoals() {
  const list = document.getElementById("goalList");
  if (!list) return;

  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  list.innerHTML = "";

  goals.forEach((goal, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${goal}</span><button onclick="deleteGoal(${index})">✕</button>`;
    list.appendChild(li);
  });
}

// Adds a new goal
function addGoal() {
  const input = document.getElementById("goalInput");
  const value = input.value.trim();
  if (!value) return;

  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.push(value);
  localStorage.setItem("goals", JSON.stringify(goals));

  input.value = "";
  loadGoals();
}

// Deletes a specific goal
function deleteGoal(index) {
  const goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.splice(index, 1);
  localStorage.setItem("goals", JSON.stringify(goals));
  loadGoals();
}

// Clears all goals
function clearGoals() {
  localStorage.removeItem("goals");
  loadGoals();
}

// ================= CLEAR PASSWORDS =================
// Clears all stored passwords (admin action)
function clearPasswords() {
  // Remove passwords from localStorage
  localStorage.removeItem("userPasswords");

  // Update displayed list
  const list = document.getElementById("passwordList");
  if (list) {
    list.textContent = "No passwords found.";
  }
}
