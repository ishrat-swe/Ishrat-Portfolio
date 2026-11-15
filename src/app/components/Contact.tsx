"use client";

import { personalInfo } from "@/data";
import {
  MapPin,
  Send,
  Github,
  Linkedin,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage(null);
    setSubmitSuccess(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to send message.");
      }

      setSubmitSuccess(true);
      setStatusMessage(
        "Message sent successfully. I will get back to you soon.",
      );
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setSubmitSuccess(false);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending your message.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id='contact' className='contact-section'>
      <div className='section-wrap contact-grid'>
        <div className='contact-copy'>
          <p className='eyebrow'><span>08</span> Start a conversation</p>
          <h2>Something in mind?<br /><span>Let’s build it.</span></h2>
          <p>Have a project, a role, or an interesting idea? I would love to hear about it.</p>
          <a className='contact-email' href={`mailto:${personalInfo.email}`}>{personalInfo.email}<ArrowUpRight size={20} /></a>
          <span className='contact-location'><MapPin size={15} /> {personalInfo.location}</span>
          <div className='contact-socials'><a href={`https://github.com/${personalInfo.github}`} target='_blank' rel='noopener noreferrer'><Github size={17} /> GitHub <ArrowUpRight size={13} /></a><a href={`https://linkedin.com/in/${personalInfo.linkedin}`} target='_blank' rel='noopener noreferrer'><Linkedin size={17} /> LinkedIn <ArrowUpRight size={13} /></a></div>
        </div>
        <form onSubmit={handleSubmit} className='contact-form'>
          <h3>A good conversation starts here.</h3>
          <div className='form-row'>
            <div><label htmlFor='name'>Your name</label><input id='name' name='name' autoComplete='name' placeholder='Jane Doe' value={formData.name} onChange={handleChange} required maxLength={120} className='form-field' /></div>
            <div><label htmlFor='email'>Email address</label><input type='email' id='email' name='email' autoComplete='email' placeholder='jane@example.com' value={formData.email} onChange={handleChange} required maxLength={254} className='form-field' /></div>
          </div>
          <div><label htmlFor='message'>What are you thinking?</label><textarea id='message' name='message' placeholder='A little about your project or idea…' value={formData.message} onChange={handleChange} required maxLength={5000} rows={5} className='form-field' /></div>
          <div className='form-bottom'><span>Prefer your inbox? <a href={`mailto:${personalInfo.email}`}>Email me directly</a></span><button type='submit' disabled={isSending} className='button button-primary'>{isSending ? "Sending…" : "Send message"}<Send size={16} /></button></div>
          <div aria-live='polite' aria-atomic='true'>{statusMessage && <p className={`form-status ${submitSuccess ? "status-success" : "status-error"}`}>{statusMessage}</p>}</div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
