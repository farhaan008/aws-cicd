# aws-cicd
Automated CI/CD pipeline that builds and deploys Vue and Node.js applications to an AWS EC2 development environment using GitHub Actions, OIDC authentication, PM2, and Nginx.

                    Developer
                        │
                   git push
                        │
                        ▼
                GitHub Repository
                        │
                        ▼
                 GitHub Actions
                        │
           Authenticate to AWS (OIDC)
                        │
                        ▼
               Build Applications
        ┌───────────────┴───────────────┐
        │                               │
        ▼                               ▼
 Build Vue App                  Build Node.js App
        │                               │
        └───────────────┬───────────────┘
                        │
                        ▼
             Copy Files to EC2 (SSH/SCP)
                        │
                        ▼
            Restart Node.js Service (PM2)
                        │
                        ▼
             Nginx Serves Vue Application
                        │
                        ▼
                Development Environment



This flow illustrates an automated CI/CD deployment pipeline that deploys both the frontend and backend applications to a development environment using GitHub Actions and AWS.

Developer Pushes Code
The process begins when a developer pushes code changes to the GitHub repository.
GitHub Actions Workflow Triggered
The push event automatically triggers a GitHub Actions workflow, initiating the build and deployment process.
AWS Authentication via OIDC
GitHub Actions securely authenticates with AWS using OpenID Connect (OIDC), eliminating the need to store long-lived AWS credentials in GitHub secrets.
Application Build Process
The workflow builds both application components in parallel:
Vue Application – Compiles the frontend into optimized static assets.
Node.js Application – Installs dependencies and prepares the backend application for deployment.
Deploy to EC2
Once both builds are complete, the generated artifacts are securely transferred to the target Amazon EC2 instance using SSH/SCP.
Restart Backend Service
After deployment, the Node.js application is restarted using PM2 to ensure the latest version is running without requiring manual intervention.
Serve Frontend Through Nginx
Nginx serves the newly deployed Vue application's static files while acting as the web server (and optionally as a reverse proxy to the Node.js backend).
Development Environment Updated
The deployment completes successfully, making the latest frontend and backend changes available in the development environment.
