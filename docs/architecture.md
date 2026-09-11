# EnVizion Life Toolkit — Working Architecture

## Product boundary

The product is an education and care-coordination toolkit. It should not diagnose, independently change prescribed treatment, or replace an individualized care plan.

## MVP surfaces

### Mobile caregiver app

Initial modules:

1. Home dashboard
2. Condition library
3. COPD guide and action-plan zones
4. Emergency tools
5. Health journal
6. Medication list
7. Care-team directory
8. Appointment preparation
9. Trusted resources

### Administration portal

Planned after the mobile foundation. It will manage approved educational content, specialist guides, resources, action-plan content and safety messaging.

## Data model direction

The content layer should be data-driven so new EnVizion Life materials can be added without redesigning the app.

Candidate entities:

- profiles
- care_profiles
- conditions
- condition_sections
- action_plans
- action_plan_zones
- specialists
- specialist_guides
- journal_entries
- vital_sign_entries
- symptom_entries
- medications
- care_team_members
- appointments
- appointment_questions
- resources
- emergency_guides
- content_versions

## Delivery order

1. App shell and design system
2. Home dashboard
3. COPD module
4. Emergency tools
5. Journal and monitoring
6. Medications
7. Care team and appointments
8. Content API/backend
9. Admin portal
10. Authentication, permissions, testing and launch hardening

## Content handling

Client source documents should remain outside the repository. The codebase should contain only application code, schemas and content that is intentionally approved for publication.
