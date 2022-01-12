const httpStatus = require('http-status');
const { getUsersByStep, getActions } = require('../services/funnel');

/**
 * Parse and validate steps body.
 * @param {array} steps - step ids
 * @returns {Promise<array>} - sorted and validated step ids
 */
const parseSteps = async (steps, res) => {
  steps = steps?.length ? steps : [];

  // Sort and remove duplicate ids.
  steps = [...new Set(steps)].sort((a, b) => a - b);
  const actions = await getActions();
  const allowedSteps = actions.map(({ id }) => parseInt(id, 10));

  // Validate if all ids exist in the allowed steps list.
  const validBody = steps.every((step) => allowedSteps.includes(step));
  if (!steps.length || !validBody) {
    return res.status(httpStatus.NOT_FOUND).send('Some step id is wrong');
  }

  return steps;
};

/**
 * Controller - Get all users by steps ids.
 */
exports.getUsersByStep = async (req, res, next) => {
  try {
    const { body } = req;
    const steps = await parseSteps(body, res);

    // Get all users by step
    const usersBySteps = await getUsersByStep();

    // Only return the requested steps
    const requestSteps = {};
    steps.forEach((step) => {
      const order = `Step${step}`;
      requestSteps[order] = usersBySteps[order];
    });

    return res.status(httpStatus.OK).json(requestSteps);
  } catch (error) {
    next(error);
  }
};
