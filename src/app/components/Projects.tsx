"use client";

import { useState } from "react";
import { ArrowDown, ArrowUpRight, BrainCircuit, Building2, Code2, Github, Layers3, Network, Utensils } from "lucide-react";
import { personalInfo, projects } from "@/data";
import type { Project } from "@/types";
import SectionHeading from "./SectionHeading";

const featured = ["OCMP", "Farrior Homes", "Prepcart", "Restaurant Management System"];
const orderedProjects = [...projects].sort((a, b) => {
  const aIndex = featured.indexOf(a.title);
  const bIndex = featured.indexOf(b.title);
  return (aIndex < 0 ? featured.length : aIndex) - (bIndex < 0 ? featured.length : bIndex);
});
const filters = ["Selected work", "Web applications", "AI & ML", "Experiments"] as const;
type Filter = (typeof filters)[number];

function category(project: Project): Filter {
  if (project.technologies.some((tech) => /tensorflow|machine learning|deep learning|ai integration|u-net/i.test(tech))) return "AI & ML";
  if (project.technologies.some((tech) => /pygame|arduino/i.test(tech))) return "Experiments";
  return "Web applications";
}

const artwork = [
  { icon: Network, label: "Systems that connect.", tone: "sage" },
  { icon: Building2, label: "A place to find home.", tone: "sand" },
  { icon: BrainCircuit, label: "A little intelligence, built in.", tone: "lavender" },
  { icon: Utensils, label: "Better everyday experiences.", tone: "blue" },
];

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("Selected work");
  const [showAll, setShowAll] = useState(false);
  const filtered = orderedProjects.filter((project) => filter === "Selected work" || category(project) === filter);
  const visible = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id='projects' className='section-space section-wrap'>
      <SectionHeading number='01' eyebrow='Selected work' title='Ideas, brought to life.' description='A selection of client platforms, full-stack applications, and experiments at the intersection of web and AI.' />
      <div className='project-toolbar'>
        <div className='project-filters' role='group' aria-label='Filter projects'>{filters.map((item) => <button type='button' key={item} aria-pressed={filter === item} onClick={() => { setFilter(item); setShowAll(false); }} className={filter === item ? "filter-active" : ""}>{item}</button>)}</div>
      </div>
      <div className='work-project-grid'>
        {visible.map((project) => {
          const index = orderedProjects.indexOf(project);
          const art = artwork[index % artwork.length];
          const Icon = index < 4 ? art.icon : category(project) === "AI & ML" ? BrainCircuit : category(project) === "Experiments" ? Code2 : Layers3;
          const githubLink = project.githubLink?.includes("yourusername") ? undefined : project.githubLink;
          return (
            <article className='project-card' key={project.title}>
              <div className={`project-art art-${art.tone}`} aria-hidden='true'>
                <span className='art-index'>{category(project) === "AI & ML" ? "INTELLIGENCE" : category(project) === "Experiments" ? "EXPERIMENT" : "WEB APPLICATION"}</span>
                <div className='art-orbit orbit-one' /><div className='art-orbit orbit-two' />
                <div className='art-icon'><Icon size={38} strokeWidth={1.25} /></div>
                <span className='art-caption'>{index < 4 ? art.label : project.title}</span>
                <span className='art-spark'>✳</span>
              </div>
              <div className='project-body'>
                <div className='project-title-row'><h3>{project.title}</h3>{project.liveLink && <a href={project.liveLink} target='_blank' rel='noopener noreferrer' className='project-visit' aria-label={`Visit ${project.title}`}><ArrowUpRight size={20} /></a>}</div>
                <p className='project-description'>{project.description}</p>
                <div className='tech-list'>{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
                {project.highlights && <details className='project-details'><summary>Behind the build <span aria-hidden='true'>+</span></summary><ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul></details>}
                <div className='project-links'>
                  {project.liveLink && <a href={project.liveLink} target='_blank' rel='noopener noreferrer'>View project <ArrowUpRight size={14} /></a>}
                  {githubLink && <a href={githubLink} target='_blank' rel='noopener noreferrer'><Github size={14} /> Source code</a>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <div className='project-bottom'>
        {filtered.length > 6 && <button type='button' className='button button-secondary' aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? "Show selected work" : "Explore more work"}<ArrowDown size={16} className={showAll ? "rotate-180" : ""} /></button>}
        <a className='text-link' href={`https://github.com/${personalInfo.github}`} target='_blank' rel='noopener noreferrer'>More on GitHub <ArrowUpRight size={15} /></a>
      </div>
    </section>
  );
}
