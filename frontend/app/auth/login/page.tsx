"use client";

import { title } from "@/components/primitives";
import { Mail, Network, LockKeyhole } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { doLogin } from "@/utils/api";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onLogin = async () => {
		const response = await doLogin(email, password);
		if (response) {
			router.push("/dashboard");
		}
	}

	return (
		<Card className="bg-bgSecondary w-96" isBlurred shadow="md">
			<CardBody className="px-4 py-8 items-center gap-4">
				<Network size={48} />
				<p className={title({ size: "xs" })}>Login</p>
				<div className="flex flex-col gap-4 w-full">
					<Input type="email" label="Email" placeholder="johndoe@domain.com"
						startContent={<Mail size={20} />} variant="faded" onChange={(e) => setEmail(e.target.value)} />

					<Input type="password" label="Password" placeholder="********"
						startContent={<LockKeyhole size={20} />} variant="faded" onChange={(e) => setPassword(e.target.value)} />
					<Button className="w-full" color="primary" variant="solid" onClick={() => onLogin()}>
						Login
					</Button>
					<p className="text-center text-textPrimary/80">
						Don't have an account? <Link href="/auth/register" className="text-primary">Register</Link>
					</p>
				</div>
			</CardBody>
		</Card>
	);
}