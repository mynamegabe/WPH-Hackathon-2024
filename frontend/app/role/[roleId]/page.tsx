"use client";

import { title } from "@/components/primitives";
import { Button } from "@nextui-org/button";

import { getRole, applyRole } from "@/utils/api";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { useRouter } from "next/navigation";

export default function RolePage({ params }: { params: { roleId: string } }) {
  const { router } = useRouter();
  const [role, setRole] = useState([]);

  useEffect(() => {
    getRole(params.roleId).then((response) => {
      setRole(response);
    });
  }, []);

  const doApply = () => {
    applyRole(params.roleId).then((res) => {
      if (res === 404 ){
        router.push("/auth/login"); 
      }
      alert("Applied successfully");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className={`mt-8 sticky top-20 left-0 ${title({ highlight: true })} !bg-primary py-2 rounded-md`}>{role.name}</h1>
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
        <span className="py-10"></span>
        <Button color="primary" className="font-semibold fixed bottom-4 w-[calc(100vw-4rem)]"
        onClick={() => doApply()}
        >
            Apply
        </Button>
      </div>
    </div>
  );
}
