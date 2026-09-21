import { getCsrfToken } from "../utils/csrf";


export async function getCsrf() {
    const response = await fetch("/api/csrf/", {
        method: "GET",
        credentials: "same-origin",
    });

    if (!response.ok) {
        throw new Error(`Failed to initialize CSRF protection (${response.status})`);
    }

    return getCsrfToken();
}


export async function fetchCases() {
    const response = await fetch("/api/cases/", {
        credentials: "same-origin",
    });

    if (!response.ok) {
        throw new Error(`Failed to load cases: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== "success") {
        throw new Error(data.message || "Failed to load cases");
    }

    return data.cases || [];
}


export async function registerCase(formData) {
    // Make sure Django has issued a CSRF cookie.
    const csrfToken = await getCsrf();

    if (!csrfToken) {
        throw new Error("CSRF token was not received from Django.");
    }

    const response = await fetch("/api/cases/register/", {
        method: "POST",

        headers: {
            "X-CSRFToken": csrfToken,
        },

        credentials: "same-origin",

        body: formData,
    });

    let data;

    try {
        data = await response.json();
    } catch {
        throw new Error(
            `Server returned an invalid response (${response.status})`
        );
    }

    if (!response.ok || data.status !== "success") {
        throw new Error(
            data.message ||
            data.error ||
            `Failed to register case (${response.status})`
        );
    }

    return data;
}