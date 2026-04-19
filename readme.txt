# Field Report Generator

An AI-powered web app that transforms rough construction site notes into structured, professional daily reports — instantly.

Built as a portfolio project to explore how AI can simplify field documentation in the construction industry.

---

## What it does

People working on construction sites hate writing reports. They're busy, tired, and the last thing they want to do is format a professional document at the end of the day.

This app lets them:

1. Dump rough notes into a text field ("laid foundation on block C, near-miss with forklift at 10am, two workers missing PPE")
2. Click **Generate Report**
3. Get a clean, structured daily report divided into: **Progress**, **Issues**, **HSE**, and **Comments**

They can also click **"Make more professional"** to refine the tone with a second AI pass.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS v4 |
| Backend | Node.js + Express |
| AI | GitHub Models API (gpt-4o-mini) |

The architecture is intentionally model-agnostic — swapping the AI provider requires changing only the backend API call. In a production context this would use Claude, which is what Ditio uses internally.

---

## How to Run Locally

### Prerequisites
- Node.js v18+
- A free GitHub account (for the API token)

### 1. Get a GitHub Models API Token

- Go to [github.com/marketplace/models](https://github.com/marketplace/models)
- Sign in and click **"Use this model"** on any model
- Generate a Personal Access Token and copy it

### 2. Clone the repo

```bash
git clone https://github.com/ViktorDY/field-report-generator.git
cd field-report-generator
```

### 3. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` folder:

```
GITHUB_TOKEN=your_token_here
PORT=3001
```

Start the server:

```bash
node index.js
```

### 4. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

### 5. Open the app

Go to **http://localhost:5173** in your browser.

---

## Features

- **Report generation** — converts messy notes into a structured report with Progress, Issues, HSE, and Comments sections
- **HSE warning** — automatically flags if no safety information was provided
- **"Make more professional"** — second AI pass to refine tone and language
- **Clean UI** — minimal, distraction-free interface built for field use

---

## AI Workflow

Prompt engineering was a core part of this project. The system prompt instructs the model to:
- Always produce the same four sections regardless of input
- Flag missing HSE information rather than silently skipping it
- Never invent information that wasn't in the original notes

This reflects a real constraint in construction reporting — accuracy matters more than completeness.

---

## Possible Improvements

These are features that would make sense in a real production version of this tool:

- **Image upload** — attach photos from the site (damaged materials, progress shots, safety incidents) and have the AI incorporate observations from the images directly into the report. Claude and GPT-4o both support vision input, so the backend change would be minimal
- **PDF export** — generate a downloadable, print-ready PDF of the report for record keeping or client handover
- **Report history** — save past reports locally or in a database so workers can look back at previous days
- **Language support** — generate reports in Norwegian by default, with a toggle for English, since most Norwegian contractors operate in both
- **Missing info prompts** — after generating, the AI could ask targeted follow-up questions like "You didn't mention HSE — was there anything to report?" before finalizing
- **Voice input** — let workers dictate notes instead of typing, which is more practical when on site with gloves on

---

## Author

**Viktor Yordanov**
[linkedin.com/in/viktor-yordanov](https://linkedin.com/in/viktor-yordanov) · viktor.yordanov6803@gmail.com
