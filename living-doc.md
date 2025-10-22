# **Ambira \- Living Doc**

# **Team Information**

## **Team Members and Roles**

**Hugh Gramelspacher**: Web Full-Stack Dev  
**Nobel Tsegai**: Mobile Full-Stack Dev  
**Donovan Hsiao**: Web Full-Stack Dev  
**Timothy Hoang**: Web Full-Stack Dev / UX Design  
**Ryan O’Connor**: Mobile Full-Stack Dev / UX Design  
**Steven Luong**: Mobile Full-Stack Dev

## **Project Artifacts**

**GitHub Web App Repository:** [https://github.com/hughgramel/ambira-web](https://github.com/hughgramel/ambira-web)  
**GitHub Mobile App Repository:** [https://github.com/hughgramel/ambira-web](https://github.com/hughgramel/ambira-web)  
**Google Drive Folder:** [https://drive.google.com/drive/folders/1f-IlCzBm0HVhMWlyDKzJA0sCuqFQ\_tG5?usp=drive\_link](https://drive.google.com/drive/folders/1f-IlCzBm0HVhMWlyDKzJA0sCuqFQ_tG5?usp=drive_link) 

## **Communication Channels**

- Discord  
- iMessage

## **Communication Rules:**

- Have decency, just be good people  
- Respond in a timely manner; if busy give an update of your current situation within 24 hours  
- At minimum, show up to class sections for biweekly meetings

## 

# **Product Description**

Ambira is a social media application on which users can track and share their productivity with others. You can follow your friends and your inspirations, and build an online community that is there to motivate and encourage accountability. Users can select from a wide array of productivity activities, from reading to studying to cooking, and monitor how long they spend with each activity. After completing an activity, users can add a caption, attach photos, and post their activity\! However, the user’s involvement in the communal aspect of Ambira is completely customizable with privacy flairs for each post. Users can choose to share their activities with everyone, just their followers, or keep them private for only them to see. Ambira redefines social media by inspiring focus, accountability, and motivation, helping users celebrate progress, not just presence.

## **Major Features (MVP)**

### **Record Page (Create-a-Post)**

1. Users can pick from pre-made “activities” and record their duration, after which will be posted to their feed based on a “privacy level” which determines whether a post is visible to followers.

### **Home Feed Page**

2. Allows users to post, view, and interact (liking, commenting) with their own and other users’ activities which transforms the application from a personal tracker to a social networking app. MVP feed is just chronological.

### **Profile Page**

3. Users will have a profile with a profile picture, name, followers/following count, activities completed, and data visualization of their activities logged.  
4. Users' personal profile pages will have an edit profile option, in which they can customize login information, display name, profile picture, and delete their account.  
5. Track consecutive days having completed an activity.

### **Signup/Login Page**

6. Users not logged in or without an account will be able to sign up through a dedicated registration page, in which they can input info such as name, email, password to create an account. Alternatively they can register using Google SSO/Apple SSO.

## **Stretch Goals**

### **Groups Page**

- Users can create, join, and view groups (intended to be largely user/community-defined, both in use case and scope).  
- Its own privacy flag.  
- Leaderboards and cumulative data visualization for group challenges and their own activities.  
- Group feed (a feed including all of the posts that have the assigned privacy flag).  
- Group challenges (created by the group leader for only the group members).  
- A members page to view all members of a group.

### **Profile Page**

- Give users options to customize which tasks add to their streak.  
- Streak freezes ($?).

### **Home Page**

- Algorithmic feed based on relevance & interests (what would frequently post/what your following frequently posts).  
- Users can set their own goals (essentially self-imposed challenges) and view their progress from the home page.

### **Settings Page**

- Light/Dark modes.  
- Account privacy setting (Private, Everyone, Group (to any particular group(s)), Followers).

### **Challenges Page**

- Page for users to join challenges (predefined by the app; think achievements).  
- Users get badges on their profiles for completing them.

### **iOS App**

- Fully functional native app for iOS (functionally equivalent to the web app MVP).

## 

# **Use Cases (Functional Requirements)**

## **Viewing Another User’s Profile \- Ryan O’Connor**

**Actors:** All users  
**Triggers:** (1) User selects another users profile from a viewed post or (2) user selects another user’s profile from search  
**Preconditions:** The selected account had to have been created properly  
**Postconditions:** The user’s profile is able to be viewed  
**List of Steps:** 

1. A user (u1) creates an account on Ambira  
2. Another user (u2) (regardless of whether or not they have an account) searches for u1’s account or views a post they made.  
3. u2 clicks on u1’s profile picture (in either scenario)

**Extensions/Variations:**

1. If the users have some form of relationship (follows you/following) that should be indicated when viewing their profile.  
2. Users should also be able to view other user’s profiles via comments and interactions (i.e. you see they liked a post or left a comment on a post)

**Exceptions/Failure Scenarios:**

1. A network or server-side error occurring should display “Unable to load profile. Please try again.”

## **Activity Logging \- Timothy Hoang:**

**Actors:** App users  
**Triggers:** User clicks the “log activity” button  
**Preconditions:** 

1. The user must have created an account on Ambira  
2. The user must be logged into their account on Ambira  
3. The user completed an activity in their life that they consider productive and wish to log

**Postconditions (Success Scenario):** User successfully logs an activity onto their account in which the activity session and all of its fields is saved into their profile, visible to the user and whomever they select.  
**List of Steps (Success Scenario):** 

1. User signs up for an Ambira account  
2. User presses the “log activity” button  
3. User fills out activity information fields (type of activity, duration, photos, privacy setting)  
4. User confirms the activity to be logged onto their account  
5. Activity is saved onto the account, visible to the user

**Extensions / Variations:** 

1. User may choose the privacy level of the activity (private, group, followers only, public) which changes who will see the logged activity  
2. User may be editing a previously logged activity session which will update the activity instead of creating a new one

**Exceptions (Failure Conditions):** 

1. User not connected to internet \- in which activity logging will show an error toast asking the user to connect to the internet  
2. Server error \- if the ambira backend fails, an error toast will be displayed stating to the user an error occurred and for them to retry  
3. Missing fields \- if the user does not fill out the required fields (activity, duration, and privacy level) the app will highlight these fields in red and prompt the user to fill them out

### 

### 

## **Posting \- Hugh Gramelspacher**

**Actors:** Logged-in user (author), followers, mentioned users, backend services (feed, notifications, moderation)  
**Trigger:** User completes/saves a session and chooses to share it  
**Preconditions:**

1. The user is logged in (has an Ambira account).  
2. The user has an active or just-completed session saved locally (duration, activity type at minimum).  
3. Network available or the app has an offline queue mechanism enabled.

**Postconditions (Success Scenario):**

1. A post (session share) is created and persisted to the backend with all selected fields (description, media, visibility, tags/mentions).  
2. The post appears in the author’s own profile and, if visibility allows, in followers’ home feeds.  
3. Followers can react via Support and/or leave comments (subject to privacy and author settings).  
4. If visibility \= Only You / Private, user is navigated to My Activities list with a “Saved privately” toast.  
5. Otherwise, user is navigated to the top of Home Feed with an “Shared successfully” toast.

**List of Steps (Success Scenario):**

1. User completes a session and taps Share (from the session summary screen).  
2. System opens the Share Post composer prefilled with session metadata (activity type, duration, timestamp, optional route/media if supported).  
3. User optionally:  
   1. Adds a free-text description (supports basic formatting/emoji).  
   2. Adds up to N photos/screenshots (optional).  
   3. Mentions teammates/friends (e.g., @username) and adds tags (e.g., \#deepwork).  
   4. Selects Visibility: Only You, Group, Followers Only, Public.  
4. Toggles Allow Comments and Allow Support (default: on).  
5. User taps Post.  
6. System validates  
7. System creates the post record  
8. System returns success:  
9. Followers opening their Home Feed see the new post (ranked by recency/relevance).

**Extensions / Variations:**

1. Edit Post: Author opens post → Edit → changes description, media, or toggles comments → Save.  
2. Delete Post: Author opens post → Delete → confirm → post removed from author profile and feeds (soft delete for N days; comments/support hidden).  
3. Change Visibility After Posting: Author updates visibility (e.g., Followers → Only You); system re-indexes/removes feed items accordingly.  
4. Group Visibility: Post appears in the specified group feed and is hidden from general followers unless they’re in that group.

**Exceptions (Failure Conditions):**  
No Internet:

- If offline queue enabled: show “Queued to share when online” toast and retain local post state; post auto-publishes on reconnect.  
- If not: show error toast “Connect to the internet to share” and keep composer open.

Server Error (5xx / timeouts):

- Show “Couldn’t share right now. Try again.” with a retry option.

Validation Errors:

- Missing required fields → highlight field(s) and block posting.

## **Viewing and Editing Profile \- Nobel Tsegai**

**Actors:** *App user (logged-in user)*  
**Triggers:** The user taps their profile icon or navigates to their profile page and chooses to edit information.  
**Preconditions:**  
The user must be logged in(implying they already have an account), and the user has existing profile data(A minimum of the essential things to have an account\~ name, username, photo). This data must of course be visible to the user.   
**Postconditions (Success Scenario):**  
The user’s updated profile information is saved successfully, and all changes are immediately reflected on the user’s profile and some info(public visibility) is visible to followers.   
**List of Steps (Success Scenario):**

1. User logs into Ambira.  
2. User taps their profile icon in the navigation bar.  
3. The system displays the user’s profile page, showing their profile photo, display name, username, and stats (e.g., activities completed, streaks).  
4. User taps the “Edit Profile” button.  
5. The system displays editable fields (e.g., display name, username, bio, profile photo).  
6. User updates one or more fields and confirms the changes by pressing “Save.”  
7. The system validates inputs (e.g., unique username, correct photo format).  
8. The system saves updated data to the backend database.  
9. The updated profile is reloaded and displayed to the user.

**Extensions / Variations:**

- User cancels editing or completely exits the app, and edits aren’t saved  
- Profile edits sync across devices if logged in on multiple devices

**Exceptions (Failure Conditions):** 

- Invalid input: If a username is already taken or contains invalid characters, the system displays an error message and highlights the field.  
- Failed upload: If the profile photo fails to upload (e.g., poor internet), the app notifies the user and prompts retry.  
- Server error: If the backend fails to save updates, the app shows an error toast (“Unable to save changes, please try again later”).  
- No internet connection: The app prevents edits and displays a “Connect to the internet to save changes” message.

### 

## **Creating an Account \- Donovan Hsiao:**

**Actors:** New app user  
**Triggers:** App user has a desire to join Ambira, presses “Create Account”  
**Preconditions:** App user has an email that has not created an account with Ambira.   
**Postconditions (Success Scenario):** User has access to an account that can use Ambira’s features.   
**List of Steps (Success Scenario):** 

1. User clicks “Sign Up”  
2. User fills in First name, Last name, Username, Email, and password  
3. User presses “Create Account”  
4. User confirms email address  
5. User signs in with correct email address and password

**Extensions / Variations:** User could sign up with an email address or sign in with Google.  
**Exceptions (Failure Conditions):** 

- User enters invalid email address \- App alerts “Invalid Email Address”  
- User enters already existing email address \- App alerts “Invalid Email Address”  
- User enters already existing username \- App alerts “Username already taken”  
- User enters invalid password (missing uppercase, lowercase, etc.) \- App alerts “Invalid password”

## **Use Case 6: Join a Group \- Steven Luong:** 

**Actors:** App users  
**Trigger:** User taps “Groups” tab and then selects a group and taps join  
**Preconditions:** 

- User is logged in  
- Group exists and is joinable

**Postconditions(Success Scenario):** 

- For open groups: user becomes a member immediately and the group appears in the users groups list and the group feed is now visible to that user

**List of Steps (Success Scenario):** 

- User opens Ambira and navigates to Groups tab  
- User searches or browses groups  
- The system returns matching groups with summary cards  
- User can tap on one of those cards to view details  
- User taps join  
- User appears in the group feed, sees the group members and other stats

**Extensions / Variations:** 

- Could make a join via Link/QR code  
- Capacity limited groups  
- Invite only groups

**Exceptions (Failure Conditions):** 

- If internet disconnected: show a cached list if possible, disable the join button and put “Connect to join groups”  
- Server Error / Timeout: show error “Couldn’t process request, please try again”

## 

# **Non-Functional Requirements**

## **Feature Scalability**

The system must be designed so that new features can be added without requiring major changes to the existing codebase \+ database schema.

## **Usability/Accessibility**

Ambira should be simple to use on first launch, with clear navigation, large tappable elements, and readable text across mobile and web platforms. Color contrast and layout choices must remain accessible to users with visual impairments, and all interactive elements should be labeled for screen readers. Additionally, all elements should be consistent across web and mobile.

## **Security**

Ambira must use a third-party BaaS that automatically handles password encryption, secure session management, and SSO integration. All sensitive data (passwords, authentication tokens) is stored server-side, never on client devices.

## 

# **External Requirements**

## **Error Handling**

Expected errors and handling:

- Ambira will validate all communications and connections between server and client to handle bad requests  
- During account creation, Ambira will make sure that there are no accounts with the same email and/or username  
- All errors that occur will have feedback to help users understand the issue and developers debug  
- Attempting to view an account that doesn’t exist/has been deleted will show that the account does not exist  
- Attempting to view a post that since has been deleted will show that the post doesn’t exist

## **Deployment**

Our application (Ambira) will be publicly deployed with a web frontend accessible via browsers and a mobile app available on iOS/Android. This means being able to open Ambira without any errors or restrictive access issues. It will work and look the same on all browsers. 

## **Build**

Ambira should be buildable from source by others. Ambira should have a well documented system so that new developers are able to understand and make modifications and enhancements.

## **Scope**

The scope of Ambira’s MVP will be designed to match the work capacity of 6 student developers within the next 8 weeks of the quarter, focusing on delivering a functional and user-tested product. Development must maintain a realistic workload that accounts for each person’s academic \+ personal responsibilities.

## 

# **Team Process Description**

## **Development Process**

We will use an **Agile workflow** with weekly sprints, short planning meetings, and check-ins on Discord. Each sprint ends with a demo and code review on GitHub. The goal is to maintain constant progress and integrate features as soon as they are functional.

## **Tech Stack**

| Tool | Purpose |
| ----- | ----- |
| **React Native (Expo)** | Cross-platform mobile app for iOS/Android. |
| **Next.js (TypeScript)** | Web app frontend for browser users. |
| **Firebase** | Handles authentication, database, storage, and hosting. |
| **GitHub** | Version control and issue tracking. |
| **Figma** | UI/UX design. |
| **Discord/iMessage** | Team communication. |

We chose this stack for speed, cross-platform support, and easy integration between frontend and backend.

### **Roles**

| Member | Role | Focus/Why |
| ----- | ----- | ----- |
| **Hugh Gramelspacher** | Web Full-Stack Dev | Coordinates sprints, integrates web \+ mobile builds, driving project vision as Ambira’s original project creator |
| **Nobel Tsegai** | Flex Full-Stack Dev | Builds record/logging and feed screens, utilizing previous experience with NoSQL and Firebase  |
| **Donovan Hsiao** | Flex Full-Stack Dev | Implements Firebase auth and database structure. This is needed for Ambira’s backend operations like user authentication for sign-in and for all of Ambira’s data concerning users and posts |
| **Timothy Hoang** | Web UI/UX Dev | Designs and implements the feed and activity pages for Ambira’s web app, leveraging prior experience collaborating with design teams to create intuitive, user-centered interfaces |
| **Ryan O’Connor** | Mobile UI/UX Dev | Create profile and visualization components, leveraging previous experience with Figma |
| **Steven Luong** | Mobile Full-Stack Dev | Implements group features and testing, applying previous experience w/ React Native |

## **Weekly Schedule & Milestones**

### **Mobile Schedule**

**Week 4**: Create sign up/sign in page, home page, record page, and profile page  
**Week 5**: Users are able to sign up/sign in, post, view their own profile page, and see other people’s post on the home page  
**Week 6**: 1st edition MVP works (no error handling): Build core feed functionality, enable users to post activities, fetch data from Firebase, and display posts in a chronological feed  
**Week 7**: Users are able to interact (comment, like, etc.) with posts, and users can edit their profiles  
**Week 8**: Users are able to create/join groups, and users can visualize their statistics (days in a row, time worked during the week)  
**Week 9**: Final bug fixing, add passive loading states, final error testing  
**Week 10**: Deployment

### **Web Schedule**

**Week 4**: Create sign up/sign in page, home page, record page, and profile page  
**Week 5**: Users are able to sign up/sign in, post, view their own profile page, and see other people’s post on the home page  
**Week 6**: 1st edition MVP works (no error handling): Build core feed functionality, enable users to post activities, fetch data from Firebase, and display posts in a chronological feed  
**Week 7**: Users are able to interact (comment, like, etc.) with posts, and users can edit their profiles   
**Week 8**: Users are able to create/join groups, and users can visualize their statistics (days in a row, time worked during the week)  
**Week 9**: Final bug fixing, add passive loading states, final error testing  
**Week 10**: Deployment

### **Design Schedule**

**Week 4**: Have drawn UX flow  
**Week 5**: Have individual Figma mockups for both web and mobile (can be different  
**Week 6**: Have cohesive design style set (mockups are the same design language)  
**Week 7**: Join dev goals (Meet at least weekly to discuss design of new features as they get added to workflow)

## **Major Risks**

1. **Integration issues** between web and mobile, mitigated by having a shared Firebase schema.  
2. **Limited time** during exams, mitigated by early feature prioritization and time management.  
3. **Firebase limits or auth bugs**, mitigated by frequent testing and backups.  
4. **Mobile/Web Sync** Keeping mobile and web apps feature-synchronized while developing in parallel, mitigated by weekly integration testing and shared Firebase schema reviews.  
   

## **External Feedback**

We’ll gather feedback three times:

- **Week 3:** general feedback on design and planned schedule from TA.  
- **Week 6:** classmates and TA test core MVP features.  
- **Week 8:** user testing for polish and usability before deployment

## **Risk Assessment**

1. Web/Mobile Integration issues  
* Likelihood: Medium  
* Impact: High  
* Evidence: The team is split between mobile and web, and there are different codebases for the two ([Next.js](http://Next.js) and React Native)  
* Solution: Weekly integration testing where both components are tested against the same use cases using a shared Firebase schema, document both components together  
* Mitigation: Prioritize developing the lagging component, re-allocate developers  
* Changes: We have added weekly integration testing  
2. Firebase authentication/database failures  
* Likelihood: Medium  
* Impact: High  
* Evidence: We are using Firebase solely as our backend \+ database, so any API limitations will affect us heavily  
* Solution: Continuously test the login/authentication, integration tests, have user accounts for testing, use Firebase console logs  
* Mitigation: Be prepared to switch to Supabase, halt development to focus on fixing the issues, regularly back up our data  
* Changes: We will consider switching to Supabase and are ready to halt development if needed  
3. Time constraints with other coursework  
* Likelihood: High  
* Impact: Medium  
* Evidence: Everyone on the team is a student with other courses and priorities, project has an 8 week timeline  
* Solution: We have front-loaded the development of core MVP features to be completed before peak exam periods, flexible Agile workflow for adaptability  
* Mitigation: Prioritize MVP and postpone stretch goals  
* Changes: We decided that the Agile workflow will work best and discussed mitigation plans to meet MVP and not sacrifice individuals’ responsibilities  
4. Inconsistent UX across Mobile/Web  
* Likelihood: Medium  
* Impact: Medium  
* Evidence: The team is split between mobile and web, and there are different codebases for the two ([Next.js](http://Next.js) and React Native)  
* Solution: All design work done via Figma, weekly testing focusing on cross-platform usability, consistency, and experience  
* Mitigation: Increase collaboration between developers, outline standard UI components  
* Changes: Implementing Figma for increased consistency for the UI/UX  
5. Scope Creep with Stretch Goals  
* Likelihood: Low  
* Impact: High  
* Evidence: We extensively debated what should be MVP and what are stretch goals  
* Solution: Clearly outlined what MVP and what stretch goals are with deadlines for features  
* Mitigation: If developers begin to stray towards stretch goals before MVP is finished, Project Manager will lead them back on track  
* Changes: Added scope creep as a potential risk

**Project Schedule**

| Week | Milestone | Tasks | Effort | Dependencies |
| :---- | :---- | :---- | :---- | :---- |
| Week 4 | Core UI Created | Implement sign up/sign in, home, record, profile pages | 6 person-weeks | Design mockups completed |
| Week 5 | Basic Functionality | Enable profile viewing, posting, and feed interaction | 6 person-weeks | Firebase authentication setup |
| Week 6 | MVP Build | Real-time feed with Firebase data | 6 person-weeks | Core UI and backend completed |
| Week 7 | Interaction Layer | Enable likes, comments, and profile editing | 5 person-weeks | MVP deployed |
| Week 8 | Groups and Analytics | Build group join/create, statistics page | 6 person-weeks | Feed testing validated |
| Week 9 | Testing Sprint | Integrate passive loading states, bug fixing | 4 person-weeks | Core app functional |
| Week 10 | Final Deployment | Deploy on web and mobile, perform QA | 6 person-weeks | All systems stable |

**Test Plan & Bugs**  
Our testing process can be broken down into three categories: Usability Testing (Hallway Testing), Unit Testing, and CI with GitHub Actions. The following is our plan for each:

**Usability Testing (Hallway Testing):**  
This will be our main testing functionality as it allows for active user feedback from a UX perspective, in addition to identifying any obvious bugs after updates. The goal is to ensure that real users can intuitively navigate Ambira without prior instruction, in addition to all of our main functions working. 

This will be done both with the Ambira developers as well as other users outside of the development team. As of currently we already have over 20 users enrolled on our platform, with many having used our main functionality. We continue to actively use their feedback to identify bugs within this early version of our product.

**Unit Testing:**  
For the most important functions of our app, we will be writing unit tests using **Jest** (for TypeScript logic) and **React Testing Library** (for components). Though the scope of these tests will not span every single function of our codebase, its goal is to cover the most important functions that are the back-bone of our defined MVP features. Some examples include:  
**Example Unit test concepts for MVP features:**

* **Streak Calculation:** Verify that consecutive daily activity logs increase streaks correctly, and that streaks reset after missed days or handle daylight savings changes properly.  
* **Goal Progress:** Ensure progress percentages are computed correctly based on time logged vs. goal targets.  
* **Privacy Filtering:** Test that private activities are excluded from public feeds and friend-only posts appear correctly for followers.

**CI Testing with Github Actions:**

We will use GitHub Actions to automate our testing and deployment process. Every time code is pushed or a pull request is created, GitHub Actions will automatically run our linting, unit tests, and React component tests to ensure code quality.

**Documentation Plan**

* User Guide detailing app setup, posting, and profile features.  
* Developer Guide explaining Firebase schema, API calls, and environment setup.  
* Admin Guide (deployment doc) summarizing hosting, database rules, and scaling.  
* In-App Help Menus integrated into settings for common FAQs.  
* Wiki Pages on GitHub for team process notes and sprint retrospectives.

# **Software Architecture**

## **![][image1]**

## 

## 

## **Components**

**Client Layer:**  
**Mobile App (React Native/Expo)** 

- Provides a fully featured mobile interface for iOS users  
- Core functions: log activities, view posts, comment, edit profiles

**Web app (React/[Next.Js](http://Next.Js))**

- Offers same functionality as the mobile app for browser users  
- Primary use for onboarding/integrating project and for desktop engagement

**Firebase Cloud Backend/Services**  
**Firebase Auth**

- Handles secure user authentication like email/password and Google/Apple single sign on (SSO)  
- Manages user sessions and permissions across mobile and web

**Firestore (NoSQL Database)**

- Stores structured data collections that are each under 1 MB per document (user, streaks, posts, … etc.)  
- It's all relational data in document-based collections that will help with fast queries and scalable reads

**Firebase Storage**

- Stores larger media assets (\>1MB) such as profile pictures, post images, session images

**DB Query Security**

- Enforces Firestore and Storage security rules to protect user data. Access is restricted based on authentication and document fields like authorID (only allowing the user to modify their own data.

**Cloud Functions**

- An algorithmic home feed and search recommendations will be handled under firebase cloud functions

## **Interfaces**

- The mobile and web UI in the client layer and Firebase backend/database will communicate with post, get, and update requests with Firebase SDK.   
- Within Firebase, the cloud backend can perform functions (both built-in and custom) on data received from the client layer and data from the databases.   
- The cloud backend can read/write data to the Firestore NoSQL database and the Firebase storage since Firebase is an all-in-one Backend-as-a-Service.  
- Upon get and update requests from the client layer, the Firebase cloud backend can respond and fulfill these requests. 

## **Data**

### **Database Structure**

**Technology:** Google Cloud Firestore (NoSQL)  
**Collections:**

* **users** \- User profiles & authentication → activeSession subcollection  
* **projects/{userId}/userProjects** \- User activities/projects → tasks subcollection  
* **sessions** \- Work sessions (primary content) → links to users, projects  
* **follows** \- Social relationships (ID format: {followerId}\_{followingId})  
* **groups** \- Social groups → groupMemberships  
* **challenges** \- Competitive events → challengeParticipants  
* **comments** \- Session comments → links to sessions, users  
* **streaks** \- Daily activity tracking → links to users  
* **social\_graph/{userId}** \- Friendship subcollections → inbound, outbound

**Indexing Strategy:**

* Composite indexes: sessions by (visibility, createdAt DESC) for feed queries  
* Single-field indexes on all foreign keys (userId, sessionId, etc.)

### **Core Data Models**

**User** \- id, username, email, followersCount, followingCount, profileVisibility (denormalized counts for performance)  
**Session** \- id, userId, activityId, duration, visibility, supportCount, commentCount, supportedBy\[\] (sessions ARE posts, Strava-like model)  
**Activity** \- id, userId, name, icon, color, weeklyTarget, status (previously called "Project")  
**Group** \- id, name, memberIds\[\], adminUserIds\[\], privacySetting (denormalized arrays for quick lookups)  
**Challenge** \- id, type, goalValue, startDate, endDate, participantCount (types: most-activity, fastest-effort, longest-session, group-goal)  
**Follow** \- id, followerId, followingId, createdAt (ID format enforces uniqueness)  
**Comment** \- id, sessionId, userId, parentId, likeCount, replyCount (supports threaded replies)  
**StreakData** \- userId, currentStreak, longestStreak, streakHistory\[\] (history stored as StreakDay objects)  
**Denormalization Pattern:** Counts (followersCount, supportCount, etc.) stored on parent documents for fast reads, updated via atomic increment/decrement

### **Caching Strategy**

#### Cache Hierarchy (4 layers)

**Platform-Specific Implementation:**  
**Web (Next.js):**

* React Query (primary cache layer)  
* Memory Cache (5 min TTL, 100 items max)  
* Session Storage (tab lifetime, temporary filters/pagination)  
* Local Storage (24hr TTL, persistent preferences)

**Mobile (React Native):**

* React Query (primary cache layer)  
* Memory Cache (5 min TTL, 100 items max)  
* AsyncStorage (24hr TTL, persistent \- React Native's equivalent to localStorage)

**Component Layer (React Query)** \- Stale-while-revalidate hooks with optimistic updates for instant UI feedback  
**Memory Cache** \- TTL: 5 minutes, Max size: 100 items (LRU eviction), cleared on page refresh  
**Session Storage** \- Cleared when browser tab closes, used for temporary data (filters, pagination)  
**Local Storage** \- TTL: 24 hours, persistent across sessions, auto-cleanup after 7 days  
**Firestore** \- Source of truth with real-time listeners

### **TTL Policies by Data Type**

* **Feed sessions** \- React Query: 1 min, Memory: 1 min (frequently changing)  
* **User profile** \- React Query: 15 min, Memory: 5 min (relatively static)  
* **User stats** \- React Query: 1 hour, Memory: 5 min (heavy computation)  
* **Projects/Activities** \- React Query: 15 min, Memory: 5 min (infrequently updated)  
* **Tasks** \- React Query: 1 min, Memory: 1 min (frequently updated)  
* **Comments** \- React Query: 5 min, Memory: 5 min (medium volatility)  
* **Suggested content** \- React Query: 1 hour, Memory: 10 min (expensive queries)

### **Key Benefits**

* 95%+ cache hit rate for user profiles and stats (reducing Firestore reads)  
* Query deduplication prevents multiple concurrent identical requests  
* Optimistic updates provide instant UI feedback  
* Automatic background refetch on window focus ensures fresh data  
* Prefetching warms cache for predicted navigation

### **Data Flow Patterns**

#### Read Operation (User Profile)

1. Component calls useUserProfile(userId) hook  
2. React Query checks stale-time (15 min), returns cached if fresh  
3. If stale → MemoryCache (5 min TTL)  
4. If miss → SessionCache  
5. If miss → LocalCache (24 hr TTL)  
6. If miss → Firestore query via getDoc()  
7. Response stored in all cache layers  
8. Component receives data and renders

### **Write Operation (Support/Like Session)**

1. User clicks "Support" button  
2. Optimistic update: UI immediately shows incremented count  
3. Mutation updates Firestore: Add user ID to supportedBy\[\], increment supportCount (atomic)  
4. On success: Invalidate cache keys \['session', sessionId\], \['feed'\]  
5. On failure: Rollback optimistic update, show error  
6. React Query refetches affected queries in background

### **Real-Time Data (Active Timer)**

1. Timer started → document created in users/{userId}/activeSession/{timerId}  
2. Context provider subscribes to Firestore onSnapshot() listener  
3. Timer state updates every second locally (no Firestore writes)  
4. Auto-save every 10 seconds → update activeSession doc  
5. On finish → batch write: create session doc, delete activeSession doc  
6. Feed invalidated → users see new session appear

## **Alternatives**

### **Supabase**

We can substitute Firebase for Supabase relatively seamlessly within our current architecture as both BaaS offer what we need.  
**Pros**

- Our team is more familiar with PostgreSQL as opposed to NoSQL.  
- Supabase gives full SQL capabilities which will help with our large-scale and relatively complex data model.  
- Supabase being open-source gives us more flexibility to extend functionality with PostgreSQL extensions, deployment, and compliance.  
- PostgreSQL may be better suited to our data model (keeping social and privacy states consistent as our data scales will be hard without PostgreSQL)

**Cons**

- Supabase’s real-time services “may not yet reach Firebase’s maturity in every edge case”  
- Being part of the Google Cloud ecosystem gives Firebase access to a lot of out-of-the-box integrations  
- Firebase abstracts more of the scaling complexity away from the programmer (potentially a pro of Supabase as well)

### **Swift**

We aren’t intending to develop the mobile application with Android in mind, meaning that we could switch to Swift.  
**Pros**

- Runs faster on iOS than React Native  
- Native performance and access to latest iOS APIs  
- Better for iOS-specific features (SwiftUI, etc)

**Cons**

- Learning curve (only one of our team members knows Swift)  
- Building separate iOS app (Swift) doubles dev work if we ever want to do Android

## **Architecture Assumptions**

### **Cost and Budget**

We would like to maintain a budget of $0. The only component of the architecture that raises potential costs would be our BaaS. Firebase’s free tier gives us 50K reads/day, 20K writes/day, 1GB storage which is way more than enough to get the app underway and successful for the foreseeable future. The fact that many good BaaS offer a compelling free tier is a huge motivation for our architecture.

### **Development and Timeline**

Our team has relatively limited backend experience, and with a one quarter timeline a BaaS reduces complexity from the development standpoint and allows us to gain experience with an industry standard tool and focus on other aspects of the app.

# 

# **Firebase Integration Details**

### **Data Storage Strategy:**

* **Firestore Collections:** Store users, sessions (posts), activities, follows, groups, comments, and streaks as separate collections with document references linking related data (e.g., sessions reference userId and activityId)  
* **Firebase Storage:** Store profile pictures and session images as blobs, with download URLs saved in corresponding Firestore user/session documents  
* **Authentication Data:** Firebase Auth manages user credentials; our Firestore users collection stores additional profile data (username, bio, stats) linked by the same userId

### **Key Firebase SDK Calls:**

* **Authentication:** `signInWithEmailAndPassword()`, `signInWithPopup(GoogleAuthProvider)`, `signInWithPopup(OAuthProvider)` for Apple SSO  
* **Database Reads:** `getDoc()` for single profiles, `getDocs(query())` for feed queries with composite indexes on (visibility, createdAt)  
* **Database Writes:** `setDoc()` for creating posts/profiles, `updateDoc()` with `increment()` for atomic counter updates (likes, followers), `batch()` for multi-document transactions  
* **Real-Time:** `onSnapshot()` listeners for live feed updates and active session tracking  
* **Storage:** `uploadBytes()` for images, `getDownloadURL()` to retrieve public URLs for display

### **SSO Implementation:**

* **Google Sign-In:** Use Firebase's `GoogleAuthProvider` with `signInWithPopup()` on web and Google Sign-In SDK for React Native on mobile  
* **Apple Sign-In:** Use Firebase's `OAuthProvider` configured for Apple, which handles token exchange and returns standardized user credentials  
* Both SSO methods automatically create/link Firebase Auth accounts and trigger our Firestore user profile creation logic via Cloud Functions

# **Software Design**

## **Frontend**

### **1\. Component Layer (115+ components)**

**Feature Components** (106+):

* **Session Management** (10): Timer interface, session cards, stats, history, editing  
* **Social Feed** (8): Feed display, filtering, infinite scroll, carousels  
* **User Profiles** (8): Profile display, stats, tabs, editing, search  
* **Analytics** (10): Charts, heatmaps, progress rings, comparative views  
* **Groups & Challenges** (11): Group/challenge management, leaderboards, progress tracking  
* **Projects/Activities** (6): CRUD operations, analytics, progress tracking  
* **Gamification** (6): Streaks, achievements, trophy case, notifications  
* **Layout & Navigation** (6): Three-column desktop layout, responsive mobile nav

### **2\. State Management (6 contexts)**

* **AuthContext**: User auth, login/signup/logout, Firebase sync  
* **TimerContext**: Active timer state, controls, cross-device persistence  
* **ActivitiesContext**: Project/activity CRUD with local caching  
* **NotificationsContext**: In-app notifications management  
* **ToastContext**: Toast/snackbar messages  
* **QueryProvider**: TanStack React Query wrapper

### **3\. Data Layer**

**API Modules**:

* `firebaseApi.ts` (500+ lines): Firestore CRUD, auth, social features  
* `api.ts`: Legacy REST client (backward compatibility)

**Utilities**:

* `queryClient.ts`: React Query config and cache keys  
* `firestoreCache.ts`: Firestore-specific caching and optimistic updates  
* `imageUpload.ts`: Firebase Storage uploads with compression  
* `errorHandler.ts`: Centralized error handling and user-friendly messages  
* `projectStats.ts`: Analytics calculations and streak tracking

### **4\. Hooks Layer**

**Mutations**: support, comments, follows, groups, challenges, activities, profiles **Queries**: feed sessions, user sessions, comments, groups, challenges, activities **Specialized**: `useTimer`, `useSessionForm`, `useResponsive`

### **5\. Routing (40+ routes)**

**Core**: `/feed`, `/timer`, `/sessions/[id]`, `/profile/[username]`, `/analytics` **Activities**: `/activities`, `/activities/[id]` **Social**: `/groups`, `/groups/[id]`, `/challenges`, `/challenges/[id]` **Auth**: `/login`, `/signup`, `/auth` **Utility**: `/search`, `/discover`, `/record-manual`, `/settings/*`

### **6\. Type System (1000 lines)**

**Domain Types**: User, Activity, Session, Comment, Group, Challenge, Streak, Achievement **API Types**: Request/response types, filters, credentials **Ensures**: Type safety, API contracts, data consistency

### **7\. Architecture Patterns**

### **Sessions-Only Model (Strava-like)**

Sessions ARE posts. No separate posts collection. Sessions include social fields (supports, comments, visibility).

### **Optimistic Updates**

UI updates immediately → backend sync → rollback on error

### **Context \+ React Query Hybrid**

* **Contexts**: Global state (auth, timer, UI)  
* **React Query**: Server state (fetching, caching, mutations)

### **Three-Column Layout**

Desktop: Left sidebar (nav) | Main content | Right sidebar (suggestions) Mobile: Full-width content with bottom nav

### **Provider Hierarchy**

QueryProvider → AuthProvider → ToastProvider → NotificationsProvider   
  → ActivitiesProvider → TimerProvider → {children}

### **8\. Data Flow**

Components → Hooks → Contexts → API Layer → Firebase

Unidirectional, type-safe, no direct Firebase access from components.

### **9\. Key Files**

| File | Lines | Purpose |
| ----- | ----- | ----- |
| `types/index.ts` | 1000 | TypeScript definitions |
| `lib/firebaseApi.ts` | 500+ | Firebase operations |
| `hooks/useMutations.ts` | 300+ | Optimistic mutations |
| `contexts/AuthContext.tsx` | 150 | Auth management |
| `contexts/TimerContext.tsx` | 200 | Timer state |
| `components/Feed.tsx` | 150 | Main feed |
| `app/layout.tsx` | 100 | Root layout |

## **Firebase Services**

### 

### **Firebase Authentication**

- Identity verification and lifecycle of sessions  
- Accessed via Firebase SDK, Firebase auth manages user identity and sign in flows. It supports email and password and google sign in or other social accounts.

The different parts to this are:

- The Auth system itself, which keeps track of the users and their IDs  
- Sign in methods, which control how the user logs in  
- Tokens, which prove who a user is

**Responsibilities:**  
Firebase Auth makes sure that only registered users can access parts of the app. It keeps users logged in safely and provides their identity to other Firebase services, like the database or storage.

### **Cloud Functions**

Cloud functions in Firebase have the responsibilities of handling background tasks and logic that should not happen on a user’s device. For example the cloud functions can send a welcome email for signing up, or create a new profile automatically for the user after signup

### **Database Security**

Database Security in firebase will control who can read or write data and under what conditions, so it's basically the permissions. Its responsibility is to keep data private and prevent people from changing things they shouldn’t. For example, in this app this will ensure that people can’t edit other peoples post or edit someone else’s profile

## **Database**

### **Storage Service(Firebase Storage)**

Firebase Storage is responsible for storing our data larger than 1 mb, which for our case is just images(user, post, ect). Storage keeps the larger files safe and accessible. It makes uploading and downloading easy, while also enforcing limits like file size and ownership (users only seeing their own images).  
**Key Responsibilities:** 

- File uploads and downloads via secure URLs.  
- Triggers file-processing Cloud Functions  
-  Enforces user-specific access control.

### **Database Service(Cloud Firestore)**

Storing usernames, messages, references to files, and more small data like that. Firestore's responsibility is to store and organize most of the app's structured data, it keeps things in sync across all devices in real time so that the users will always see the latest updates.  
**Key Responsibilities:** 

- Documents storage with flexible schema.  
- Real-time synchronization to clients.  
- Indexed queries for feed, leaderboard, and user sessions.  
- Triggers Cloud Functions for reactive updates.

### **Cloud Functions Layer:**

- Serverless execution of backend logic and automation.  
- Key responsibilities:   
  - Executes business logic not suited for client-side (e.g., deletion cascades, feed updates).  
  - Responds to Firestore, Auth, and Storage triggers.  
  - Handles scheduled tasks (e.g., streak recalculation)

**Large component interactions within Firebase:**   
Cloud Functions \+ Firestore: 

- **(Groups & Leaderboard Service)** compute leaderboards based on session(on a set interval), updating group stats on session writes   
- **(Feed Services)** listening to activity write and send push updates, which also aggregate feed for follower  
- **(Streak & Analytics Service)** calculate streaks based on activity entries, Exposes aggregate stats via Firestore collections

Cloud Functions \+ Firebase Storage: 

- **(File Processing Service- Upload parsing)** triggering on file upload events, parse image processing, update corresponding activity in Firestore

**Backend Interfaces and Integration:** 

**Automated Storage Integration (Firebase Storage:**  
Storage files follow a predictable path pattern:  
Ex: /uploads/{userId}/{activityId}/{filename}

- Each uploaded file triggers a Cloud Function:

  onFinalize(upload) → extracts metadata (e.g., text, keywords,  summary).

- Writes results to the corresponding Firestore document in uploads/

**Firestore:**  
**NOTE: data model nor file path(organization) is final**

1. **Authentication Module:** 

	**Files:**

* auth/onUserCreate.ts  
* auth/onUserDelete.ts  
* utils/userHelpers.ts

**Data model(**firestore \- users/{uid}**):**   
{  
  "username": "string",  
  "email": "string",  
  "photoUrl": "string",  
  "bio": "string",  
  "streakCount": "number",  
  "followersCount": "number",  
  "followingCount": "number",  
  "createdAt": "timestamp"  
}

Interfaces: 

- Firebase Auth SDK: handles sign-up, sign-in, and token-based user identity.  
- Firestore Triggers: onUserCreate, onUserDelete.

2. **Activities / Feed Module:** 

	**Files**:

* activities/onActivityCreate.ts  
* activities/onActivityDelete.ts  
* activities/updateActivityStats.ts  
* utils/activityHelpers.ts

	**Data Model(**firestore \- activities/{activityId}**):**  
{  
  "userId": "string",  
  "title": "string",  
  "duration": "number",  
  "tags": \["string"\],  
  "visibility": "public | private",  
  "supportsCount": "number",  
  "commentsCount": "number",  
  "createdAt": "timestamp"  
}

**Interfaces:**

- Firestore SDK: direct client writes for creating activities.  
- Cloud Function Trigger: onCreate(activity) → updateUserStreak() → pushToFeed()

	

3. **Comments Module:**

**Files**:

* comments/onCommentCreate.ts  
* comments/onCommentDelete.ts

	**Data Model**(firestore \- comments/{commentId}**):**  
{  
  "activityId": "string",  
  "userId": "string",  
  "content": "string",  
  "createdAt": "timestamp"  
}

**Interfaces:**

- Firestore SDK: firestore.collection('comments').add({ ... })  
- Trigger Function: onCreate(comment) → increment activities/{activityId}.commentsCount


  

4. **Follows Module:**

**Files**:

* follows/toggleFollow.ts(direct call)  
* follows/onFollowCreate.ts  
* follows/onFollowDelete.ts

	**Data Model(**Firestore \- follows/{followId}**):**  
{  
  "followerId": "string",  
  "followingId": "string",  
  "createdAt": "timestamp"  
}

**Interfaces:**

- Firestore Triggers: update counts and notify user  
- Direct call: Client triggers \[toggleFollow\] on Functions

         Payload → { targetUserId }


5. **Groups & Leaderboards Module:**

**Files**:

* analytics/updateLeaderboard.ts  
* groups/onGroupActivity.ts

	**Data Model(**firestore**):**  
"groups/{groupId}": {  
  "name": "string",  
  "description": "string",  
  "members": \["string"\],  
  "leaderboardId": "string"  
} and   
"leaderboards/{leaderboardId}": {  
  "groupId": "string",  
  "rankings": \[  
    { "userId": "string", "totalTime": "number", "rank": "number" }  
  \]  
}

**Interfaces:**

- Callable Function: updateLeaderboard(groupId)  
- Firestore listeners for real-time leaderboard updates


6. **Storage & File Processing Module(uploaded files Storage):**

**Files**:

- storage/onFileUpload.ts  
- storage/parsePdf.ts

	**Data Model(**firestore- upload/{uploadId}**):**  
{  
  "userId": "string",  
  "fileUrl": "string",  
  "activityId": "string",  
  "processed": "boolean",  
  "summary": "string | null",  
  "createdAt": "timestamp"  
}

**Interfaces:**

- Firebase Storage SDK: firebase.storage().ref(path).put(file)  
- Cloud Function Trigger: onFinalize(upload) → parseImage/pdf() → store metadata in Firestore  
7. **Notifications Module:**

**Files**:

* notifications/onActivityCreate.ts  
* notifications/onCommentCreate.ts  
* notifications/onFollowCreate.ts

	**Data Model**(Firestore \- notifications/{notificationId}**):**  
{  
  "userId": "string",  
  "sourceId": "string",  
  "type": "follow | comment | activity",  
  "read": "boolean",  
  "createdAt": "timestamp"  
}

**Interfaces:**

- Firestore SDK: clients listen for changes in their `notifications` collection in real time  
8. **Analytics & Streaks Module:**

**Files**:

* analytics/updateStreaks.ts  
* analytics/updateUserStats.ts


	**Data Model(firestore \-** userStats/{uid}**):**  
{  
  "totalStudyTime": "number",  
  "streakDays": "number",  
  "lastActiveDate": "timestamp",  
  "averageSessionLength": "number"  
}  
**Interfaces:**

- Triggered by onActivityCreate and onActivityDelete events.  
- Callable functions for recalculating analytics on demand

9. **Utilities & Helpers:**

**Files**:

- utils/firestoreHelpers.ts  
- utils/validation.ts  
- utils/activityHelpers.ts  
- Purpose: Have reusable helper functions for batch writes, input validation, and data consistency

# **Coding Guidelines**

All of our style conventions will be enforced via typescript-eslint and Prettier. We will customize our ESLint config file to fit all of our guidelines.

## **Typescript \- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html?utm_source=chatgpt.com)**

We chose Google’s TypeScript Style Guide because its emphasis on explicit types, naming consistency, and strict null handling ensures Ambira’s data models and async logic remain reliable across the app. We’ll enforce these standards through TypeScript’s strict compiler options and the @typescript-eslint/recommended ESLint configuration integrated into our CI pipeline.

## **TSX \- [Airbnb React Style Guideline](https://github.com/airbnb/javascript/tree/master/react?utm_source=chatgpt.com)**

The Airbnb React/JSX Style Guide provides consistent, readable component structure and hooks usage that keeps Ambira’s mobile UI predictable and performant. We’ll enforce it using ESLint with the Airbnb and React Hooks plugins, alongside Prettier formatting and pre-commit lint checks.

## **Firestore Query \- [Google Firestore Query Best Practices](https://docs.cloud.google.com/firestore/native/docs/best-practices)**

We follow Google’s Firestore Query Best Practices to ensure Ambira’s data fetching remains secure, index-friendly, and scalable, particularly for feeds and user privacy controls. These practices will be enforced by isolating all queries in a typed service layer, linting async usage with ESLint, and validating query behavior with Firestore Emulator tests in CI.

[image1]: <data:image/png;base64,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uEkQBMEjlhsdbrrpJho+fDg3Czbhu+++4ybBDdu3bxcBFyXceeed3CQIguARy40Od999N/3444/cLNiETz75hJsEN5w4cUIEXJTw3//+ly5dusTNgiAIbrHc6PDYY49Rz549uVmwCVLnzz9effVVGjZsGDeHhQsXLqgafhs3blTxeb///jv179+fPvvsM2rRogU1bNiQKlWqRKVLl1a/84MPPkh33XUX3XzzzUqIelrgeb/99ttVX1BcA/D6kiVLUpUqVah69eqqR3KjRo3ovffeow8++IDat29PnTt3pu7du6ubgqZNm9Ibb7xBzz//PD366KPKo8X/BhbYsR7v/eabb1KrVq2oU6dO6n30gm4wFStWDPjy8ssvU/369alx48bq+8Jn0H8T+/b+++9LL2hBEHzGcgLuySefpK5du3JzxHH27FnavXu3Ksb622+/0bfffqsqrrdp00YNGm+99RbVqVNHDdD8Qh+MBQPr22+/TR9++CF99dVXTgPWwIEDaeTIkSpDFHXadu7cSefOnaPk5GT+sbySkpKiklDGjBlD33//PTVr1oxee+01tQ/gmmuucX6B4BGIIz24B5PTp0/T7Nmz1bH66aefKkGE36148eJ03333UYECBZyE0C233EIPPfQQPf3006p/MY6tli1bUrdu3dSxjqzKP/74g8aOHavOgaVLl6pSGbqV2smTJ/N0fPnLxYsXKSYmhrZt20YrVqxQx+Uvv/yipvIhBBs0aKCEFT9f9FK7dm312Zo3b+5y3nhaPv/8cyUs8Z3g9Yhxw/eE81C/d4kSJeiOO+5Q3+dtt92mutDguxcEQfAFywk43Hl36NCBm4PK+fPnaceOHbR48WLlUejYsaO6S37uueeoUKFCVLBgQZc7eSwYwHDHDw8BBtpevXopMYQCrHPnzlUDFmo8YRCJFCDAIN527dpF69evVwMvylnA24LPxgcq49KnTx/6888/pShpEIDAwvHGj0FfFxTIvv/++5VogKcKnizcUOD3Wrhwofq9BUGIHtauXatutCpUqOC4kbj11ltp3759fNM8s2jRIm4SAohtBRxEE4QEBMjUqVNp1KhR1KNHD3WHC3FWpkwZKlKkiIs4u/baa1Uc3uOPP041atRQd8+tW7dWwm706NG0YMECOn78OP9zghASEhIS1P/I1IaHk4toLaR//fVX5QmFNxXi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a1mFbUq3tUyn5vXNkM92tn+3bNnSdOjQwSpjgwYNsv1U8+lZ+uuvv5o+ffqYLl26mPfff9+2zHruuefMPffcYxo3bmwuu+wym8V74IEH2rIn3mO54IILzCOPPGI/V1EUpZLYe++9pSh0VIFTKgLKdKBUoISkEVpzPf7447YAb/369W39txtuuMEqarSo2nzzzWsUo3XWWcecccYZtrE9NeG++uorW0wYq+KKxSNrWd/m/3yY/LjIoJYeLchuvPFGs8kmm9QcM71jDzroIHPllVeG0kNWURQlzcTRWjARBW6zzTaTIkWJFJSIRx9NT4G7uXPnms8++8wcddRRZvXVV8+wXHm3nXbayTz88MO2ywIuz/nzcxc2Xb6gv1k4tGGNArdsekyVV33ge/bq1csqoljpXGFjAnwpRqwoilKO7L///lIUOokocMVUKFaUYnjooYeswpAUs2bNMp988ompV69ehmJGOzlcj1irvv76azNvXu32SrwOxa1cadWqlTnppJPs9zzzzDPNqFGj5EsURVFKEjwOUZPIk00VOCUOiL9KwvI2bdo007Zt24z4NOLvsDyfc845ZuHChTWvnTQpe3boTz/9JEWRQV/VpEBxc+5WXN2KoiilTtkqcNtuu60UKUqooLTFpbg1a9asppn93Xffbbp16yZfkhWUvDSANTAN4HLFpYx1TlEUpVRRBU5RioBkgDjcplitUBKpuE1/02HDhsmX5CSO48yHI488UooSA5fzqquuapo0aSJ3KYqilARlGwO3/fbbS5GihAZK0f333y/FoUJsG0oGsW11gWMdOnSoFMdOmhQ4oO7c2muvLcWKoiglQdkqcHH0CFMqj/bt20du0dphhx3sZ1AHLQzIMr3rrrukOHZOOOGEjL9POeUUs8EGG2TI/MBdTDmTqOBcY1FVyg8KQ0+dOtXGQLKIoZQOGcuyiHTQxuupa1i2hbmVkmXfffeVotCJ9mmXBVXglLChwC0lKi699FK5KzTatGljdt11V1tzLSzOP/98c/TRR0tx7FBXzsExYf0aMWKE5xW1wcWJgtW5c2e5KzSef/55+xk8rJXoIBzgt99+M0OGDLHn+vPPP7dxiO+++64t3ky9QZKCuOY333yzLeJ89dVXm4suusice+655vTTT7eFpf/1r3/ZNnWEyWy00Ua1ijtHvfGZO+64ox3PHOeLL75o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A5YVLpplQRCEuMHYbDPzAEQmwE2cOFH5jQmCkBnMokQt8eKT5JR0KESWomnKBElzi6nVjhoWXqSHwacT3xLRugmCEFcYx8lHapPIBDgctnGqFwQhGCQWRVAj4emee+6pBgYyxF900UUqQTDBMNmEvFKndevWqk4q5/zyyy9nDfIRBEGIE4xZtnORRibAkSmchJOCIBQGiyG0dRS0J7WKO1gFlT0pX3Th+VIEkzDJa/HzO/roo1XgDSWZBEEQSgXGZAIGbRKZAAdS5FkQooP6pmit2rVrp9LIaEGPbPxk1adOH+lISDJMYfmoefrpp5WT76GHHprqG3mT8JcVBEEoZRjPbJc3jFSAI8xfEITisH79emVuJSky5lgEOS04sZFDDY0XxcYxXRLhSUAFhbz9RrlyDNLSUKCemrQkgybC+8knn1TfSY7B6tWrq+OR+gR/NgRJzMSCIAhJgTHOne7JBpEKcAzcgiCUDghkFFMniTTJp0lCTT7HTp06pSWr1hsrTqqukISZlDySY1AQhHIEAc52WcFIBTjKIAmCIAiCICQZBLjEpBGB3/zmN2aTIAiCIAhCokCAI7+nTSIV4DghSaIrCIIgCEKSIXCMzSaRC3AUbBcEQRAEQUgqlPg78MADzeZQiVyAmz17ttksCIIgCIKQGC6++GIl89jE7rcbiAAnCIIgCELSufTSS5MnwM2bN89sFgRBEARBSAyJ1MBRUksQBEEQBCGpEIGaOAFOEARBEAQhyTRu3Ni6zGP32w32228/s0kQBEEQBCFRXHjhhckS4E488USzSRAEQRAEIVEkyoS6efNm56KLLjKbBUEQBEEQEsXll1+uBLjt27ebu0IjMgGuf//+zmuvvWY2C4IgCIJQAD/99JMzZcoU55tvvnFeffVVp0ePHs7f/va3SLZHHnnEadeunXP//fc79957r3PnnXc6t912m3Prrbc6N954o3Pdddc5V199tRJoLrnkEqXI+dOf/uSce+65ToMGDZSm6oorrnCuv/565+abb1b/SxH49u3bq+9/4oknnKeeesrp1auXOre+ffs67777rvPJJ584n3/+ufP1119n3AYPHuy88MILTteuXVX/6MMFF1zgHH300c7++++vhKt8t7322kv1nfO59tprnfvuu8/p2LFj2nXB4shn+d0WkQlwTz75pDN58mSzWRAEQRCEncyfP9+ZNm2aM2rUKCWAfPjhh87bb7/tvPTSS86zzz7rdOvWTQlKCEZk+j/kkEOqCBeyeW+///3vVYmrU089VQl1rVq1cv761786//jHP5z333/fGTZsmHlbnGXLljmTJk1SSqguXbooIbVevXrOSSed5Bx55JHObrvtVuU47s0W9r5ZEITEsnr1amf58uWqNN6PP/7ofP/992qBNnr0aKUF+OKLL5x+/fqpQfGZZ55xHn74YbU6b9mypVptN2rUSE1AxxxzjHPooYc6u+yyS5VBr1S2ww47zDn++OOdc845J+fGpFGnTh31+Ro1aqhzp9zOnnvu6ey6665Vvlu2ZG9M/AgTdevWVRqpG264wbnjjjuU9um5555z3nzzTWfQoEHO+PHj1XtWWVlpvopCTBkwYIC6x9OnTzd3hYYIcIIQI3755Re1Cv/qq6+cDz74wHnllVeUiQLhB1PEZZddpswPqOcRAA444IAqk0KpbLvvvrtaDR9++OHOKaecokwShN7fdNNNalWMWeKxxx5TJhRMQphDEAj79OmjTCgMkB999JHzz3/+U5lMRowYoSY6TEkIlCQNX7RokZr0Vq1a5axduzZ1nTdu3KhW1QsXLlTVYRA+v/vuO/UdaD2YOJ9//nl17e+++25l2iGqzBTIzj77bOcPf/iDs88++1Q5v7333lsJZ8cee6yaoFmxm/+fz8Y1whyF9gCBuHXr1kor4zbfhLF17tw5de0xX7344ovq+r/xxhvOW2+9pdxiEC4wZQ0ZMkTdg5EjRzrjxo1TwgZmPa5xHNm0aZOzbt06Z82aNer54DnhvauoqFATLs/DmDFj1PmwIDHNc5m2b7/91pkwYYIzc+ZM9eyxuOH7edaE8mTWrFlmU6gURYAzBzrSi6CKZIBkIMLciqqSF2ju3LnqRSsGc+bMUX1Alc0ghhaBSaV58+Zq8Dz//PPVoMzgzCTEZMpK2jw/r43/YeJq0qSJsv337NlTTR5oMBgIUaczyaxYscLKdWBwWbJkibrOEydOVBoUc2DKZ2MinDp1atqkmWSYBLh+L7/8svPoo4+qe4lQwgRu3vNMGz4ZZ555pvIPYRXOBIrmismSa8lzsGHDBvOwgiAIQplSFAEOJ0QmKJz+WN0ivKBVOOGEE6pMbHrD1o+Qx+duv/1256GHHlJCFavlL7/8sooAMXz4cE/VJeYfVkms1PksfgasNhEia9WqldOm7d74LP3DOZI+mivmbBvCH+e87777VvnOpG3VqlVTJrOGDRsqAQUfggcffNB57733lNC4YMEC8xbFBgRnhHlW2GjEcIq95557Upow81zdG5oZnie0Zwj/PGNojtCw4VNhQygXBEEQkk9RBDgvUG2jxkYoQ4WPJgOtBH4mmFzMCTLsjWNokw6OonrSxVSDoDd27FhlckE9Tl/DBk0YJiBU95gmcKpEq4MJo3v37kpwbdu2rdOmTRulCSQCpmnTpkobiCYPARRhoUWLFuozplkkqg3TE/2kHwhsV155pRJ4EFq5l5lMTgjCaKIwDWKawk8Kfyl8QviuTp06KWdefKsw3ZhCeyHbp59+qsxDTz/9tNKgsaigr/TF7Kd722OPPZyzzjpLmbQw+/Xu3Vs9K5jjBEEQBMEWsRPgBEGDeRfTMeZDTNlordCUImhhajaFxkI2hGMtGLJ4EGdhQRAEIc78f4zxLkEvTjfYAAAAAElFTkSuQmCC>