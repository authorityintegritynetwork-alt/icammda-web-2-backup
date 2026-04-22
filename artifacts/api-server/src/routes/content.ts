import { Router } from "express";
import { db } from "@workspace/db";
import { siteContent } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/requireAdmin";

const router = Router();

/* ─── Seed defaults ──────────────────────────────────────────────────────── */

const DEFAULTS: {
  key: string;
  label: string;
  value: string;
  page: string;
  type: string;
  sortOrder: number;
}[] = [
  // ── HOME ──
  { key: "home.hero.eyebrow",  label: "Hero Eyebrow Tag",              page: "home", value: "WAMCAD Member · West Africa",  type: "text",     sortOrder: 1 },
  { key: "home.hero.line1",    label: "Hero Title: Line 1",            page: "home", value: "Where African",               type: "text",     sortOrder: 2 },
  { key: "home.hero.line2.em", label: "Hero Title: Gradient Word",     page: "home", value: "Science",                    type: "text",     sortOrder: 3 },
  { key: "home.hero.line3",    label: "Hero Title: Line 3",            page: "home", value: "Meets World\u2011Class",      type: "text",     sortOrder: 4 },
  { key: "home.hero.line4",    label: "Hero Title: Line 4 (closing)",  page: "home", value: "Analytics.",                 type: "text",     sortOrder: 5 },
  { key: "home.hero.subtitle", label: "Hero Subtitle",                 page: "home", value: "International Centre for Applied Mathematical Modelling and Data Analytics — Federal University Oye-Ekiti, Nigeria. Building Africa's next generation of modelling scientists.", type: "textarea", sortOrder: 6 },
  { key: "home.stats.researchers", label: "Stat: Researchers Count", page: "home", value: "10+", type: "text", sortOrder: 4 },
  { key: "home.stats.partners", label: "Stat: Partner Institutions Count", page: "home", value: "5+", type: "text", sortOrder: 5 },
  { key: "home.stats.countries", label: "Stat: Countries Count", page: "home", value: "3+", type: "text", sortOrder: 6 },
  { key: "home.stats.events", label: "Stat: Events & Trainings Count", page: "home", value: "20+", type: "text", sortOrder: 7 },
  { key: "home.mission.eyebrow", label: "Mission Section Eyebrow", page: "home", value: "Our Mission", type: "text", sortOrder: 8 },
  { key: "home.mission.title", label: "Mission Section Title", page: "home", value: "Training a Critical Mass of Modelling Scientists across West Africa.", type: "textarea", sortOrder: 9 },
  { key: "home.mission.body1", label: "Mission Body Paragraph 1", page: "home", value: "Our long-term goal is to train researchers who are retained within the West African region — building the next generation of modellers who work closely with National Malaria Elimination Programs and other public health institutions.", type: "textarea", sortOrder: 10 },
  { key: "home.mission.body2", label: "Mission Body Paragraph 2", page: "home", value: "We build scientists who are internationally competitive, grant-ready, and deeply networked with partners across Africa and the globe.", type: "textarea", sortOrder: 11 },
  { key: "home.community.eyebrow", label: "Community Section Eyebrow", page: "home", value: "Our Community", type: "text", sortOrder: 12 },
  { key: "home.community.title", label: "Community Section Title", page: "home", value: "Growing a Continent's Scientific Capital.", type: "textarea", sortOrder: 13 },
  { key: "home.community.body", label: "Community Body Text", page: "home", value: "From Federal University Oye-Ekiti to partner institutions across West Africa, our researchers are building the next generation of modelling scientists on the continent — trained, networked, and retained in Africa.", type: "textarea", sortOrder: 14 },
  { key: "home.activities.01.title", label: "Activity 1: Title", page: "home", value: "Book Reading", type: "text", sortOrder: 15 },
  { key: "home.activities.01.desc", label: "Activity 1: Description", page: "home", value: "Collaborative study of key texts in mathematical modelling and epidemiology.", type: "textarea", sortOrder: 16 },
  { key: "home.activities.02.title", label: "Activity 2: Title", page: "home", value: "Journal Club", type: "text", sortOrder: 17 },
  { key: "home.activities.02.desc", label: "Activity 2: Description", page: "home", value: "Weekly critique of cutting-edge publications across data science and global health.", type: "textarea", sortOrder: 18 },
  { key: "home.activities.03.title", label: "Activity 3: Title", page: "home", value: "Progress Reports", type: "text", sortOrder: 19 },
  { key: "home.activities.03.desc", label: "Activity 3: Description", page: "home", value: "Regular research updates and milestone reviews across all active projects.", type: "textarea", sortOrder: 20 },
  { key: "home.activities.04.title", label: "Activity 4: Title", page: "home", value: "Software Hub", type: "text", sortOrder: 21 },
  { key: "home.activities.04.desc", label: "Activity 4: Description", page: "home", value: "Hands-on mastery in R, Python, NetLogo, and simulation environments.", type: "textarea", sortOrder: 22 },

  // ── ABOUT ──
  { key: "about.hero.subtitle", label: "Hero Subtitle", page: "about", value: "Empowering Africa's health future through rigorous analytics, bold innovation, and sustainable capacity building.", type: "textarea", sortOrder: 1 },
  { key: "about.overview.body1", label: "Overview Body 1", page: "about", value: "ICAMMDA is a member of the West Africa Mathematical Modelling Capacity Development (WAMCAD) — an Anglophone–Francophone–Lusophone scientific partnership with a bold vision: train a critical mass of modelling scientists retained within West Africa.", type: "textarea", sortOrder: 2 },
  { key: "about.overview.body2", label: "Overview Body 2", page: "about", value: "Situated in the ICT Centre of Federal University Oye-Ekiti, our state-of-the-art computing and simulation laboratory hosts seminars, workshops, and trainings on modelling, data analytics, and computational skills.", type: "textarea", sortOrder: 3 },
  { key: "about.director.letter.p1", label: "Director's Letter Paragraph 1", page: "about", value: "Welcome to the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA). At ICAMMDA, we believe science and data should do more than sit in reports. They should guide decisions and save lives.", type: "textarea", sortOrder: 4 },
  { key: "about.director.letter.p2", label: "Director's Letter Paragraph 2", page: "about", value: "Our team is committed to building tools that address real public health challenges, training Africa's next generation of scientific leaders, and working closely with partners across the continent and beyond.", type: "textarea", sortOrder: 5 },
  { key: "about.director.letter.p3", label: "Director's Letter Paragraph 3", page: "about", value: "Our passion is driven by purpose — to create solutions rooted in Africa and relevant to the world. We are building something here that will last generations, and I invite you to be part of it.", type: "textarea", sortOrder: 6 },
  { key: "about.units.01.title", label: "Unit 1 Title", page: "about", value: "Research & Modelling Unit", type: "text", sortOrder: 7 },
  { key: "about.units.01.desc", label: "Unit 1 Description", page: "about", value: "Developing mathematical models, epidemiological analyses, and policy-relevant research. Our work spans malaria, schistosomiasis, Lassa fever, and vaccine-preventable diseases.", type: "textarea", sortOrder: 8 },
  { key: "about.units.02.title", label: "Unit 2 Title", page: "about", value: "Capacity Building & Training", type: "text", sortOrder: 9 },
  { key: "about.units.02.desc", label: "Unit 2 Description", page: "about", value: "Workshops, short courses, and mentorship programmes equipping African researchers with cutting-edge analytical and modelling skills.", type: "textarea", sortOrder: 10 },
  { key: "about.units.03.title", label: "Unit 3 Title", page: "about", value: "International Partnerships", type: "text", sortOrder: 11 },
  { key: "about.units.03.desc", label: "Unit 3 Description", page: "about", value: "Through WAMCAD and beyond, active collaborations with universities, research centres, and public health agencies across West Africa, Europe, and North America.", type: "textarea", sortOrder: 12 },
  { key: "about.units.04.title", label: "Unit 4 Title", page: "about", value: "Community & Mentorship", type: "text", sortOrder: 13 },
  { key: "about.units.04.desc", label: "Unit 4 Description", page: "about", value: "Journal clubs to book reading circles — our community-oriented approach ensures researchers grow together and support each other's professional development.", type: "textarea", sortOrder: 14 },

  // ── CONTACT ──
  { key: "contact.hero.subtitle", label: "Hero Subtitle", page: "contact", value: "We welcome partnerships, collaborations, inquiries, and opportunities to work together toward data-driven health solutions for Africa.", type: "textarea", sortOrder: 1 },
  { key: "contact.address.line1", label: "Address Line 1", page: "contact", value: "ICT Centre, Oye-Campus", type: "text", sortOrder: 2 },
  { key: "contact.address.line2", label: "Address Line 2", page: "contact", value: "Federal University Oye-Ekiti", type: "text", sortOrder: 3 },
  { key: "contact.address.line3", label: "Address Line 3", page: "contact", value: "Ekiti State, Nigeria", type: "text", sortOrder: 4 },
  { key: "contact.phone", label: "Phone Number", page: "contact", value: "+234 901 607 3157", type: "text", sortOrder: 5 },
  { key: "contact.email", label: "Email Address", page: "contact", value: "info@icammda.org", type: "text", sortOrder: 6 },

  // ── CAREERS ──
  { key: "careers.hero.title", label: "Hero Title", page: "careers", value: "Join us in shaping Africa's health future", type: "textarea", sortOrder: 1 },
  { key: "careers.hero.subtitle", label: "Hero Subtitle", page: "careers", value: "Through data, science, and innovation.", type: "text", sortOrder: 2 },
  { key: "careers.section.title", label: "Section Title", page: "careers", value: "A mission-driven team tackling Africa's most urgent health challenges", type: "textarea", sortOrder: 3 },
  { key: "careers.section.body1", label: "Section Body 1", page: "careers", value: "At the International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA), we are driven by a mission to advance health in Africa through science, data, and innovation. Our team is made up of passionate professionals working across disciplines to solve complex public health challenges.", type: "textarea", sortOrder: 4 },
  { key: "careers.section.body2", label: "Section Body 2", page: "careers", value: "We welcome individuals who share our vision of using data-driven solutions to improve lives. Whether you are a modeller, data analyst, epidemiologist, software developer, or health professional — there is a place for you at ICAMMDA.", type: "textarea", sortOrder: 5 },
  { key: "careers.section.body3", label: "Section Body 3", page: "careers", value: "We invite scholars from around the globe to become part of our esteemed team. Our application, interview, and selection processes are conducted at various times throughout the year.", type: "textarea", sortOrder: 6 },
  { key: "careers.apply.internship.title", label: "Internship Card Title", page: "careers", value: "Elevate your modelling proficiency", type: "text", sortOrder: 7 },
  { key: "careers.apply.internship.body", label: "Internship Card Body", page: "careers", value: "ICAMMDA welcomes global scholars in pursuit of internship opportunities to elevate their mathematical modelling proficiency and gain a competitive edge in their careers.", type: "textarea", sortOrder: 8 },
  { key: "careers.apply.visiting.title", label: "Visiting Scholars Card Title", page: "careers", value: "Enriching learning for Masters & PhD scholars", type: "text", sortOrder: 9 },
  { key: "careers.apply.visiting.body", label: "Visiting Scholars Card Body", page: "careers", value: "ICAMMDA is delighted to invite Visiting Scholars, both Masters and Ph.D. candidates, from across the globe. Join us for an enriching learning journey, sharpen your capabilities, and leverage mathematical modelling to combat infectious diseases.", type: "textarea", sortOrder: 10 },
  { key: "careers.apply.fulltime.title", label: "Full-Time Staff Card Title", page: "careers", value: "Join our permanent research team", type: "text", sortOrder: 11 },
  { key: "careers.apply.fulltime.body", label: "Full-Time Staff Card Body", page: "careers", value: "We periodically recruit full-time researchers, analysts, and support staff. Open positions are advertised through our website and partner institutions.", type: "textarea", sortOrder: 12 },
  { key: "careers.cohorts.01.name", label: "Cohort 1 Name", page: "careers", value: "Cohort 1", type: "text", sortOrder: 13 },
  { key: "careers.cohorts.01.period", label: "Cohort 1 Period", page: "careers", value: "February – April", type: "text", sortOrder: 14 },
  { key: "careers.cohorts.01.deadline", label: "Cohort 1 Application Deadline", page: "careers", value: "January 15", type: "text", sortOrder: 15 },
  { key: "careers.cohorts.02.name", label: "Cohort 2 Name", page: "careers", value: "Cohort 2", type: "text", sortOrder: 16 },
  { key: "careers.cohorts.02.period", label: "Cohort 2 Period", page: "careers", value: "June – August", type: "text", sortOrder: 17 },
  { key: "careers.cohorts.02.deadline", label: "Cohort 2 Application Deadline", page: "careers", value: "May 15", type: "text", sortOrder: 18 },
  { key: "careers.cohorts.03.name", label: "Cohort 3 Name", page: "careers", value: "Cohort 3", type: "text", sortOrder: 19 },
  { key: "careers.cohorts.03.period", label: "Cohort 3 Period", page: "careers", value: "October – December", type: "text", sortOrder: 20 },
  { key: "careers.cohorts.03.deadline", label: "Cohort 3 Application Deadline", page: "careers", value: "September 15", type: "text", sortOrder: 21 },
  { key: "careers.email", label: "Careers/Applications Email", page: "careers", value: "careers@icammda.org", type: "text", sortOrder: 22 },

  // ── RESEARCH ──
  { key: "research.hero.subtitle", label: "Hero Subtitle", page: "research", value: "Rigorous science. Real-world impact. Tackling Africa's most pressing public health challenges through data-driven models.", type: "textarea", sortOrder: 1 },
  { key: "research.areas.01.title", label: "Area 1 Title", page: "research", value: "Malaria Modelling & Forecasting", type: "text", sortOrder: 2 },
  { key: "research.areas.01.desc", label: "Area 1 Description", page: "research", value: "Supporting targeted interventions and early warning systems across endemic regions through advanced compartmental and agent-based models.", type: "textarea", sortOrder: 3 },
  { key: "research.areas.02.title", label: "Area 2 Title", page: "research", value: "Vaccine Preventable Diseases (VPD)", type: "text", sortOrder: 4 },
  { key: "research.areas.02.desc", label: "Area 2 Description", page: "research", value: "Harnessing data and modelling to strengthen vaccine strategies and eliminate preventable diseases through optimised immunisation programmes.", type: "textarea", sortOrder: 5 },
  { key: "research.areas.03.title", label: "Area 3 Title", page: "research", value: "Lassa Fever & Emerging Infections", type: "text", sortOrder: 6 },
  { key: "research.areas.03.desc", label: "Area 3 Description", page: "research", value: "Developing models that help predict outbreaks and guide rapid response for Lassa fever and other emerging infectious threats in West Africa.", type: "textarea", sortOrder: 7 },
  { key: "research.areas.04.title", label: "Area 4 Title", page: "research", value: "Cholera Dynamics & Intervention", type: "text", sortOrder: 8 },
  { key: "research.areas.04.desc", label: "Area 4 Description", page: "research", value: "Helping to predict outbreaks and optimise response strategies for cholera-prone regions, integrating environmental and epidemiological data.", type: "textarea", sortOrder: 9 },
  { key: "research.areas.05.title", label: "Area 5 Title", page: "research", value: "Cerebrospinal Meningitis (CSM)", type: "text", sortOrder: 10 },
  { key: "research.areas.05.desc", label: "Area 5 Description", page: "research", value: "Supporting surveillance, prevention, and emergency response plans for meningitis outbreaks across the meningitis belt of sub-Saharan Africa.", type: "textarea", sortOrder: 11 },
  { key: "research.areas.06.title", label: "Area 6 Title", page: "research", value: "Neglected Tropical Diseases (NTDs)", type: "text", sortOrder: 12 },
  { key: "research.areas.06.desc", label: "Area 6 Description", page: "research", value: "Creating models to guide elimination strategies for diseases that disproportionately affect underserved communities across the continent.", type: "textarea", sortOrder: 13 },

  // ── ELEARNING ──
  { key: "elearning.hero.subtitle", label: "Hero Subtitle", page: "elearning", value: "Free, world-class lecture series in mathematical modelling, epidemiology, and data analytics — open to all African researchers.", type: "textarea", sortOrder: 1 },
  { key: "elearning.stats.playlists", label: "Stat: Playlists Count", page: "elearning", value: "15+", type: "text", sortOrder: 2 },
  { key: "elearning.stats.lectures", label: "Stat: Lectures Count", page: "elearning", value: "50+", type: "text", sortOrder: 3 },
  { key: "elearning.stats.access", label: "Stat: Access Type", page: "elearning", value: "Free", type: "text", sortOrder: 4 },
  { key: "elearning.stats.reach", label: "Stat: Reach", page: "elearning", value: "Africa-wide", type: "text", sortOrder: 5 },
];

export async function seedSiteContent() {
  const count = await db.select().from(siteContent).limit(1);
  if (count.length > 0) return;
  await db.insert(siteContent).values(DEFAULTS).onConflictDoNothing();
  console.log("[content] Seeded", DEFAULTS.length, "site content entries");
}

/* ─── GET /site-content ──────────────────────────────────────────────────── */
router.get("/", async (req, res) => {
  const { page } = req.query as { page?: string };
  const rows = page
    ? await db.select().from(siteContent).where(eq(siteContent.page, page)).orderBy(siteContent.sortOrder)
    : await db.select().from(siteContent).orderBy(siteContent.page, siteContent.sortOrder);
  res.json(rows);
});

/* ─── PATCH /site-content/:id ────────────────────────────────────────────── */
router.patch("/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { value } = req.body as { value?: string };

  if (value === undefined) {
    return res.status(400).json({ error: "value is required" });
  }

  const [updated] = await db
    .update(siteContent)
    .set({ value, updatedAt: new Date() })
    .where(eq(siteContent.id, id))
    .returning();

  if (!updated) return res.status(404).json({ error: "Not found" });
  return res.json(updated);
});

export default router;
