import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      <section className="bg-[hsl(222,47%,11%)] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Get in Touch</p>
          <h1 className="text-4xl font-bold font-serif mb-3" data-testid="contact-title">Contact Us</h1>
          <p className="text-slate-300">
            We welcome partnerships, collaborations, inquiries, and opportunities to work together toward data-driven solutions for health in Africa.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Get in Touch</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4 p-4 bg-card border border-card-border rounded-xl" data-testid="contact-address">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Address</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ICT Centre, Oye-Campus<br />
                    Federal University Oye-Ekiti<br />
                    Ekiti State, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-card-border rounded-xl" data-testid="contact-phone">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Phone</p>
                  <a href="tel:+2349016073157" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +234 901 607 3157
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-card-border rounded-xl" data-testid="contact-email">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Email</p>
                  <a href="mailto:icammda@fuoye.edu.ng" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                    icammda@fuoye.edu.ng
                  </a>
                  <a href="mailto:info@icammda.org" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                    info@icammda.org
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-card border border-card-border rounded-xl" data-testid="contact-hours">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Working Hours</p>
                  <p className="text-sm text-muted-foreground">Monday – Friday: 8:00 AM – 5:00 PM (WAT)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div data-testid="contact-form-section">
            <h2 className="text-2xl font-bold font-serif text-foreground mb-6">Send a Message</h2>
            <form
              className="space-y-4 bg-card border border-card-border rounded-xl p-6"
              data-testid="contact-form"
              onSubmit={(e) => { e.preventDefault(); alert("Thank you for your message. We will get back to you shortly."); }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">Full Name <span className="text-destructive">*</span></Label>
                  <Input id="name" name="name" required placeholder="Your full name" data-testid="contact-name-input" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email <span className="text-destructive">*</span></Label>
                  <Input id="email" name="email" type="email" required placeholder="your@email.com" data-testid="contact-email-input" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Subject <span className="text-destructive">*</span></Label>
                <Input id="subject" name="subject" required placeholder="How can we help?" data-testid="contact-subject-input" />
              </div>
              <div>
                <Label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message <span className="text-destructive">*</span></Label>
                <Textarea id="message" name="message" required rows={5} className="resize-none" placeholder="Write your message here..." data-testid="contact-message-input" />
              </div>
              <Button type="submit" className="w-full" data-testid="contact-submit-btn">
                Send Message
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We'll respond within 2 business days.
              </p>
            </form>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
