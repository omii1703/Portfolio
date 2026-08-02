"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, LogOut, ExternalLink, CheckCircle2 } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const SECTIONS = [
  "hero",
  "about",
  "experience",
  "projects",
  "skills",
  "achievements",
  "contact",
] as const;
type Section = (typeof SECTIONS)[number];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [content, setContent] = useState<SiteContent | null>(null);
  const [active, setActive] = useState<Section>("hero");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  async function handleSave() {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-void text-text-muted text-sm">
        Loading content&hellip;
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void">
      <header className="glass sticky top-0 z-20 flex items-center justify-between px-6 py-3">
        <div>
          <p className="font-display font-semibold text-sm">Content admin</p>
          <p className="text-[11px] text-text-faint">
            Editing {content.hero.name}&apos;s portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="glass rounded-full px-3 py-1.5 text-xs flex items-center gap-1.5 hover:border-violet-soft/50 transition"
          >
            <ExternalLink size={13} /> View site
          </a>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-violet text-void text-xs font-medium px-4 py-1.5 flex items-center gap-1.5 hover:brightness-110 transition disabled:opacity-50"
          >
            {saved ? <CheckCircle2 size={13} /> : <Save size={13} />}
            {saving ? "Saving\u2026" : saved ? "Saved" : "Save changes"}
          </button>
          <button
            onClick={handleLogout}
            className="glass rounded-full p-2 hover:border-amber/50 transition"
            aria-label="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-[180px_1fr] gap-8">
        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible">
          {SECTIONS.map((section) => (
            <button
              key={section}
              onClick={() => setActive(section)}
              className={`text-left text-sm capitalize rounded-lg px-3.5 py-2 whitespace-nowrap transition-colors ${
                active === section
                  ? "bg-violet/15 text-violet-soft border border-violet/30"
                  : "text-text-muted hover:bg-white/5"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>

        <div className="glass-card rounded-2xl p-6">
          {active === "hero" && (
            <HeroEditor content={content} setContent={setContent} />
          )}
          {active === "about" && (
            <AboutEditor content={content} setContent={setContent} />
          )}
          {active === "experience" && (
            <ExperienceEditor content={content} setContent={setContent} />
          )}
          {active === "projects" && (
            <ProjectsEditor content={content} setContent={setContent} />
          )}
          {active === "skills" && (
            <SkillsEditor content={content} setContent={setContent} />
          )}
          {active === "achievements" && (
            <AchievementsEditor content={content} setContent={setContent} />
          )}
          {active === "contact" && (
            <ContactEditor content={content} setContent={setContent} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- shared field primitives ---------- */

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-mono-label uppercase text-text-faint mb-1.5">
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full rounded-lg glass px-3.5 py-2.5 text-sm outline-none focus:border-violet-soft/60 transition-colors resize-y"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg glass px-3.5 py-2.5 text-sm outline-none focus:border-violet-soft/60 transition-colors"
        />
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-display text-lg font-semibold mb-5 capitalize">
      {children}
    </h2>
  );
}

function RemovableRow({
  onRemove,
  children,
}: {
  onRemove: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-xl p-4 relative">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-text-faint hover:text-amber transition"
        aria-label="Remove"
      >
        <Trash2 size={14} />
      </button>
      <div className="space-y-3 pr-6">{children}</div>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-surface-border text-text-muted text-sm py-3 flex items-center justify-center gap-1.5 hover:border-violet-soft/50 hover:text-violet-soft transition"
    >
      <Plus size={14} /> {label}
    </button>
  );
}

/* ---------- editors ---------- */

type EditorProps = {
  content: SiteContent;
  setContent: (c: SiteContent) => void;
};

function HeroEditor({ content, setContent }: EditorProps) {
  const hero = content.hero;
  const update = (patch: Partial<SiteContent["hero"]>) =>
    setContent({ ...content, hero: { ...hero, ...patch } });

  return (
    <div className="space-y-4">
      <SectionTitle>Hero</SectionTitle>
      <Field label="Eyebrow" value={hero.eyebrow} onChange={(v) => update({ eyebrow: v })} />
      <Field label="Name" value={hero.name} onChange={(v) => update({ name: v })} />
      <Field label="Tagline" value={hero.tagline} onChange={(v) => update({ tagline: v })} textarea />
      <Field label="Location" value={hero.location} onChange={(v) => update({ location: v })} />
      <Field label="Email" value={hero.email} onChange={(v) => update({ email: v })} />
      <Field label="Phone" value={hero.phone} onChange={(v) => update({ phone: v })} />
      <Field label="GitHub URL" value={hero.github} onChange={(v) => update({ github: v })} />
      <Field label="LinkedIn URL" value={hero.linkedin} onChange={(v) => update({ linkedin: v })} />
      <Field
        label="Skill nodes (comma separated, shown in 3D graph)"
        value={hero.nodes.join(", ")}
        onChange={(v) => update({ nodes: v.split(",").map((s) => s.trim()).filter(Boolean) })}
        textarea
      />
    </div>
  );
}

function AboutEditor({ content, setContent }: EditorProps) {
  const about = content.about;
  const update = (patch: Partial<SiteContent["about"]>) =>
    setContent({ ...content, about: { ...about, ...patch } });

  const updateStat = (i: number, patch: Partial<{ label: string; value: string }>) => {
    const stats = about.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    update({ stats });
  };

  return (
    <div className="space-y-4">
      <SectionTitle>About</SectionTitle>
      <Field label="Heading" value={about.heading} onChange={(v) => update({ heading: v })} />
      <Field label="Body" value={about.body} onChange={(v) => update({ body: v })} textarea />

      <div>
        <label className="block text-xs font-mono-label uppercase text-text-faint mb-2">
          Stats
        </label>
        <div className="space-y-3">
          {about.stats.map((stat, i) => (
            <RemovableRow
              key={i}
              onRemove={() => update({ stats: about.stats.filter((_, idx) => idx !== i) })}
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Value" value={stat.value} onChange={(v) => updateStat(i, { value: v })} />
                <Field label="Label" value={stat.label} onChange={(v) => updateStat(i, { label: v })} />
              </div>
            </RemovableRow>
          ))}
          <AddButton
            label="Add stat"
            onClick={() => update({ stats: [...about.stats, { label: "New stat", value: "0" }] })}
          />
        </div>
      </div>
    </div>
  );
}

function ExperienceEditor({ content, setContent }: EditorProps) {
  const experience = content.experience;

  const updateJob = (i: number, patch: Partial<SiteContent["experience"][number]>) => {
    const next = experience.map((job, idx) => (idx === i ? { ...job, ...patch } : job));
    setContent({ ...content, experience: next });
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Experience</SectionTitle>
      {experience.map((job, i) => (
        <RemovableRow
          key={i}
          onRemove={() =>
            setContent({ ...content, experience: experience.filter((_, idx) => idx !== i) })
          }
        >
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Role" value={job.role} onChange={(v) => updateJob(i, { role: v })} />
            <Field label="Company" value={job.company} onChange={(v) => updateJob(i, { company: v })} />
            <Field label="Location" value={job.location} onChange={(v) => updateJob(i, { location: v })} />
            <Field label="Period" value={job.period} onChange={(v) => updateJob(i, { period: v })} />
          </div>
          <Field
            label="Bullet points (one per line)"
            value={job.points.join("\n")}
            onChange={(v) => updateJob(i, { points: v.split("\n").filter(Boolean) })}
            textarea
          />
        </RemovableRow>
      ))}
      <AddButton
        label="Add experience"
        onClick={() =>
          setContent({
            ...content,
            experience: [
              ...experience,
              { role: "New role", company: "Company", location: "City", period: "2026", points: [] },
            ],
          })
        }
      />
    </div>
  );
}

function ProjectsEditor({ content, setContent }: EditorProps) {
  const projects = content.projects;

  const updateProject = (i: number, patch: Partial<SiteContent["projects"][number]>) => {
    const next = projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setContent({ ...content, projects: next });
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Projects</SectionTitle>
      {projects.map((project, i) => (
        <RemovableRow
          key={i}
          onRemove={() =>
            setContent({ ...content, projects: projects.filter((_, idx) => idx !== i) })
          }
        >
          <Field label="Title" value={project.title} onChange={(v) => updateProject(i, { title: v })} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Tools" value={project.tools} onChange={(v) => updateProject(i, { tools: v })} />
            <Field label="Date" value={project.date} onChange={(v) => updateProject(i, { date: v })} />
          </div>
          <Field
            label="Description"
            value={project.description}
            onChange={(v) => updateProject(i, { description: v })}
            textarea
          />
          <Field
            label="Bullet points (one per line)"
            value={project.points.join("\n")}
            onChange={(v) => updateProject(i, { points: v.split("\n").filter(Boolean) })}
            textarea
          />
          <Field label="Link" value={project.link} onChange={(v) => updateProject(i, { link: v })} />
        </RemovableRow>
      ))}
      <AddButton
        label="Add project"
        onClick={() =>
          setContent({
            ...content,
            projects: [
              ...projects,
              { title: "New project", tools: "", date: "", description: "", points: [], link: "#" },
            ],
          })
        }
      />
    </div>
  );
}

function SkillsEditor({ content, setContent }: EditorProps) {
  const groups = content.skills.groups;

  const updateGroup = (i: number, patch: Partial<SiteContent["skills"]["groups"][number]>) => {
    const next = groups.map((g, idx) => (idx === i ? { ...g, ...patch } : g));
    setContent({ ...content, skills: { groups: next } });
  };

  return (
    <div className="space-y-4">
      <SectionTitle>Skills</SectionTitle>
      {groups.map((group, i) => (
        <RemovableRow
          key={i}
          onRemove={() =>
            setContent({ ...content, skills: { groups: groups.filter((_, idx) => idx !== i) } })
          }
        >
          <Field label="Category" value={group.category} onChange={(v) => updateGroup(i, { category: v })} />
          <Field
            label="Items (comma separated)"
            value={group.items.join(", ")}
            onChange={(v) =>
              updateGroup(i, { items: v.split(",").map((s) => s.trim()).filter(Boolean) })
            }
            textarea
          />
        </RemovableRow>
      ))}
      <AddButton
        label="Add skill group"
        onClick={() =>
          setContent({
            ...content,
            skills: { groups: [...groups, { category: "New category", items: [] }] },
          })
        }
      />
    </div>
  );
}

function AchievementsEditor({ content, setContent }: EditorProps) {
  return (
    <div className="space-y-4">
      <SectionTitle>Achievements</SectionTitle>
      <Field
        label="One achievement per line"
        value={content.achievements.join("\n")}
        onChange={(v) =>
          setContent({ ...content, achievements: v.split("\n").filter(Boolean) })
        }
        textarea
      />
    </div>
  );
}

function ContactEditor({ content, setContent }: EditorProps) {
  const contact = content.contact;
  const update = (patch: Partial<SiteContent["contact"]>) =>
    setContent({ ...content, contact: { ...contact, ...patch } });

  return (
    <div className="space-y-4">
      <SectionTitle>Contact</SectionTitle>
      <Field label="Heading" value={contact.heading} onChange={(v) => update({ heading: v })} />
      <Field label="Body" value={contact.body} onChange={(v) => update({ body: v })} textarea />
      <Field label="Email" value={contact.email} onChange={(v) => update({ email: v })} />
      <Field label="Phone" value={contact.phone} onChange={(v) => update({ phone: v })} />
      <Field label="GitHub URL" value={contact.github} onChange={(v) => update({ github: v })} />
      <Field label="LinkedIn URL" value={contact.linkedin} onChange={(v) => update({ linkedin: v })} />
    </div>
  );
}
