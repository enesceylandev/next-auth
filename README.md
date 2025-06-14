# Next.js Auth Application

## Overview

This is a test case solution for Kayra Export; is a Next.js application with Auth0 authentication, Cypress testing capabilities, and Docker deployment support. This README provides comprehensive documentation to help you set up and develop the project.

## Installation

To run the project on your device, follow the steps below:

1. Clone this repository:

   ```bash
   git clone git@github.com:enesceylandev/next-auth.git next-auth
   ```

2. Clone this repository:

   ```bash
   cd next-auth
   ```

3. Install the required dependencies:

   ```bash
   npm i
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The project will start at `http://localhost:3000`.

## Project Structure

```
next-auth/
├── app/                   # Main application directory (Next.js Router)
├── components/            # Reusable React components
├── cypress/               # Cypress test suite and configurations
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and shared logic
├── public/                # Static assets served by Next.js
├── middleware.ts          # Next.js middleware for auth and routing
├── next.config.ts         # Next.js configuration
├── Dockerfile             # Docker configuration for containerization
└── ...
```

## Contribution Guideline
We welcome contributions! Here's how you can contribute:

### Setting Up the Development Environment

1.Before starting development, run the following commands:

   ```bash
   git clone git@github.com:enesceylandev/next-auth.git next-auth
   cd next-auth
   ```

### Development Process

1. Update the main and develop branches:
   ```bash
   git checkout main
   git pull origin main
   git checkout develop
   git pull origin develop
   ```
   
> [!NOTE]
> If the change you want to work on is not in the issue list, first open an issue related to the problem

3. Create a branch for the change you want to make:
   ```bash
   git checkout -b <type>/<development-name>
   ```
   
> [!NOTE]
> Available **type** names;
>
> - **feat**: Adding a new feature
> - **refactor**: Code refactoring, performance improvements
> - **docs**: Documentation update
> - **fix**: Bug fix
> - **hotfix**: Emergency bug fixes

> For example, you can create a branch like:
>
> ```bash
>    git checkout -b feat:setting-page
> ```

4. After making changes, make sure there are no issues by following these steps:

   ```bash
     git checkout dev/1.0.0
     git pull origin dev/1.0.0
     git checkout <your-branch-name>
     git rebase dev/1.0.0
     npm run build
   ```

> [!CAUTION]
> - This step checks if your changes cause any issues in the project. Do not proceed to the next step without resolving any issues encountered!
> - Only use the main branch for hotfixes. For all other situations, use the develop branch.

5. If there are no issues, commit your changes with a message like this:

   ```bash
    git commit -m "<type>: A short summary of your change. (#<issueId>)"
   ```

> For example:
>
> ```bash
>     git commit -m "docs: Updated the contributing section in README.md. (#19)"
> ```

> [!TIP]
> If you’re committing for an urgent fix, you can indicate it with "(main)" before the #issueId, so reviewers know it’s meant for the main branch.

6. Push your changes:
   ```bash
   git push origin <branch-name>
   ```
7. Go to Github and create a **Pull Request (PR)**.
> [!NOTE]
> Except for hotfixes, submit all PRs to the develop branch.

Please follow our coding standards to ensure the project progresses smoothly.
