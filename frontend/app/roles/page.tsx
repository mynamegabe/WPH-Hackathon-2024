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
import Link from "next/link";

export default function DashboardPage() {
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getRoles().then((response) => {
      setRoles(response);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1
        className={`flex justify-between items-center ${title({
          highlight: true,
        })}`}
      >
        Roles
      </h1>

      <Input
        type="text"
        label="Search"
        placeholder="Search for roles"
        startContent={<Search size={20} />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-4">
        {roles.map((role, index) => {
          return (
            <Card
              key={index}
              className={`bg-bgSecondary/80 shadow-none w-full !transition-all border-[1px] border-textPrimary/50
              ${role.name.toLowerCase().includes(search.toLowerCase()) ? "" : "hidden"}
              `}
              isHoverable
            >
              <CardBody
                className={`flex flex-col gap-4 px-4 py-8 items-center`}
              >
                <div className="bg-primary p-3 rounded-full">
                  <Calendar size={28} />
                </div>
                <p className="font-semibold">{role.name}</p>
                <p className="h-16 text-ellipsis text-sm text-left w-full overflow-auto">
                  {role.description}
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">
                    Open Positions:{" "}
                    <span className="text-textPrimary font-normal">
                      {role.openings}
                    </span>
                  </p>
                  <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">
                    Salary:{" "}
                    <span className="text-textPrimary font-normal">
                      {role.salary_range}
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-4 w-full">
                  <Button
                    color="primary"
                    size="md"
                    as={Link}
                    href={`/role/${role.id}`}
                  >
                    View
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
