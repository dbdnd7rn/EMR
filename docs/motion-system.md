# EnVizion Life Motion System

## Goal
Motion should make the caregiver toolkit feel calm, modern, and understandable without making urgent health information feel playful or distracting.

## Motion principles

1. **Calm first** — use short fades, small vertical movement, and restrained spring feedback.
2. **Meaningful motion** — animate navigation, selection, save confirmation, and progress changes rather than decorating every element.
3. **Emergency clarity** — emergency content should enter clearly and quickly; no looping or attention-stealing effects.
4. **Clinical restraint** — Green/Yellow/Red action-plan zones use ordered entrance motion, not flashing or bouncing.
5. **Accessible by default** — respect the device reduced-motion preference and remove non-essential movement when it is enabled.

## Current implementation

- Screen fade/slide entrance
- Staggered home-card reveal
- Press-scale feedback on interactive cards and buttons
- Animated condition-library rows
- Staggered COPD action-plan zones
- Staggered B.E. F.A.S.T. emergency rows
- Save confirmation pulse for journal, vital-sign, and medication actions
- Progress response for hospital-to-home checklist
- Animated question-set transition in appointment preparation
- Reduced-motion support through React Native AccessibilityInfo

## Later enhancements

- EnVizion logo reveal on launch
- Shared-element-like transition into condition details
- Animated progress ring for care-plan completion
- Gentle timeline transitions in the health journal
- Admin-preview motion toggle for content editors

Motion should remain subtle enough for older adults, stressed caregivers, and users with accessibility needs.
