import fs from "fs";
import path from "path";

const CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

export type SiteContent = {
  hero: {
    eyebrow: string;
    name: string;
    tagline: string;
    location: string;
    resumeUrl: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    nodes: string[];
  };
  about: {
    photoUrl: string;
    heading: string;
    body: string;
    stats: { label: string; value: string }[];
  };
  experience: {
    role: string;
    company: string;
    location: string;
    period: string;
    points: string[];
  }[];
  projects: {
    title: string;
    tools: string;
    date: string;
    description: string;
    points: string[];
    link: string;
  }[];
  skills: {
    groups: { category: string; items: string[] }[];
  };
  achievements: string[];
  contact: {
    heading: string;
    body: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
  };
};

export function readContent(): SiteContent {
  const raw = fs.readFileSync(CONTENT_PATH, "utf-8");
  return JSON.parse(raw);
}

export function writeContent(content: SiteContent) {
  fs.writeFileSync(CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}
