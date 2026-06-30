# The Puppet Language

OpenVox runs the **Puppet language** — the same declarative DSL described
throughout this course. This chapter covers its core building blocks.

## Variables

Variable names begin with a dollar sign (`$`) and can contain alphanumeric
characters plus the underscore (`_`). Variable names are case-sensitive.

[Variables](https://docs.openvoxproject.org/openvox/latest/lang_variables.html)

### Constants

Variables can only be assigned a value once in a given scope — in reality,
Puppet "variables" are actually constants.

[No reassignment](https://docs.openvoxproject.org/openvox/latest/lang_variables.html#no-reassignment)

## Data types

Data types determine the kind of data that a variable can contain. The Puppet
language is strongly typed. Common data types include:

* `String`
* `Integer`
* `Float`
* `Numeric`
* `Boolean`
* `Array`
* `Hash`
* `Enum`
* `Variant`
* `Optional`

[Data types](https://docs.openvoxproject.org/openvox/latest/lang_data.html)

### Syntax

```text
TypeName[modifier] $variable = value
```

As class parameters, data types have the following syntax:

```text
DataType $variable_name = optional_default_value,
```

For example:

```puppet
class test (
  String        $world_var       = 'World',
  Array[String] $packages        = ['vim', 'git'],
  Boolean       $enjoyable_class = true,
) {}
```

!!! note
    Capitalization, spacing, and quoting are all very important!

### String

A *String* is a text fragment of any length.

```puppet
class test ( String $x = 'Strings are Neat' ) {}
```

Strings can be single- or double-quoted. Double-quoted strings allow for
variable interpolation:

```puppet
String $my_dog = 'Fido'
String $motd   = "Hello, ${world_var}"
```

[String type](https://docs.openvoxproject.org/openvox/latest/lang_data_string.html)

### Regexp

A *Regexp* is a Ruby (PCRE-style) regular expression.

```puppet
class test (
  Regexp $b = /b/,
) {}
```

[Regexp type](https://docs.openvoxproject.org/openvox/latest/lang_data_regexp.html)

### Pattern

*Pattern* restricts *String* values to only those that match the provided
*Regexp* value.

```puppet
class test (
  Regexp      $b           = /b/,
  Pattern[$b] $x           = 'bob',
  Pattern[/\Aalice\Z/] $y  = 'alice',
) {}
```

[Pattern type](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-pattern-data-type)

### Numbers

An *Integer* is a whole number:

```puppet
class test ( Integer $x = 1337 ) {}
```

A *Float* is a floating-point number:

```puppet
class test ( Float $x = 3.14 ) {}
```

The *Numeric* type can be either an *Integer* or a *Float*:

```puppet
class test (
  Numeric $x = 1234,
  Numeric $y = 1.234
) {}
```

[Number types](https://docs.openvoxproject.org/openvox/latest/lang_data_number.html)

### Boolean

A *Boolean* is a logical true or false value.

```puppet
class test (
  Boolean $in_california    = true,
  Boolean $terrible_weather = false,
) { }
```

[Boolean type](https://docs.openvoxproject.org/openvox/latest/lang_data_boolean.html)

### Array

An *Array* is a list of values.

```puppet
class test (
  Array         $array1 = ['a',1,'b',2],
  Array[String] $array2 = ['a','b','c','d']
) {}
```

[Array type](https://docs.openvoxproject.org/openvox/latest/lang_data_array.html)

### Hash

A *Hash* is a key-value data map.

```puppet
class test (
  Hash[String, Boolean] $feature_flags = {
    'logging'    => true,
    'metrics'    => true,
    'debug_mode' => false,
    'beta_ui'    => false,
  }
) {}
```

[Hash type](https://docs.openvoxproject.org/openvox/latest/lang_data_hash.html)

### Enum

An *Enum* matches one of a range of strings.

```puppet
class test (
  Enum['one', 'two', 'three'] $x = 'one',
) {}
```

[Enum type](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-enum-data-type)

### Variant

A *Variant* matches one of any listed types.

```puppet
class test (
  Variant[String, Boolean] $string = 'neat',
  Variant[String, Boolean] $bool   = false
) {}
```

[Variant type](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-variant-data-type)

### Undef

An *Undef* variable can contain only the value `undef`.

[Undef type](https://docs.openvoxproject.org/openvox/latest/lang_data_undef.html)

### Optional

*Optional* is a modifier that allows `undef` as a value.

```puppet
class test (
  Optional[String] $string = undef,
) {}
```

This is exactly equivalent to:

```puppet
class test (
  Variant[String, Undef] $string = undef,
) {}
```

[Optional type](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-optional-data-type)

### Sensitive

The *Sensitive* type is used for data that should not be printed in logs or
reports. Other data types can be converted to Sensitive using
`Sensitive.new()`.

```puppet
class test (
  Sensitive $password = Sensitive.new("Don't print me!"),
) {}
```

When a Sensitive variable is converted to a String, its value will always be
`Sensitive [value redacted]`.

[Sensitive type](https://docs.openvoxproject.org/openvox/latest/lang_data_sensitive.html)

### Other types

* [NotUndef](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-notundef-data-type)
* [Tuple](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-tuple-data-type)
* [Struct](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-struct-data-type)
* [Scalar](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-scalar-data-type)
* [Data](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-data-data-type)
* [Collection](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-collection-data-type)
* [Catalogentry](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-catalogentry-data-type)
* [Any](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-any-data-type)
* [Callable](https://docs.openvoxproject.org/openvox/latest/lang_data_abstract.html#the-callable-data-type)
* [Default](https://docs.openvoxproject.org/openvox/latest/lang_data_default.html)

## Quoting strings

### Double quotes

Double quotes (`"`) allow for strings that contain variable interpolation or
escape sequences. For example, variable interpolation:

```puppet
$combined_string = "Hello ${myclass::world_var}"
```

The following escape sequences are available in double-quoted strings:

| Sequence      | Result |
| ------------- | :----- |
| `\\`          | Single backslash |
| `\n`          | Newline |
| `\r`          | Carriage return |
| `\t`          | Tab |
| `\s`          | Space |
| `\$`          | Literal dollar sign (to prevent interpolation) |
| `\uXXXX`      | Unicode character number XXXX (a four-digit hex number) |
| `\u{XXXXXX}`  | Unicode character XXXXXX (a hex number between two and six digits) |
| `\"`          | Literal double quote |
| `\'`          | Literal single quote |

According to [the Puppet Language Style
Guide](https://docs.openvoxproject.org/openvox/latest/style_guide.html#quoting),
double quotes should only be used for strings that contain variable
interpolation or escape sequences.

### Single quotes

Single quotes (`'`) denote literal strings, with minor exceptions. The only
escape sequences available in single-quoted strings are:

| Sequence | Result |
| -------- | :----- |
| `\\`     | Single backslash |
| `\'`     | Literal single quote |

## Facts

*Facts* are available in Puppet code via the `$facts` hash.

```console
$ puppet apply -e 'notify { "${facts[os][name]}": }'
Notice: Compiled catalog for node1.test in environment production in 0.02 seconds
Notice: Fedora
Notice: /Stage[main]/Main/Notify[Fedora]/message: defined 'message' as 'Fedora'
Notice: Applied catalog in 0.02 seconds
```

The data in the `$facts` hash is the same data returned by the `facter` command.

[Facts and built-in variables](https://docs.openvoxproject.org/openvox/latest/lang_facts_and_builtin_vars.html)

Originally, facts were available via top-scope variables:

```console
$ puppet apply -e 'notify { "${os[name]}": }'
Notice: Compiled catalog for node1.test in environment production in 0.02 seconds
Notice: Fedora
Notice: /Stage[main]/Main/Notify[Fedora]/message: defined 'message' as 'Fedora'
Notice: Applied catalog in 0.02 seconds
```

!!! warning
    While top-scope fact variables still work and are in common use, they should
    be avoided in favor of the `$facts` hash.

## Conditionals

The Puppet language supports four types of conditionals:

* `if`
* `unless`
* `case`
* Selectors

### `if`

`if` conditionally executes blocks of code. It can be combined with `elsif`
("else if") and `else` to build more complex logic.

```puppet
if $facts['is_virtual'] {
  # Our NTP module is not supported on virtual machines:
  warning('Tried to include class ntp on virtual machine; this node might be misclassified.')
}
elsif $facts['os']['name'] == 'Darwin' {
  warning('This NTP module does not yet work on our Mac laptops.')
}
else {
  # Normal node, include the class.
  include ntp
}
```

[if statements](https://docs.openvoxproject.org/openvox/latest/lang_conditional.html#if-statements)

!!! tip "Try it yourself"
    Save the following in a file called `test.pp` and apply it with
    `puppet apply test.pp`:

    ```puppet
    if $facts['kernel'] == 'windows' {
      notify { 'How did this happen?': }
    } else {
      notify { $facts['kernel']: }
    }
    ```

### `unless`

`unless` acts like a reversed `if` statement. It cannot contain `elsif` blocks,
but it can include an `else` block.

```puppet
unless $facts['kernel'] == 'windows' {
  notify { 'This is a Unix of some sort': }
}
```

[unless statements](https://docs.openvoxproject.org/openvox/latest/lang_conditional.html#unless-statements)

!!! tip "Try it yourself"
    Add the code above to a file and apply it with `puppet apply`.

### `case`

Much like `if`, `case` executes a block of code based on a set of conditions.

```puppet
case $facts['os']['name'] {
  'Solaris':           { include role::solaris } # Apply the solaris class
  'RedHat', 'CentOS':  { include role::redhat  } # Apply the redhat class
  /^(Debian|Ubuntu)$/: { include role::debian  } # Apply the debian class
  default:             { include role::generic } # Apply the generic class
}
```

[case statements](https://docs.openvoxproject.org/openvox/latest/lang_conditional.html#case-statements)

!!! tip "Try it yourself"
    Add the following to a file and apply it with `puppet apply`:

    ```puppet
    case $facts['os']['name'] {
      'Solaris':           { notify { 'I am using Solaris!': } }
      'RedHat', 'CentOS':  { notify { 'I am using EL!': } }
      /^(Debian|Ubuntu)$/: { notify { 'I am using Debian/Ubuntu!': } }
      default:             { notify { 'This OS is probably hard to use...': } }
    }
    ```

### Selectors

Selectors are similar to a `case` statement, but they return a value instead of
executing a code block.

```puppet
$rootgroup = $facts['os']['family'] ? {
  'Solaris'          => 'wheel',
  /(Darwin|FreeBSD)/ => 'wheel',
  default            => 'root',
}

file { '/etc/passwd':
  ensure => file,
  owner  => 'root',
  group  => $rootgroup,
}
```

[Selectors](https://docs.openvoxproject.org/openvox/latest/lang_conditional.html#selectors)

!!! tip "Try it yourself"
    Add the following to a file and apply it with `puppet apply` as root:

    ```puppet
    $rootgroup = $facts['os']['family'] ? {
      'Solaris'          => 'wheel',
      /(Darwin|FreeBSD)/ => 'wheel',
      default            => 'root',
    }

    file { '/tmp/delete_me':
      ensure => file,
      owner  => 'root',
      group  => $rootgroup,
      mode   => '0640',
    }
    ```

## Functions

*Functions* perform an action or return a result. They typically take one or
more parameters and can be used to modify values in a catalog. In a typical
server/agent configuration, they are executed on the server.

[Functions](https://docs.openvoxproject.org/openvox/latest/lang_functions.html) ·
[Function reference](https://docs.openvoxproject.org/openvox/latest/function.html)

Functions can be called in either *prefix style* (where all arguments follow the
function name) or *chain style* (where the first argument, followed by a `.`,
precedes the function name):

```text
name(arg1, arg2, ...)
arg1.name(arg2, ...)
```

For example, the following are equivalent:

```puppet
include(lookup('classes'))
```

```puppet
lookup('classes').include
```

[Prefix calls](https://docs.openvoxproject.org/openvox/latest/lang_functions.html#prefix-function-calls) ·
[Chained calls](https://docs.openvoxproject.org/openvox/latest/lang_functions.html#chained-function-calls)

## `puppetlabs-stdlib`

`puppetlabs-stdlib` is a standard library of resources for Puppet modules. It
contains many popular functions, defined types, data types, and facts not
included in the core Puppet language.

[puppetlabs/stdlib on the Forge](https://forge.puppet.com/puppetlabs/stdlib)

## YAML

A common way to represent data in Puppet modules is YAML, a data serialization
format similar in many ways to JSON. YAML files used by OpenVox contain keys and
values. The keys are always strings; the values can be any data type that exists
in the Puppet language and can be represented in YAML. Keys and values are
separated by a colon and one or more spaces (`: `).

YAML documents should always start with the following string:

```yaml
---
```

Unlike JSON, YAML supports comments that start with `#`, but only (reliably)
when the comment is the only thing on a line.

### Strings

In YAML, strings are bare words, or can be quoted with `'` or `"`:

```yaml
key: value
"quoted key": 'quoted value'
```

Multi-line strings can be represented using quoted or unquoted strings with line
breaks. Unquoted strings require that trailing lines are indented, but can have
issues when `:` and `#` characters are used. This is the *flow scalar* format:

```yaml
key: 'This is a long single-quoted
string value.'
key2: This is an even longer completely
  unquoted string value.
```

YAML also supports a *block scalar* format. Blocks begin with either `>` (to
fold lines) or `|` (to keep line breaks), and an optional `+` (to keep trailing
line breaks) or `-` (to drop the trailing line break):

```yaml
key: >-
  This is a long
  string value.
  Linefeeds will be
  replaced with spaces,
  and the trailing
  linefeed will be chomped.
key2: |
  # This is a string that
  # will include linefeeds,
  # but will have the
  # indentation stripped.
  [myconfig]
  key = value
```

For a great way to visualize multi-line strings in YAML, see
[yaml-multiline.info](https://yaml-multiline.info/).

### Numeric values

Numeric values are unquoted decimal, hexadecimal, or octal integers, plus
floating-point numbers:

```yaml
decimal: 42
hex: 0x2A
octal: 052
float: 42.0
```

### Booleans

Booleans are unquoted `true` or `false` values:

```yaml
'Evaluates as true': true
'Evaluates as false': false
```

YAML allows many spellings (`yes`/`no`, `on`/`off`, and various capitalizations),
but for maximum compatibility with Puppet code, `true` and `false` are the
recommended values.

### `undef`

In YAML, `undef` can be represented with `~` or `null`:

```yaml
'nothing': null
'nada': ~
```

To OpenVox these technically mean "no value," which may mean that defaults from
another data layer are used instead.

### Arrays

Arrays are represented with indented lines beginning with `-`:

```yaml
key:
  - 'array value 1'
  - 'array value 2'
```

### Hashes

Hashes are represented with indented lines containing additional key/value
pairs:

```yaml
key:
  'hash key': 'hash value'
  'another key': 'another value'
```

## Module data

Module data can be declared in two ways: *Hiera data* and *functions*.

### Hiera data

Hiera in modules should be used for relatively static data, which might be
determined by facts.

```yaml
# ntp/hiera.yaml
---
version: 5
hierarchy:
  - name: "OS family"
    path: "os/%{facts.os.family}.yaml"

  - name: "common"
    path: "common.yaml"
```

```yaml
# ntp/data/common.yaml
---
ntp::autoupdate: false
ntp::service_name: ntpd
```

```yaml
# ntp/data/os/AIX.yaml
---
ntp::service_name: xntpd
```

```yaml
# ntp/data/os/Debian.yaml
ntp::service_name: ntp
```

### Functions

Functions can be used where logic is required to determine the values of data.

```puppet
# ntp/functions/data.pp
function ntp::data() {
  $base_params = {
    'ntp::autoupdate'   => false,
    'ntp::service_name' => 'ntpd',
  }

  $os_params = case $facts['os']['family'] {
    'AIX': {
      { 'ntp::service_name' => 'xntpd' }
    }
    'Debian': {
      { 'ntp::service_name' => 'ntp' }
    }
    default: {
      {}
    }
  }

  # Merge the hashes and return a single hash.
  $base_params + $os_params
}
```
