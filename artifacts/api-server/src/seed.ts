import { db, postsTable, eventsTable, teamTable, partnersTable } from "@workspace/db";

async function seed() {
  console.log("Seeding database...");

  // Partners
  await db.delete(partnersTable);
  await db.insert(partnersTable).values([
    {
      name: "University of Ghana",
      website: "https://www.ug.edu.gh",
      description: "WAMCAD partner institution from Ghana.",
      displayOrder: 1,
    },
    {
      name: "University of Thies, Senegal",
      website: "https://www.univ-thies.sn",
      description: "Francophone WAMCAD partner from Senegal.",
      displayOrder: 2,
    },
    {
      name: "Bandim Health Project, Guinea Bissau",
      description: "Lusophone WAMCAD partner from Guinea Bissau.",
      displayOrder: 3,
    },
    {
      name: "University of Conakry, Guinea",
      description: "Francophone WAMCAD partner from Guinea.",
      displayOrder: 4,
    },
    {
      name: "Federal University Oye-Ekiti",
      website: "https://www.fuoye.edu.ng",
      description: "Host institution of ICAMMDA in Nigeria.",
      displayOrder: 5,
    },
  ]);
  console.log("Partners seeded.");

  // Team members
  await db.delete(teamTable);
  await db.insert(teamTable).values([
    {
      name: "Prof Emmanuel Afolabi Bakare",
      title: "Director, ICAMMDA / Professor of Mathematics",
      role: "director",
      bio: "Prof Bakare is a Professor of Mathematics at the Federal University Oye-Ekiti. He specialises in mathematical epidemiology and optimal control theory applied to infectious diseases including malaria, Lassa fever, and schistosomiasis.",
      email: "bakare.emmanuel@fuoye.edu.ng",
      displayOrder: 0,
    },
    {
      name: "Dr Adenike Oluwaseun",
      title: "Research Associate – Mathematical Epidemiology",
      role: "researcher",
      bio: "Dr Oluwaseun's research focuses on mathematical modelling of vector-borne diseases and the application of optimal control techniques to malaria transmission dynamics.",
      email: "oluwaseun.adenike@fuoye.edu.ng",
      displayOrder: 1,
    },
    {
      name: "Mr Festus Ayodeji Adegoke",
      title: "Postdoctoral Researcher – Data Analytics",
      role: "postdoc",
      bio: "Festus applies machine learning and Bayesian statistical methods to epidemiological data from West African countries to improve disease burden estimates.",
      email: "adegoke.festus@fuoye.edu.ng",
      displayOrder: 2,
    },
    {
      name: "Mrs Taiwo Blessing Okonkwo",
      title: "Administrative Officer",
      role: "staff",
      bio: "Taiwo provides administrative support to all research and training activities at the centre.",
      email: "okonkwo.taiwo@fuoye.edu.ng",
      displayOrder: 3,
    },
  ]);
  console.log("Team seeded.");

  // Posts
  await db.delete(postsTable);
  await db.insert(postsTable).values([
    {
      title: "ICAMMDA Hosts Inaugural West Africa Modelling Symposium",
      slug: "inaugural-west-africa-modelling-symposium",
      excerpt: "Researchers from across West Africa gathered at FUOYE for the first WAMCAD modelling symposium, sharing groundbreaking work on malaria dynamics.",
      content: `<p>The International Centre for Applied Mathematical Modelling and Data Analytics (ICAMMDA) recently hosted the inaugural West Africa Mathematical Modelling Symposium at the Federal University Oye-Ekiti.</p>
<p>The three-day event brought together over 40 researchers, graduate students, and public health experts from Nigeria, Ghana, Senegal, Guinea, and Guinea Bissau.</p>
<h2>Highlights of the Symposium</h2>
<p>Key presentations covered:</p>
<ul>
<li>New mathematical frameworks for modelling malaria transmission in seasonal environments</li>
<li>Data-driven estimation of disease burden using Bayesian hierarchical models</li>
<li>Optimal control strategies for schistosomiasis elimination</li>
<li>Panel discussions on sustainable research funding for African modelling scientists</li>
</ul>
<p>Prof Emmanuel Bakare, Director of ICAMMDA, described the symposium as "a milestone for scientific collaboration across language boundaries in West Africa."</p>`,
      category: "News",
      authorName: "ICAMMDA Editorial Team",
      published: true,
      featured: true,
    },
    {
      title: "Applications Now Open: WAMCAD Modelling Summer School 2026",
      slug: "wamcad-modelling-summer-school-2026",
      excerpt: "The prestigious WAMCAD Summer School on Mathematical Modelling and Data Analytics is accepting applications for its 2026 cohort.",
      content: `<p>ICAMMDA and the WAMCAD consortium are pleased to announce that applications are now open for the 2026 WAMCAD Mathematical Modelling and Data Analytics Summer School.</p>
<p>The two-week intensive programme is designed for early-career researchers, graduate students, and public health professionals from across West Africa.</p>
<h2>Programme Overview</h2>
<p>Topics covered will include:</p>
<ul>
<li>Foundations of compartmental epidemic modelling (SIR, SEIR, vector-host)</li>
<li>Parameter estimation and model calibration</li>
<li>R and Python for epidemiological modelling</li>
<li>Optimal control theory in public health</li>
<li>Data visualisation and communication of modelling results</li>
</ul>
<h2>How to Apply</h2>
<p>Applicants must submit a completed application form, a one-page statement of research interest, and a letter of support from a supervisor or employer. Full funding is available for eligible candidates.</p>`,
      category: "Upcoming Training",
      authorName: "ICAMMDA Training Unit",
      published: true,
      featured: false,
    },
    {
      title: "Journal Club Recap: Optimal Control of Schistosomiasis",
      slug: "journal-club-optimal-control-schistosomiasis",
      excerpt: "This week's journal club explored a landmark paper on optimal control strategies for schistosomiasis control in sub-Saharan Africa.",
      content: `<p>The ICAMMDA Journal Club met this week to discuss a landmark paper on the application of optimal control theory to schistosomiasis transmission dynamics in sub-Saharan Africa.</p>
<p>Led by Prof Bakare, the session explored the paper's mathematical framework, which employed Pontryagin's maximum principle to identify cost-effective intervention strategies combining mass drug administration with environmental snail control.</p>
<p>Participants engaged in lively discussions about the assumptions embedded in the model and how they might be refined using surveillance data from Nigerian communities.</p>
<p>The next journal club session will focus on a recent preprint examining malaria parasite dynamics under artemisinin combination therapy.</p>`,
      category: "Recent Training",
      authorName: "ICAMMDA Editorial Team",
      published: true,
      featured: false,
    },
  ]);
  console.log("Posts seeded.");

  // Events
  await db.delete(eventsTable);
  await db.insert(eventsTable).values([
    {
      title: "WAMCAD Mathematical Modelling Summer School 2026",
      slug: "wamcad-summer-school-2026",
      description: `<p>The WAMCAD Summer School on Mathematical Modelling and Data Analytics returns for 2026! This prestigious two-week intensive programme equips early-career researchers and graduate students with the quantitative and computational skills needed to address public health challenges in West Africa and beyond.</p>
<h2>Who Should Attend</h2>
<ul>
<li>Graduate students in mathematics, statistics, epidemiology, or public health</li>
<li>Early-career researchers with an interest in disease modelling</li>
<li>Public health professionals wanting to strengthen their analytical toolkit</li>
</ul>
<h2>What You Will Learn</h2>
<ul>
<li>Compartmental epidemic models (SIR, SEIR, vector-host)</li>
<li>Parameter estimation and model calibration using R and Python</li>
<li>Optimal control theory applied to public health interventions</li>
<li>Effective communication of modelling results to policy audiences</li>
</ul>
<p>Full funding (travel, accommodation, and meals) is available for eligible participants from WAMCAD member countries.</p>`,
      eventType: "Training",
      location: "ICAMMDA, Federal University Oye-Ekiti, Nigeria",
      startDate: new Date("2026-07-14"),
      endDate: new Date("2026-07-25"),
      formType: "google",
      googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSd8Rt2eKjyITj8nxBGp0rQYvX5nqSYAXg0HsKmXu2NMxLuAAg/viewform?embedded=true",
      published: true,
      featured: true,
    },
    {
      title: "ICAMMDA Webinar: Data-Driven Approaches to Malaria Elimination",
      slug: "webinar-data-driven-malaria-elimination",
      description: `<p>Join ICAMMDA for a free online webinar exploring how modern data analytics and machine learning are being applied to accelerate malaria elimination efforts across West Africa.</p>
<h2>Speakers</h2>
<p>The webinar will feature presentations from researchers affiliated with WAMCAD partner institutions covering:</p>
<ul>
<li>Spatial heterogeneity in malaria transmission and implications for control</li>
<li>Integrating routine health system data with modelling frameworks</li>
<li>Machine learning for malaria risk stratification</li>
</ul>
<p>A Q&A session will follow the presentations. All are welcome to attend. No prior modelling experience is required.</p>`,
      eventType: "Webinar",
      location: "Online (Zoom)",
      startDate: new Date("2026-05-20"),
      formType: "custom",
      customFormFields: JSON.stringify([
        { name: "fullName", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "institution", label: "Institution / Organisation", type: "text", required: false },
        { name: "country", label: "Country", type: "text", required: true },
      ]),
      published: true,
      featured: false,
    },
    {
      title: "Introduction to R for Epidemiological Modelling",
      slug: "intro-r-epidemiological-modelling",
      description: `<p>This hands-on workshop provides an accessible introduction to the R programming language with a focus on epidemiological modelling. Participants will leave with practical skills to start building and analysing disease transmission models immediately.</p>
<h2>Topics</h2>
<ul>
<li>R basics: data types, control flow, and functions</li>
<li>Data manipulation with tidyverse</li>
<li>Building SIR models with deSolve</li>
<li>Fitting models to epidemiological data</li>
<li>Creating publication-quality visualisations</li>
</ul>`,
      eventType: "Workshop",
      location: "ICAMMDA Computing Lab, FUOYE",
      startDate: new Date("2026-03-05"),
      endDate: new Date("2026-03-07"),
      formType: "none",
      published: true,
      featured: false,
    },
  ]);
  console.log("Events seeded.");

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
