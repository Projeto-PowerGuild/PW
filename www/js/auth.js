document.addEventListener("DOMContentLoaded", function () {
    const profileLink = document.getElementById("profileLink");

    profileLink.addEventListener("click", function (event) {
        event.preventDefault();
        if (checkSession()) {
            displayUserInfo();
        } else {
            displayLoginForm();
        }
    });

    let users = [];

    // Carregar dados do JSON local (substitua esta parte com a lógica correta para seu ambiente)
    fetch('path/to/your/users.json')
        .then(response => response.json())
        .then(data => {
            users = data;
        })
        .catch(error => console.error("Error loading users:", error));

    function displayUserInfo(user) {
        if (user && user.username && user.email) {
            // Criação e manipulação dos elementos DOM...
        } else {
            console.error("User data is incomplete:", user);
            displayLoginForm();
        }
    }

    function checkSession() {
        fetch('/auth/session')
            .then(response => response.json())
            .then(data => {
                console.log("Session data received:", data);
                if (data.isLoggedIn && data.user) {
                    displayUserInfo(data.user);
                } else {
                    console.error("No user logged in or incomplete data", data);
                    displayLoginForm();
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
                displayLoginForm();
            });
    }

    function displayLoginForm() {
        const mainContent = document.getElementById("mainContent");
        mainContent.textContent = ''; // Clear previous content

        const heading = document.createElement('h2');
        heading.textContent = 'Login/Signup';

        const form = document.createElement('form');
        form.id = 'loginForm';

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Username';
        usernameInput.required = true;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = 'Password';
        passwordInput.required = true;

        const loginButton = document.createElement('button');
        loginButton.type = 'submit';
        loginButton.textContent = 'Login';

        const signupButton = document.createElement('button');
        signupButton.type = 'button';
        signupButton.id = 'signupButton';
        signupButton.textContent = 'Signup';

        form.appendChild(usernameInput);
        form.appendChild(passwordInput);
        form.appendChild(loginButton);
        form.appendChild(signupButton);
        mainContent.appendChild(heading);
        mainContent.appendChild(form);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = usernameInput.value;
            const password = passwordInput.value;
            login(username, password);
        });

        signupButton.addEventListener("click", function () {
            displaySignupForm();
        });
    }

    function displaySignupForm() {
        const mainContent = document.getElementById("mainContent");
        mainContent.textContent = ''; // Clear previous content

        const heading = document.createElement('h2');
        heading.textContent = 'Signup';

        const form = document.createElement('form');
        form.id = 'signupForm';

        const usernameInput = document.createElement('input');
        usernameInput.type = 'text';
        usernameInput.id = 'username';
        usernameInput.placeholder = 'Username';
        usernameInput.required = true;

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email';
        emailInput.placeholder = 'email';
        emailInput.required = true;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = 'Password';
        passwordInput.required = true;

        const signupButton = document.createElement('button');
        signupButton.type = 'submit';
        signupButton.textContent = 'Signup';

        form.appendChild(usernameInput);
        form.appendChild(emailInput);
        form.appendChild(passwordInput);
        form.appendChild(signupButton);
        mainContent.appendChild(heading);
        mainContent.appendChild(form);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const username = usernameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            signup(username, email, password);
        });
    }

    function login(username, password) {
        const email = document.getElementById('email-login').value;
        const password = document.getElementById('password-login').value;

        const user = users.find(user => user.email === email && user.pwd === password);
        if (user) {
            console.log("Login successful");
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('user', JSON.stringify(user));
            checkSession();
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.textContent = "Login failed: Invalid email or password.";
            errorMessage.style.display = 'block';
        }
    }

    function signup(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const email = document.getElementById('email-signup').value;
        const password = document.getElementById('password-signup').value;
        fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password })
        })
            .then(response => {
                if (response.ok) {
                    console.log("Signup successful");
                    location.reload();
                } else {
                    throw new Error('Signup failed');
                }
            })
            .catch(error => {
                console.error("Error during signup:", error);
            });
    }

    function logout() {
        fetch("/auth/logout")
            .then(response => {
                if (response.ok) {
                    checkSession();
                } else {
                    throw new Error("Error logging out");
                }
            })
            .catch(error => console.error("Error logging out:", error));
    }
});