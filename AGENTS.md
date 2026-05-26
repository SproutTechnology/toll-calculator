# Repository Guidelines

## Project Structure & Module Organization

This repository contains a small toll fee calculator exercise with parallel Java and C# implementations.

- `Java/` contains the Java implementation: `TollCalculator.java`, `Vehicle.java`, `Car.java`, and `Motorbike.java`.
- `C#/` contains the C# implementation with equivalent vehicle and calculator classes.
- `src/TollRush/` exists as a placeholder and currently contains no source files.
- `README.md` documents the assignment requirements and expected toll rules.

Keep language-specific code in its existing directory unless introducing a full project scaffold.

## Build, Test, and Development Commands

There is currently no Maven, Gradle, `.csproj`, or test runner configuration. Use direct compiler checks when changing the existing files:

```sh
javac Java/*.java
```

Compiles the Java implementation and catches syntax errors.

```sh
dotnet new console -o /tmp/toll-check
```

Use a temporary .NET project if you need to compile or test the C# files manually. Do not commit generated build scaffolding unless the repository is intentionally adopting it.

## Coding Style & Naming Conventions

Follow the style of the language being edited.

- Java: use PascalCase class names, camelCase methods and variables, and 2-space indentation in existing files.
- C#: use PascalCase public methods and types, camelCase locals, and 4-space indentation.
- Keep `Vehicle`, `Car`, `Motorbike`, and `TollCalculator` concepts aligned across language implementations when changing shared behavior.
- Prefer clear rule extraction over adding more nested conditionals to toll calculation logic.

## Testing Guidelines

No automated tests are currently present. Add tests with any behavioral change, especially around:

- toll-free weekends and 2013 holidays
- fee-free vehicle types
- the one-hour charging rule
- the daily 60 SEK maximum
- boundary times such as `06:29`, `06:30`, `08:29`, `08:30`, and `18:29`

Name tests by behavior, for example `returns_zero_for_motorbike` or `caps_daily_fee_at_60`.

## Commit & Pull Request Guidelines

Recent history uses short imperative messages, for example `Add important notes to README`. Keep commits concise and focused on one change.

Pull requests should include:

- a short summary of the behavior changed
- the language implementation touched
- tests or manual verification performed
- screenshots only if documentation or generated output changes visually

## Agent-Specific Instructions

Do not overwrite user changes. Before modifying calculator behavior, compare Java and C# versions and decide whether both should stay behaviorally equivalent.
