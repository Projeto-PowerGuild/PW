document.addEventListener("DOMContentLoaded", function() {
    const profileLink = document.getElementById("profileLink");

    profileLink.addEventListener("click", function(event) {
        event.preventDefault();
        if (checkSession()) {
            displayUserInfo();
        } else {
            displayLoginForm();
        }
    });   
    
    function displayUserInfo(user) {
        if (user && user.username && user.email) {
            // Create the CSS link element
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './css/user.css'; 
    
            document.head.appendChild(link);
    
            const content = `
        <section>
            <div id="page-top">
                <h1 class="mainTit">Profile</h1>
            </div>

            <div id="user-info">
                <img src="../../ASSETS/user/profile.png" alt="" id="user-photo" style="cursor: pointer;">
                <input type="file" id="profile-picture-input" accept="image/*" style="display: none;">
                <button id="save-button" style="display: none;">Save</button>

                <div id="info-1">
                    <div id="user-email-container">
                        <h1 id="user-nick">Username: ${user.username}</h1>
                        <p id="user-email">Email: ${user.email}</p>
                    </div>
                    <button id="logout-button">Logout</button>
                </div>
            </div>
        </section>
        `;
        document.getElementById("mainContent").innerHTML = content;

        // Add event listener to the image to open file dialog
        document.getElementById("user-photo").addEventListener("click", function() {
            document.getElementById("profile-picture-input").click();
        });

    
        // Add event listener to logout button
        document.getElementById("logout-button").addEventListener("click", function() {
            logout();
        });
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

    
    document.addEventListener("DOMContentLoaded", function() {
        checkSession();
    });

    function displayLoginForm() {
        const content = `
            <h2>Login/Signup</h2>
            <form id="loginForm">
                <input type="text" id="username" placeholder="Username" required>
                <input type="password" id="password" placeholder="Password" required>
                <button type="submit">Login</button>
                <button type="button" id="signupButton">Signup</button>
            </form>
        `;
        document.getElementById("mainContent").innerHTML = content;

        const loginForm = document.getElementById("loginForm");
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            login(username, password);
        });

        const signupButton = document.getElementById("signupButton");
        signupButton.addEventListener("click", function() {
            displaySignupForm();
        });
    }

    function displaySignupForm() {
        const content = `
            <h2>Signup</h2>
            <form id="signupForm">
                <input type="text" id="username" placeholder="Username" required><br>
                <input type="email" id="email" placeholder="email" required><br>
                <input type="password" id="password" placeholder="Password" required><br>
                <button type="submit">Signup</button>
            </form>
        `;
        document.getElementById("mainContent").innerHTML = content;

        const signupForm = document.getElementById("signupForm");
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const username = document.getElementById("username").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            signup(username, email, password);
        });
    }

    function login(event) {
        event.preventDefault();
        const email = document.getElementById('email-login').value;
        const password = document.getElementById('password-login').value;
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Login successful");
                sessionStorage.setItem('isLoggedIn', 'true');
                checkSession();
            } else {
                alert("Login failed: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error during login:", error);
        });
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