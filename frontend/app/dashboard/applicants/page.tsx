"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Divider } from "@nextui-org/divider";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";


export default function ApplicantsPage() {
    const [activeApplicant, setActiveApplicant] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            <h1 className={title()}>Applicants</h1>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Applicants</p>
                        <p className="text-3xl">18</p>
                    </CardBody>
                </Card>
            </div>

            <Input type="text" label="Search" placeholder="Search for applicants"
                startContent={<Search size={20} />} />

            <div className="flex flex-col gap-4">
                <Card
                    className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 ${activeApplicant === 1 ? "w-[30rem]" : ""}`}
                    onPress={() => {
                        if (activeApplicant === 1) {
                            setActiveApplicant(0);
                        } else {
                            setActiveApplicant(1);
                        }
                    }}
                    isPressable
                    isHoverable>
                    <CardBody className={`flex flex-row gap-4 w-auto px-4 py-8 items-stretch overflow-hidden`}>
                        <div className="flex flex-col gap-4 items-center w-56">
                            <img src="https://media.istockphoto.com/id/1441360103/photo/close-up-portrait-of-awesome-young-caucasian-male-smiling-and-looking-at-camera-at-the.webp?b=1&s=170667a&w=0&k=20&c=d8LX9wb13x8pRm-vLkOrEDiagsjSFNoIgr-eAUeIqyI=" alt="John Doe" className="w-20 h-20 rounded-full object-cover" />
                            <p className="font-semibold">John Doe</p>
                            <p className="text-sm text-left w-full">I am a passionate and driven individual who loves to work in a team.</p>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Role: <span className="text-textPrimary font-normal">Project Manager</span></p>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                                <div className="flex flex-row gap-4 w-full">
                                    <Chip color="primary">Charismatic</Chip>
                                    <Chip color="default">Innovative</Chip>
                                </div>
                            </div>
                        </div>
                        {activeApplicant === 1 && (
                            <>
                                <Divider orientation="vertical" className="!h-auto" />
                                <div className="flex flex-col gap-4 flex-grow justify-between">
                                    <div className="flex flex-col gap-4">
                                        <p className="font-semibold">Matched Roles</p>
                                        <div className="flex flex-col gap-4">
                                            <Button color="default">Project Manager</Button>
                                            <Button color="default">Product Manager</Button>
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
            </div>

        </div>
    );
}