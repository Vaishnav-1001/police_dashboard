import { getCsrf } from "./cases";


export async function login(username, password) {
    const csrfToken = await getCsrf();

    if (!csrfToken) {
        throw new Error(
            "CSRF token was not received from Django."
        );
    }

    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);


    const response = await fetch(
        "/api/auth/login/",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
                "X-CSRFToken": csrfToken,
            },

            credentials: "same-origin",

            body: formData,
        }
    );


    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            `Server returned an invalid response (${response.status}).`
        );
    }


    if (!response.ok || data.status !== "success") {
        throw new Error(
            data.message ||
            "Invalid username or password."
        );
    }


    return data;
}


export async function getCurrentUser() {
    const response = await fetch(
        "/api/auth/me/",
        {
            method: "GET",
            credentials: "same-origin",
        }
    );


    if (response.status === 401) {
        return null;
    }


    if (!response.ok) {
        throw new Error(
            "Failed to check authentication."
        );
    }


    const data = await response.json();

    return data.user;
}


export async function logout() {
    const csrfToken = await getCsrf();

    if (!csrfToken) {
        throw new Error(
            "CSRF token was not received from Django."
        );
    }


    const response = await fetch(
        "/api/auth/logout/",
        {
            method: "POST",

            headers: {
                "X-CSRFToken": csrfToken,
            },

            credentials: "same-origin",
        }
    );


    if (!response.ok) {
        throw new Error("Logout failed.");
    }


    return response.json();
}