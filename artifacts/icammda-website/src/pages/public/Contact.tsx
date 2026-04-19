import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useCreateContactMessage } from "@workspace/api-client-react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useSiteContent } from "@/hooks/useSiteContent";

export default function Contact() {
  const c = useSiteContent();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const createMessage = useCreateContactMessage();
  const sending = createMessage.isPending;

  const phone = c("contact.phone", "+234 901 607 3157");
  const email = c("contact.email", "info@icammda.org");
  const contactDetails = [
    { icon: MapPin, title: "Address", lines: [c("contact.address.line1", "ICT Centre, Oye-Campus"), c("contact.address.line2", "Federal University Oye-Ekiti"), c("contact.address.line3", "Ekiti State, Nigeria")] },
    { icon: Phone, title: "Phone", lines: [phone], href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: Mail, title: "Email", lines: [email], href: `mailto:${email}` },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      await createMessage.mutateAsync({
        data: {
          name: form.name.trim(),
          email: form.email.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
      });
      setSent(true);
    } catch (err) {
      const message = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error
        ?? (err as Error)?.message
        ?? "Could not send your message. Please try again, or email us directly.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/section-bg.png')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07101e]/97 via-[#07101e]/92 to-[#07101e]/80" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent" />
        <div
        />
        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
          <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-4">Reach Out</p>
          <h1 className="font-serif text-white text-5xl sm:text-6xl md:text-7xl leading-tight mb-4" data-testid="contact-title">
            Get in<br /><em className="text-gradient">Touch</em>
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            {c("contact.hero.subtitle", "We welcome partnerships, collaborations, inquiries, and opportunities to work together toward data-driven health solutions for Africa.")}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 py-20" data-testid="contact-section">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact cards */}
          <div className="lg:col-span-2 space-y-5" data-testid="contact-details">
            <h2 className="font-serif text-foreground text-2xl mb-6">Contact Details</h2>
            {contactDetails.map((c) => (
              <div key={c.title} className="bg-card border border-card-border rounded-2xl p-6 flex gap-4 hover-lift">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                  <c.icon size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1">{c.title}</p>
                  {c.lines.map((line, i) => (
                    c.href && i === 0 ? (
                      <a key={i} href={c.href} className="text-foreground text-sm hover:text-cyan-600 transition-colors block">{line}</a>
                    ) : (
                      <p key={i} className="text-foreground text-sm">{line}</p>
                    )
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-[#07101e] rounded-2xl p-6 mt-6">
              <p className="text-cyan-400 text-xs font-bold tracking-widest uppercase mb-3">Research Collaborations</p>
              <p className="text-white/50 text-sm leading-relaxed">
                Interested in partnering with ICAMMDA on a research project or training programme? We actively seek collaborations with institutions across Africa and globally.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3" data-testid="contact-form-section">
            <h2 className="font-serif text-foreground text-2xl mb-6">Send a Message</h2>

            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-20 bg-cyan-50 border border-cyan-200 rounded-2xl" data-testid="success-message">
                <div className="w-14 h-14 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-4">
                  <CheckCircle size={26} />
                </div>
                <p className="font-serif text-foreground text-2xl mb-2">Message Sent!</p>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Thank you for reaching out. We'll get back to you within 2–3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="contact-form">
                {errorMsg && (
                  <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 rounded-xl px-4 py-3 text-sm" data-testid="contact-error">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-foreground/70 tracking-wide mb-1.5 block">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full bg-card border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                      data-testid="contact-name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground/70 tracking-wide mb-1.5 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="w-full bg-card border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                      data-testid="contact-email"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 tracking-wide mb-1.5 block">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="How can we help?"
                    className="w-full bg-card border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all"
                    data-testid="contact-subject"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground/70 tracking-wide mb-1.5 block">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Write your message here..."
                    className="w-full bg-card border border-card-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 transition-all resize-none"
                    data-testid="contact-message"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="group w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-black font-semibold px-6 py-3.5 rounded-xl text-sm transition-all duration-200"
                  data-testid="contact-submit"
                >
                  {sending ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
