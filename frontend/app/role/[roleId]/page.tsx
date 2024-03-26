"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";

import { Calendar } from "lucide-react";
import { getRole } from "@/utils/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function RolePage({ params }: { params: { roleId: string } }) {
  const [role, setRole] = useState([]);

  useEffect(() => {
    getRole(params.roleId).then((response) => {
      setRole(response);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`mt-8 ${title({ highlight: true })}`}>{role.name}</h1>
      <div className="flex flex-col gap-4 w-full mt-4">
        <h3 className="flex items-center gap-4 font-semibold">
          <img
            src={siteConfig.companyLogo}
            alt={siteConfig.company}
            className="w-12 h-12 rounded-md object-cover"
          />
          {siteConfig.company}
        </h3>
        <h3 className="text-lg font-semibold">Description</h3>
        <p>{role.description}</p>
        <h3 className="text-lg font-semibold">Salary Range</h3>
        <p>{role.salary_range}</p>
        <h3 className="text-lg font-semibold">Openings</h3>
        <p>{role.openings}</p>
        <h3 className="text-lg font-semibold">Location</h3>
        <p>{role.location}</p>
        <Button color="primary" className="font-semibold">
            Apply
        </Button>
      </div>
    </div>
  );
}
