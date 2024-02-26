"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input, Textarea } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Bot } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { getForm, getUser, getResponse } from "@/utils/api";
import { useState, useEffect } from "react";

export default function ResponsePage({ params }: { params: { formId: string, userId: string } }) {
    const [form, setForm] = useState([]);
    const [applicant, setApplicant] = useState([]);
    const [response, setResponse] = useState([]);

    useEffect(() => {
        getUser(params.userId).then((response) => {
            setApplicant(response);
        });
        getForm(params.formId).then((response) => {
            setForm(response.form);
        });
        getResponse(params.formId, params.userId).then((response) => {
            setResponse(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm text-textPrimary/50">RESPONSE</p>
                <h1 className={title({ "highlight": true })}>{form.name}</h1>
            </div>

            <div className="flex flex-col gap-4">
                <Card
                    className={`bg-bgSecondary/80 shadow-none w-full !transition-all border-[1px] border-textPrimary/50`}
                    isHoverable>
                    <CardBody className={`flex flex-row gap-4 w-auto px-4 py-8`}>
                        <img src={applicant.image} alt={applicant.first_name} className="w-20 h-20 rounded-full object-cover" />
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-2 max-w-96 w-full">
                                <p className="font-semibold">{applicant.first_name} {applicant.last_name}</p>
                                <p className="text-sm"
                                >{applicant.description}</p>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                {/* <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Role: <span className="text-textPrimary font-normal">{applicant.role}</span></p> */}
                                <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                                <div className="flex flex-row gap-4 w-full">
                                    {applicant.traits?.split(",").map((trait, index) => {
                                        return (
                                            <Chip key={index} color="primary">{trait}</Chip>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {
                    response.map((question, index) => {
                        let field = form.fields.find((field) => field.id === question.field_id);
                        return (
                            <Textarea
                                isReadOnly
                                label={
                                <p className="font-semibold flex gap-2 items-center">
                                    {field.description} {question.ai_detected && 
                                        <Bot size={16} className="text-red"/>
                                    }
                                </p>
                                }
                                variant="faded"
                                labelPlacement="outside"
                                defaultValue={question.response}
                            />
                        );
                    })
                }
            </div>

        </div>
    );
}