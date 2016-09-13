// Description:
//   Middleware to prevent certain commands to be run in certain rooms
//
module.exports = function (robot) {

  robot.listenerMiddleware(function (context, next, done) {
    if (context.response.message.text) {
      var id = context.listener.options.id;
      var room = context.response.envelope.room;
      var user = context.response.envelope.user;
      var respondInChannel = robot.brain.get('data.commandBlacklists' + room + '.replyInRoom') || false;
      var blacklist = robot.brain.get('data.commandBlacklists' + room) || [];
      var override = robot.brain.get('data.commandBlacklists' + room + '.override') || false;
      var userHasPerm = !process.env.HUBOT_AUTH_ADMIN
          || (robot.auth && (robot.auth.hasRole(user, room + '-admin') 
          || robot.auth.isAdmin(user))) ;

      if (blacklist.indexOf(id) !== -1 && !(override && userHasPerm))) {
        if (respondInChannel) {
          context.response.reply("Sorry " + user.name + ", you aren't allowed to run that command in " + room);
        }
        done();
      } else {
        next(done);
      }
    } else {
      next(done);
    }
  });
}