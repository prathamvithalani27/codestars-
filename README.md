# DJS CodeStars — Code UnCode 2026

A full-stack competitive-programming event platform built around Code UnCode 2026. This application serves as the central hub for participants to register, track their progress, and for organizers to manage the event lifecycle securely and efficiently.

## Overview

The DJS CodeStars platform provides a seamless experience for both participants and event organizers. 
- **Participants** can register for the event, view their status, and engage with the CP Island journey.
- **Organizers (Admins)** have access to a secure control center to manage registrations, monitor capacity, promote or fail participants through event stages, and export data for external use.

## Features

### Participant
- Email/password registration
- Email OTP verification
- Secure authentication/session handling
- Code UnCode participant dashboard
- Event information
- Registration details
- Current event stage/status
- Responsive CP Island experience

### Admin
- Role-based admin access
- Event control center
- Participant management
- Search/filter
- Participant stage progression
- Promote participant
- Mark participant failed
- Event capacity management
- Excel participant export

## User Roles

**PARTICIPANT**
Can access their own participant experience and registration data.

**ADMIN**
Can manage Code UnCode event data and registered participants. Admin routes are protected and participants cannot access admin functionality.

## Authentication

**Registration:**
Name → Email → Password → Confirm Password → Supabase Auth → Email verification OTP → Authenticated user

**Login:**
Email + Password → Supabase Auth → Role detection → `/admin` OR `/dashboard`

## Event Workflow

Participants progress through the following lifecycle:
Registration → Current Stage → Promote / Fail → Next Stage → Final Stage

## Admin Workflow

1. Admin logs in.
2. Admin enters the Code UnCode control center.
3. Admin sees registered participants.
4. Admin reviews participant information.
5. Admin promotes or fails participants.
6. Admin exports participant data.

Registrations and participants are handled as one participant-management workflow because this platform focuses on one main event.

## Technology Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase (Auth + PostgreSQL)
- Framer Motion
- Recharts
- xlsx
- Lucide React

## Architecture

**Frontend**
Next.js App Router + TypeScript

**Backend / Data**
Supabase Auth + PostgreSQL

**Authorization**
Role-based access + Supabase RLS

## Database

- **profiles**: Stores extended user information linked to Supabase Auth.
- **events**: Manages the core Code UnCode event details and capacity.
- **registrations**: Tracks user participation and stage progression within the event.

## Security

- Supabase handles authentication.
- Email OTP is handled through Supabase Auth.
- RLS protects database access.
- Admin routes are protected.
- Service-role secrets are not exposed.
- SMTP credentials remain outside source code.
- Environment secrets are not committed.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
