# Toll Rules Reference

Use this reference for detailed behavior tests in the Sprout toll-calculator repository.

## Core Rules

- Fees vary by time of day from 8 SEK to 18 SEK.
- A vehicle is charged at most once in a 60-minute period; when multiple passages occur in that period, the highest fee applies.
- The maximum total fee for one vehicle in one day is 60 SEK.
- Weekends are toll-free.
- Some vehicle types are toll-free.
- The current implementation hard-codes 2013 Swedish holiday-like toll-free dates and all of July 2013 as toll-free.

## Fee Windows

- `06:00-06:29`: 8
- `06:30-06:59`: 13
- `07:00-07:59`: 18
- `08:00-08:29`: 13
- `08:30-14:59`: 8
- `15:00-15:29`: 13
- `15:30-16:59`: 18
- `17:00-17:59`: 13
- `18:00-18:29`: 8
- all other times: 0

## Toll-Free Vehicles

- Motorbike
- Tractor
- Emergency
- Diplomat
- Foreign
- Military

## High-Value Edge Cases

- Exact transition points: `06:29`, `06:30`, `07:59`, `08:00`, `08:29`, `08:30`, `14:59`, `15:00`, `15:29`, `15:30`, `16:59`, `17:00`, `18:29`, `18:30`.
- Multiple passages inside one hour where the later passage has a higher fee.
- Multiple passages inside one hour where the earlier passage has a higher fee.
- Passages exactly 60 minutes apart.
- Enough chargeable passages to exceed 60 SEK before capping.
- Saturday, Sunday, July 2013, and listed 2013 holidays.
