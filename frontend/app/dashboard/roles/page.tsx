"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";

import { Calendar } from "lucide-react";
import { getRoles } from "@/utils/api";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className={title({"highlight": true})}>Roles</h1>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Roles</p>
                        <p className="text-3xl">{roles.length}</p>
                    </CardBody>
                </Card>
            </div>

            <Input type="text" label="Search" placeholder="Search for roles"
                startContent={<Search size={20} />} />

            <div className="flex flex-col gap-4">

                {
                    roles.map((role, index) => {
                        return (
                            <Card
                                key={index}
                                className={`bg-bgSecondary/80 shadow-none w-72 !transition-all border-[1px] border-textPrimary/50`}
                                isHoverable>
                                <CardBody className={`flex flex-col gap-4 px-4 py-8 items-center`}>
                                    <div className="bg-primary p-3 rounded-full">
                                        <Calendar size={28} />
                                    </div>
                                    <p className="font-semibold">{role.name}</p>
                                    <p className="text-sm text-left w-full">{role.description}</p>
                                    <div className="flex flex-col gap-2 w-full">
                                        <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Open Positions: <span className="text-textPrimary font-normal">{role.openings}</span></p>
                                        <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Salary: <span className="text-textPrimary font-normal">{role.salary_range}</span></p>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                                        <div className="flex flex-row flex-wrap gap-4 w-full">
                                            {role.traits?.split(",").map((trait, index) => {
                                                return (
                                                    <Chip key={index} color="primary" className="text-normal">{trait}</Chip>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-4 w-full">
                                        <Button color="success" size="sm">View</Button>
                                        <Button color="warning" size="sm">Edit</Button>
                                        <Button color="danger" size="sm">Delete</Button>
                                    </div>
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