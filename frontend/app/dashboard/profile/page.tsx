"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { useState, useEffect} from "react";
import { Upload } from "lucide-react";
import { Button } from "@nextui-org/button";
import { getProfile } from "@/utils/api";
import Link from "next/link";

export default function ApplicantsPage() {
    const [user, setUser] = useState({});

    useEffect(() => {
        getProfile().then((response) => {
            setUser(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className={title({"highlight": true})}>Profile</h1>
            <div className="flex flex-col gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="min-w-96 flex-col items-center gap-2 py-8 px-4">
                        <img src={user.image} alt="Profile Picture" className="w-20 h-20 rounded-full object-cover" />
                        <p className="font-semibold">{user.first_name} {user.last_name}</p>
                        <p>{user.description}</p>
                        <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">Age <span className="text-textSecondary">{user.age}</span></p>
                        <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">Phone <span className="text-textSecondary">{user.phone_number}</span></p>
                        <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">Email <span className="text-textSecondary">{user.email}</span></p>
                        <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">Role <span className="text-textSecondary">{user.role}</span></p>
                    </CardBody>
                </Card>
            </div>
            <div className="border-[1px] border-textPrimary/50 rounded-md h-32 relative hover:bg-bgSecondary/50 transition-colors">
                <input type="file" className="h-full w-full opacity-0 cursor-pointer" />
                <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-textPrimary/50 flex flex-col items-center gap-2 cursor-pointer">
                    <Upload size={24} />
                    <span>Upload a new resume</span>
                </p>
            </div>
            <Button color="primary" variant="solid" as={Link} href={""}>View Resume</Button>
        </div>
    );
}