const API_URL = import.meta.env.VITE_API_URL;

export async function authFetch(endpoint, options = {}) {
    const accessToken = localStorage.getItem("accessToken");

    const doFetch = (token) => fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.headers || {}),
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            Authorization: `Bearer ${token}`,
        },
    });

    let response = await doFetch(accessToken);

    // Agar 401 aaya, ek baar refresh try karo
    if (response.status === 401) {
        const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });

        if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem("accessToken", refreshData.accessToken);
            response = await doFetch(refreshData.accessToken);   // dobara try
        } else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            window.location.reload();   // Login page pe wapas bhej do
            return;
        }
    }

    return response;
}