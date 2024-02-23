import { title } from "@/components/primitives";
import { Mail, Network, LockKeyhole } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";

export default function LoginPage() {
	return (
		<Card className="bg-bgSecondary w-96" isBlurred shadow="md">
			<CardBody className="px-4 py-8 items-center gap-4">
				<Network size={48} />
				<p className={title({ size: "xs" })}>Login</p>
				<div className="flex flex-col gap-4 w-full">
					<Input type="email" label="Email" placeholder="johndoe@domain.com"
						startContent={<Mail size={20} />} variant="faded" />

					<Input type="password" label="Password" placeholder="********"
						startContent={<LockKeyhole size={20} />} variant="faded" />
					<Button className="w-full" color="primary" variant="solid">
						Login
					</Button>
				</div>
			</CardBody>
		</Card>
	);
}