# 📎 Automated E-Commerce Platform

## 📌 Project Overview
The core of this project is to deploy a multi-service e-commerce platform (web, database, payment, and search) utilizing advanced DevOps methodologies. It focuses on automated CI/CD, containerization, infrastructure provisioning, and continuous monitoring to ensure high availability, scalability, and zero downtime during updates.

---

## 👥 Team & Acknowledgments

* **🎓 Instructor:** Abobakr Yousre

### 👥 Team Members:
- **Mohammed Wael Badr**
- **Mohamed Farid Abdel Fattah Atallah**
- **Youssif Ashraf Ewais**
- **Mohammed Hussein Fahim Mohammed**
- **Mohamed Yasser Abdelrahman Abdelaziz**

---

## 🎯 Project Objectives
- **Full-Stack E-Commerce Application:** Develop a full-stack e-commerce application with shopping cart and product management features.
- **Zero Downtime Deployments:** Eliminate website downtime during updates and deployments.
- **Automated CI/CD:** Build seamless continuous integration and continuous deployment pipelines.
- **Microservices Containerization:** Containerize all e-commerce microservices to ensure consistent operation across environments.
- **High Availability & Auto-Scaling:** Guarantee high availability and automated scaling to handle high user traffic.
- **Infrastructure Automation:** Automate infrastructure provisioning and server configuration.
- **Continuous Monitoring:** Continuously monitor service performance and system reliability.

---

## 📦 Project Scope
- **Full-stack E-Commerce Development:** Frontend, Backend, Shopping Cart functionality.
- **Containerization:** Dockerized e-commerce microservices.
- **CI/CD Pipelines:** Automated updates using Jenkins.
- **Container Orchestration:** Kubernetes deployment with auto-scaling capabilities.
- **Configuration Management:** Ansible scripts for server and configuration setup.
- **Cloud Infrastructure:** Provisioning on AWS (EC2, RDS, S3, ELB) using Terraform.
- **Service Monitoring:** Prometheus and Grafana dashboards.
- **Traffic Routing:** Nginx reverse proxy for traffic routing.
- **Deployment Reliability:** Automated rollback strategies for deployment failures.
- **Version Control:** Complete code and script management via Git repository.

---

## 📅 Project Plan (5 Weeks)

| Week | Phase / Objectives | Key Deliverables & Activities |
| :--- | :--- | :--- |
| **Week 1** | **Planning & Infrastructure Setup** | Project planning, setting up the Git repository, designing core e-commerce features (product catalog & cart), and writing Terraform scripts to provision AWS infrastructure. |
| **Week 2** | **Development & Containerization** | Developing frontend and backend, containerizing application and database using Docker, and writing Ansible scripts for server configuration. |
| **Week 3** | **Kubernetes & Scaling** | Setting up Kubernetes cluster, deploying microservices, and configuring auto-scaling to handle variable shopping traffic. |
| **Week 4** | **CI/CD & Reliability** | Building CI/CD pipelines using Jenkins for seamless integration, testing buying/selling processes, and implementing automated rollback strategies. |
| **Week 5** | **Monitoring, Routing & Testing** | Configuring system monitoring with Prometheus and Grafana, setting up Nginx routing, and conducting comprehensive end-to-end testing before final delivery. |

---

## 🤝 Team Collaboration Workflow

### 1. Branching Strategy
- `main`: Production-ready, stable code. Direct commits to `main` should be restricted.
- **Feature / Task Branches:** Create a separate branch for each feature, task, or bugfix:
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
