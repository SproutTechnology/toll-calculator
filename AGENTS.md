# Repository Guidelines

## Coding Style & Naming Conventions

Follow the style of the language being edited.

- Java: use PascalCase class names, camelCase methods and variables, and 2-space indentation in existing files.
- C#: use PascalCase public methods and types, camelCase locals, and 4-space indentation.
- Prefer clear rule extraction over adding more nested conditionals to toll calculation logic.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages, for example `Add important notes to README`. Keep commits concise and focused on one change.

Pull requests should include:

- a short summary of the behavior changed
- the language implementation touched
- tests or manual verification performed
- screenshots only if documentation or generated output changes visually

## Agent-Specific Instructions

Do not overwrite user changes. Before modifying calculator behavior, compare Java and C# versions and decide whether both should stay behaviorally equivalent.
