document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById('sign-up-form');
    const loginForm = document.getElementById('login-form');

    signUpForm.addEventListener('submit', signup);
    loginForm.addEventListener('submit', login);

    // Fetch users on page load and store in localStorage
    fetchUsers('./users.json');
});

async function fetchUsers() {
    try {
        const response = await fetch('users.json');
        const users = await response.json();
        localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
        console.error('Error fetching users:', error);
        localStorage.setItem('users', JSON.stringify([]));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function signup(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email-signup').value;
    const password = document.getElementById('password-signup').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const users = getUsers();
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert('User with this email already exists');
    } else {
        const newUser = { username, email, password };
        users.push(newUser);
        saveUsers(users);
        alert('User registered successfully');
        document.getElementById('sign-up-form').reset();
    }
}

function login(event) {
    event.preventDefault();

    const email = document.getElementById('email-login').value;
    const password = document.getElementById('password-login').value;

    const users = getUsers();
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        window.location.href = 'profile.html';
    } else {
        alert('Invalid email or password');
    }
}
