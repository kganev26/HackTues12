const API_URL = "http://localhost:5500";
let isLogin = false;

// Елементи от DOM-а
const authForm = document.getElementById('authForm');
const authView = document.getElementById('authView');
const loggedInView = document.getElementById('loggedInView');
const registerFields = document.getElementById('registerFields');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const toggleAuth = document.getElementById('toggleAuth');
const switchPrompt = document.getElementById('switchPrompt');
const errorMessage = document.getElementById('errorMessage');

// Проверка при зареждане (като useEffect)
window.onload = () => {
    const token = localStorage.getItem("token");
    if (token) {
        showLoggedInView();
    }
};

// Превключване между Login и Register
toggleAuth.onclick = () => {
    isLogin = !isLogin;
    errorMessage.innerText = "";
    
    if (isLogin) {
        formTitle.innerText = "Login";
        submitBtn.innerText = "Login";
        switchPrompt.innerText = "Don't have an account?";
        toggleAuth.innerText = " Register";
        registerFields.style.display = "none";
        // Махаме 'required' от скритите полета
        registerFields.querySelectorAll('input').forEach(i => i.required = false);
    } else {
        formTitle.innerText = "Create Account";
        submitBtn.innerText = "Register";
        switchPrompt.innerText = "Already have an account?";
        toggleAuth.innerText = " Login";
        registerFields.style.display = "block";
        registerFields.querySelectorAll('input').forEach(i => i.required = true);
    }
};

// Обработка на формата (handleSubmit)
authForm.onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(authForm);
    
    const body = {
        username: formData.get("username"),
        password: formData.get("password")
    };

    if (!isLogin) {
        body.firstname = formData.get("firstname");
        body.lastname = formData.get("lastname");
    }

    try {
        const endpoint = isLogin ? "/login" : "/register";
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            errorMessage.innerText = data.message || "Грешка при заявката";
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        showLoggedInView();
        errorMessage.innerText = "";
    } catch (err) {
        errorMessage.innerText = "Няма връзка със сървъра";
    }
};

function showLoggedInView() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    document.getElementById('welcomeMessage').innerText = `Welcome, ${user.username} 👋`;
    authView.style.display = "none";
    loggedInView.style.display = "block";
}

function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    location.reload(); // Най-лесният начин да рестартираме изгледа
}