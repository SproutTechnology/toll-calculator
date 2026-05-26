# Repository Guidelines

## Skill Routing

Use repo-specific skills instead of loading all guidance on every request:

- `toll-calculator-repo`: repository organization, commits, pull requests, and cross-language coordination.
- `toll-calculator-java-jdk`: Java/JDK work under `Java/`.
- `toll-calculator-csharp-dotnet`: C#/.NET work under `C#/`.
- `toll-calculator-testing`: tests, edge cases, and toll behavior validation.

Prefer the most specific skill for the task. Use multiple skills only when the task genuinely crosses boundaries, such as changing toll behavior in both Java and C# and adding tests.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages, for example `Add important notes to README`. Keep commits concise and focused on one change.

Pull requests should include:

- a short summary of the behavior changed
- the language implementation touched
- tests or manual verification performed
- screenshots only if documentation or generated output changes visually

## Agent-Specific Instructions

Do not overwrite user changes. Before modifying calculator behavior, compare Java and C# versions and decide whether both should stay behaviorally equivalent.
