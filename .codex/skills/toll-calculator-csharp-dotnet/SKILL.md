---
name: toll-calculator-csharp-dotnet
description: Use when editing, compiling, refactoring, or testing the C#/.NET implementation in the Sprout toll-calculator repository, especially files under C#/.
metadata:
  short-description: C#/.NET toll calculator work
---

# Toll Calculator C#/.NET

Use this skill for work under `C#/` in this project.

## Files

- `C#/TollCalculator.cs` contains toll calculation, fee windows, toll-free dates, and toll-free vehicle checks.
- `C#/Vehicle.cs` defines `GetVehicleType()`.
- `C#/Car.cs` and `C#/Motorbike.cs` return vehicle type names used by the calculator.

## Style

- Match the current C# style: PascalCase public methods and types, camelCase locals, and 4-space indentation.
- Keep namespace usage consistent with `TollFeeCalculator`.
- Remove unused `using` directives when touching a file.
- Prefer named helpers for toll rules over additional nested conditionals.

## Checks

There is no committed `.csproj`. For compile checks, create a temporary project outside the repo and copy or link files there. Do not commit generated .NET scaffolding unless the repo is intentionally adopting it.

## Cross-Language Parity

If C# behavior changes, inspect the Java implementation before finishing and call out whether parity was preserved, intentionally changed, or left for follow-up.
