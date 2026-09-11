# EnVizion Life Admin CMS

## Purpose

The administration portal manages publishable EnVizion Life educational content without requiring code changes.

## Managed content

The CMS is being designed for:

- condition guides and condition sections
- specialist references and specialist guides
- Green / Yellow / Red action plans
- trusted links, videos, downloads, and text resources
- emergency guides
- transition-support content
- caregiver support resources
- safety messages

## Workflow

Content follows this lifecycle:

`draft -> review -> approved -> published -> archived`

Approval and publishing are separate steps. Clinical or safety-sensitive wording should not be published directly from draft or review.

A source/reference note should be attached before approval so reviewers can trace the wording back to an EnVizion Life source or other explicitly approved material.

## Roles

The portal now uses three CMS roles:

- **Editor** — create and update drafts, then send content to review.
- **Reviewer** — review submitted content and move it to approved status.
- **Admin** — full access, including publishing and administrative management.

The browser UI reflects these capabilities, and Supabase row-level-security policies enforce compatible write boundaries at the database layer.

## Authentication

The admin portal includes a branded Supabase Auth sign-in screen and an application-wide auth gate. Only authenticated users with an active record in `public.admin_users` may access the CMS.

The role table is introduced in `supabase/migrations/0003_admin_roles.sql`.

A first admin must be bootstrapped through a trusted server/service-role path after the corresponding Supabase Auth user exists. Do not expose the service-role key in browser code or manually hard-code it into the repository.

## Current implementation

The current admin UI supports working content creation and editing in the prototype. The database schema supports the full approval lifecycle, specialist guides, safety messages, admin roles, and role-aware RLS policies.

The browser Supabase client lives in `apps/admin/lib/supabase-browser.ts`. The server-side content repository lives in `apps/admin/lib/supabase-content.ts`.

## Security boundary

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for browser configuration when RLS is correctly enabled. `SUPABASE_SERVICE_ROLE_KEY` is server-only and must never be committed to Git or exposed through a `NEXT_PUBLIC_` environment variable.

No personal caregiver or patient health data should be introduced into the CMS tables. The CMS is for approved educational/publication content.

## Next implementation step

Replace the remaining in-memory CMS content state with authenticated Supabase reads and writes, create version-history events on review/approval/publish transitions, and add an admin-only user-management screen for inviting or deactivating Editors and Reviewers.
