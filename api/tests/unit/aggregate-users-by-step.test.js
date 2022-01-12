const chai = require('chai');
const { aggregateUsersByStep } = require('../../services/funnel');

const { expect } = chai;

describe('Aggregate User by Step - Unit Test', async () => {
  const steps = [
    { id: 1, action: 'User signed in' },
    { id: 2, action: 'User validated email address' },
    { id: 3, action: 'User created twit' },
    { id: 4, action: 'User retwitted twit' },
    { id: 5, action: 'User signed out' }
  ];

  it('Users can only appear in one step of the funnel', async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '2',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User validated email address'
      },
      {
        action_id: '3',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User created twit'
      }
    ];
    const expected = {
      Step1: {
        users: []
      },
      Step2: {
        users: []
      },
      Step3: {
        users: [
          {
            action_id: '3',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User created twit'
          }
        ]
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it('If a user completed step 1 and 2, they would appear in step 2', async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '2',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User validated email address'
      }
    ];
    const expected = {
      Step1: {
        users: []
      },
      Step2: {
        users: [
          {
            action_id: '2',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User validated email address'
          }
        ]
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it("If they completed step 1 and 3, they would appear in step 1, since they didn't complete step 2", async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '3',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User created twit'
      }
    ];
    const expected = {
      Step1: {
        users: [
          {
            action_id: '1',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User signed in'
          }
        ]
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it("If user only completed step 2 or 3 they won't appear in the funnel", async () => {
    const queryResults = [
      {
        action_id: '2',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User validated email address'
      },
      {
        action_id: '3',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User created twit'
      }
    ];
    const expected = {
      Step1: {
        users: []
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it('A user can complete an action more than one time, but they should only appear once', async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '1',
        user_id: '2',
        email: 'm2@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '1',
        user_id: '2',
        email: 'm2@mila.vc',
        action: 'User signed in'
      }
    ];
    const expected = {
      Step1: {
        users: [
          {
            action_id: '1',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User signed in'
          },
          {
            action_id: '1',
            user_id: '2',
            email: 'm2@mila.vc',
            action: 'User signed in'
          }
        ]
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it("if users only completed step action 3 we won't show them, since they 'entered' the funnel", async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '3',
        user_id: '2',
        email: 'm2@mila.vc',
        action: 'User created twit'
      }
    ];
    const expected = {
      Step1: {
        users: [
          {
            action_id: '1',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User signed in'
          }
        ]
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it('to be in the last step, the user should be in all previous ones', async () => {
    const queryResults = [
      {
        action_id: '1',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed in'
      },
      {
        action_id: '2',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User validated email'
      },
      {
        action_id: '3',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User created twit'
      },
      {
        action_id: '4',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User retwitted twit'
      },
      {
        action_id: '5',
        user_id: '1',
        email: 'm@mila.vc',
        action: 'User signed out'
      }
    ];
    const expected = {
      Step1: {
        users: []
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: [
          {
            action_id: '5',
            user_id: '1',
            email: 'm@mila.vc',
            action: 'User signed out'
          }
        ]
      }
    };
    const result = await aggregateUsersByStep(queryResults, steps);

    expect(result).to.deep.equal(expected);
  });

  it('all steps should have an empty user array', async () => {
    const expected = {
      Step1: {
        users: []
      },
      Step2: {
        users: []
      },
      Step3: {
        users: []
      },
      Step4: {
        users: []
      },
      Step5: {
        users: []
      }
    };
    const result = await aggregateUsersByStep([], steps);

    expect(result).to.deep.equal(expected);
  });
});
