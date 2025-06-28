import BASE_URL from "./config";

const customFetch = async (endpoint, options = {}) => {
    // const BASE_URL = "https://your-api.com"; // Replace with actual API URL

    try {
        let token = localStorage.getItem("token") || "";
        let email = localStorage.getItem("email") || "";

        const isFormData = options.body instanceof FormData;
        
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            ...options,
                headers: {
                     ...(isFormData ? {} : { "Content-Type": "application/json" }),
                    token: token,
                    Email: email,
                    ...options.headers
                },
        });

        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Invalid JSON response from server");
        }

        return { status: response.status, body: data };
    } catch (error) {
        console.error("Fetch Error:", error);
        throw new Error("Network error");
    }
};

export default customFetch;

