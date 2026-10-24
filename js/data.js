/* All site content lives here. Edit this file to add or change anything on the page.
   Screenshots: shots: screenshots("folder-name", count)  ->  images/projects/<folder>/01.png ... NN.png
   Other formats: screenshots("folder-name", 5, "webp"). Use [] for a placeholder. */

function screenshots(folder, count, ext = "png") {
  return Array.from({ length: count }, (_, i) =>
    `images/projects/${folder}/${String(i + 1).padStart(2, "0")}.${ext}`);
}

const PROFILE = {
  name: "Muhammad Usama Mughal",
  email: "usamaofficiall1212@gmail.com",
  github: "https://github.com/usamaofficiall1212-cloud",
  linkedin: "https://www.linkedin.com/in/iamusamamughall",
  formEndpoint: "",                        // Formspree URL, e.g. "https://formspree.io/f/abcdwxyz". Empty = form opens your email app.
  cv: "assets/Usama_CV_2026.pdf",          // "" hides the button
  photo: "",                                // e.g. "images/me.jpg"; empty shows a phone with your lead project
  headline: "I build mobile apps, from the screen to the server.",
  intro: "I’m Muhammad Usama Mughal, a mobile developer in Rawalpindi. I build Android apps with Kotlin and Jetpack Compose, cross-platform apps with Flutter, and the C# backends behind them.",
  stack: "Kotlin · Jetpack Compose · Flutter · ASP.NET Core · SQL Server · Firebase",
  about: "I’m a full-stack mobile developer. I design the screens, write the app in Kotlin or Flutter, and build the ASP.NET Core and SQL Server backend it talks to. One of my apps, Al-Muqeet Milk, is used every day by a real business. I’m currently an intern at Technology Junction (NASTP)."
};

const EXPERIENCE = [
  { role: "Software Development Intern", org: "Technology Junction (NASTP)", period: "May 2026 – Present",
    text: "Building Flutter apps and ASP.NET Core APIs with SQL Server, including client-side data caching." },
  { role: "IT Support Trainee", org: "Pearl Continental Hotel", period: "Apr 2025 – Jul 2025",
    text: "Supported hotel systems, server backups and network troubleshooting." },
  { role: "Video Editor and Content Researcher", org: "Hashtag Media", period: "Dec 2021 – Jan 2025",
    text: "Produced video content with Premiere Pro and After Effects, and researched content strategy." }
];

const SKILLS = {
  "Mobile": ["Kotlin", "Jetpack Compose", "Flutter", "Dart", "Material 3", "MVVM"],
  "Backend": ["C#", "ASP.NET Core", "REST APIs", "Entity Framework Core"],
  "Data": ["SQL Server", "Room", "SQLite", "Firebase"],
  "Tools": ["Git", "Docker", "Postman", "Figma", "Android Studio"]
};

/* color: the app's brand color (tints the phone panel). icon: optional app icon path, "" shows a letter badge.
   links: [{ label: "Play Store", url: "https://..." }]. note: shown when there are no links. */
const PROJECTS = [
  {
    name: "Al-Muqeet Milk",
    role: "Business management app · Android, in production",
    summary: "A billing and ledger app for a milk business, used day to day by the shop.",
    points: [
      "Generates PDF invoices and keeps customer ledgers up to date automatically.",
      "Works offline and backs up to Firebase so records are not lost.",
      "Offline license system using time-block MD5 hashing to stop unauthorized copies.",
      "Sends bills to customers directly through WhatsApp."
    ],
    tags: ["Kotlin", "Android", "Firebase", "PDF generation"],
    color: "#4B5FD6", icon: "",
    shots: screenshots("al-muqeet-milk", 7),
    links: [], note: "Private client project",
    caseStudy: {
      problem: "A milk business needed to create bills and keep customer ledgers accurately, without depending on a constant internet connection.",
      role: "Lead developer. I designed and built the whole Android app in Kotlin and Java using Android Studio.",
      decisions: [
        { title: "Offline first, backed up to the cloud", text: "Data is stored on the phone so the shop keeps working offline, and a hybrid sync to Firebase keeps a cloud copy. I used Logcat and Firebase Debug View to check the data stayed correct during sync." },
        { title: "A license system that works offline", text: "I built a license check using time-block MD5 hashing with clock-tamper detection, so copies can’t be shared or reset by clearing app data." },
        { title: "Bills sent where customers already are", text: "Invoices are generated as PDFs and sent straight to the customer through WhatsApp." }
      ],
      result: "In daily use by the business since January 2026."
    }
  },
  {
    name: "Aequs Vault",
    role: "Income and expense tracker · Android",
    summary: "A personal finance tracker that shows balance, monthly spending and savings progress at a glance.",
    points: [
      "Savings goals with live percentage progress.",
      "Quick-math field that evaluates chained expressions such as 3+2+2-4.",
      "Currency exchange screen and Room database storage with manual cloud backup."
    ],
    tags: ["Kotlin", "Jetpack Compose", "Material 3", "Room"],
    color: "#2E9B1F", icon: "",
    shots: screenshots("aequs-vault", 9),
    links: [], note: "Personal project",
    caseStudy: {
      problem: "Income, spending and savings are hard to follow when they live in different places. I wanted one app that shows where the money goes.",
      role: "Lead developer. I built the app in Kotlin with Jetpack Compose and Material 3.",
      decisions: [
        { title: "Live totals from one source of truth", text: "Total balance, monthly spending and savings update instantly through state-driven updates in Compose." },
        { title: "A quick-math field", text: "A custom calculator evaluates chained expressions such as 3+2+2-4 by keeping intermediate values, so long inputs stay accurate." },
        { title: "Data that doesn’t get lost", text: "Records are stored locally with Room, and a manual cloud backup protects them against data loss." }
      ],
      result: ""
    }
  }
];
