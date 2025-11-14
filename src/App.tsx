import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { RESUME_DATA } from './constants';
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Users,
  Star
} from './components/Icons';
import Cursor from './components/Cursor';
import InteractiveBackground from './components/ThreeScene';
import { Project } from './types';

const App: React.FC = () => {
    const [hidden, setHidden] = useState(false);
    const lastYRef = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastYRef.current && currentY > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            lastYRef.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        setHidden(false);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            const headerOffset = 64;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

  return (
    <>
      <InteractiveBackground />
      <Cursor />

      <motion.header
        variants={{
            visible: { y: 0 },
            hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center h-16">
              <div className="w-full overflow-x-auto no-scrollbar">
                <ul className="flex items-center justify-start sm:justify-center flex-nowrap min-w-max space-x-4 sm:space-x-6 md:space-x-8">
                    {['About', 'Experience', 'Education', 'Skills', 'Projects', 'Reach Me'].map(item => {
                      const targetId = item.toLowerCase().replace(' ', '-');
                      return (
                        <li key={item}>
                            <a href={`#${targetId}`} onClick={(e) => handleNavClick(e, targetId)} className="text-sm sm:text-base text-gray-300 hover:text-white transition-colors duration-300 font-medium whitespace-nowrap">
                                {item}
                            </a>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </nav>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <section id="about" className="min-h-screen flex flex-col justify-center items-center text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
                <h3 className="text-base sm:text-lg text-cyan-400 mb-2 tracking-widest uppercase font-semibold">
                  My Portfolio
                </h3>
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-4">
                  {RESUME_DATA.name}
                </h1>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-cyan-400 mb-8">
                  {RESUME_DATA.title}
                </h2>
                <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-3 text-gray-400 max-w-md mx-auto text-sm sm:text-base">
                    <a href={`mailto:${RESUME_DATA.contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="w-5 h-5" /> {RESUME_DATA.contact.email}</a>
                    <a href={`tel:${RESUME_DATA.contact.phone}`} className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="w-5 h-5" /> {RESUME_DATA.contact.phone}</a>
                    <a href={RESUME_DATA.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /> LinkedIn</a>
                    <span className="flex items-center gap-2"><MapPin className="w-5 h-5" />{RESUME_DATA.contact.location}</span>
                </div>
            </motion.div>
        </section>

        <Section id="summary" title="Professional Summary">
            <p className="text-base sm:text-lg md:text-xl text-center text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {RESUME_DATA.summary}
            </p>
        </Section>

        <Section id="experience" title="Experience">
            <div className="relative max-w-3xl mx-auto">
                <div className="absolute left-6 top-0 w-0.5 h-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 -translate-x-1/2" aria-hidden="true"></div>
                <div className="flex flex-col gap-8">
                    {RESUME_DATA.experience.map((exp, index) => (
                        <ExperienceItem key={index} item={exp} />
                    ))}
                </div>
            </div>
        </Section>

        <Section id="education" title="Education">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {RESUME_DATA.education.map((edu, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(34, 211, 238, 0.4)" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-cyan-900/50 p-2 rounded-full"><GraduationCap className="w-6 h-6 text-cyan-400"/></div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{edu.institution}</h3>
                      <p className="text-md text-cyan-400 mb-1">{edu.degree}</p>
                      <p className="text-sm text-gray-500">{edu.period}</p>
                    </div>
                  </div>
                  <ul className="mt-4 list-disc list-inside space-y-1 text-gray-400 leading-relaxed">
                    {edu.description.map((desc, i) => <li key={i}>{desc}</li>)}
                  </ul>
                </motion.div>
              ))}
            </div>
        </Section>

        <Section id="skills" title="Skills & Certifications">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Core Skills</h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {RESUME_DATA.skills.map(skill => <SkillBadge key={skill.name} name={skill.name} />)}
            </div>
            <div className="mt-12">
               <h3 className="text-2xl font-bold text-white mb-6 text-center">Certifications</h3>
               <div className="grid sm:grid-cols-2 gap-4 text-gray-300">
                {RESUME_DATA.certifications.map(cert => (
                  <div key={cert.title} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <span>{cert.title}</span>
                  </div>
                ))}
               </div>
            </div>
          </div>
        </Section>

        <Section id="projects" title="Projects">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {RESUME_DATA.projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
              ))}
            </div>
        </Section>

        <Section id="more-info" title="More Info">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <InfoCard index={0} icon={<Languages className="w-7 h-7 text-cyan-400"/>} title="Languages">
              <ul className="space-y-2 text-gray-400">{RESUME_DATA.languages.map(lang => <li key={lang}>{lang}</li>)}</ul>
            </InfoCard>
            <InfoCard index={1} icon={<Users className="w-7 h-7 text-cyan-400"/>} title="Clubs">
              <ul className="space-y-2 text-gray-400">{RESUME_DATA.clubs.map(club => <li key={club}>{club}</li>)}</ul>
            </InfoCard>
          </div>
        </Section>

        <Section id="reach-me" title="Reach Me">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team. Let's connect!
            </p>
            <div className="flex justify-center items-center flex-wrap gap-6 text-base sm:text-lg">
              <a
                href={`mailto:${RESUME_DATA.contact.email}`}
                className="inline-flex items-center gap-3 bg-gray-800/70 backdrop-blur-sm border border-white/10 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>{RESUME_DATA.contact.email}</span>
              </a>
              <a
                href={RESUME_DATA.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-gray-800/70 backdrop-blur-sm border border-white/10 text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </Section>

      </main>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {RESUME_DATA.name} All rights reserved.</p>
      </footer>
    </>
  );
};

const Section: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => {
    return (
        <section id={id} className="py-12 sm:py-16 md:py-20">
             <motion.h2
                className="text-3xl sm:text-4xl font-bold text-center text-white mb-10 md:mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5 }}
             >
                {title}
            </motion.h2>
            {children}
        </section>
    );
};

const ExperienceItem: React.FC<{ item: any }> = ({ item }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });

    return (
        <motion.div
            ref={ref}
            className="relative pl-14 sm:pl-20"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="absolute left-6 top-0 w-12 h-12 bg-gray-800 rounded-full flex-shrink-0 flex items-center justify-center z-10 ring-4 ring-gray-900/50 -translate-x-1/2">
                <Briefcase className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex-grow pt-1 pb-8 group">
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{item.role}</h3>
                <p className="text-cyan-500 mb-1">{item.company}</p>
                <p className="text-sm text-gray-500 mb-3">{item.period}</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 leading-relaxed">
                    {item.description.map((desc: string, i: number) => <li key={i}>{desc}</li>)}
                </ul>
            </div>
        </motion.div>
    );
};

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
    <motion.div
      className="bg-gray-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-lg shadow-lg flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(34, 211, 238, 0.4)" }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-cyan-900/50 p-2 rounded-full"><Star className="w-6 h-6 text-cyan-400"/></div>
        <h3 className="text-xl font-bold text-white">{project.title}</h3>
      </div>
      <ul className="space-y-2 text-gray-400 text-sm flex-grow leading-relaxed">
        <li><strong className="font-semibold text-gray-300">Focus:</strong> {project.focus}</li>
        {project.problem && <li><strong className="font-semibold text-gray-300">Problem:</strong> {project.problem}</li>}
        <li><strong className="font-semibold text-gray-300">Role:</strong> {project.role}</li>
        {project.skill && <li><strong className="font-semibold text-gray-300">Skill Applied:</strong> {project.skill}</li>}
        {project.tools && <li><strong className="font-semibold text-gray-300">Tools:</strong> {project.tools}</li>}
      </ul>
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-sm"><strong className="font-semibold text-gray-300">Result:</strong> <span className="font-bold text-cyan-400">{project.result}</span></p>
      </div>
    </motion.div>
  );

const SkillBadge: React.FC<{ name: string }> = ({ name }) => (
  <span className="inline-block bg-gray-800/70 backdrop-blur-sm border border-white/10 text-gray-300 py-1.5 px-4 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
    {name}
  </span>
);

const InfoCard: React.FC<{ icon: React.ReactNode, title: string, children: React.ReactNode, index: number }> = ({icon, title, children, index}) => (
    <motion.div
        className="bg-gray-900/50 backdrop-blur-sm border border-white/10 p-6 rounded-lg shadow-lg flex items-start gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.03, boxShadow: "0 0 15px rgba(34, 211, 238, 0.4)" }}
    >
        <div className="bg-cyan-900/50 p-3 rounded-full">{icon}</div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            {children}
        </div>
    </motion.div>
);

export default App;
