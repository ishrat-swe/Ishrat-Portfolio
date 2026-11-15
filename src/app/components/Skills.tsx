import { skills, languages } from "@/data";
import { Braces, PanelsTopLeft, Server, Database, BrainCircuit, Wrench, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";

const icons = [Braces, PanelsTopLeft, Server, Database, BrainCircuit, Wrench, Users];

export default function Skills() {
  return (
    <section id='skills' className='section-band'>
      <div className='section-wrap section-space'>
        <SectionHeading number='02' eyebrow='What I work with' title='The tools behind the thinking.' description='From the interface you interact with to the systems that make it work. A practical, end-to-end toolkit.' />
        <div className='skills-grid'>
          {skills.map((group, index) => {
            const Icon = icons[index % icons.length];
            return <article key={group.name} className={`skill-group ${group.name === "Soft Skills" ? "skill-group-wide" : ""}`}>
              <div className='skill-group-title'><Icon size={19} strokeWidth={1.6} /><h3>{group.name}</h3><span>{String(index + 1).padStart(2, "0")}</span></div>
              <div className='tech-list'>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div>
            </article>;
          })}
        </div>
        <div className='languages-row'><p>Beyond the code<span>Languages I speak</span></p><div>{languages.map((language) => <span className='language-item' key={language.name}><strong>{language.name}</strong><span>{language.level}</span></span>)}</div></div>
      </div>
    </section>
  );
}
