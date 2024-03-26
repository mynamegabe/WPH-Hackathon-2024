"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { getForm, getResponses } from "@/utils/api";
import { useState, useEffect } from "react";

export default function ResponsesPage({ params }: { params: { formId: string } }) {
    const [form, setForm] = useState([]);
    const [responses, setResponses] = useState([]);
    const [activeApplicant, setActiveApplicant] = useState(-1);

    useEffect(() => {
        getForm(params.formId).then((response) => {
            setForm(response.form);
        });
        getResponses(params.formId).then((response) => {
            setResponses(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm text-textPrimary/50">RESPONSES</p>
                <h1 className={title({ "highlight": true })}>{form.name}</h1>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Responses</p>
                        <p className="text-3xl">{responses.length}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="flex flex-row gap-4 flex-wrap">
            {
                    responses.map((applicant, index) => {
                        return (
                            <Card
                                key={index}
                                className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 ${activeApplicant === index ? "w-[30rem]" : ""}`}
                                onPress={() => {
                                    console.log(index);
                                    if (activeApplicant === index) {
                                        setActiveApplicant(-1);
                                    } else {
                                        setActiveApplicant(index);
                                    }
                                }}
                                isPressable
                                isHoverable>
                                <CardBody className={`flex flex-row gap-4 w-auto px-4 py-8 items-stretch overflow-hidden`}>
                                    <div className="flex flex-col gap-4 items-center w-56">
                                        <img src={applicant.image} alt={applicant.first_name} className="w-20 h-20 rounded-full object-cover" />
                                        <p className="font-semibold">{applicant.first_name} {applicant.last_name}</p>
                                        <p className="text-sm max-h-16 text-ellipsis overflow-hidden"
                                        style={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical"
                                        }}
                                        >{applicant.description}</p>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Role: <span className="text-textPrimary font-normal">{applicant.role}</span></p>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                                            <div className="flex flex-row gap-4 w-full flex-wrap h-32 overflow-y-auto">
                                                {applicant.traits?.split(",").map((trait, index) => {
                                                    return (
                                                        <Chip key={index} color="primary">{trait}</Chip>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <Button color="primary" variant="solid" as={Link} href={`/dashboard/forms/${params.formId}/response/${applicant.id}`}>View Response</Button>
                                        </div>
                                    </div>
                                    {activeApplicant === index && (
                                        <>
                                            <Divider orientation="vertical" className="!h-auto" />
                                            <div className="flex flex-col gap-4 flex-grow justify-between">
                                                <div className="flex flex-col gap-4">
                                                    <p className="font-semibold">Matched Roles</p>
                                                    <div className="flex flex-col gap-4">
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    <Button color="primary" variant="solid">View Resume</Button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    }
                    )
                }
            </div>

        </div>
    );
}