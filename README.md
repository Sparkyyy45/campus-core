# 🎓 CampusCore — Modern Academic Portal

CampusCore is a premium, high-fidelity academic resources and study roadmaps portal specifically engineered for **Sir Padampat Singhania University (SPSU)**. It provides a secure, lightning-fast, and beautiful interface for students to access Previous Year Questions (PYQs), lecture notes, and curriculum syllabus, while offering a robust management suite for administrators.

---

## ✨ Features

### 👤 Student Dashboard
- **Subject-Wise Filtering**: Dynamic filtering by academic branch (CS, IT, ME, etc.) and semester (1–8).
- **Interactive Resource Discovery**: Search and sort lecture papers and class modules with instant feedback.
- **Secure Inline PDF Viewer**: Read academic papers directly inside the browser using a custom-wrapped, sandboxed secure PDF viewer—no forced downloads or external redirections.
- **Background Downloads ("Get")**: Seamless one-click file downloads powered by browser-level background tabs, leaving the student's active portal view fully active and undisturbed.

### 🛡️ Airtight Security & Asset Privacy
- **Cloudinary Secure Signing**: Academic materials are uploaded as private assets. CampusCore's backend dynamically signs resource URLs on-the-fly, rendering them valid for exactly 1 hour.
- **Anti-Leak Barriers**: Shared links automatically expire. Bypassing portal authentication to scrape or hotlink files is strictly blocked by access token signatures.
- **Supabase Credentials Authentication**: Safe, secure email-and-password client sign-up, sign-in, and reset flows reinforced with Row-Level Security (RLS) policies.

### ⚙️ Administrative Command Console
- **Resource Publisher**: Drag-and-drop file uploader that securely registers documents in Cloudinary and publishes them instantly or saves them as drafts.
- **Portal Management**: Complete CRUD interfaces to manage subjects, add announcements, configure resource categories, and audit user roles.
- **Rate-Limiting Protection**: Backend API routes are rate-limited to shield databases from scraping or brute-force operations.

### 🚀 Search Engine Optimization (SEO)
- **SPSU-Tailored Schema Markup**: Embedded JSON-LD structured data mapping site context back to official university hubs, making it instantly discoverable for student search parameters.
- **Double-Barrier Directory Privacy**: A strict double-barrier (Next.js server layout rules + strict `robots.txt` / `sitemap.xml` mapping) allows indexable search visibility for auth portals while totally masking private dashboards and personal user files from web-crawlers.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) utilizing **Turbopack** compiler.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a sleek, premium, dark-mode-first aesthetic.
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, custom schema tables, RLS security policies).
- **Media Engine**: [Cloudinary v2](https://cloudinary.com/) (Secure raw file uploads and signed CDN asset delivery).
- **Icons & Visuals**: [Lucide React](https://lucide.dev/), [Sonner](https://trigger.dev/) custom toast alerts.

---

## 💾 Database Schema Overview

CampusCore runs on a relational PostgreSQL database (managed via Supabase). The core relationships are structured as follows:

```
┌──────────────────┐         ┌──────────────────┐
│     profiles     │         │     subjects     │
├──────────────────┤         ├──────────────────┤
│ id (PK, Auth)    │         │ id (PK)          │
│ role (STUDENT/   │         │ name             │
│       ADMIN)     │◄────────│ branch_code      │
│ branch_code      │         │ semester         │
│ semester         │         └────────┬─────────┘
└────────┬─────────┘                  │
         │                            │ 1
         │ 1                          │
         │                            │ N
         │ N                         ┌▼─────────────────┐
         │                          │    resources     │
         │                          ├──────────────────┤
         │                          │ id (PK)          │
         │                          │ title            │
         │                          │ description      │
         │                          │ cloudinary_id    │
         │                          │ cloudinary_url   │
         │                          │ file_size_bytes  │
         │                          │ status (DRAFT/   │
         │                          │         PUBLISHED)
         │                          │ subject_id (FK)  │
         └─────────────────────────►│ uploader_id (FK) │
                                    │ type_id (FK) ◄───┼──────┐
                                    └──────────────────┘      │ N
                                                              │
                                     ┌──────────────────┐     │ 1
                                     │  resource_types  │     │
                                     ├──────────────────┤     │
                                     │ id (PK)          │─────┘
                                     │ name (PYQ, Notes)│
                                     │ is_pyq (Boolean) │
                                     └──────────────────┘
```

---

## ⚙️ Getting Started

### 1. Prerequisites
Ensure you have [Node.js (v18+)](https://nodejs.org/) installed on your machine.

### 2. Clone and Setup Project
```bash
git clone https://github.com/Sparkyyy45/campus-core.git
cd campus-core
npm install
```

### 3. Configure Local Environment
Create a `.env.local` file in the project root and enter your Supabase and Cloudinary API credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name

# App Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Initialize your Supabase database using the sql schema file provided in this repository:
- Run the SQL scripts in `supabase/schema.sql` directly inside the Supabase SQL editor to scaffold the tables, profiles, and relational constraints.

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your browser.

---

## 🚀 Building & Deploying

### Production Build
Generate an optimized Next.js production build:
```bash
npm run build
```

### Deploying to Vercel
1. Push your changes to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your `campus-core` project.
3. Configure the environment variables matching your `.env.local` keys.
4. Deploy!

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
