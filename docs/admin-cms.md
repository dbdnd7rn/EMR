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

## Current implementation

The current admin UI supports working content creation and editing in the prototype. The database schema now supports the full approval lifecycle plus specialist guides and safety messages.

The server-side Supabase repository lives in `apps/admin/lib/supabase-content.ts`. It uses server-only environment variables and must never be imported into browser/client code.

## Security boundary

There are intentionally no Supabase client-side write policies yet. Before persistent CMS writes are enabled, the project needs:

1. authenticated EnVizion Life admin users
2. explicit admin/editor/reviewer roles
3. row-level-security policies for those roles
4. audit/version history for changes and approvals
5. confirmation of who is allowed to approve clinical and safety content

`SUPABASE_SERVICE_ROLE_KEY` is server-only. A real key must never be committed to Git or exposed through a `NEXT_PUBLIC_` environment variable.

## Next implementation step

Add Supabase Auth for administrators, define role authorization, then expose narrowly scoped authenticated server actions that call the server-only content repository. After that, replace prototype in-memory content state with persistent database-backed content.
