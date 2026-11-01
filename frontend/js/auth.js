/* =====================================================
   AUTHENTICATION JAVASCRIPT
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ============================================
           LOGIN
        ============================================ */

        const loginForm =
            document.getElementById("loginForm");


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const email =
                        document.getElementById(
                            "loginEmail"
                        ).value.trim();


                    const password =
                        document.getElementById(
                            "loginPassword"
                        ).value;


                    if (!email || !password) {

                        showToast(
                            "Please enter email and password."
                        );

                        return;

                    }


                    const submitButton =
                        loginForm.querySelector('[type="submit"]');
                    submitButton.disabled = true;

                    fetch(
                        "/api/login",
                        {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    )
                        .then(function (response) {
                            return response.json().then(function (data) {
                                return {
                                    ok: response.ok,
                                    data: data
                                };
                            });
                        })
                        .then(function (result) {
                            if (!result.ok) {
                                throw new Error(
                                    result.data.error || "Unable to log in."
                                );
                            }

                            const user = result.data && result.data.user ? result.data.user : null;
                            const userRole = user && typeof user.role === "string" ? user.role.toLowerCase() : "";
                            const targetPage = userRole === "admin" ? "admin.html" : "dashboard.html";
                            window.location.href = targetPage;
                        })
                        .catch(function (error) {
                            showToast(
                                error.message || "Unable to contact the login service."
                            );
                        })
                        .finally(function () {
                            submitButton.disabled = false;
                        });

                }
            );

        }


        /* ============================================
           REGISTER
        ============================================ */

        const registerForm =
            document.getElementById("registerForm");


        if (registerForm) {

            registerForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const name =
                        document.getElementById(
                            "registerName"
                        ).value.trim();


                    const email =
                        document.getElementById(
                            "registerEmail"
                        ).value.trim();

                    const department =
                        document.getElementById(
                            "registerDepartment"
                        ).value;


                    const password =
                        document.getElementById(
                            "registerPassword"
                        ).value;


                    const confirmPassword =
                        document.getElementById(
                            "confirmPassword"
                        ).value;


                    if (
                        !name ||
                        !email ||
                        !department ||
                        !password ||
                        !confirmPassword
                    ) {

                        showToast(
                            "Please fill all fields."
                        );

                        return;

                    }


                    if (password.length < 8) {

                        showToast(
                            "Password must contain at least 8 characters."
                        );

                        return;

                    }

                    if (!/[A-Z]/.test(password)) {

                        showToast(
                            "Password must contain one uppercase letter."
                        );

                        return;

                    }

                    if (!/[a-z]/.test(password)) {

                        showToast(
                            "Password must contain one lowercase letter."
                        );

                        return;

                    }

                    if (!/\d/.test(password)) {

                        showToast(
                            "Password must contain one number."
                        );

                        return;

                    }


                    if (
                        password !== confirmPassword
                    ) {

                        showToast(
                            "Passwords do not match."
                        );

                        return;

                    }


                    const preferredLanguage =
                        document.getElementById(
                            "preferredLanguage"
                        )?.value || "en";

                    showToast(
                        "Creating your account..."
                    );

                    fetch(
                        "/api/register",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                name: name,
                                email: email,
                                department: department,
                                preferred_language: preferredLanguage,
                                password: password
                            })
                        }
                    )
                        .then(function (response) {
                            return response.json().then(function (data) {
                                return {
                                    ok: response.ok,
                                    status: response.status,
                                    data: data
                                };
                            });
                        })
                        .then(function (result) {
                            if (!result.ok) {
                                throw new Error(
                                    result.data.error ||
                                    "Unable to create account."
                                );
                            }

                            showToast(
                                "Account created successfully!"
                            );

                            setTimeout(
                                function () {

                                    window.location.href =
                                        "login.html";

                                },
                                1200
                            );
                        })
                        .catch(function (error) {
                            showToast(error.message || "Unable to create account.");
                        });

                }
            );

        }

    }
);


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) {

        alert(message);

        return;

    }


    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(
        function () {

            toast.classList.remove("show");

        },
        3000
    );

}