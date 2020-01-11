# Introducing QStudy

QStudy is a web app for Kingston students (Queens intended) to host and join study groups. 

A **Full-Stack Software System** consisting of a Single Page Web Application built with **ES5/6/7+ Javascript and React.js**. Which interfaces a **REST APi** built with **Node.js, Express, and MongoDB** (Mongoose). The site is interactive and dynamic, through appropriate advantage of SPA-logic to give an app-like user experience. 

*Not enough time to read the pitch?*

**TL;DR** Large mini social media "group messenger" app with User Authentication, tailored for group studying for UX use-cases, with AirBnB's "Use google maps to find BnBs" but for IRL Study Crams (but that last part not just yet,and will add later).

**Lots of APi & component logic, on a large scale app, hopefully demonstrating competent technical ability.**

*Alright, behold the pitch.*

### About

In the application, you create accounts in which when you login, you're prompted to create a profile. In the profile you can list a bio, year, and the courses you're enrolled in (all very well validated). Then you can browse other users, and send friend requests. Your dashboard will display requests sent to you, and your friends, with various options, like seeing their profiles. You can create study groups, private or public (private groups have to let requesting members in, public groups allow auto-joining), and based on groups. You can also join other groups. Groups have a chat, and soon a map-based real-life cram session system. You can also invite other members to groups, especially your friends.

My first side project of significant scale. My 2d game had 5000 lines and maybe could be considered large scale for a student side project, this one I've written 10k+, and not just tons of boilerplate as if I used Angular.

### Technical Pitch (Buzzwords)

* Front-end built with React.js, and Modern (my own) responsive CSS (Using flexbox, shadows, transitions, etc)
* Functional Components * Hooks (Modern React)
* Global State Management handled using Context APi and it's related hooks such as useReducer (Same architecture as Redux, 'Actions dispatches types to a reducer, changing a store provided down the component tree')
* REST APi built with Node.js, Express, and MongoDB (Mongoose). Tested using Postman. APi Includes Request Validation, 40+ endpoints, JSON req/res interface, and emphasis on scalable logic.
* User Authentication system built with JWT, with custom express middleware for private routes and user identification, and JWT-localStorage handling on the client for user sessions
* Passwords hashed in the database using BCryptJS, with JWT Secret not pushed to repository.

### Business Pitch (Use cases)

1. It's popular for people on facebook to host group chats for courses, which has tons of use, and is fairly popular. Problem is, you can't really find them all the time unless you run into some link in a comment section or get invited to one. A Query system makes a big difference, especially when you can query by course. Also, not everyone has Facebook.
2. Some people like real-life group studying, though may not know people in a certain elective, or their friends are uninterested in group studying, so creating a system to host IRL crams (Coming soon) could be really useful.
3. A way to find, meet, and connect with others at your school in your courses. Especially useful for those who don't attend lectures and stick to studying the online content. Which is astonishingly popular.
4. Tailoring a social media to an audience can be pretty powerful. Especially if it's just slight user experience tweaks. Take Linkedin for example, It's facebook but they renamed the friends list to "connections" and made the profile look more like a resume, while Facebook still has all those features like past job experiences.
5. If I decide to launch/market it at Queens, and it succeeds. Can potentially try growing it into a startup and launch at other schools, as it could succeed based on these cases.

### Some Interesting Features

* Authentication System (fairly explained above), utilized by Context APi for component access.
* Component logic & React-router-dom used for PrivateRoutes you can only access if logged in, and some you must have a profile for too. The navs of the Responsive Navbar adjusts based on this authentication state too.
* The use of regular expressions and reducers for search bars. You can also search things through buttons too, which cancels out the search bar.
* Friend Request System. APi utilizing authentication and the encapsulation of logic to securely create a permission system in which if the APi was manually interfaced, friends can only become friends if a party requests and the other accepts. Dynamic "friend request button" with logic to change it's local state depending on state in the friend-request system.
* Alert System. Fixed, colored (based on alert) tabs on the bottom right, where any component in the tree can spawn one, removed by a delay, by utilizing Context APi. For uses such as validation errors, successful sending of friend requests, group-join requests, and group-member acceptances.

### TODO (When I pick the project back up next summer)

* Formally test REST APi with coded cases
* Public Group Join URLs for sending "Instant Invites" to users on other sites
* Stickying group messages with Stickied Page
* Secondary Host Priveledges to members
* Create the "Cram System" where you can host real life study group sessions within a "group", placing location and time on Google maps, using Google Maps APi.
* "Explore by Cram" in the explore page where you can see study groups on a map.
* Publicize/Privatize Crams (Seperate from group privacy) options.
* Block Accounts and Delete Accounts
* Probably make the CSS look a little better lol
* Learn Containerization & AWS and Deploy!
* Responsive Notifications Drop down and Notifications Page for seeing past notifications and deletions

### Could of done better, and possibly fix in the future

* Utilize props and higher-order components for component reusability
* First React project so I took it straight on, step at a time. I had a plan, but didn't know React well enough to be super in-depth. Next time,better project planning and architecture design would save time and allow for more code reusability
* Better APi/db design although mine didn't cause much problems
* Make more middleware and promise returning utility functions for APi logic reusability
* Use of CSS Grid for layout management and layout-skeleton loading screens
* Mobile-first approach to responsive design


### Bugs I found a lot later :((

* The error message doesn't properly display on the client for min-character password creation validation (works in the back, as the backend is well tested)
* Sometimes the friend request button when viewing a profile will be "Send Friend Request" even if friends
* Sometimes when you go the groups page, a blank error popup will show up.