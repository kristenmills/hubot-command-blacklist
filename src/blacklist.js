// Description:
//   Sets the permissions for commands in a room
//
// Configuration:
//   HUBOT_DEFAULT_COMMANDS
//
// Commands:
//   hubot enable/disable <commandId> - Enable/disable this command in the current room
//   hubot enable/disable all - Enable/disable all commands in the current room
//   hubot list commands - Displays all commands for a room sorted into enabled and disabled
//
// Author:
//   kristenmills


module.exports = function(robot) {
  var defaults = ['room.enable', 'room.list-commands', 'room.disable'];
  if(process.env.HUBOT_DEFAULT_COMMANDS){
    var split = process.env.HUBOT_DEFAULT_COMMANDS.split(',');
    defaults = robot.brain.data.defaultCommands = defaults.concat(split);
  } else {
    robot.brain.data.defaultCommands = defaults;
  }

  robot.respond(/enable (.*)/i, {id: 'room.enable'}, function(msg) {
    var room = msg.message.room;
    var user = msg.envelope.user;

    if(!process.env.HUBOT_AUTH || // if not using hubot auth anyone can do this
      robot.auth.hasRole(user, room + '-admin') ||
      robot.auth.isAdmin(user)
    ) {
      var commandId = msg.match[1];

      var commandBlacklists = robot.brain.data.commandBlacklists = robot.brain.data.commandBlacklists || {};
      commandBlacklists[room] = commandBlacklists[room] || [];
      var index = commandBlacklists[room].indexOf(commandId);
      var commands = robot.listeners.reduce(function(prev, l){
        if(l.options.id) {
          prev.push(l.options.id);
        }
        return prev;
      }, []);

      if(commandId === 'all'){
        commandBlacklists[room] = [];
        robot.brain.save();
        msg.send('All commands enabled in ' + room);
      } else if(commands.indexOf(commandId) === -1){
        msg.send(commandId + " is not an available command.  run `list commands` to see the list.");
      } else if(index === -1){
        msg.send(commandId + " is already enabled in " + room);
      } else {
        commandBlacklists[room].splice(index, 1);
        robot.brain.save();
        msg.send(commandId + " is enabled in " + room);
      }
    } else {
      msg.send("Only admins can enable commands");
    }
  });

  robot.respond(/disable (.*)/i, {id: 'room.disable'}, function(msg) {
    var room = msg.message.room;
    var user = msg.envelope.user;

    if(!process.env.HUBOT_AUTH || // if not using hubot auth anyone can do this
      robot.auth.hasRole(user, room + '-admin') ||
      robot.auth.isAdmin(user)
    ) {
      var commandId = msg.match[1];
      var room = msg.message.room;

      var commandBlacklists = robot.brain.data.commandBlacklists = robot.brain.data.commandBlacklists || {};
      commandBlacklists[room] = commandBlacklists[room] || [];

      var index = commandBlacklists[room].indexOf(commandId);
      var commands = robot.listeners.reduce(function(prev, l){
        if(l.options.id && defaults.indexOf(l.options.id) === -1) {
          prev.push(l.options.id);
        }
        return prev;
      }, []);

      if(commandId === 'all'){
        commandBlacklists[room] = commands;
        robot.brain.save();
        msg.send('All commands disabled in ' + room);
      } else if(index !== -1){
        msg.send(commandId + " is already disabled in " + room);
      } else if(defaults.indexOf(commandId) !== -1){
        msg.send("Why on earth would you want to disable this command? Stahp.")
      } else if(commands.indexOf(commandId) === -1) {
        msg.send(commandId + " is not an available command.  run `list commands` to see the list.");
      } else {
        commandBlacklists[room].push(commandId);
        robot.brain.save();
        msg.send(commandId + " is disabled in " + room);
      }
    } else {
      msg.send("Only admins can disable commands");
    }
  });

  robot.respond(/list commands/i, {id: 'room.list-commands'}, function(msg) {
    var room = msg.message.room;

    var commandBlacklists = robot.brain.data.commandBlacklists || {};
    var disabled = commandBlacklists[room] || [];

    var enabled = robot.listeners.reduce(function(prev, listener){
      if(disabled.indexOf(listener.options.id) == -1){
        if(listener.options.id) {
          prev.push(listener.options.id);
        }
      }
      return prev;
    }, []);

    var message = "*Enabled Commands in " + room + "*\n";
    message += enabled.join('\n');
    message += "\n\n*Disabled Commands in " + room + "*\n";
    message += disabled.join('\n');

    msg.send(message);
  });
}