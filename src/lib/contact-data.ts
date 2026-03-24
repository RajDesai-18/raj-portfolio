import { Linkedin, Github, FileText, Calendar } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ContactLink {
  id: string;
  number: string;
  name: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
}

export const CONTACT_LINKS: ContactLink[] = [
  {
    id: "linkedin",
    number: "01",
    name: "LINKEDIN",
    href: "https://linkedin.com/in/rajdesai18",
    icon: Linkedin,
    external: true,
  },
  {
    id: "github",
    number: "02",
    name: "GITHUB",
    href: "https://github.com/RajDesai-18",
    icon: Github,
    external: true,
  },
  {
    id: "resume",
    number: "03",
    name: "RESUME",
    href: "/RajDesai_Resume.pdf",
    icon: FileText,
    external: true,
  },
  {
    id: "calcom",
    number: "04",
    name: "COFFEE CHAT",
    href: "https://cal.com/rvdesai/coffee-chat",
    icon: Calendar,
    external: true,
  },
];
