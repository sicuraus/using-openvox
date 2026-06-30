# Using the CLI

The `puppet` command-line utility is used to perform most OpenVox-related
actions. (There is no `openvox` executable — the command remains `puppet`.)

```
puppet <subcommand> [options]
```

## `puppet help`

`puppet help` gives you help on `puppet` or any of its subcommands.

```console
# puppet help

Usage: puppet <subcommand> [options] <action> [options]

Available subcommands:

  agent             The puppet agent daemon
  apply             Apply Puppet manifests locally
```

`puppet help <subcommand>` and `puppet <subcommand> --help` are equivalent.

There is also a deprecated `puppet man <subcommand>` that displays the full
`man`-style documentation for any subcommand.

## `puppet config`

```console
$ puppet help config


USAGE: puppet config <action> [--section SECTION_NAME]

This subcommand can inspect and modify settings from Puppet's
'puppet.conf' configuration file. For documentation about individual settings,
see https://puppet.com/docs/puppet/latest/configuration.html.

OPTIONS:
  --render-as FORMAT             - The rendering format to use.
  --verbose                      - Whether to log verbosely.
  --debug                        - Whether to log debug information.
  --section SECTION_NAME         - The section of the configuration file to
                                   interact with.

ACTIONS:
  delete    Delete a Puppet setting.
  print     Examine Puppet's current settings.
  set       Set Puppet's settings.

See 'puppet help config' or 'man puppet-config' for full help.
```

### `puppet config print`

`puppet config print` gives you the actual value for configuration settings,
merging default settings, settings from the configuration file, and
command-line settings.

!!! tip "Try it yourself"
    Examine the output of `puppet config print` as `root`.

    Compare the output of `puppet config print environment` with
    `puppet config print environment --environment test`. Then look for this
    setting in `/etc/puppetlabs/puppet/puppet.conf`.

### `puppet config set`

`puppet config set` sets values in `puppet.conf`. The `--section` option sets
options in specific blocks of the configuration file. For example:

```console
# puppet config set environment production --section agent
```

adds the following to `puppet.conf`:

```ini
[agent]
environment = production
```

!!! tip "Try it yourself"
    Run the following as `root`, then examine the contents of
    `/etc/puppetlabs/puppet/puppet.conf`:

    ```console
    # puppet config set environment production --section agent
    ```

### `puppet config delete`

`puppet config delete` removes keys from `puppet.conf`, resetting the
configuration option to its default.

!!! tip "Try it yourself"
    Run the following as `root`, then examine `puppet.conf` again:

    ```console
    # puppet config delete environment --section agent
    ```

## `puppet agent`

`puppet agent` retrieves a catalog from an OpenVox server and applies it.

```console
$ puppet help agent

puppet-agent(8) -- The puppet agent daemon
========

SYNOPSIS
--------
Retrieves the client configuration from the puppet master and applies it to
the local host.

This service may be run as a daemon, run periodically using cron (or something
similar), or run interactively for testing purposes.


USAGE
-----
puppet agent [--certname <NAME>] [-D|--daemonize|--no-daemonize]
  [-d|--debug] [--detailed-exitcodes] [--digest <DIGEST>] [--disable [MESSAGE]] [--enable]
  [--fingerprint] [-h|--help] [-l|--logdest syslog|eventlog|<ABS FILEPATH>|console]
  [--masterport <PORT>] [--noop] [-o|--onetime] [--sourceaddress <IP_ADDRESS>] [-t|--test]
  [-v|--verbose] [-V|--version] [-w|--waitforcert <SECONDS>]
```

The agent typically runs as a daemon, waking up to retrieve and apply a catalog
periodically (every 30 minutes by default). To trigger an agent run on demand,
use the `-t` option (`puppet agent -t`). To see what the agent *would* do
without applying changes, add the `--noop` option.

## `puppet apply`

`puppet apply` executes Puppet code locally, without contacting a server.

```console
$ puppet help apply

puppet-apply(8) -- Apply Puppet manifests locally
========

SYNOPSIS
--------
Applies a standalone Puppet manifest to the local system.


USAGE
-----
puppet apply [-h|--help] [-V|--version] [-d|--debug] [-v|--verbose]
  [-e|--execute] [--detailed-exitcodes] [-L|--loadclasses]
  [-l|--logdest syslog|eventlog|<ABS FILEPATH>|console] [--noop]
  [--catalog <catalog>] [--write-catalog-summary] <file>
```

At its simplest, `puppet apply` applies a manifest:

```console
# puppet apply manifest.pp
```

It can also be passed Puppet code directly using the `-e` option:

```console
# puppet apply --modulepath=$( pwd ) -e "include myclass"
```

To see what changes a manifest will make, pass `--noop`:

```console
# puppet apply --noop manifest.pp
```

## `puppet resource`

`puppet resource` queries or modifies resources on the local system.

```console
$ puppet help resource

puppet-resource(8) -- The resource abstraction layer shell
========

SYNOPSIS
--------
Uses the Puppet RAL to directly interact with the system.


USAGE
-----
puppet resource [-h|--help] [-d|--debug] [-v|--verbose] [-e|--edit]
  [-p|--param <parameter>] [-t|--types] [-y|--to_yaml] <type>
  [<name>] [<attribute>=<value> ...]
```

To query the state of a resource, use `puppet resource <type> <name>`:

```console
$ puppet resource user root
user { 'root':
  ensure   => 'present',
  comment  => 'System Administrator',
  gid      => '0',
  groups   => ['admin', 'certusers', 'daemon', 'kmem', 'operator', 'procmod', 'procview', 'staff', 'sys', 'tty', 'wheel'],
  home     => '/var/root',
  password => '*',
  shell    => '/bin/sh',
  uid      => '0',
}
```

`puppet resource` can also be used as a shorthand for `puppet apply`. The
following are equivalent:

```console
$ puppet apply -e \
 "package { 'bind-utils': ensure => 'present', }"

$ puppet resource package bind-utils ensure=present
```

It can even modify existing resources interactively using the `--edit` option:

<video src="../assets/resourceedit.mp4" width="900" controls loop muted playsinline preload="metadata"></video>

## `puppet lookup`

`puppet lookup` examines data in Hiera.

```console
$ puppet help lookup

puppet-lookup(8) -- Interactive Hiera lookup
========

SYNOPSIS
--------
Does Hiera lookups from the command line.

Since this command needs access to your Hiera data, make sure to run it on a
node that has a copy of that data. This usually means logging into a Puppet
Server node and running 'puppet lookup' with sudo.

The most common version of this command is:

'puppet lookup <KEY> --node <NAME> --environment <ENV> --explain'

USAGE
-----
puppet lookup [--help] [--type <TYPESTRING>] [--merge first|unique|hash|deep]
  [--knock-out-prefix <PREFIX-STRING>] [--sort-merged-arrays]
  [--merge-hash-arrays] [--explain] [--environment <ENV>]
  [--default <VALUE>] [--node <NODE-NAME>] [--facts <FILE>]
  [--compile]
  [--render-as s|json|yaml|binary|msgpack] <keys>
```

You will use `puppet lookup` hands-on in the [exercises](hands-on.md).

## `puppet module`

`puppet module` installs and upgrades modules, generates new modules, and more.

```console
# puppet help module

USAGE: puppet module <action> [--environment production ] [--modulepath  ]

This subcommand can find, install, and manage modules from the Puppet Forge,
a repository of user-contributed Puppet code. It can also generate empty
modules, and prepare locally developed modules for release on the Forge.

ACTIONS:
  build        Build a module release package.
  changes      Show modified files of an installed module.
  generate     Generate boilerplate for a new module.
  install      Install a module from the Puppet Forge or a release archive.
  list         List installed modules
  search       Search the Puppet Forge for a module.
  uninstall    Uninstall a puppet module.
  upgrade      Upgrade a puppet module.
```

Many functions of `puppet module` have been superseded by other tools, but it
is still very useful for installing a module from the Forge locally — for
testing or for use with `puppet apply`.

!!! tip "Try it yourself"
    Install the `puppet-r10k` module into the current directory:

    ```console
    $ puppet module install puppet-r10k --modulepath .
    ```

## `puppet parser`

`puppet parser validate <manifest>` can be used as a simple correctness check.

```console
# puppet help parser

USAGE: puppet parser <action>

Interact directly with the parser.

OPTIONS:
  --render-as FORMAT             - The rendering format to use.
  --verbose                      - Whether to log verbosely.
  --debug                        - Whether to log debug information.

ACTIONS:
  dump        Outputs a dump of the internal parse tree for debugging
  validate    Validate the syntax of one or more Puppet manifests.

See 'puppet man parser' or 'man puppet-parser' for full help.
```
