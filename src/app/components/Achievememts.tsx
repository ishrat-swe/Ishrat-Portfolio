import { achievements, certifications, ongoingCourses } from "@/data";
import { Award, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function Achievements() {
  return (
    <section id='achievements' className='section-band'>
      <div className='section-wrap section-space'>
        <SectionHeading number='05' eyebrow='Milestones' title='A few things along the way.' description='Recognition, challenges, and a commitment to keep learning.' />
        <div className='recognition-grid'>
          <div className='award-list'>{achievements.map((achievement, index) => <article className={`award-card ${index === 0 ? "award-featured" : ""}`} key={achievement.title}>
            <Award size={index === 0 ? 30 : 20} strokeWidth={1.5} /><div>{index === 0 && <span className='eyebrow'>National recognition</span>}<h3>{achievement.title}</h3><p>{achievement.description}</p></div>
          </article>)}</div>
          <div className='certification-panel'>
            <p className='eyebrow'>Always a student</p>
            <h3>Courses & certifications</h3>
            {ongoingCourses.map((course) => (
              <article className='certificate-row' key={course.title}>
                <div><h4>{course.title}</h4><p>{course.provider}</p></div>
                <span>{course.status}</span>
              </article>
            ))}
            {certifications.map((certificate) => <article className='certificate-row' key={certificate.title}><div><h4>{certificate.title}</h4><p>{certificate.issuer}</p></div><span>{certificate.year}</span></article>)}
            <p className='certification-note'>Learning is part of the process. <ArrowUpRight size={14} /></p>
          </div>
        </div>
      </div>
    </section>
  );
}
