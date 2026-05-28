# 🤝 Contributing to CampusCore

We welcome open-source contributions from SPSU students, GSoC candidates, and the global developer community! 

This guide outlines our development standards, code guidelines, and submission workflow to ensure high quality and safety in our academic hub.

---

## 📖 Table of Contents
1. [Onboarding & Local Setup](#-onboarding--local-setup)
2. [Git Workflow & Branch Strategy](#-git-workflow--branch-strategy)
3. [Conventional Commits Specification](#-conventional-commits-specification)
4. [Coding Standards & Conventions](#-coding-standards--conventions)
5. [Local Build & Pre-Commit Validation](#-local-build--pre-commit-validation)
6. [Pull Request (PR) Procedure](#-pull-request-pr-procedure)

---

## 🚀 Onboarding & Local Setup

### Prerequisites
- **Node.js** version 20.x or higher.
- **npm** version 10.x or higher.
- A **Supabase** account (Free tier is perfectly suitable).
- A **Cloudinary** account (Free tier).

### Local Setup
1. **Fork the Repository**: Fork the project on GitHub and clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/campus-core.git
   cd campus-core
   ```
2. **Install Dependencies**: Run npm clean-install to install verified versions:
   ```bash
   npm ci
   ```
3. **Configure Environment Variables**: Duplicate the env template and populate it with your local credentials:
   ```bash
   cp .env.example .env.local
   ```
   > [!WARNING]
   > Never commit `.env.local` or any file containing real API secrets to git. The project is pre-configured to ignore these files.

4. **Initialize Database**: Copy the complete schema and seed definitions inside `supabase/schema.sql` and run them inside your Supabase project's SQL Editor to set up relational tables and Row-Level Security (RLS) policies.

5. **Start Dev Server**: Launch Next.js in development mode:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 🌿 Git Workflow & Branch Strategy

We enforce a structured, branch-based feature workflow. All changes must be developed in dedicated feature/fix branches created from `main`:

### Branch Naming Taxonomy
Name your branch based on the category of your changes:
- **Features**: `feature/your-feature-name` or `feat/some-feature`
- **Bugfixes**: `bugfix/bug-fix-name` or `fix/some-bug`
- **Hotfixes**: `hotfix/critical-security-patch`
- **Documentation**: `docs/update-readme`
- **Performance**: `perf/optimize-db-queries`

*Example:* `git checkout -b feat/cookie-consent-popup`

---

## ✍️ Conventional Commits Specification

To keep the release history clean and support automated changelogs, we strictly adhere to the **Conventional Commits** standard. Commit messages must be structured as follows:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Commit Types
- **`feat`**: A new user-facing feature (e.g., `feat(auth): add email verification check`)
- **`fix`**: A bug fix (e.g., `fix(admin): resolve profile demographic self-demotion lockout`)
- **`docs`**: Documentation changes only (e.g., `docs(readme): add system topology diagram`)
- **`style`**: Markup, white-space, formatting, semi-colons (no code changes)
- **`refactor`**: Code changes that neither fix a bug nor add a feature (e.g., `refactor(auth): extract shared verifyAdmin`)
- **`perf`**: A code change that improves performance (e.g., `perf(resources): cache resource types list`)
- **`test`**: Adding missing tests or correcting existing tests
- **`build`**: Changes that affect the build system or external dependencies
- **`ci`**: Changes to our CI/CD pipelines (e.g., GitHub Actions workflows)
- **`chore`**: Other changes that don't modify src or test files

### Scope
The scope is a noun describing the affected component enclosed in parentheses: `auth`, `admin`, `resources`, `notes`, `pyqs`, `roadmaps`, `profile`, `config`.

*Example of a great commit message:*
```bash
git commit -m "feat(auth): add IP-based login rate limiting"
```

---

## 📐 Coding Standards & Conventions

- **TypeScript Strictness**: We require strict type checking. Avoid assertions like `as any` or casting unless absolutely necessary (such as bypassing Next.js server-side DB generics mapping anomalies).
- **React Purity**: Keep React rendering pure. Do not perform side effects (like in-place `new Date()` calls) inside component rendering chains.
- **Tailwind CSS Utility Use**: Follow the established token styling variables. Do not use ad-hoc arbitrary styles or inline spacing wrappers.
- **Accessibility (a11y)**: Every interactive element must be fully accessible:
  - All icon-only buttons must have an explicit, readable `aria-label` attribute.
  - All form inputs must have a corresponding `<Label>` linking to their `id`.
  - Color contrast ratios must comply with WCAG 2.2 AA guidelines.

---

## 🛡️ Local Build & Pre-Commit Validation

Before submitting any code for review, you must verify your changes compile and pass our automated checkers locally.

### 1. Run Unit Tests (Vitest)
Verify that all tests in our test suite pass cleanly:
```bash
npm test
# Or to run once:
npx vitest run
```

### 2. Run ESLint Code Analysis
Check for code style issues and unused variables:
```bash
npm run lint
```

### 3. Compile Production Bundle
Verify that Next.js and TypeScript compilation compiles without any errors:
```bash
npm run build
```

> [!TIP]
> **Git Hooks Guard**: The project has **Husky** and **lint-staged** configured. On Git commit, the pre-commit hook automatically formats and lints your staged files. If the linting or syntax tests fail, the commit will be blocked until resolved!

---

## 🤝 Pull Request (PR) Procedure

1. **Synchronize Main**: Make sure your local branch is rebased with the latest upstream `main` branch before pushing:
   ```bash
   git fetch origin
   git rebase origin/main
   ```
2. **Push Changes**: Push the feature branch to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
3. **Open PR**: Create a Pull Request against the upstream `main` branch.
4. **Detail the PR**: Complete the PR description template detailing:
   - What the change introduces (Goal).
   - How it was verified (tests, manual workflows, screens).
   - Any architectural implications.
5. **Resolve Feedback**: Address review suggestions cleanly in the same branch, pushing updates directly to update the PR.

Thank you for dedicating your time to improving CampusCore! Happy coding!
