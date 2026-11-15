import { ArrowUp } from "lucide-react";

export default function Footer() {
  return <footer className='site-footer section-wrap'><a href='#home' className='footer-wordmark'>Ishrat Rintu<span>.</span></a><p>Thoughtfully built with Next.js & a little curiosity.</p><a href='#home' className='back-to-top'>Back to top <ArrowUp size={14} /></a></footer>;
}
