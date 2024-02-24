"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation'

import { getForm, submitForm } from "@/utils/api";
import { useState, useEffect } from "react";

export default function FormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form, setForm] = useState({});
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formStatus, setFormStatus] = useState("idle");

    const onChange = (index: number, value: string) => {
        console.log(index, value);
        let newFields = fields;
        newFields[index]["value"] = value;
        setFields(newFields);
    }

    const onSubmit = () => {
        setFormLoading(true);
        submitForm(form.id, fields)
            .then((response) => {
                setFormLoading(false);
                setFormStatus("success");
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            });
    }

    useEffect(() => {
        async function getLoader() {
            const { miyagi } = await import('ldrs')
            miyagi.register()
        }
        getLoader()
        const formId = searchParams.get('id');
        getForm(formId).then((response) => {
            setForm(response.form);
            setFields(response.fields);
        });
    }, []);

    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            {loading ?
                <l-miyagi
                    size="35"
                    stroke="3.5"
                    speed="0.9"
                    color="hsl(var(--nextui-textPrimary) / var(--nextui-textPrimary-opacity, var(--tw-text-opacity)))"
                ></l-miyagi>
                :
                <div className="flex flex-col gap-4 w-xl max-w-screen">
                    <div className="flex flex-col">
                        <h1 className={title({ "highlight": true })}>{form.name}</h1>
                        <h2 className={subtitle({ class: "mt-4" })}>
                            {form.description}
                        </h2>
                    </div>
                    {
                        fields.map((field, index) => {
                            return (
                                <div key={index} className="flex flex-col gap-2 w-full">
                                    <p className="font-semibold">{field.description}</p>
                                    <Input variant="faded" type={field.type} placeholder={field.placeholder}
                                        onChange={(e) => onChange(index, e.target.value)} />
                                </div>
                            )
                        })
                    }
                    <Button
                        className={`${buttonStyles({ color: "primary", radius: "full", variant: "shadow" })} 
                        ${formStatus === "success" ? "bg-success" : ""}
                        `}
                        onClick={() => onSubmit()}
                        isLoading={formLoading}
                    >
                        {formStatus === "success" ? 
                        <CheckCircle2 size={24} className="mr-2" />
                        : "Submit"}
                    </Button>
                </div>
            }
        </section>
    );
}
