## 🔥 Backend engineer exercise


Problem:

As a user of Palabra I'd like to see where my users are in my funnel.

**Explaining the funnel**:

- A funnel is a series of steps that users go through. Is read from left to right and users are supposed to move from the step in the left all the way to the last step in the funnel. A typical funnel in an app like Twitter would be:
    - Step 1: User signed up.
    - Step 2: User validated their email address.
    - Step 3: User posted a twit.
- Users can complete only some steps (like step 1 and 2) but never complete step 3. Or complete only action 3 but not 1 and 2 (depending on the funnel). Since we want to show users where they left off in the funnel, if users only completed step action 3 we won't show them, since they 'entered' the funnel.
- The funnel will display users in the last step they completed. So if a user completed step 1 and 2, they will be displayed in step 2. If they only completed step 1, they will be displayed in step 1. If, on the other hand, they completed steps 1 and 3, they will be displayed in step 1, since to be in step 3 they would need to complete step 2.

**To-dos**:

- [ ]  Use the data set we provided. You will find a list of users, a list of actions and a list of user actions. A step consist of 1 action. For example, if the action assigned to step 1 is `User signed in` you'd need to retrieve all users who completed action `User signed in` to know who completed step 1.
- [ ]  Build a node.js service that receives a list of steps and returns an array of users who are in each step. Example:
    - Request:

        ```jsx
        steps = [Step 1, Step 2, Step 3]
        ```

    - Response:

        ```jsx
        usersByStep = [
        	[User 1, User 5, User 8], // users in step 1
        	[User 4, User 2], // users in step 2
        	[User 3] // users in step 3
        ]
        ```

- [ ]  Display a list of users in the funnel in their correct positions following these rules:
    - Users can only appear in one step of the funnel.
    - If a user completed step 1 and 2, they would appear in step 2.
    - If they completed step 1 and 3, they would appear in step 1, since they didn't complete step 2.
    - If user only completed step 2 or 3 they won't appear in the funnel.
    - A user can complete an action more than one time, but they should only appear once.

**What we expect**:

- Instructions on how to test and try.
- Clear, explanatory code.
- Testing.

Make a PR to the repo with your solution when you are done.

## 💡 Solution

This solution is based on an express service that is connected to a postgres database.

### How to test

#### Manually

```bash
npm i
npm run docker-start
```

At this moment you have a container with the rest app service running on port 3000 (as default).

You can make a get request to get all users by step:

```bash
curl --location --request GET 'http://localhost:3000/funnel/usersbystep' \
--header 'Content-Type: application/json' \
--data-raw '[1, 2, 3]'
```

#### Running integration and unit tests

```bash
npm i
npm run docker-test
```

#### Running integration and unit tests manually

```bash
npm i
npm run docker-sh
```

Then inside the docker container:
```bash
npm run test
```

## Pending tasks

- more unit tests
- schema validation (middleware)
- docker development / production / test  setup




