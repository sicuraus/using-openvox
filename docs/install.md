# Installing OpenVox

## All-In-One packages

The official OpenVox packages are *All-In-One* (AIO) packages, which have no
external dependencies beyond basic low-level system components. On Linux and
macOS, these packages install under `/opt/puppetlabs`.

The `openvox-agent` package includes the following in `/opt/puppetlabs/bin`
(which is added to your `PATH` by a script in `/etc/profile.d`):

* `puppet`
* `facter`
* `hiera`

Various dependencies are also included but are not added to `PATH`. These
include an OpenVox-specific build of Ruby, Augeas, OpenSSL, `curl`, and a number
of other libraries.

AIO packages are published to the Vox Pupuli mirrors:

* RPM-based systems: [yum.voxpupuli.org](https://yum.voxpupuli.org/)
* Debian/Ubuntu: [apt.voxpupuli.org](https://apt.voxpupuli.org/)
* Windows and macOS: [downloads.voxpupuli.org](https://downloads.voxpupuli.org/)

!!! tip "Try it yourself"
    On a RHEL-family system, enable the OpenVox 8 repository and install the
    agent:

    ```console
    # rpm -Uvh https://yum.voxpupuli.org/openvox8-release-el-$(rpm -E %{rhel}).noarch.rpm
    # yum install openvox-agent
    ```

    See the [OpenVox installation guide](https://voxpupuli.org/openvox/install/)
    for other platforms.

For more on where files live, see the OpenVox
[platform documentation](https://docs.openvoxproject.org/openvox/latest/openvox_platform.html).

## Configuring OpenVox

The primary configuration file is `puppet.conf`, located at
`/etc/puppetlabs/puppet/puppet.conf`. OpenVox honors the same `puppet.conf`
settings that Puppet did, so existing configuration carries over unchanged.

A reference to all available configuration options can be found in the
[configuration documentation](https://docs.openvoxproject.org/openvox/latest/configuration.html).

While there are many optional configuration parameters, the defaults are
generally sufficient. The most common settings you may need to change are
`server` and `environment`.

* [Important settings](https://docs.openvoxproject.org/openvox/latest/config_important_settings.html)
* [About settings](https://docs.openvoxproject.org/openvox/latest/config_about_settings.html)
* [The main config file](https://docs.openvoxproject.org/openvox/latest/config_file_main.html)
* [Full configuration reference](https://docs.openvoxproject.org/openvox/latest/configuration.html)

## Certificates

In a typical server/agent configuration, the agent communicates with the
OpenVox server over a TLS-encrypted connection using certificates signed by a
Certificate Authority (CA) created by the server.

A certificate is generated for each agent node the first time OpenVox runs.
These certificates are used to authenticate agents with the server. They are
also used for *trusted facts*.

!!! note
    In a *masterless* (or *serverless*) setup — where you apply code locally
    with `puppet apply` instead of contacting a server — there are no
    certificates, and therefore no trusted facts. Even so, an OpenVox CA can
    still be a useful tool for communication between other components such as
    PuppetDB and External Node Classifiers (ENCs).
