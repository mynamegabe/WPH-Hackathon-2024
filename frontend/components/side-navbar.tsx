"use client";

import { Button } from "@nextui-org/button"
import { Link } from "@nextui-org/link"
import { User, Settings } from "lucide-react"
import { siteConfig } from "@/config/site"
import { usePathname } from 'next/navigation'

export const SideNavbar = () => {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-48 py-4 px-2 bg-bgSecondary rounded-lg shadow-md justify-between shrink-0 sticky max-h-[calc(100vh-7rem)] top-20 left-4 ">
            <div className="flex flex-col gap-0">
                {
                    siteConfig.sideNavItems.map((link, index) => {
                        return (
                            <Button
                                as={Link}
                                href={link.href}
                                key={index}
                                className={`bg-transparent font-semibold text-sm justify-start rounded-lg hover:bg-bgPrimary
                                    ${pathname === link.href ? "bg-primary hover:bg-primary" : ""}
                                `}
                                startContent={link.icon}
                            >{link.label}</Button>
                        )
                    })
                }
            </div>
            <div className="flex flex-col gap-0">
                <Button as={Link} href="/dashboard/profile" className="bg-transparent justify-start rounded-lg hover:bg-bgPrimary" startContent={<User size={16} />}>Profile</Button>
                {/* <Button className="bg-transparent justify-start hover:bg-bgPrimary" startContent={<Settings size={16} />}>Settings</Button> */}
                <Button className="bg-transparent text-red justify-start hover:bg-red hover:text-white">Logout</Button>
            </div>
        </div>
    )
}