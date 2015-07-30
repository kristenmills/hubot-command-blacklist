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

`HUBOT_DEFAULT_COMMANDS` - comma seperated list of command ids that can't be disabled.


## Commands

`hubot enable <commandId>` - enables the command with a given commandId in your
current room.
`hubot enable all` - enables all commands in the current room
`hubot disable <commandId>` - disables the command with a given commandId in your
current room.
`hubot disable all` - disables all commands except for this packages command and any commands you've listed as `HUBOT_DEFAULT_COMMANDS`
`hubot list commands` - will list all the commandIds split into categories: enabled commands and disabled commands

## Notes

If you are using [hubot-auth](https://github.com/hubot-scripts/hubot-auth),
anyone who is `admin` or anyone with role `[room-name]-admin` can run these commands. If you aren't using hubot-auth, then anyone can run them.

If your listener doesn't have an id set using listener metadata you won't be able to disable that command.