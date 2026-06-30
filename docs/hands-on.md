# Hands-On Exercises

This chapter ties the course together. You will build a **control repo** from
scratch, deploy it with `r10k`, explore the data with `puppet lookup`, and apply
it with `puppet apply` — the same `git`-based workflow used to manage real
infrastructure, running entirely on a single machine.

!!! note "Prerequisites"
    You need a Linux machine with [OpenVox installed](install.md), plus `git`.
    The commands below are run as your normal user except where a `#` prompt
    indicates `root` (use `sudo`). Wherever you see `/home/youruser`, substitute
    your actual home directory.

## What is a control repo?

A *control repo* is a `git` repository that defines your OpenVox environments.
When deployed, **each branch of the control repo becomes a separate
environment**. A minimal control repo contains an `environment.conf`, a
`Puppetfile`, a `hiera.yaml`, a `data/` directory, and a `manifests/site.pp`.

[Reference: a minimal control repo](https://github.com/puppet-bootstrap/minimal-control)

## Create the control repo

Create the repository and switch to a `production` branch (r10k maps the branch
name to the environment name):

```console
$ mkdir ~/control && cd ~/control
$ git init
$ git checkout -b production
```

### `environment.conf`

`environment.conf` is a simple INI-style configuration file for the environment.
Create `~/control/environment.conf`:

```ini
modulepath = site:modules:$basemodulepath
```

### `Puppetfile`

The `Puppetfile` tells `r10k` which modules to install. Create
`~/control/Puppetfile`:

```ruby
# stdlib is required by many other modules.
mod 'puppetlabs-stdlib', '9.6.0'

# r10k gives us dynamic Puppet environments.
mod 'puppet-r10k', '13.0.0'

# Common dependencies.
mod 'puppetlabs-inifile', '6.1.1'
mod 'puppetlabs-concat', '9.0.2'
mod 'puppetlabs-vcsrepo', '7.0.0'
mod 'puppetlabs-ruby_task_helper', '0.6.1'
```

!!! note
    Module versions go stale quickly. The versions above are illustrative —
    check each module's page on the [Puppet Forge](https://forge.puppet.com/)
    for current releases before you deploy.

### `hiera.yaml`

`hiera.yaml` configures Hiera for this environment. Here we define two hierarchy
layers: the most specific is `nodes/<fqdn>.yaml`, and the least specific is
`common.yaml`. Both live in the `data` directory. Create `~/control/hiera.yaml`:

```yaml
---
version: 5
hierarchy:
  - name: "FQDN"
    path: "nodes/%{facts.fqdn}.yaml"
  - name: "Defaults"
    path: "common.yaml"
```

### `data/common.yaml`

`common.yaml` holds YAML-formatted data. Here we define a `classes` key — a list
of classes to apply — and point `r10k` at our local control repo. Create
`~/control/data/common.yaml`:

```yaml
---
classes:
  - r10k

r10k::remote: 'file:///home/youruser/control'
```

### `manifests/site.pp`

`manifests/site.pp` is our entry point for `puppet apply`. Create
`~/control/manifests/site.pp`:

```puppet
File {
  # Disable filebucket
  backup => false,
}

lookup('classes', Array[String], 'unique').include
```

Here we set a default attribute for all `file` resources, then use `lookup` to
search Hiera for `classes` and pass the resulting array to `include`.

Commit everything:

```console
$ cd ~/control
$ git add -A
$ git commit -m 'Initial control repo'
```

## Bootstrapping `r10k`

`r10k` is the command-line tool for deploying data and modules from a control
repo. The most commonly used subcommands are:

```text
r10k deploy environment <environment> -v
r10k deploy module <modulename> -e <environment> -v
r10k deploy environment <environment> -pv
```

The first deploys the data for an environment. The second deploys a single
`<modulename>` from the `Puppetfile`. The third (`-pv`) deploys the data *and*
all modules listed in the `Puppetfile`. If `<environment>` is omitted, `r10k`
works across all environments; if `<modulename>` is omitted, it works on all
modules. The `-v` flag enables verbose output — without it, `r10k` is silent on
success.

[Where does the name "r10k" come from?](https://github.com/puppetlabs/r10k/blob/master/doc/faq.mkd#what-does-the-name-mean)

To install `r10k` itself and perform the first deploy, create a file `r10k.pp`
with the following contents (substitute your real home directory):

```puppet
class { 'r10k':
  remote => 'file:///home/youruser/control',
}

exec { 'r10k deploy environment -pv':
  path    => '/opt/puppetlabs/bin:/bin:/sbin',
  creates => '/etc/puppetlabs/code/environments/production/Puppetfile',
}
```

!!! tip "Try it yourself"
    Apply it as root:

    ```console
    # puppet apply r10k.pp
    ```

    This configures `r10k` to point at your control repo and deploys the
    `production` branch into
    `/etc/puppetlabs/code/environments/production`.

## Exploring data with `puppet lookup`

`puppet lookup` explores the data in Hiera from the command line. The basic
syntax is `puppet lookup <key>`. Useful options include:

* `--node <nodename>` — return the data as it would resolve for `<nodename>`
* `--merge <behavior>` — set the merge behavior (`first`, `unique`, `hash`, or `deep`)
* `--explain` — explain how the value was determined
* `--environment <environment_name>` — use the data in that environment

!!! tip "Try it yourself"
    Explore the `classes` key as root:

    ```console
    # puppet lookup classes
    ```

    This returns the value of `classes` from `data/common.yaml`. Run it again
    with `--explain` added to see exactly how the value was resolved.

## Applying with `puppet apply`

!!! tip "Try it yourself"
    Apply the Hiera-configured classes:

    ```console
    # puppet apply \
     /etc/puppetlabs/code/environments/production/manifests/site.pp
    ```

    On a freshly deployed environment, this should make no changes.

    Run it again with debugging enabled to see what OpenVox is doing:

    ```console
    # puppet apply --debug \
     /etc/puppetlabs/code/environments/production/manifests/site.pp
    ```

!!! warning
    Unlike `puppet agent`, `puppet apply` has no built-in locking mechanism.

## A full workflow: managing EPEL with a topic branch

This exercise walks through the complete `git`-based workflow — branch, develop,
test, merge, deploy — by managing the EPEL yum repository on EL-family systems
using the [stahnma-epel](https://forge.puppet.com/stahnma/epel) module.

!!! tip "Try it yourself: create a topic branch"
    In the control repo, create a topic branch and deploy it as a new
    environment:

    ```console
    $ cd ~/control
    $ git checkout -b epel
    # r10k deploy environment -pv
    ```

    Note that there is now a directory
    `/etc/puppetlabs/code/environments/epel`.

!!! tip "Try it yourself: verify no changes yet"
    Demonstrate that the new environment makes no changes:

    ```console
    # puppet apply \
     --environment=epel --noop \
     /etc/puppetlabs/code/environments/epel/manifests/site.pp
    ```

!!! tip "Try it yourself: add the module"
    Edit `Puppetfile` and add:

    ```ruby
    mod 'stahnma-epel', '1.3.1'
    ```

!!! tip "Try it yourself: add an OS layer to Hiera"
    Edit `hiera.yaml` to add a layer to your hierarchy between `FQDN` and
    `Defaults`:

    ```yaml
    - name: "OS"
      glob: "os/%{facts.os.name}/*.yaml"
    ```

    This introduces two new ideas: `glob` (wildcard paths) and using the
    structured `facts` hash in a path. See the OpenVox
    [file-path documentation](https://docs.openvoxproject.org/openvox/latest/hiera_config_yaml_5.html#specifying-file-paths)
    for more on globbing in Hiera.

!!! tip "Try it yourself: add the class"
    Create the directory `data/os/CentOS` and a file
    `data/os/CentOS/epel.yaml` with:

    ```yaml
    ---
    classes:
      - epel
    ```

!!! tip "Try it yourself: deploy the changes"
    Commit your changes and redeploy:

    ```console
    $ git add -A && git commit -m 'Manage EPEL on EL systems'
    # r10k deploy environment -pv
    ```

!!! tip "Try it yourself: test the changes"
    Verify that the `classes` key now includes `epel`:

    ```console
    # puppet lookup classes --environment epel --merge unique
    ```

    See what would change if the new environment were applied:

    ```console
    # puppet apply \
     --environment=epel --noop \
     /etc/puppetlabs/code/environments/epel/manifests/site.pp
    ```

!!! tip "Try it yourself: merge and clean up"
    Merge the `epel` branch into `production` and delete the topic branch:

    ```console
    $ git checkout production
    $ git merge epel
    $ git branch -d epel
    ```

!!! tip "Try it yourself: deploy and apply"
    Redeploy. Note that the `epel` environment is removed from
    `/etc/puppetlabs/code/environments` because its branch is gone:

    ```console
    # r10k deploy environment -pv
    ```

    Apply the changes from `production`:

    ```console
    # puppet apply \
     /etc/puppetlabs/code/environments/production/manifests/site.pp
    ```

    Verify that `/etc/yum.repos.d/epel.repo` has been created.
