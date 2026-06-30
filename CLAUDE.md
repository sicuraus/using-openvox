# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Using OpenVox" — a self-paced training course on configuration management with [OpenVox](https://voxpupuli.org/openvox/). It is a static documentation site built with [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and published to GitHub Pages. This repo is course content, **not** a software project. It was converted from an older instructor-led Showoff slide deck ("Using Puppet", by Onyx Point).

## Commands

```bash
python3 -m venv .venv && . .venv/bin/activate && pip install -r requirements.txt
mkdocs serve            # live-reload preview at http://127.0.0.1:8000/
mkdocs build --strict   # static build into site/ (CI uses --strict; fails on broken links)
```

## Architecture

- **`mkdocs.yml`** is the source of truth: the `nav:` block defines chapter order and which pages appear. Adding a page means adding it to `nav:`.
- **`docs/`** holds one Markdown page per chapter (`overview.md`, `install.md`, `ecosystem.md`, `cli.md`, `module-structure.md`, `resources.md`, `puppet-language.md`, `hiera.md`, `hands-on.md`, `next-steps.md`) plus `index.md` (home). Media lives in `docs/assets/`.
- **`.github/workflows/deploy.yml`** builds with `--strict` and deploys to GitHub Pages on push to `main`.
- Mermaid diagrams render via the `pymdownx.superfences` custom fence configured in `mkdocs.yml`; write them in ```` ```mermaid ```` blocks. "Try it yourself" exercises use Material admonitions (`!!! tip "Try it yourself"`).

## Branding & terminology rules

This content was rebranded from Puppet to OpenVox. When editing, keep these conventions consistent:

- **OpenVox** = the platform/product/project/company, packages, repos, and docs. **Puppet** stays for the *language/DSL*, the `puppet` command (there is no `openvox` executable), `.pp` manifests, and file paths (`/etc/puppetlabs`, `/opt/puppetlabs` are retained by OpenVox).
- Packages: `puppet-agent` → `openvox-agent`, `puppetserver` → `openvox-server`. Repos: `*.voxpupuli.org` (not `*.puppet.com`).
- Companion tools were renamed in OpenVox docs: Facter → **OpenFact**, Bolt → **OpenBolt** (the `facter` command itself still works).
- Module-development tooling: the course recommends **[jig](https://github.com/voxpupuli/jig)** (a Go-based PDK replacement: `jig new module/class`, `jig validate`, `jig test unit`) plus **[voxbox](https://github.com/voxpupuli/container-voxbox)** (a container running the full `rake` test toolchain). Do not reintroduce `pdk`.
- "master" → "server" in prose/diagrams (matches `openvox-server`).
- The **Puppet Forge** stays at `forge.puppet.com` and `puppetlabs-*` module names are unchanged.
- **Literal command output** in ```` ```console ```` blocks is kept verbatim — it may still say `puppet master` or `puppet.com`, because that is what the tool actually prints.

## Documentation URL mapping

Reference links map from the old `puppet.com/docs/*` to OpenVox docs:

- `puppet.com/docs/puppet/latest/X.html` → `docs.openvoxproject.org/openvox/latest/X.html` — **except** `types/index.html` → `type.html` (OpenVox has no `types/index.html`).
- `facter/latest/*` → `docs.openvoxproject.org/openfact/latest/*`
- `bolt/latest/*` → `docs.openvoxproject.org/openbolt/latest/*`
- `pe/latest/designing_system_configs_roles_and_profiles.html` → `openvox/latest/the_roles_and_profiles_method.html`

Not every page exists on the OpenVox docs site — verify new doc links resolve (a 404 check) before adding them, since `mkdocs build --strict` only validates *internal* links, not external ones.
