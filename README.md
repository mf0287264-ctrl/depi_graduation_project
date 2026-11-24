# 📎 Automated E-Commerce Platform

## 📌 Project Overview
The core of this project is to deploy a multi-service e-commerce platform (web, database, payment, and search) utilizing advanced DevOps methodologies. It focuses on automated CI/CD, containerization, infrastructure provisioning, and continuous monitoring to ensure high availability, scalability, and zero downtime during updates.

---

## 👥 Team & Acknowledgments

* **🎓 Instructor:** Mohamed Rahim

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

## 🏗️ Architecture & Containerization Setup

The platform is designed around a multi-service containerized architecture orchestrated via **Docker Compose** and fronted by an **Nginx Reverse Proxy**:

```
                          ┌────────────────────────┐
                          │     Client / Browser   │
                          └───────────┬────────────┘
                                      │ Port 80
                                      ▼
                      ┌────────────────────────────────┐
                      │    Nginx Reverse Proxy (Port 80)│
                      └───────┬──────────────┬─────────┘
                              │              │
             ┌────────────────┘              └────────────────────────┐
             │ Path: /                                                 │ Path: /api/*
             ▼                                                         ▼
  ┌──────────────────────┐                     ┌───────────────────────────────────────────────┐
  │   React / Vite UI    │                     │              Backend Microservices            │
  │  (frontend container)│                     │                                               │
  └──────────────────────┘                     │  • /api/user-service/    ──▶ user-service:4001 │
                                               │  • /api/catalog-service/ ──▶ catalog-service:4002│
                                               │  • /api/search-service/  ──▶ search-service:4003 │
                                               │  • /api/payment-service/ ──▶ payment-service:4004│
                                               └───────────────────────┬───────────────────────┘
                                                                       │ Shared Volume
                                                                       ▼
                                                           ┌──────────────────────┐
                                                           │    hexaxotics.db     │
                                                           │   (SQLite Database)  │
                                                           └──────────────────────┘
```

### Key Components Added:
1. **Docker Compose (`docker-compose.yml`)**:
   - Manages and links all services together in a private bridge network (`hexa-network`).
   - Configures persistent storage for the shared database (`hexaxotics.db`).
   - Sets environment configurations, health restart policies (`unless-stopped`), and service dependencies.
2. **Nginx Reverse Proxy (`nginx/nginx.conf`)**:
   - Acts as the unified gateway on port `80`.
   - Routes frontend traffic and proxies microservice APIs to avoid CORS issues and eliminate port proliferation.
   - Configured with `client_max_body_size 10M` for handling media/avatar uploads seamlessly.
3. **Frontend Production Build Integration (`frontend/Dockerfile`)**:
   - Multi-stage Docker build utilizing Node.js for building Vite assets and Nginx for serving production bundles.
   - Build arguments (`VITE_*_SERVICE_URL`) injected at build time to direct client-side API requests to Nginx reverse proxy routes.

---

## 🚀 Running the Project Locally with Docker

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose installed.

### 1. Build and Run All Services
From the root directory, start the entire stack:
```bash
docker compose up --build -d
```

### 2. Access the Application
- **Web Application:** `http://localhost`
- **Reverse Proxy Routing:**
  - User Service: `http://localhost/api/user-service/`
  - Catalog Service: `http://localhost/api/catalog-service/`
  - Search Service: `http://localhost/api/search-service/`
  - Payment Service: `http://localhost/api/payment-service/`

### 3. Stop the Containers
```bash
docker compose down
```

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
