import { leadershipActivities } from "@/data";
import { ShieldCheck, Users } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function Leadership() {
  return (
    <section id='leadership' className='section-wrap section-space'>
      <SectionHeading number='06' eyebrow='Beyond the screen' title='Good work starts with people.' description='Taking initiative, giving back, and being part of something bigger.' />
      <div className='leadership-grid'>{leadershipActivities.map((activity, index) => {
        const Icon = index === 0 ? Users : ShieldCheck;
        return <article key={activity.role} className='leadership-card'><span className='icon-box'><Icon size={21} /></span><span className='small-label'>{activity.period}</span><h3>{activity.role}</h3><p className='leadership-org'>{activity.organization}</p><p className='body-copy'>{activity.description}</p></article>;
      })}</div>
    </section>
  );
}
