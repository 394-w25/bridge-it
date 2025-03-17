<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/394-w25/bridge-it/">
    <img src="assets/images/temp_logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Bridge It</h3>
<br />
  <p align="center">
    A mobile application designed to help users bridge the gap between their academic knowledge and professional career by providing journaling, interview preparation, and AI-powered assistance.
<!--     <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="http://www.responsinator.com/?url=https%3A%2F%2Ffloppi-c55d5.web.app%2F">View Demo</a>
    &middot;
    <a href="https://github.com/394-w25/bridge-it/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/394-w25/bridge-it/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#1-about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#2-file-structure-and-logic">File Structure and Logic</a>
    </li>
    <li>
      <a href="#3-getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#google-gemini-api-set-up">Google Gemini API Set Up</a></li>
        <li><a href="#firebase-set-up">Firebase Set Up</a></li>
      </ul>
    </li>
    <li><a href="#4-syncing-your-work">Syncing Your Work</a></li>
    <li>
        <a href="#5-usage">Usage</a>
        <ul>
        <li><a href="#dashboard-overview">Dashboard Overview</a></li>
        <li><a href="#journal">Journal</a></li>
        <li><a href="#interview-preparation">Interview Preparation</a></li>
        <li><a href="#bridget-ai-assistant">Bridget AI Assistant</a></li>
      </ul>
    </li>
    <li><a href="#6-roadmap">Roadmap</a></li>
    <li><a href="#7-known-issues">Known Issues</a></li>
    <li><a href="#8-contributing">Contributing</a></li>
    <li><a href="#9-top-contributors">Top Contributors</a></li>
    <li><a href="#10-license">License</a></li>
    <li><a href="#11-contact">Contact</a></li>
    <li><a href="#12-acknowledgments">Acknowledgments</a></li>
  </ol>
</details>
<br />

<!-- ABOUT THE PROJECT -->
## 1. About The Project
<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
<div style="display: flex; flex-wrap: nowrap; justify-content: center; align-items: center;">
  <img src="assets/images/Mock Up 1.png" alt="Login" height="380" style="margin: 0 10px;">
  <img src="assets/images/Mock Up 2.png" alt="Dashboard" height="380" style="margin: 0 10px;">
  <img src="assets/images/Mock Up 3.png" alt="Journal Entry" height="380" style="margin: 0 10px;">
  <img src="assets/images/Mock Up 4.png" alt="Interview Prep" height="380" style="margin: 0 10px;">
  <img src="assets/images/Mock Up 5.png" alt="Bridget AI" height="380" style="margin: 0 10px;">
</div>

<br />
Bridge It is a comprehensive career development tool designed to help students and professionals transition smoothly from academic to professional environments. The application offers several key features:

- **Personal Journal**: Document your career journey, insights, and growth
- **Interview Preparation**: Practice and prepare for job interviews with guided exercises
- **AI Assistant (Bridget)**: Get personalized career advice and feedback
- **Progress Tracking**: Monitor your development and set career goals
- **Resource Library**: Access curated resources for professional development

<!-- Here's a blank template to get started. To avoid retyping too much info, do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`, `project_license` -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React Native][React Native]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Expo][Expo]][Expo-url]
* [![Firebase][Firebase]][Firebase-url]
* [![Gemini][Gemini]][Gemini-url]
* [![Figma][Figma]][Figma-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 2. File Structure and Logic

This project uses a component-based structure with a focus on clear separation of concerns. Key files and folders:

```plaintext
.
├── app                            # Main application directory (Expo Router)
│   ├── index.tsx                  # Home/Dashboard screen
│   ├── interview.tsx              # Interview preparation screen
│   ├── screens                    # Additional screens directory
│   │   ├── EntryDetail.tsx        # Detailed view of a journal entry
│   │   ├── allEntry.tsx           # List view of all journal entries
│   │   ├── chatBot.tsx            # Conversational interface with Bridget AI
│   │   ├── textEntry.tsx          # Text-based journal entry modal
│   │   └── voiceEntry.tsx         # Voice-based journal entry modal 
│   └── signin                     # Authentication screens
├── assets                         # Static assets (images, fonts)
├── backend                        # Backend services and API
│   ├── dbFunctions.ts             # Firebase database operations
│   ├── firebaseInit.ts            # Firebase initialization
│   ├── gemini.ts                  # Google Gemini AI integration
│   └── utils.ts                   # Utility functions for backend
├── components                     # Reusable UI components
├── context                        # React Context providers
│   └── UserContext.tsx            # User authentication and profile context
└── types                          # TypeScript type definitions
    └── journal.ts                 # Types for journal entries
```

The main components and utilities are organized under `app/`, `components/`, and `backend/`.


<!-- GETTING STARTED -->
## 3. Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/394-w25/bridge-it.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Create a Firebase project and set up Authentication and Firestore. More information below.

4. Copy `.env.example` file and rename it to `.env` file in the root directory. 

5. Enter your Firebase and Gemini API credentials:

   ```.env
    EXPO_PUBLIC_FIREBASE_API_KEY=
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
    EXPO_PUBLIC_FIREBASE_APP_ID=
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=

    EXPO_PUBLIC_GEMINI_API_KEY=
   ```

6. Change git remote url to avoid accidental pushes to base project

   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

### Google Gemini API Set Up

1. Visit [Google's AI Studio][GoogleAPI-url] and create an account
2. Generate an API key for the Gemini API
3. Add this key to your `.env` file as `EXPO_PUBLIC_GEMINI_API_KEY`

### Firebase Set Up

1. Create a Firebase account at <https://firebase.google.com/>
2. Create a new project in the Firebase console
3. Enable Authentication with Email/Password sign-in method
4. Create a Firestore database with the following collections:
    - `users`: To store user profile information
    - `journals`: To store user journal entries
    - `interviews`: To store interview preparation data

### Firebase Configuration

1. In the Firebase console, go to Project Settings > General
2. Scroll down to "Your apps" section and click the web app icon (</>) to register a web app
3. Copy the configuration object provided
4. Use these values in your .env file as described in the Installation section

### Database Schema

#### Users Collection

- `displayName`: User's display name
- `email`: User's email address
- `blurb`: AI-generated summary of the user's skills and experiences

#### Journal Entries Collection

- `title`: Entry title
- `content`: Main content of the journal entry
- `summary`: Bullet-point summary of the entry
- `hardSkills`: Technical skills demonstrated in the entry
- `softSkills`: Soft skills demonstrated in the entry
- `reflection`: Reflection for interview preparation
- `categories`: Classification of the entry (Academic, Personal, Leadership, Research, Project)
- `shortSummary`: Concise one-line summary of the entry
- `timestamp`: Date and time when the entry was created

#### Jobs Collection

- `companyInfo`: Key facts about the company
- `interviewQ`: AI-generated interview questions based on the job posting
- `jobPosting`: URL or content of the job posting
- `keyStrength`: User strengths that align with the job requirements
- `positionName`: Title of the job position

## 4. Syncing Your Work

### Step 1: Create a New Feature Branch

- **Why**: Avoid developing directly on `main`. Keeping `main` in sync with `origin/main` makes it easier to update and manage changes.
- **How**: Create and switch to a new branch for your feature, and remember to push it to `origin`:

  ```bash
  git switch -c feat/new-feature-name
  git push -u origin feat/new-feature-name
  ```

### Step 2: Update Your Local `main` with `origin/main`

1. **Switch Back to `main`**: Ensure you're on `main` before updating:

   ```bash
   git switch main
   ```

2. **Stash Your Work**(if needed): If you have uncommitted changes, stash them to avoid conflicts while pulling:

   ```bash
   git stash
   ```

3. **Pull Latest Changes**: Bring in the latest updates from `origin/main`:

   ```bash
   git pull origin main
   ```

### Step 3: Rebase Your Feature Branch onto the Updated `main`

1. **Switch Back to Your Feature Branch**:

   ```bash
   git switch feat/new-feature-name
   ```

2. **Rebase**: Apply your feature branch changes on top of the latest `main`:

   ```bash
   git rebase main
   ```

3. **Apply Stash**(if you stashed changes): Reapply your saved changes once main is updated:

   ```bash
   git stash pop
   ```

4. **Resolve Conflicts** (if any): If conflicts occur, Git will prompt you to resolve them. After resolving, use:

   ```bash
   git add <conflicted-files>
   git rebase --continue
   ```

5. **Push Changes**:

   - **If you have NOT previously pushed code to the remote**:

     ```bash
     git push
     ```

   - **If you HAVE previously pushed code** (with conflicting changes), you may need to force-push to align with the rebased history. **(Do NOT use this on `main`)**

     ```bash
     git push --force-with-lease
     ```

By following these steps, you ensure that `main` remains in sync with `origin/main`, while your feature branch incorporates the latest updates without directly modifying `main`. This keeps your work organized and minimizes conflict risks.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## 5. Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

Bridge It offers several key features to help users develop their professional skills:

### Dashboard Overview

The Dashboard is the central hub of Bridge It, providing a comprehensive overview of your professional journey and development. To access the Dashboard, simply open the app and log in. The Dashboard is the default landing page, providing immediate access to your professional development journey.

Here's how to make the most of its features:

<img src="assets/images/Mock Up 2.png" alt="Dashboard" height="380">
<img src="assets/images/Mock Up 7.png" alt="Blurb and Events" height="380">

#### Personal Blurb

The Dashboard displays your AI-generated professional blurb, which summarizes your skills, experiences, and career aspirations based on your journal entries.

- View Your Blurb: Your personalized professional summary appears at the top of the Dashboard
- Update Your Blurb: The blurb automatically updates as you add more journal entries
- Use for Networking: Copy your blurb for LinkedIn profiles, personal websites, or networking events

#### Skills Visualization

Track your professional development through intuitive skills visualization:

- Skills Overview: See a breakdown of your hard and soft skills extracted from journal entries
- Skills Growth: Monitor how your skills develop over time with progress indicators
- Skill Categories: View skills organized by categories (Technical, Communication, Leadership, etc.)
- Skill Recommendations: Receive suggestions for skills to develop based on your career interests

#### Upcoming Events

Stay informed about career development opportunities:

- Event Calendar: View upcoming career fairs, workshops, and networking events
- Event Link: Quick access to an external event link
- Card Dismissal: Dismiss the event card if you're not interested 

### Journal

Record your daily professional experiences, challenges, and insights. The journal feature helps you track your growth and identify patterns in your career development.

<img src="assets/images/Mock Up 3.png" alt="Journal Entry" height="380">
<img src="assets/images/Mock Up 6.png" alt="All Entries" height="380">


1. Navigate to the Journal tab
2. Tap the "+" button to create a new entry
3. Write about your experience
4. The AI will automatically analyze your entry to extract skills and provide a summary
5. View all of your saved and analyzed entries in the All Entries tab

### Interview Preparation

Practice common interview questions, receive feedback on your responses, and improve your interview skills with guided exercises tailored to your industry.

<img src="assets/images/Mock Up 4.png" alt="Interview Prep Screen" height="380">

1. Navigate to the Interview Prep tab
2. Enter a job posting URL and position name
3. The app will analyze the job posting and your journal entries
4. Review company information, your key strengths, and practice interview questions

### Bridget AI Assistant

Get personalized career advice, resume feedback, and professional development suggestions from our AI assistant, Bridget.

<img src="assets/images/Mock Up 5.png" alt="Bridget AI Screen" height="380">

1. Navigate to the Bridget tab
2. Start a conversation with the AI
3. Ask questions about career development, interview tips, or job search strategies

_For more examples, please refer to the [demo](http://www.responsinator.com/?url=https%3A%2F%2Ffloppi-c55d5.web.app%2F)_

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ROADMAP -->
## 6. Roadmap

- [x] User authentication and profile management
- [x] Personal journal with AI-powered analysis
- [x] Skills extraction and categorization from journal entries
- [x] AI-generated professional blurb based on journal content
- [x] Interview preparation with job posting analysis
- [x] Conversational AI assistant (Bridget) for career guidance
- [x] Dashboard with skills visualization
- [ ] Display category circles in All Entries shelf
- [ ] Implement speech-to-text functionality
- [ ] Implement file upload functionality
- [ ] Implement camera upload functionality
- [ ] Make the radar chart take in dynamic data from Gemini
- [ ] Gamification system upgrade
    - [ ] Streak counter for consistent journaling
    - [ ] Points system for completing prep through Bridget AI

See the [open issues](https://github.com/394-w25/bridge-it/issues) for a full list of proposed features (and known issues).

## 7. Known Issues

- The Gemini API occasionally experiences slow response times during peak usage periods, which can delay the analysis of journal entries and interview preparation.
- The Gemini API occasionally exhausts all resources on the free dev plan. We've been working around this by changing the model.

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- CONTRIBUTING -->
## 8. Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 9. Top contributors

<a href="https://github.com/394-w25/bridge-it/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=394-w25/bridge-it" />
</a>

<br />

<!-- LICENSE -->
## 10. License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- CONTACT -->
## 11. Contact

<!-- Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - <email@email_client.com> -->

Project Link: [https://github.com/394-w25/bridge-it](https://github.com/394-w25/bridge-it)

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ACKNOWLEDGMENTS -->
## 12. Acknowledgments

- This project was created by Team Orange in Northwestern University's CS394 course, taught by Prof. C. Riesbeck
- Thanks to our product managers in the Northwestern University MPD^2 course for their guidance

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/394-w25/bridge-it.svg?style=for-the-badge
[contributors-url]: https://github.com/394-w25/bridge-it/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/394-w25/bridge-it.svg?style=for-the-badge
[forks-url]: https://github.com/394-w25/bridge-it/network/members
[stars-shield]: https://img.shields.io/github/stars/394-w25/bridge-it.svg?style=for-the-badge
[stars-url]: https://github.com/394-w25/bridge-it/stargazers
[issues-shield]: https://img.shields.io/github/issues/394-w25/bridge-it.svg?style=for-the-badge
[issues-url]: https://github.com/394-w25/bridge-it/issues
[license-shield]: https://img.shields.io/github/license/394-w25/bridge-it.svg?style=for-the-badge
[license-url]: https://github.com/394-w25/bridge-it/blob/master/LICENSE.txt

[React Native]: https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactnative.dev/
[Firebase]: https://img.shields.io/badge/firebase-a08021?style=for-the-badge&logo=firebase&logoColor=ffcd34
[Firebase-url]: http://firebase.google.com/
[Gemini]: https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white
[Gemini-url]: https://ai.google.dev/
[Figma]: https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white
[Figma-url]: http://figma.com/
[Expo]: https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37
[Expo-url]: https://expo.dev/
[TypeScript]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/

[GoogleAPI-url]: https://aistudio.google.com/prompts/new_chat