import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";
import { Chip } from "@nextui-org/chip";

import { Calendar } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className={title()}>Roles</h1>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Roles</p>
                        <p className="text-3xl">5</p>
                    </CardBody>
                </Card>
            </div>

            <Input type="text" label="Search" placeholder="Search for roles"
                startContent={<Search size={20} />} />

            <div className="flex flex-col gap-4">
                <Card className="bg-bgSecondary/80 shadow-none w-64 border-[1px] border-textPrimary/50">
                    <CardBody className="flex flex-col gap-4 px-4 py-8 items-center">
                        <div className="bg-primary p-3 rounded-full">
                            <Calendar size={28} />
                        </div>
                        <p className="font-semibold">Project Manager</p>
                        <p className="text-sm text-left w-full">Responsible for planning, executing, and closing projects.</p>
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Open Positions: <span className="text-textPrimary font-normal">4</span></p>
                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Salary: <span className="text-textPrimary font-normal">$100,000</span></p>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                            <div className="flex flex-row gap-4 w-full">
                                <Chip color="primary">Charismatic</Chip>
                                <Chip color="default">Innovative</Chip>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>

        </div>
    );
}