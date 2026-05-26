---
name: toll-calculator-java-jdk
description: Use when editing, compiling, refactoring, or testing the Java/JDK implementation in the Sprout toll-calculator repository, especially files under Java/.
metadata:
  short-description: Java/JDK toll calculator work
---

# Toll Calculator Java/JDK

Use this skill for work under `Java/` in this project.

## Files

- `Java/TollCalculator.java` contains toll calculation, fee windows, toll-free dates, and toll-free vehicle checks.
- `Java/Vehicle.java` defines `getType()`.
- `Java/Car.java` and `Java/Motorbike.java` return vehicle type names used by the calculator.

## Style

- Match the current Java style: PascalCase classes, camelCase methods and variables, and 2-space indentation.
- Prefer extracting named helpers for toll rules rather than extending long conditional chains.
- Keep vehicle type strings aligned with toll-free vehicle matching.

## Checks

Compile with:

```sh
javac Java/*.java
```

Remove generated `.class` files after manual compilation unless the user explicitly wants build artifacts kept.

## Cross-Language Parity

If Java behavior changes, inspect the C# implementation before finishing and call out whether parity was preserved, intentionally changed, or left for follow-up.
