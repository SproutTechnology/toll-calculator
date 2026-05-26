---
name: toll-calculator-testing
description: Use when adding tests, designing test cases, validating toll-calculator behavior, or reviewing edge cases for the Sprout toll-calculator Java or C# implementations.
metadata:
  short-description: Toll calculator behavior testing
---

# Toll Calculator Testing

Use this skill when the task involves behavior validation, test coverage, bug reproduction, or edge-case review.

## Current State

The repository currently has no committed automated test framework. Choose the smallest test setup that fits the implementation being changed, and avoid committing generated scaffolding unless adopting it intentionally.

## Required Coverage Areas

Read `references/toll-rules.md` when designing detailed tests.

At minimum, cover:

- toll-free weekends and holidays
- fee-free vehicle types
- one-hour charging window, including selecting the highest fee
- daily 60 SEK maximum
- fee boundary times around each transition
- empty, null, unsorted, or multi-day input if the change touches input handling

## Naming

Use behavior-focused names, for example `returns_zero_for_motorbike`, `caps_daily_fee_at_60`, or `uses_highest_fee_within_one_hour`.

## Parity

When validating one language implementation, consider whether the same behavior should be asserted or documented for the other implementation.
