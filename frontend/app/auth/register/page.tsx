"use client";

import { title } from "@/components/primitives";
import { Mail, LockKeyhole } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { doRegister } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [age, setAge] = useState("");

	const onRegister = async () => {
		const response = await doRegister(email, firstName, lastName, phoneNumber, age, password);
		if (response) {
			router.push("/auth/login");
		}
	}

	return (
		<Card className="bg-bgSecondary w-96" isBlurred shadow="md">
			<CardBody className="px-4 py-8 items-center gap-4">
				<p className={title({ size: "xs" })}>Register</p>
				<div className="flex flex-col gap-4 w-full">
					<Input type="email" label="Email" placeholder="johndoe@domain.com"
						startContent={<Mail size={20} />} variant="faded" onChange={(e) => setEmail(e.target.value)} />
					<div className="flex gap-4">
						<Input type="text" label="First Name" placeholder="John"
							variant="faded" onChange={(e) => setFirstName(e.target.value)} />
						<Input type="text" label="Last Name" placeholder="Doe"
							variant="faded" onChange={(e) => setLastName(e.target.value)} />
					</div>
					<Input type="text" label="Phone Number" placeholder="91234567"
						variant="faded" onChange={(e) => setPhoneNumber(e.target.value)} />
					<Input type="number" label="Age" placeholder="25"
						variant="faded" onChange={(e) => setAge(e.target.value)} />
					<Input type="password" label="Password" placeholder="********"
						startContent={<LockKeyhole size={20} />} variant="faded" onChange={(e) => setPassword(e.target.value)} />
					<Button className="w-full" color="primary" variant="solid" onClick={() => onRegister()}>
						Register
					</Button>
					<p className="text-center text-textPrimary/80">
						Already have an account? <Link href="/auth/login" className="text-primary">Login</Link>
					</p>
				</div>
			</CardBody>
		</Card>
	);
}