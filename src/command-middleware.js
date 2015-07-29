// Description:
//   Middleware to prevent certain commands to be run in certain rooms
//
module.exports = function(robot) {

  robot.listenerMiddleware(function(context, next, done){
    var id = context.listener.options.id;
    var room = context.response.envelope.room;
    var cb = robot.brain.data.commandBlacklists || {};
    var blacklist = cb[room] || [];
    if (blacklist.indexOf(id) !== -1) {
      robot.send({ room: room }, "Sorry you aren't allowed to run that command in " + room);
      done();
    } else {
      next(done);
    }
  });
}