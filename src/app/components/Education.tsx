import { education } from "@/data";
import { GraduationCap, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function Education() {
  const [university, ...schools] = education;
  return (
    <section id='education' className='section-wrap section-space section-top-line'>
      <SectionHeading number='04' eyebrow='The foundation' title='Curiosity, with a foundation.' />
      <div className='education-grid'>
        <article className='university-card'>
          <div className='education-top'><span className='icon-box'><GraduationCap size={23} /></span><span className='small-label'>{university.period}</span></div>
          <h3>{university.institution}</h3><p className='education-degree'>{university.degree}</p>
          <p className='education-location'>{university.location} <span>·</span> CGPA {university.cgpa}</p>
          {university.thesis && <div className='thesis-block'><p className='eyebrow'>Research & thesis</p><p>{university.thesis}</p></div>}
          {university.coursework && <details className='coursework-details'><summary>Relevant coursework <ArrowUpRight size={15} /></summary><div className='tech-list'>{university.coursework.map((course) => <span key={course}>{course}</span>)}</div></details>}
        </article>
        <div className='school-list'>{schools.map((school) => <article key={school.degree} className='school-card'><span className='small-label'>{school.period}</span><h3>{school.degree}</h3><p>{school.institution}</p><div className='school-meta'><span>{school.location}</span><strong>{school.result}</strong></div></article>)}</div>
      </div>
    </section>
  );
}
