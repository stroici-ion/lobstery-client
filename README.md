# Lobstery Client

Lobstery Client is a React application designed to provide a rich user experience with various media-related functionalities. This application allows users to create and manage posts, edit media content, comment, tag, and more. It serves as the front-end counterpart to the Lobstery Server (Django-based API), offering seamless interaction with the back-end API.

## Features

### 1. **Post Management**

- **View Posts:** Users can view posts in a dynamic feed, with options to interact via comments or reactions.
- **Create Posts:** Allows users to create new posts with text and media attachments (images/videos).
- **Edit Posts:** Edit existing posts with a user-friendly interface to update the content.

### 2. **Image Editor**

- **Cropping:** Users can crop images to desired dimensions.
- **Adjustments:** Modify image attributes such as brightness, contrast, saturation, etc.
- **Filtering:** Apply various filters to images, including grayscale, sepia, etc.
- **Drawing:** Freeform drawing capabilities on images.
- **Borders:** Add and customize borders around images.
- **History Management:** Undo/redo functionality to make image editing flexible.

### 3. **MediaTools**

A set of tools focused on managing and editing media (images, videos) with the following functionalities:

- **Naming and Tagging:** Add meaningful names and tags to images and videos.
- **Commenting:** Users can comment on media files.
- **Video Editing:** Basic tools for trimming, cutting, and adjusting videos.

### 4. **Comments and Interactions**

- **Post Comments:** Users can add, edit, or delete comments on posts.
- **Real-time Updates:** Comment threads update in real time without the need for page reloads.

### 5. **User Authentication**

- Integrated with [Lobstery Server](https://github.com/stroici-ion/lobstery-server.git) for user authentication using **JWT (JSON Web Tokens)**.
- **Login/Logout** functionality to manage user sessions.

### 6. **Chess Game**

A lightweight chess game integrated into the app that allows users to:

- Play chess with local multiplayer functionality.
- Save and load games.

### 7. **Navigation**

- Organized navigation structure using **react-router-dom** for dynamic routing.
- Multi-level routing for ease of use across the app's features.

### 8. **Responsive Design**

The entire app is built with responsive design principles, ensuring an optimal experience on both desktop and mobile devices.

## Technology Stack

### Front-end

- **React.js** with **TypeScript** for strongly-typed, component-based UI.
- **Redux Toolkit** for state management.
- **Axios** for handling HTTP requests.
- **Sass** for styling.

### Back-end

- This project is powered by the [Lobstery Server](https://github.com/stroici-ion/lobstery-server.git), a Django REST API.

### Dependencies

- **@reduxjs/toolkit**: For state management.
- **axios**: For API requests.
- **jwt-decode**: For decoding JWT tokens.
- **lodash**: For utility functions.
- **react-hook-form**: For form validation and management.
- **react-router-dom**: For navigation and routing.
- **sass**: For styling and CSS pre-processing.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/stroici-ion/lobstery-client.git
   cd lobstery-client
   ```
   q
