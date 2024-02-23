import { SideNavbar } from "@/components/side-navbar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section className="flex flex-row gap-4 py-4 flex-grow">
			<SideNavbar />
			<div className="py-4 flex-grow">
				{children}
			</div>
		</section>
	);
}