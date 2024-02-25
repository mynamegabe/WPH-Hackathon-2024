"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { getForms } from "@/utils/api";
import { useState, useEffect } from "react";

export default function ApplicantsPage() {
    const [forms, setForms] = useState([]);

    useEffect(() => {
        getForms().then((response) => {
            setForms(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className={title({ "highlight": true })}>Forms</h1>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Forms</p>
                        <p className="text-3xl">{forms.length}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="flex flex-col gap-4">
                {/* <Card
                    className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50`}
                    isHoverable>
                    <CardBody className={`flex flex-row gap-4 w-auto p-4 items-stretch overflow-hidden`}>
                        <div className="flex flex-col gap-4 w-56">
                            <p className="font-semibold">HR Round 1</p>
                            <p className="text-sm text-left w-full">This form contains questions to evaluate the candidate's interpersonal skills.</p>
                            <div className="flex flex-row gap-4 w-full">
                                <Button color="success" size="sm">View</Button>
                                <Button color="warning" size="sm">Edit</Button>
                                <Button color="danger" size="sm">Delete</Button>
                            </div>
                        </div>
                    </CardBody>
                </Card> */}
                {forms.map((form, index) => {
                    return (
                        <Card
                            key={index}
                            className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50`}
                            isHoverable>
                            <CardBody className={`flex flex-row gap-4 w-auto p-4 items-stretch overflow-hidden`}>
                                <div className="flex flex-col gap-4 w-56">
                                    <p className="font-semibold">{form.name}</p>
                                    <p className="text-sm text-left w-full">{form.description}</p>
                                    <div className="flex flex-row gap-4 w-full">
                                        <Button color="success" size="sm" as={Link} href={`/form?id=${form.id}`}>
                                            Preview
                                        </Button>
                                        {/* <Button color="warning" size="sm">Edit</Button>
                                        <Button color="danger" size="sm">Delete</Button> */}
                                        <Button color="primary" size="sm" as={Link} href={`/dashboard/forms/${form.id}/responses`}>
                                            Responses
                                        </Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    );
                }
                )}
            </div>

        </div>
    );
}