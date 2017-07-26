# hubot-command-blacklist

Middleware and commands for blacklisting specific commands in certain rooms or
channels

## Installation

In hubot project repo, run:

`npm install hubot-command-blacklist --save`

Then add **hubot-command-blacklist** to your `external-scripts.json`:

```json
[
  "hubot-command-blacklist"
]
```

## Configuration

`HUBOT_DEFAULT_COMMANDS` - comma separated list of command ids that can't be disabled.


## Commands

| Command | Listener Id | Description|
|:---| :---: | ---:|
`hubot enable <commandId>` | `room.enable` | Enable the command with a given commandId in your
current room.
`hubot enable all` | `room.enable` | Enable all commands in the current room
`hubot disable <commandId>` | `room.disable` | Disable the command with a given commandId in your
current room.
`hubot disable all` | `room.enable` | Disable all commands except for this packages command and any commands you've listed as `HUBOT_DEFAULT_COMMANDS`
`hubot list commands` | `room.list-commands` | Lists list all the commandIds split into categories: enabled commands and disabled commands
`hubot toggle respond` | `room.toggle-response` | Toggle whether or not responses will be sent in this room for these commands. (Defaults to false)
`hubot toggle override` | `room.toggle-override` | Toggles whether or not admin users can override and send commands that are otherwise disabled.

## Notes

If you are using [hubot-auth](https://github.com/hubot-scripts/hubot-auth),
anyone who is `admin` or anyone with role `[room-name]-admin` can run these commands. If you aren't using hubot-auth, then anyone can run them.

If your listener doesn't have an id set using listener metadata you won't be able to disable that command.
