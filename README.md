# Using OpenVox

A self-paced introduction to configuration management with
[OpenVox](https://voxpupuli.org/openvox/), the open source implementation of the
Puppet platform.

The course is built as a static site with
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) and is
designed to be published to GitHub Pages.

## Building locally

You need Python 3. Install the dependencies (a virtual environment is
recommended):

```console
$ python3 -m venv .venv
$ . .venv/bin/activate
$ pip install -r requirements.txt
```

Serve the site locally with live reload:

```console
$ mkdocs serve
```

Then open <http://127.0.0.1:8000/>.

Produce a static build in `site/`:

```console
$ mkdocs build --strict
```

## Project layout

* `docs/` — the course content, one Markdown page per chapter
* `docs/assets/` — images and other media
* `mkdocs.yml` — site configuration and navigation
* `.github/workflows/deploy.yml` — builds and deploys the site to GitHub Pages
  on every push to `main`

## License

This course is licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Copyright 2018 Onyx Point, Inc.
Copyright 2026 Sicura, Inc.

Originally developed as an instructor-led "Using Puppet" course by Onyx Point,
and adapted for self-paced OpenVox use by Sicura.
