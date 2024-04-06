"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Switch } from "@nextui-org/switch";
import Link from "next/link";
import { createForm } from "@/utils/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateFormPage() {
    const router = useRouter();
    const [formName, setFormName] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formFields, setFormFields] = useState([]);
    const [isConversational, setIsConversational] = useState(false);

    const onSubmit = async () => {
        const res = createForm(formName, formDescription, formFields, isConversational);
        if (res.status === "success") {
            router.push("/dashboard/forms");
        }
    };

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`${title({ highlight: true })}`}>Create Form</h1>
      <Input
        variant="faded"
        type="text"
        placeholder="Form Name"
        onChange={(e) => setFormName(e.target.value)}
      />

        <Input
            variant="faded"
            type="text"
            placeholder="Form Description"
            onChange={(e) => setFormDescription(e.target.value)}
        />

        {
            formFields.map((field, index) => {
                return (
                    <div key={index} className="flex flex-row items-center gap-4">
                        <Input
                            variant="faded"
                            type="text"
                            size="sm"
                            placeholder="Field Question"
                            onChange={(e) => {
                                let newFields = formFields;
                                newFields[index]["question"] = e.target.value;
                                setFormFields(newFields);
                            }}
                        />
                        <Button
                            color="danger"
                            onClick={() => {
                                let newFields = formFields;
                                newFields.splice(index, 1);
                                setFormFields(newFields);
                            }}
                        >
                            Remove
                        </Button>
                    </div>
                );
            })
        }
        <Button
            color="primary"
            onClick={() => {
                let newFields = formFields.slice();
                newFields.push({ question: "", required: false });
                setFormFields(newFields);
            }}
        >
            Add Field
        </Button>
        <Divider />
        <h2 className="font-semibold">Conversational</h2>
        <Switch
            checked={isConversational}
            onChange={() => setIsConversational(!isConversational)}
        />
        <Button
            color="success"
            onClick={() => {
                onSubmit();
            }}
        >
            Create
        </Button>
    </div>
  );
}
