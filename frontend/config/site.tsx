export type SiteConfig = typeof siteConfig;
import { LayoutDashboard, SquareUser, User, BookText } from "lucide-react"

export const siteConfig = {
	name: "JobStop",
	company: "WPH Digital",
	companyLogo: "/wph.png",
	description: "Make beautiful websites regardless of your design experience.",
	apiUrl: "http://localhost:8000",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Roles",
      href: "/roles",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
	{
	  label: "Login",
	  href: "/auth/login",
	}
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Roles",
			href: "/roles",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Login",
			href: "/auth/login",
		}
	],
	sideNavItems: [
		{
			label: "Dashboard",
			href: "/dashboard",
			icon: <LayoutDashboard size={20} className="outline-none"/>
		},
		{
			label: "Roles",
			href: "/dashboard/roles",
			icon: <SquareUser size={20} className="outline-none" />
		},
		{
			label: "Users",
			href: "/dashboard/users",
			icon: <User size={20} className="outline-none" />
		},
		{
			label: "Forms",
			href: "/dashboard/forms",
			icon: <BookText size={20} className="outline-none" />
		},
	],
	links: {
		github: "https://github.com/nextui-org/nextui",
	},

};
