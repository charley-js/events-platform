# Schedulo

Find the hosted version [here](https://schedulo-five.vercel.app).

## Contents

- [Summary](#summary)
- [Features](#features)
- [Languages And Frameworks](#languages-and-frameworks)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Cloning The Repo](#1-clone-the-repo)
  - [Installing Dependencies](#2-install-dependencies)
  - [Setup MongoDB](#3-set-up-mongodb)
  - [Setup Google Cloud Console](#4-set-up-google-cloud-console)
  - [Build Next Application](#5-build-next-application)
  - [Seed Databases](#6-seed-the-databases)
  - [Start The Application](#7-start-the-application)
  - [Using The Application](#8-using-the-application)

## Summary

This is a full-stack application and my first time using Next.js,MongoDB And bcrypt amongst other technologies.

The project is an Events platform which contains a front-end and back-end under one roof, with external queries to a MongoDB Atlas Database. Next.js built in SSR allows the serving of data directly to the front-end.

The platform includes various functionalities for users such as Google Sign Up and Authorization, Personal Dashboard, Event Sign Up Integrated With Google Calendar, Clear View Of Event Information Including Date, Time and Number of Attendees etc. and much more.

There are different functionality for staff accounts, gaining the ability to Create, Edit and Delete events by interacting with the platform in real time.

I have hosted the Database on [MongoDB](https://mongodb.com/) and the Application on [Vercel](https://vercel.com/).

## Features

- Intuitive Sign Up and Log In Screen with custom alerts, error messages and even a Password Strength Checker
- Sign up using Google and Authorize with Google upon Login.
- See account details and your events on the dashboard
- See a view of all events and the event's details, including how many people are attending.
- Sign up to an event with Google Calendar integration, adding it both to the platform and your Google Account.
- Have the browser remember your account for 7 days or simply log out in the top right.
- Staff members have access to the Create and Edit Event Form.
- Staff can delete an event.

## Languages and Frameworks

- JavaScript
- MongoDB
- Next.js
- React
- node.js
- Chakra UI
- yup
- zxcvbn
- bcryptjs
- js-cookie
- googleapis
- dotenv

## Test Account Details

```
Schedulo Log In
Username: staff
Password: Schedulo123!

Username: user
Password: Schedulo123!

Google Calendar and Authentication Log In
Email: schedulostaff@gmail.com
Password: Schedulo123!

Email: schedulouser@gmail.com
Password: Schedulo123!
```

## Getting Started

A link to the hosted version can be found above and you can simply log in with the provided account details, however if you would like to run the project locally please follow the following steps;

### Prerequisites

- Node.js: v20.x or higher

### 1. Clone the repo

```
git clone https://github.com/charley-js/events-platform.git
cd events-platform
```

### 2. Install dependencies

```
npm install
```

> Please check the package.json to ensure all dependencies have been installed

> Skip to step 5 if .env details have been provided to you.

### 3. Set-up MongoDB

1. You can set up a MongoDB account [here](https://www.mongodb.com/cloud/atlas/register/)
2. Create a MongoDB account
3. Create your first cluster
4. Click "Connect" -> "Drivers" and follow the on screen confugrations
5. At the bottom, copy your "Connection String".
6. Create a .env at the root of your project and enter URI="[Replace with your Connection String"]

```
.env
URI="connection_string_here"
```

### 4. Set Up Google Cloud Console

1. Go to Google Cloud Console and Sign In
2. Create a new Project
3. Go to API->Library
4. Enable Google Calendar API
5. Go to Credentials On The Left
6. "Create Credentials" -> OAuth Client ID
7. Under authorized JavaScript Origins enter http://localhost:3000
8. Under authorized redirect URI enter http://localhost:3000
9. Click Create
10. Copy and Paste Client ID and Client Secre into .env like so

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000
```

### 5. Build Next Application

```
npm run build
```

### 6. Seed the Database

```
cd database
node seed
```

### 7. Start the Application

```
npm run dev
```

### 8. Using The Application

The application will open on http://localhost:3000. If you are not already logged in, it will redirect you to login. Otherwise, it will redirect you to your dashboard.

1. Log in with the provided user account and authenticate with the provided Google Account.

2. Upon login you will be met with the dashboard, currently Your Events will be empty.

3. Navigate to the "Events" Page in the middle at the top of the NavBar.

4. Here, you can see a grid of Events and their respective information. You can click Sign Up and have it added to your Google Calendar.

5. Navigate back to the Dashboard by clicking your Avatar in the Dashboard, and notice the Event added to Your Events.

6. Navigate to the Google Calendar of the provided Gmail account and notice the Event added to your Calendar.

7. Login to the provided Staff account and navigate to the Events Page.

8. You now have view of "Create Event", "Edit Event" and "Delete Event". Try it out.

9. When you are finished, Log out in the top right.
