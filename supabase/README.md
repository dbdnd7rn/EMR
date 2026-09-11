# Supabase backend foundation

This folder starts the backend as a content platform first.

## Current scope

The first migration stores only publishable EnVizion Life educational content:

- conditions
- condition sections
- specialist references
- action plans and zones
- trusted resources
- content-version metadata

Published educational content is readable through row-level-security policies. Client-side write access is intentionally not enabled yet.

## Intentionally not stored yet

Personal caregiver and patient data is not persisted in the backend at this stage. The mobile prototype currently keeps journal entries, vital readings, and medication entries in local in-memory state.

Before personal health information is persisted, the project needs confirmed decisions for:

- whether identifiable health information will be stored
- caregiver-to-care-recipient relationships
- one caregiver managing multiple people and/or shared caregiving
- hosting region and service providers
- access-control model
- retention and deletion rules
- security logging and incident response
- U.S. healthcare privacy/compliance requirements where applicable
- consent and disclosure language

## Next backend step

After those decisions are confirmed, add authenticated profile and care-data tables with explicit RLS policies, then connect the mobile app and administration portal.
