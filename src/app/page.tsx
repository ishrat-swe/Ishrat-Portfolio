import Hero from "./components/Hero";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Achievements from "./components/Achievememts";
import Leadership from "./components/Leadership";
import Footer from "./components/Footer";
import InteractivePlayground from "./components/InteractivePlayground";

export default function Home() {
  return (
    <main id='main-content' tabIndex={-1}>
      <Hero />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Achievements />
      <Leadership />
      <InteractivePlayground />
      <Contact />
      <Footer />
    </main>
  );
}
