import { readContent } from "@/lib/content";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Achievements from "@/components/Achievements";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

export default function Home() {
  const content = readContent();

  return (
    <main className="relative">
      <Navbar name={content.hero.name} resumeUrl={content.hero.resumeUrl} />
      <Hero hero={content.hero} />
      <About about={content.about} />
      <Experience experience={content.experience} />
      <Projects projects={content.projects} />
      <Skills skills={content.skills} />
      <Achievements achievements={content.achievements} />
      <Contact contact={content.contact} />
    </main>
  );
}
