"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "@/components/form-field";

import { Calendar } from "lucide-react";
import { createRole } from "@/utils/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(50),
  description: z.string().min(1, { message: "Description is required" }),
  salary_range: z.string().min(1, { message: "Salary range is required" }),
  openings: z.coerce.number().min(1, { message: "Openings is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  traits: z.string().min(1, { message: "Traits is required" }),
  //   icon: z.string().nonempty(),
});

export default function CreateRolePage() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    // const res = await updateSubscription(subscription.id, data);
    // toast({
    //   title: res.title,
    //   description: (
    //     <p className="text-sm font-normal text-primary/70">{res.message}</p>
    //   ),
    // });
    // navigate("/admin/subscriptions");
    const res = await createRole(data);
    if (res.status === "success") {
        router.push("/dashboard/roles");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1
        className={`${title({
          highlight: true,
        })}`}
      >
        Create Role
      </h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField
          type="text"
          placeholder="Name"
          name="name"
          register={register}
          error={errors.name}
          valueAsNumber={false}
        />

        <FormField
          type="text"
          placeholder="Description"
          name="description"
          register={register}
          error={errors.description}
          valueAsNumber={false}
        />

        <FormField
          type="text"
          placeholder="Salary Range"
          name="salary_range"
          register={register}
          error={errors.salary_range}
          valueAsNumber={false}
        />

        <FormField
          type="number"
          placeholder="Openings"
          name="openings"
          register={register}
          error={errors.openings}
          valueAsNumber={true}
        />

        <FormField
          type="text"
          placeholder="Location"
          name="location"
          register={register}
          error={errors.location}
          valueAsNumber={false}
        />

        <FormField
          type="text"
          placeholder="Traits"
          name="traits"
          register={register}
          error={errors.traits}
          valueAsNumber={false}
        />

        <Button type="submit" color="success">
          Create Role
        </Button>
      </form>
    </div>
  );
}
