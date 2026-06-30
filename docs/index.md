# Using OpenVox

Welcome to **Using OpenVox**, a self-paced introduction to configuration
management with [OpenVox](https://voxpupuli.org/openvox/) — the open source
implementation of the Puppet platform.

OpenVox runs the same **Puppet language** you may already have heard of: the
configuration code, manifests, and modules are all Puppet code. What changes is
the platform that runs it — the agent, server, and packages are provided by the
OpenVox project rather than by Puppet, Inc. Throughout this course you will
"install OpenVox" but "write Puppet code."

## Learning objectives

After working through this course, you should be able to:

* Understand the structure and syntax of the Puppet language
* Use the [Puppet Forge](https://forge.puppet.com/) to find pre-built modules
* Understand the layout of Puppet modules
* Use the `puppet` and `r10k` command-line utilities
* Implement a `git`-based workflow for managing systems with OpenVox

## Course outline

1. [Puppet Overview](overview.md)
2. [Installing OpenVox](install.md)
3. [The Ecosystem](ecosystem.md)
4. [Using the CLI](cli.md)
5. [Module Structure](module-structure.md)
6. [Core Resources](resources.md)
7. [The Puppet Language](puppet-language.md)
8. [Logic, Facts, and Hiera](hiera.md)
9. [Hands-On Exercises](hands-on.md)
10. [Where to Go Next](next-steps.md)

## Before you start

To follow along with the examples and the hands-on exercises, you will want a
Linux machine (a local VM or a cloud instance is fine) where you can install
OpenVox and safely make changes. The [Installing OpenVox](install.md) chapter
walks through getting `openvox-agent` set up; the
[OpenVox Quickstart Guide](https://voxpupuli.org/openvox/quickstart/) is another
good reference.

!!! tip "Try it yourself"
    Throughout the course you will see **Try it yourself** boxes like this one.
    They contain commands and small exercises you can run on your own machine to
    reinforce what you just read. None of them require a classroom or a shared
    lab environment — just your own system with OpenVox installed.

---

*This course was originally developed as an instructor-led "Using Puppet" course
by Onyx Point, Inc. (Copyright 2018) and adapted for self-paced OpenVox use by
Sicura, Inc. (Copyright 2026). It is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).*
