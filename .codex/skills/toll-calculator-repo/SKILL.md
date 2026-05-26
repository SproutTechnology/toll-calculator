---
name: toll-calculator-repo
description: Use when working in the Sprout toll-calculator repository on repository organization, contributor guidance, commits, pull requests, or cross-language coordination not specific to Java or C#.
metadata:
  short-description: Sprout toll-calculator repo workflow
---

# Toll Calculator Repo

Use this skill for repository-level work in this project.

## Repository Shape

- `Java/` contains the Java implementation: `TollCalculator.java`, `Vehicle.java`, `Car.java`, and `Motorbike.java`.
- `C#/` contains the C# implementation with equivalent vehicle and calculator classes.
- `src/TollRush/` currently exists as an empty placeholder.
- `README.md` contains the assignment brief and toll rules.
- There is no committed Maven, Gradle, `.csproj`, or automated test runner setup.

## Workflow

- Preserve user changes; inspect `git status --short` before broad edits.
- Keep language-specific code in its existing directory unless intentionally introducing a project scaffold.
- When calculator behavior changes, decide explicitly whether Java and C# should remain behaviorally equivalent.
- Recent commit messages are short and imperative, such as `Add important notes to README`.

## PR Notes

Mention the implementation touched, behavior changed, and verification performed. Include screenshots only for visual documentation or generated output changes.
