
import { siteConfig } from "@/config/site";
import { data } from "autoprefixer";

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


export const uploadResume = async (resume: File) => {
    const formData = new FormData();
    formData.append("resume", resume);

    const response = await fetch(`${siteConfig.apiUrl}/upload/resume`, {
        method: "POST",
        body: formData,
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to upload resume");
    }
}

export const getUser = async (userId: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/users/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch user");
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


export const getResponse = async (formId: string, userId: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}/responses/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch response");
    }
}


export const createForm = async (name: string, description: string, fields: any, conversational: any ) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description, fields, conversational }),
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to create form");
    }
}

export const startConversation = async (formId: string, field: any) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}/conversation`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify( field ),
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to start conversation");
    }
}


export const submitConversation = async (formId: string, fields: any) => {
    const response = await fetch(`${siteConfig.apiUrl}/forms/${formId}/conversation/submit`, {
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
        throw new Error("Failed to submit conversation");
    }
}


export const createRole = async (data: any) => {
    const response = await fetch(`${siteConfig.apiUrl}/roles`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to create role");
    }
}

export const getRole = async (roleId: string) => {
    const response = await fetch(`${siteConfig.apiUrl}/role/${roleId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Failed to fetch role");
    }
}