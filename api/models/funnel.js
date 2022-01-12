const db = require('../../database');

/**
 * Get all users by step from the db.
 * @returns {Promise<array>}
 */
exports.getUsersByStep = async () => {
  const connection = await db.getConnection();
  const query = `
    select UA.action_id, UA.user_id, U.email, A.action
    from public.user_actions UA
    inner join public.users U
    on UA.user_id = U.id
    inner join actions A
    on A.id = UA.action_id
  `;
  const getUsersByStep = await connection.query(query);
  connection.end();
  return getUsersByStep.rows;
};

/**
 * Get all actions from the db.
 * @returns {Promise<array>}
 */
exports.getActions = async () => {
  const connection = await db.getConnection();
  const query = `
    select A.id, A.action
    from actions A
    order by a.id ASC
  `;
  const getActions = await connection.query(query);
  connection.end();
  return getActions.rows;
};
