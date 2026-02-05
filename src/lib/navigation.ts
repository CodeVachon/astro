import type { IconName } from "~components/Icons";

export interface NavItem {
    name: string;
    href: string;
    className?: string;
    icon?: IconName;
}

export interface SocialMediaItem {
    name: string;
    href: string;
    icon: IconName;
}

export const navItems: Array<NavItem> = [
    { name: "Home", href: "/", className: "hidden lg:block", icon: "home" },
    { name: "Blog", href: "/blog", icon: "blog" },
    { name: "Uses", href: "/uses", icon: "uses" },
    { name: "Code", href: "/code", icon: "code" }
];

export const socialMediaItems: Array<SocialMediaItem> = [
    {
        name: "Github",
        href: "https://github.com/CodeVachon",
        icon: "github"
    },
    {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/christophervachon/",
        icon: "linkedin"
    },
    {
        name: "BlueSky",
        href: "https://bsky.app/profile/christophervachon.ca",
        icon: "blueSky"
    }
];

export const siteTitle = "Christopher Vachon";
export const siteAuthor = "Christopher Vachon";
export const defaultDescription =
    "Hi, I Christopher Vachon, a Web Application Developer in Canada. I write about web development, programming, and technology.";
