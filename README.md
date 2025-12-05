# WaChat

**WaChat** is a modern, secure, and real-time messaging application built with Next.js and Firebase. Inspired by the core functionalities of WhatsApp, this project showcases a privacy-first approach with end-to-end encryption, multi-device linking, and an AI-powered assistant.

![WaChat Screenshot](https://image2url.com/images/1760142261420-af7d0397-6b65-4c2b-b873-ed74cbecf265.jpg)

## ✨ Features

- **🔒 End-to-End Encryption**: Private conversations by default. Only the sender and recipient can read the messages.
- **⚡ Real-time Messaging**: Instant message delivery and status updates powered by Firestore's real-time database.
- **📱 Multi-Device Linking (WaChat Web)**: Use WaChat on up to 4 linked devices and 1 phone simultaneously, with chats synced in real-time.
- **🤖 AI-Powered Assistant**: An integrated AI bot (`WaChat AI`) that can answer questions and perform tasks with web search capabilities.
- **🎨 Custom AI Creation**: Users can define and create their own personalized AI bots with specific instructions and knowledge.
- **👤 User Presence**: See when a user is "online" or their "last seen" status.
- **✔️ Read Receipts**: Know when your messages are delivered and read with single and double checkmarks.
- ** gestures**:
  - **Swipe-to-Reply**: Intuitively reply to messages on mobile with a simple swipe.
  - **Long-Press Menu**: Access message options like reactions and copy with a long press on touch devices.
- **📞 Audio & Video Calls**: A fully implemented UI for initiating and receiving audio and video calls, built with WebRTC in mind.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Database & Auth**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit)
- **Deployment**: Firebase App Hosting

## 🚀 Getting Started

This project is set up to run in Firebase Studio, a web-based development environment.

### Prerequisites

- A Firebase account.
- Basic knowledge of React, Next.js, and Firebase.

### Running the Application

1.  **Start the development server**:
    ```bash
    npm run dev
    ```
    This will start the Next.js application on `http://localhost:9002`.

2.  **Start the Genkit development server**:
    ```bash
    npm run genkit:dev
    ```
    This runs the AI flows and makes them available to the application.

## 📁 Project Structure

```
.
├── src
│   ├── app/          # Next.js App Router (Pages & Layouts)
│   ├── ai/           # Genkit AI flows and configuration
│   ├── components/   # Shared React components (UI, Layouts)
│   ├── firebase/     # Firebase configuration, hooks, and services
│   ├── hooks/        # Custom React hooks
│   └── lib/          # Utility functions and data types
├── public/           # Static assets (images, icons, manifest)
├── docs/             # Backend definitions and documentation
└── firestore.rules   # Firestore security rules
```

##  pushing to GitHub

To push your code to your GitHub repository, you can use the following commands in your terminal:

```bash
git remote add origin https://github.com/Ugoyoungking/wachat.git
git branch -M main
git push -u origin main
```
