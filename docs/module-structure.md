# Module Structure

A *module* is the basic unit of reuse and code-sharing in OpenVox: a class lives
inside a manifest, which is stored in a module's `manifests` directory.

## Anatomy of a module

Modules are distributed as gzipped tar files with a structure that looks like
this:

```text
author-modulename-version/
├── metadata.json
├── manifests/
│   ├── init.pp
│   └── subclass.pp
├── files/
├── templates/
├── README.md
├── lib/
│   └── facter/
├── facts.d/
├── examples/
│   ├── init.pp
│   └── subclass.pp
├── Gemfile
├── Rakefile
└── spec/
    ├── classes/
    │   └── init_spec.rb
    └── spec_helper.rb
```

[Module fundamentals](https://docs.openvoxproject.org/openvox/latest/modules_fundamentals.html#example)

The sections below walk through each part.

### `metadata.json`

`metadata.json` contains information about a module, including:

* The module name, version, author, description, etc.
* Module dependencies
* Supported operating systems

While not strictly required, it is strongly recommended that every module
contain a `metadata.json`.

[Module metadata](https://docs.openvoxproject.org/openvox/latest/modules_metadata.html)

### `manifests`

```text
author-modulename-version/
└── manifests/
    ├── init.pp
    ├── subclass.pp
    └── defined_type.pp
```

The `manifests` directory contains classes and defined types.

The file `init.pp`, if it exists, must contain a class named `modulename`. In
the example above, `subclass.pp` would contain a class named
`modulename::subclass`, and `defined_type.pp` would contain a defined type named
`modulename::defined_type`. Following this pattern, `modulename::foo::bar` would
live in `modulename/manifests/foo/bar.pp`.

[Manifests](https://docs.openvoxproject.org/openvox/latest/modules_fundamentals.html#manifests)

### `files`

```text
author-modulename-version/
└── files/
```

The `files` directory contains files that are distributed as-is to nodes and can
be referenced in Puppet manifests. For example, a static configuration file or
script you want a module to install can be dropped in `files` and declared as a
`file` resource.

[Files in modules](https://docs.openvoxproject.org/openvox/latest/modules_fundamentals.html#files-in-modules)

### `templates`

```text
author-modulename-version/
└── templates/
```

The `templates` directory contains ERB (Embedded Ruby) or EPP (Embedded Puppet)
files. For example, a configuration file that needs to be customized per system
might be distributed as a template.

[Templates in modules](https://docs.openvoxproject.org/openvox/latest/modules_fundamentals.html#templates-in-modules)

### `lib`

```text
author-modulename-version/
└── lib/
```

The `lib` directory contains Ruby code used to extend OpenVox. This can include
custom types, providers, and facts. In a server/agent configuration, files in
`lib` are synced to each agent.

### `lib/facter`

```text
author-modulename-version/
└── lib/
    └── facter/
```

Custom facts, which are written in Ruby, are placed in the `lib/facter`
directory.

### `facts.d`

```text
author-modulename-version/
└── facts.d/
```

External facts can be distributed in the `facts.d` directory of a module. These
facts can be executable scripts (in any language supported by the agent node),
plain-text files, or structured text (YAML or JSON).

[External facts](https://docs.openvoxproject.org/openfact/latest/custom_facts.html#external-facts)

### `examples`

```text
author-modulename-version/
└── examples/
    ├── init.pp
    └── other.pp
```

The files in `examples` show usage examples of the module. They are for
documentation only.

### `spec` and friends

```text
author-modulename-version/
├── Gemfile
├── Rakefile
└── spec/
    ├── classes/
    │   └── init_spec.rb
    └── spec_helper.rb
```

The remaining files are used primarily for a module's test suite. This can
include simple `lint` tests, compilation tests (using `rspec-puppet`), or
acceptance tests (using `beaker` or other tools).

## Component, profile, and role modules

Not every module plays the same role. Three categories are commonly used
together, following [the roles and profiles
method](https://docs.openvoxproject.org/openvox/latest/the_roles_and_profiles_method.html).

### Component modules

* Manage one thing, and manage it well
* Loosely coupled with other modules
* Designed for redistribution

Component modules manage a specific piece of technology (nginx, ntp, gitlab,
and so on). They are well-encapsulated, expose a reasonable API, and focus on
doing small, specific things really well. For example, an `apache` component
module contains all the logic and defaults needed to install, configure, and
start an Apache server — but it does *not* contain the logic to start a syslog
server, even though it may need to send logs to syslog.

### Profile modules

* Site-specific modules
* Not meant for outside distribution
* May contain sensitive information
* May be tightly coupled

Profiles contain site-specific code (and sometimes data). They group component
modules together — and, if needed, other profiles. An example would be creating
a common OS baseline from a group of modules that you can easily apply across
all your nodes.

### Role modules

* Also site-specific
* Used for classification
* Include one or more profile modules

Both profiles and roles can use the **same testing techniques** as any other
module.

## Developing modules

The Vox Pupuli community provides two complementary tools for managing the
lifecycle of a module:

* **[jig](https://github.com/voxpupuli/jig)** — a Go-based reimplementation of
  the Puppet Development Kit (PDK). It ships as a single static binary with no
  Ruby runtime, and it scaffolds modules, creates classes, validates style and
  syntax, and runs unit tests.
* **[voxbox](https://github.com/voxpupuli/container-voxbox)** — a container
  image bundling the full Vox Pupuli testing toolchain (OpenVox, OpenFact,
  `r10k`, `rubocop`, `voxpupuli-test`, and more). It lets you run a module's
  complete `rake` test suite via Podman or Docker without installing any Ruby
  gems locally — which is especially handy in CI.

Use `jig` for day-to-day scaffolding and quick checks, and reach for `voxbox`
when you want the full test matrix in a reproducible environment.

!!! note "Installing the tools"
    `jig` is distributed as a static binary (see the
    [jig repository](https://github.com/voxpupuli/jig) for the latest release or
    to build from source with Go). `voxbox` requires only Podman or Docker; it is
    pulled automatically the first time you run it.

### Using `jig`

!!! tip "Try it yourself: create a module"
    Create a new module named `mytest`:

    ```console
    $ jig new module mytest
    ```

    `jig` will ask you a few questions and use the answers to generate the
    module's `metadata.json`. (Pass `--skip-interview` to accept defaults
    non-interactively.)

!!! tip "Try it yourself: examine metadata.json"
    Run `cd mytest` to enter the directory `jig` created, then examine the
    contents of `metadata.json`. Note what was added based on your answers and
    what was added automatically.

!!! tip "Try it yourself: create a class"
    From the `mytest` directory:

    ```console
    $ jig new class mytest
    ```

    Note the files that are created, and examine their contents.

!!! tip "Try it yourself: validate"
    From the `mytest` directory:

    ```console
    $ jig validate
    ```

    This runs syntax and style checks against the module.

!!! tip "Try it yourself: unit tests"
    From the `mytest` directory:

    ```console
    $ jig test unit
    ```

    This runs the tests defined in `spec/classes/`. The generated spec tests
    only check that the code compiles into a catalog.

### Using `voxbox`

When you want to run the full test suite in a container instead of installing
the toolchain locally, mount the module directory into `voxbox`. Its default
entrypoint is `rake`, so you can call any rake task directly.

!!! tip "Try it yourself: run the test suite in a container"
    From the `mytest` directory, list the available rake tasks:

    ```console
    $ podman run -it --rm -v $PWD:/repo:Z ghcr.io/voxpupuli/voxbox:8
    ```

    Run the unit tests (`rspec-puppet`):

    ```console
    $ podman run -it --rm -v $PWD:/repo:Z ghcr.io/voxpupuli/voxbox:8 spec
    ```

    Substitute `docker` for `podman` if that's what you have. The `:Z` SELinux
    label on the volume can be dropped on systems without SELinux.
