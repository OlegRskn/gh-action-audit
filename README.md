# gh-action-audit

CLI tool for detecting basic GitHub Actions security risks.

---

## What it does

Analyzes GitHub Actions workflows in a repository and detects potential security risks.

### Current checks

- Unpinned GitHub Actions (not pinned to commit SHA)

---

## Why it matters

Using non-pinned GitHub Actions (e.g. `@v4`, `@main`) introduces supply chain risk.

If an action is compromised, your CI/CD pipeline may be affected.

---

## Requirements

- Node.js 18+

---

## Installation

git clone <your-repo-url>
cd gh-action-audit
npm install

---

## Usage

npm start -- owner/repo

Example:

npm start -- actions/starter-workflows

---

## Example output

Repository: actions/starter-workflows
Workflows scanned: 9
Findings: 13

Summary:
High: 0
Medium: 13
Low: 0

File: .github/workflows/lint.yaml
Workflow: Lint

[MEDIUM] UNPINNED_ACTION
Job: pre-commit
Step: (unnamed step)
Uses: actions/checkout@v4
Message: Action is not pinned to a full commit SHA

---

## Run tests

npm test

---

## Project structure

src/
  cli/        CLI entry point
  github/     GitHub API integration
  parser/     YAML parsing
  analyzer/   security analysis
    rules/    rules

test/         unit tests
scripts/      manual testing

---

## Tech stack

- Node.js
- GitHub REST API
- YAML parser
- Jest

---

## Roadmap

- Detect curl | bash / remote script execution
- Add SHA pin recommendations
- Improve CLI output
- Add JSON output mode
- Add npx support

---

## License

MIT