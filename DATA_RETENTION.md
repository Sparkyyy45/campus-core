# 🛡️ Data Retention & Privacy Policy — CampusCore

This document outlines the data collection, retention timelines, data security, and cascading erasure procedures implemented in **CampusCore**. We adhere to strict privacy-by-design standards, complying with **India's Digital Personal Data Protection (DPDP) Act 2023** and **GDPR** principles for college-wide educational portals.

---

## 1. Data Collection Scope & Purpose

CampusCore only collects data essential to optimizing the academic experience and securing the platform. We do not sell, track, or share any personal student data with external third parties.

| Data Category | Specific Elements | Business Purpose |
|---------------|-------------------|------------------|
| **Authentication Details** | Email, Password (hashed) | Direct secure access control |
| **Student Profile** | Full Name, Roll Number, Branch Code, Semester | Customizing notes and roadmaps layouts |
| **Roadmap Achievements** | Completed items, order checklist state | Self-guided progress tracking |
| **Download logs** | Student ID, Resource ID, Timestamp | Tracking resource popularity and audit logging |

---

## 2. Retention Timelines

We strictly enforce minimum data retention schedules. Data is purged automatically once its primary analytical purpose has been completed:

### 📊 A. Student Download Logs (`resource_downloads`)
* **Retention Limit**: **Exactly 90 Days**
* **Policy**: Download logs are collected solely to analyze study resource popularity (e.g. which PYQs are highly searched before exams) and to prevent download service abuse. These records are automatically pruned or anonymized (uncoupled from the student's ID) after 90 days.

### 👤 B. Active Student Profiles (`profiles`)
* **Retention Limit**: **Duration of College Enrollment**
* **Policy**: Retained indefinitely until the student triggers account deletion, or demitted from the university database upon graduation.

### 🗺️ C. Roadmap Completions (`user_roadmap_progress`)
* **Retention Limit**: **Active Enrollment**
* **Policy**: Retained to allow students to resume their course progress across terms. Deleted immediately upon account closure.

### 💾 D. Database System Backups
* **Retention Limit**: **30 Days (Rolling)**
* **Policy**: Supabase daily database snapshots are retained securely for a rolling window of 30 days to support disaster recovery, after which older snapshots are permanently destroyed.

---

## 3. The Cascaded Account Deletion (Cascade Purge)

In compliance with India's DPDP Act 2023 (Section 13 - Right to Correction and Erasure), students possess the absolute right to permanently delete their account and associated metadata at any time.

### 🔴 The Danger Zone Purge
When a student triggers account deletion inside **[profile/actions.ts](file:///C:/Users/suyas/OneDrive/Desktop/CAMPUS_CORE/campuscore/src/app/(dashboard)/profile/actions.ts)**:
1. **Auth Session Revocation**: The student's active auth session is immediately destroyed on the Edge.
2. **Supabase Cascade Trigger**: A service-role request purges the primary user ID record from `auth.users`.
3. **Database Cascade**:
   - `public.profiles` matching the user ID is immediately deleted.
   - `public.resource_downloads` linking the user ID is cascadingly deleted.
   - `public.user_roadmap_progress` linking the user ID is cascadingly deleted.
4. **Irreversible Action**: Once completed, the student's personal data is permanently wiped from PostgreSQL, with zero recovery capability.

---

## 4. Encryption & Operational Security

- **Data in Transit**: All connections between the browser client, Next.js proxy routing, Supabase database layers, and Cloudinary storage are secured via enforced **TLS 1.3 / HTTPS** encryption.
- **Data at Rest**:
  - Student passwords are cryptographically hashed using **bcrypt** inside Supabase auth modules before storage.
  - PostgreSQL database disks are protected via standard AES-256 cloud encryption.
- **Row-Level Security (RLS)**: Enforced directly inside PostgreSQL to ensure that student users can never read another classmate's download histories, profile configurations, or roadmap completion checklists.
- **File Isolation**: Study resource PDF sheets are stored inside a private Cloudinary bucket. They cannot be hotlinked; direct access is restricted via time-limited signed URLs that expire after exactly **1 hour**.
