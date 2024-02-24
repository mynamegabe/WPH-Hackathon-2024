export type SiteConfig = typeof siteConfig;
import { LayoutDashboard, SquareUser, User, BookText } from "lucide-react"

export const siteConfig = {
	name: "JobStop",
	description: "Make beautiful websites regardless of your design experience.",
	apiUrl: "http://localhost:8000",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
    {
      label: "Docs",
      href: "/docs",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "About",
      href: "/about",
    }
	],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Team",
			href: "/team",
		},
		{
			label: "Calendar",
			href: "/calendar",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
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
			label: "Applicants",
			href: "/dashboard/applicants",
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
