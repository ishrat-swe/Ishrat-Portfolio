import Image from "next/image";
import { ArrowDown, ArrowUpRight, Download, Github, Linkedin, MapPin } from "lucide-react";
import { personalInfo } from "@/data";
import rintu from "../../../public/ishrat.png";

export default function Hero() {
  return (
    <section id='home' className='hero section-wrap'>
      <div className='hero-copy'>
        <p className='eyebrow'><span className='status-dot' /> {personalInfo.title}</p>
        <h1>Ishrat Jahan<br /><span>Rintu.</span></h1>
        <p className='hero-tagline'>Building for the web.<br />Thinking beyond it.</p>
        <p className='hero-about'>{personalInfo.about}</p>
        <div className='hero-actions'>
          <a href='#projects' className='button button-primary'>Explore my work <ArrowUpRight size={18} /></a>
          <a href='/MstIshratJahanRintu_Resume.pdf' download className='button button-secondary'><Download size={16} /> Resume</a>
        </div>
        <div className='hero-socials'>
          <span><MapPin size={14} /> {personalInfo.location}</span>
          <span className='social-divider' aria-hidden='true' />
          <a href={`https://github.com/${personalInfo.github}`} target='_blank' rel='noopener noreferrer' aria-label='GitHub profile'><Github size={18} /></a>
          <a href={`https://linkedin.com/in/${personalInfo.linkedin}`} target='_blank' rel='noopener noreferrer' aria-label='LinkedIn profile'><Linkedin size={18} /></a>
        </div>
      </div>
      <div className='hero-visual'>
        <div className='portrait-decoration' aria-hidden='true'><span /><span /><span /></div>
        <div className='portrait-frame'>
          <Image src={rintu} alt='Ishrat Jahan Rintu' fill priority sizes='(max-width: 767px) 85vw, 420px' className='portrait-image' />
          <div className='portrait-caption'><span>ISHRAT JAHAN RINTU</span><span>{personalInfo.title}</span></div>
        </div>
      </div>
      <div className='hero-bottom'>
        <a href='#projects' className='scroll-cue'><ArrowDown size={15} /> Scroll to explore</a>
        <div className='hero-facts'><span>Selected work & experiments</span><span className='fact-divider' /><span>Web development <i>×</i> AI integration</span></div>
      </div>
    </section>
  );
}
