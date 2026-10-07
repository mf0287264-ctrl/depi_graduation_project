# DEPI Graduation Project

Welcome to the repository for the **DEPI Graduation Project**.

## Team Collaboration Workflow

### 1. Branching Strategy
- `main`: Production-ready, stable code. Direct commits to `main` should be restricted.
- Feature / Task Branches: Create a separate branch for each feature, task, or bugfix:
  ```bash
  git checkout -b feature/your-feature-name
  ```

### 2. Making & Pushing Changes
- Commit your changes locally:
  ```bash
  git add .
  git commit -m "feat: add detailed description of changes"
  ```
- Push your feature branch to GitHub:
  ```bash
  git push origin feature/your-feature-name
  ```

### 3. Merging via Pull Requests (PR)
1. Go to the GitHub repository: `https://github.com/mf0287264-ctrl/depi_graduation_project`
2. Open a **Pull Request (PR)** from your branch into `main`.
3. Have team members review and approve the changes.
4. Merge the PR into `main`.
