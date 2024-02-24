
import { siteConfig } from "@/config/site";

export const doLogin = async (email: string, password: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to login");
    }
}


export const doRegister = async (
    email: string,
    first_name: string,
    last_name: string,
    phone_number: string,
    age: string,
    password: string
) => {
    const response = await fetch(`${siteConfig.apiUrl}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, first_name, last_name, phone_number, age, password }),
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to register");
    }
};


export const getApplicants = async () => {
    const response = await fetch(`${siteConfig.apiUrl}/applicants`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch applicants");
    }
};


export const getProfile = async () => {
    const response = await fetch(`${siteConfig.apiUrl}/auth/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch profile");
    }
}


export const getRoles = async () => {
    const response = await fetch(`${siteConfig.apiUrl}/roles`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch roles");
    }
}


export const getForms = async () => {
    const response = await fetch(`${siteConfig.apiUrl}/forms`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch forms");
    }
}


export const getForm = async (formId: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch form");
    }
}


export const submitForm = async (formId: string, fields: any) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}/submit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to submit form");
    }
}


export const getResponses = async (formId: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}/responses`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch responses");
    }
}
