import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code"
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { Target } from "lucide-react";

export default function Home() {
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center mt-24">
				<h1 className={title()}>Find the&nbsp;</h1>
				<h1 className={title({ color: "blue" })}>Best&nbsp;</h1>
				<br />
				<h1 className={title()}>
					people in the industry
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
					Semantic matchmaking and AI reliance detection for enhanced selection
				</h2>
			</div>

			<div className="flex gap-3">
				<Button
					as={Link}
					href={"/auth/login"}
					className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}
					endContent={<Target size={20} />}
				>
					Try it Now
				</Button>
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
				>
					<GithubIcon size={20} />
					GitHub
				</Link>
			</div>

		</section>
	);
}
