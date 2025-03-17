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
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project
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

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

* npm

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

4. Create a `.env` file in the root directory with your Firebase and Gemini API credentials:

   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

5. Change git remote url to avoid accidental pushes to base project

   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

## Firebase Setup

1. Create a Firebase account at <https://firebase.google.com/>
2. Create a new project in the Firebase console
3. Enable Authentication with Email/Password sign-in method
4. Create a Firestore database in test mode

### Firebase Configuration

1. In the Firebase console, go to Project Settings > General
2. Scroll down to "Your apps" section and click the web app icon (</>) to register a web app
3. Copy the configuration object provided
4. Use these values in your .env file as described in the Installation section

### Initial Database Setup

1. In the Firestore Database section of the Firebase console, create the following collections:

    * `users`: To store user profile information
    * `journals`: To store user journal entries
    * `interviews`: To store interview preparation data
    * `resources`: To store career resources

2. You can import initial data using the Firebase Admin SDK or manually create some sample documents for testing.

## Google Gemini API Setup

1. Visit [Google's AI Studio][GoogleAPI-url] and create an account
2. Generate an API key for the Gemini API
3. Add this key to your `.env` file as `GEMINI_API_KEY`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

* [ ] Feature 1
* [ ] Feature 2
* [ ] Feature 3
  * [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors

<a href="https://github.com/github_username/repo_name/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=github_username/repo_name" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - <email@email_client.com>

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/394-w25/bridge-it/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/394-w25/bridge-it/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/394-w25/bridge-it/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/394-w25/bridge-it/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
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