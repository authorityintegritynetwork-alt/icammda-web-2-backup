import { FlaskConical, GraduationCap, Globe, Users } from "lucide-react";
import PublicNav from "@/components/PublicNav";
import PublicFooter from "@/components/PublicFooter";
import { useListTeamMembers } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function About() {
  const { data: team, isLoading } = useListTeamMembers();
  const director = team?.find((m) => m.role === "director");

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="bg-[hsl(222,47%,11%)] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">Who We Are</p>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4" data-testid="about-title">About ICAMMDA</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Empowering Africa's health future through analytics, innovation, and capacity building.
          </p>
        </div>
      </section>

      {/* About overview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="about-overview">
        <div className="prose prose-slate max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            The International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA), Federal University Oye-Ekiti, Ekiti State, Nigeria is a member of the West Africa Mathematical Modelling Capacity Development (WAMCAD) — an Anglophone–Francophone–Lusophone partnership comprising several international research institutions:
          </p>
          <ul className="mt-4 space-y-1 text-muted-foreground">
            <li>University of Thies, Senegal</li>
            <li>University of Conakry, Guinea</li>
            <li>Bandim Health Project, Guinea Bissau</li>
            <li>University of Ghana</li>
            <li>ICAMMDA, Federal University Oye-Ekiti, Nigeria</li>
          </ul>
        </div>
      </section>

      {/* Director's letter */}
      <section className="bg-muted/40 py-14" data-testid="director-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Leadership</p>
          <h2 className="text-2xl font-bold font-serif text-foreground mb-8">A Letter from Our Director</h2>
          <div className="bg-card border border-card-border rounded-2xl p-8 md:flex gap-8 items-start shadow-sm">
            {isLoading ? (
              <div className="shrink-0 w-36 h-36 rounded-xl bg-muted" />
            ) : director?.photoUrl ? (
              <img src={director.photoUrl} alt={director.name} className="shrink-0 w-36 h-36 rounded-xl object-cover" data-testid="director-photo" />
            ) : (
              <div className="shrink-0 w-36 h-36 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users size={40} className="text-primary/50" />
              </div>
            )}
            <div className="mt-4 md:mt-0">
              <h3 className="font-bold text-xl text-foreground font-serif" data-testid="director-name">
                {isLoading ? <Skeleton className="h-6 w-48" /> : director?.name ?? "Prof Emmanuel Afolabi Bakare"}
              </h3>
              <div className="text-primary text-sm font-medium mb-4">
                {isLoading ? <Skeleton className="h-4 w-32 mt-1" /> : director?.title ?? "Director, ICAMMDA"}
              </div>
              <div className="prose prose-slate max-w-none text-muted-foreground text-sm leading-relaxed space-y-3">
                <p>Dear Visitor,</p>
                <p>Welcome to the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA).</p>
                <p>At ICAMMDA, we believe science and data should do more than sit in reports. They should guide decisions and save lives. Our team is committed to building tools that address real public health challenges, training Africa's next generation of scientific leaders, and working closely with partners across the continent and beyond.</p>
                <p>Our passion is driven by purpose — to create solutions that are rooted in Africa and relevant to the world.</p>
                <p>Thank you for visiting. I invite you to explore our work and join us in advancing public health through innovation, collaboration, and excellence.</p>
                <p className="font-medium text-foreground">Warm regards,<br /><strong>Prof Emmanuel Bakare</strong><br />Director, ICAMMDA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structure */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14" data-testid="structure-section">
        <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Organisation</p>
        <h2 className="text-2xl font-bold font-serif text-foreground mb-4">Our Structure</h2>
        <p className="text-muted-foreground leading-relaxed mb-8">
          ICAMMDA is situated within the ICT Centre, Oye-Campus. It comprises two major sections: a scientific computing and simulation laboratory, and a section of offices. The computing and simulation lab contains state-of-the-art equipment suitable for hosting seminars, workshops, and trainings on modelling, data analytics, and computational skills.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              icon: FlaskConical,
              title: "Research and Modelling Unit",
              desc: "This unit drives the core scientific work of ICAMMDA. It is responsible for developing mathematical models, conducting epidemiological analyses, and producing policy-relevant research. Our modelling work spans diseases such as malaria, schistosomiasis, Lassa fever, and vaccine-preventable illnesses.",
            },
            {
              icon: GraduationCap,
              title: "Capacity Building and Training Unit",
              desc: "We believe that sustainable impact comes from investing in people. This unit organises workshops, short courses, and mentorship programmes to equip African researchers with cutting-edge analytical and modelling skills.",
            },
            {
              icon: Globe,
              title: "International Partnerships",
              desc: "Through WAMCAD and beyond, we maintain active collaborations with universities, research centres, and public health agencies across West Africa, Europe, and North America.",
            },
            {
              icon: Users,
              title: "Community and Mentorship",
              desc: "From journal clubs to book reading circles, our community-oriented approach ensures researchers grow together, share knowledge, and support each other's professional development.",
            },
          ].map((unit) => (
            <div key={unit.title} className="bg-card border border-card-border rounded-xl p-6" data-testid={`unit-${unit.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                <unit.icon size={18} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{unit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{unit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
