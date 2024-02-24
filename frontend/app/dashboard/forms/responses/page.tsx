"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getForm, getResponses } from "@/utils/api";
import { useState, useEffect } from "react";

export default function ApplicantsPage() {
    const searchParams = useSearchParams();
    const [form, setForm] = useState([]);
    const [responses, setResponses] = useState([]);

    useEffect(() => {
        const formId = searchParams.get("id");
        getForm().then((response) => {
            setForm(response);
        });
        getResponses(formId).then((response) => {
            setResponses(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-sm text-textPrimary/50">RESPONSES</p>
                <h1 className={title({ "highlight": true })}>Forms</h1>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Responses</p>
                        <p className="text-3xl">{responses.length}</p>
                    </CardBody>
                </Card>
            </div>

            <div className="flex flex-col gap-4">
            </div>

        </div>
    );
}