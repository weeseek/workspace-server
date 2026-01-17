const User = require('../../models/modules/User');

async function getUserById(ctx) {
    const id = ctx.params.id;
    const user = await User.findByPk(id);
    if (user) {
        ctx.body = user;
    } else {
        ctx.status = 404;
        ctx.body = {message: 'User not found'};
    }
}

module.exports = {
    getUserById
};
