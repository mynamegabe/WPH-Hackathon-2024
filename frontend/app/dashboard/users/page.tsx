"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { getUsers } from "@/utils/api";
import { siteConfig } from "@/config/site";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [activeUser, setActiveUser] = useState(-1);

    useEffect(() => {
        getUsers().then((response) => {
            setUsers(response);
        });
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <h1 className={title({ "highlight": true })}>Users</h1>
            <div className="flex flex-row gap-4 w-full">
                <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50" >
                    <CardBody className="w-28 flex-col items-center gap-2">
                        <p className="font-semibold">Users</p>
                        <p className="text-3xl">{users.length}</p>
                    </CardBody>
                </Card>
            </div>

            <Input type="text" label="Search" placeholder="Search for users"
                startContent={<Search size={20} />} />

            <div className="flex flex-row gap-4 flex-wrap overflow-y-auto">

                {
                    users.map((user, index) => {
                        return (
                            <Card
                                key={index}
                                className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 max-w-[30rem] ${activeUser === index ? "w-full" : ""}`}
                                onPress={() => {
                                    console.log(index);
                                    if (activeUser === index) {
                                        setActiveUser(-1);
                                    } else {
                                        setActiveUser(index);
                                    }
                                }}
                                isPressable
                                isHoverable>
                                <CardBody className={`flex flex-row gap-4 w-auto px-4 py-8 items-stretch overflow-hidden`}>
                                    <div className="flex flex-col gap-4 items-center w-56">
                                        <img src={user.image} alt={user.first_name} className="w-20 h-20 rounded-full object-cover" />
                                        <p className="font-semibold">{user.first_name} {user.last_name}</p>
                                        <p className="text-sm max-h-16 text-ellipsis overflow-hidden"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: "vertical"
                                            }}
                                        >{user.description}</p>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Role: <span className="text-textPrimary font-normal">{user.role}</span></p>
                                        </div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">Traits</p>
                                            <div className="flex flex-row gap-4 w-full flex-wrap max-h-32 overflow-y-auto">
                                                {user.traits?.split(",").map((trait, index) => {
                                                    return (
                                                        <Chip key={index} color="primary">{trait}</Chip>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {activeUser === index && (
                                        <>
                                            <Divider orientation="vertical" className="!h-auto" />
                                            <div className="flex flex-col gap-4 flex-grow justify-between">
                                                <div className="flex flex-col gap-4">
                                                    <p className="font-semibold">Matched Roles</p>
                                                    <div className="flex flex-col gap-4">
                                                        {/* <Button color="default">Project Manager</Button>
                                                        <Button color="default">Product Manager</Button> */}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-4">
                                                    <Button color="primary" variant="solid" as={Link} href={
                                                        siteConfig.apiUrl + "/profile/resume"
                                                    }>Download Resume</Button>
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