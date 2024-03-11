Social Media API build with Nodejs in backend. 
Starting the application:
1. cd .\api\ 
2. npm install (to install relevant node modules)
3. Manage own .env as per the code, whichever variables to be added there
4. After setup, npm start to start the application.

**Authentication Endpoints**
1. Register User
  Endpoint: POST /auth/register
  Description: Registers a new user in the system.

2. Login User
  Endpoint: POST /auth/login
  Description: Logs in a user and generates an authentication token

**User Endpoints**
1. Get User Profile
  Endpoint: GET /users/:userId
  Description: Retrieves the profile information of a user by their ID.
  Request Headers: Authorization: Bearer <jwtToken>

2. Update User Profile
  Endpoint: PUT /users/:userId
  Description: Updates the profile information of a user.
  Request Headers: Authorization: Bearer <jwtToken>

4. Delete User Profile
  Endpoint: DELETE /users/:userId
  Description: Deletes the profile information of a user.
  Request Headers: Authorization: Bearer <jwtToken>

5. Follow User
  Endpoint: POST /users/:userId/follow
  Description: Follows another user.
  Request Headers: Authorization: Bearer <jwtToken>

6. Unfollow User
  Endpoint: POST /users/:userId/unfollow
  Description: Unfollows another user.
  Request Headers: Authorization: Bearer <jwtToken>
  
**Post Endpoints**
1. Create Post
  Endpoint: POST /posts
  Description: Creates a new post.
  Request Headers: Authorization: Bearer <jwtToken>

2. Update Post
  Endpoint: PUT /posts/:postId
  Description: Updates a post.
  Request Headers: Authorization: Bearer <jwtToken>

3. Delete Post
  Endpoint: DELETE /posts/:postId
  Description: Deletes a post.
  Request Headers: Authorization: Bearer <jwtToken>

4. Get Latest Posts
  Endpoint: GET /posts/latest
  Description: Retrieves the latest posts from followed users, as well as own posts. Implemented through MongoDB Aggregation.
  Request Headers: Authorization: Bearer <jwtToken>
