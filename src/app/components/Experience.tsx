import { experiences } from "@/data";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function Experience() {
  return (
    <section id='experience' className='section-wrap section-space'>
      <SectionHeading number='03' eyebrow='My journey' title='Learning by building.' description='Taking ownership, solving real problems, and growing through the work.' />
      {experiences.map((experience) => <article className='experience-row' key={experience.company}>
        <div className='experience-meta'><span className='icon-box'><BriefcaseBusiness size={21} /></span><p>{experience.period}</p></div>
        <div className='experience-content'><p className='eyebrow'>{experience.company}</p><h3>{experience.role}</h3><ul>{experience.description.map((item) => <li key={item}><ArrowUpRight size={15} /><span>{item}</span></li>)}</ul></div>
      </article>)}
      <div className='journey-links'><span>Keep exploring</span><a href='#education'>Education <ArrowUpRight size={14} /></a><a href='#achievements'>Recognition <ArrowUpRight size={14} /></a><a href='#leadership'>Leadership <ArrowUpRight size={14} /></a></div>
    </section>
  );
}
