const _ = require('underscore');
const FunnelModel = require('../models/funnel');

/**
 * Aggregate user by step id following the challenge guides.
 * @param {usersByStep} array - Returned users by step list from db.
 * @param {actions} array - Returned action list from db.
 * @returns {object}
 */
const aggregateUsersByStep = (usersByStep, actions) => {
  // Order steps list
  const steps = _.sortBy(actions, 'id');

  // Create base template response
  const aggregated = steps.reduce((accumulator, current) => {
    accumulator[`Step${current.id}`] = {
      users: []
    };
    return accumulator;
  }, {});

  // Group users by step id
  const groupedByActionId = _.groupBy(usersByStep, 'action_id');
  const firstStepId = parseInt(steps[0].id, 10);
  const stepsIds = steps.map(({ id }) => parseInt(id, 10));

  Object.keys(groupedByActionId).forEach((actionId) => {
    // Iterate all users by step.
    groupedByActionId[actionId].forEach((userEvent) => {
      // Convert the action id to an integer
      actionId = parseInt(actionId, 10);

      // Get the current group of users by step
      const step = `Step${actionId}`;
      const current = aggregated[step];

      // Check if the user exists in the current step
      const userAlreadyAdded = _.findWhere(current.users, { user_id: userEvent.user_id });

      // Don't add if it already exists in the current step
      if (userAlreadyAdded) {
        return;
      }

      // Add user to a step if it already exists in all previous steps
      if (actionId === firstStepId) {
        current.users.push(userEvent);
      } else {
        // Check if it exists in all previous steps
        const previousStepIds = stepsIds.slice(0, actionId - 1);
        const existsInAllPreviousSteps = previousStepIds.every((stepId) => {
          const group = groupedByActionId[stepId];
          if (!group) {
            return false;
          }
          const existInGroup = _.findWhere(group, { user_id: userEvent.user_id });

          return existInGroup;
        });

        // If it exists in all previous steps, add to the current step and remove it from all previous ones
        if (existsInAllPreviousSteps) {
          current.users.push(userEvent);
          previousStepIds.forEach((stepId) => {
            const _step = `Step${stepId}`;
            aggregated[_step].users = aggregated[_step].users.filter(
              ({ user_id }) => parseInt(user_id, 10) !== parseInt(userEvent.user_id, 10)
            );
          });
        }
      }
    });
  });

  return aggregated;
};

exports.aggregateUsersByStep = aggregateUsersByStep;

/**
 * Get all actions from db
 * @returns {Promise<array>}
 */
const getActions = async () => FunnelModel.getActions();

exports.getActions = getActions;

/**
 * Pass users by step and actions from the db to the aggregate function.
 * @returns {Promise<object>}
 */
exports.getUsersByStep = async () => {
  const [usersByStep, actions] = await Promise.all([FunnelModel.getUsersByStep(), getActions()]);

  return aggregateUsersByStep(usersByStep, actions);
};
