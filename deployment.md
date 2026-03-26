# FDS Deployment step by step process

The server runs on `Ubuntu`,and we are using K3s for deployment—a lightweight and easy-to-set-up Kubernetes solution that simplifies managing and scaling the application

### Step 1 : Update the ubuntu packages
```
sudo apt update             
sudo apt update -y
```
### Step 2:Install k3s(for latest version)
```
curl -sfL https://get.k3s.io | sudo sh -
```

### If we need paticular version https://get.k3s.io always fetches the latest stable release from the official K3s releases
```
curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.28.1+k3s1 sudo sh -
```
# Avoid Using sudo for kubectl

### Create Kubernetes Configuration Directory
```
mkdir -p ~/.kube
```

## Copy K3s Admin Config
```
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
```
## Change Ownership of Config File
```
sudo chown $USER:$USER ~/.kube/config
```
## Set File Permissions
```
chmod 600 ~/.kube/config
```
## Configure Environment Variable
```
echo 'export KUBECONFIG=~/.kube/config' >> ~/.bashrc         
source ~/.bashrc
```
### Reason for doing all this:
**By copying the kubeconfig, changing ownership, setting permissions, and exporting the environment variable, your user can safely and conveniently manage the K3s cluster using kubectl commands without sudo. Each step acts to make the file accessible, secure, and automatically usable for normal user operations.**

# Workflow Summary: Docker Build & Push
**This GitHub Actions workflow automates the process of building and pushing Docker images to GitHub Container Registry (GHCR) whenever code is pushed or a pull request targets the main branch.**

### Checkout code 

>Copies the latest version of the project so the system can work with the most up-to-date files and changes.

### Login to GHCR 

>Securely connects to GitHub’s container storage (GHCR) so the system can save the application image.

### how to generate the tokens for workflows build
>`GithubSettings` -> `Developer settings` -> `Personal access tokens` -> `Token(classic)` -> `generate a new token(classic)` -> `give permission as per project need accordingly` -> `Generate token`

##### Note:
>Login details are stored safely in GitHub and are not written directly in the workflow file, keeping credentials secure.

### Build & push Docker image 
>Creates a packaged version of the application using the Dockerfile and uploads it to GHCR as the latest version, ready for use.

### Check image size 
**Reviews the size of the created Docker image to ensure it is optimized and suitable for deployment.**

### Overall benefit 
>This workflow automatically keeps the application image updated with the latest code, reducing manual work and ensuring the system is always ready for deployment.


# Dockerfile Overview

## Muliti-stage Docker

**This Docker setup builds the app in two stages, keeping only what’s needed for running in the final image. This makes the app smaller, faster, more secure, and easier to manage, ensuring it’s always ready and reliable for production.**


### Stage 1
>Build stage – Uses a lightweight Node.js image to prepare and build the application. This stage is only used during the build process and not in the final running container.

>Set working directory – Creates a dedicated folder inside the container where the application files will live.

>Copy dependency files – Copies the dependency definition files first so Docker can reuse cached layers and speed up future builds.

>Install all dependencies – Downloads and installs all required packages needed to build the application.

>Copy application source code – Copies the full application code into the container so it can be built.

>Build the application – Compiles the Next.js application into an optimized production-ready version. Dynamic pages are handled at runtime to avoid build-time issues.

### Stage 2: 

>Production stage – Creates a clean, lightweight container that only contains what is required to run the application in production.

>Install production dependencies only – Installs only the necessary packages needed to run the application, reducing image size and improving security.

>Copy built application files – Transfers the compiled application and public assets from the build stage into the final container.

>Expose application port – Makes the application available on port 3000 so it can be accessed by users or services.

>Set production environment – Ensures the application runs in production mode for better performance and stability.

>Start the application – Launches the application when the container starts.

### Overall benefit
**This Dockerfile creates a secure, lightweight, and production-ready container by separating the build process from the runtime environment, improving performance, reliability, and deployment speed.**