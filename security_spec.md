# Security Specification: YeniEvent Firestore Rules

## 1. Data Invariants
- **Users**: A user can only access their own profile. Only admins can see the full user list.
- **Products**: Publicly readable. Only admins can create, update, or delete.
- **Teambuilding Concepts**: Publicly readable. Only admins can modify.
- **Leads**: 
  - Anyone can create a lead (anonymous or signed in).
  - If a lead has a `userId`, only that user or an admin can read it.
  - If a lead has no `userId`, it's essentially "orphan" and only admins can read it.
  - Only admins can update lead status.
- **Shared Files**:
  - Only admins can create/update metadata.
  - Anyone with the ID can read metadata (for the public link functionality).

## 2. The "Dirty Dozen" Payloads (Denial Targets)
1. **Identity Spoofing (Users)**: Attempt to update `role` to 'admin' as a regular user on `users/{uid}`.
2. **Identity Spoofing (Leads)**: Attempt to create a lead with a `userId` that is not the current user's UID.
3. **Ghost Field (Products)**: Attempt to create a product with an extra `discountedPrice` field not in the schema.
4. **Unauthorized Read (Users)**: Regular user attempting to `list` all users.
5. **Unauthorized Write (Products)**: Regular signed-in user attempting to update a product description.
6. **Bypassing Status Lock (Leads)**: Attempting to update a 'won' lead back to 'new' (once won/lost, status should be final/terminal for non-admins).
7. **Resource Poisoning (IDs)**: Attempting to create a product with an extremely long ID (1000+ chars).
8. **PII Leak (Leads)**: Non-admin trying to `list` all leads in the system.
9. **Email Spoofing**: Signed-in user with `email_verified: false` trying to create a lead.
10. **State Shortcut (Leads)**: Non-admin trying to update `items` in a lead that is already 'quoted'.
11. **Type Poisoning**: Attempting to update `views` in `shared_files` with a string instead of an integer.
12. **Shadow Field (Users)**: Adding `isInternalAdmin: true` to a user profile.

## 3. Conflict Report & Mitigation
| Feature | Risk | Mitigation |
| :--- | :--- | :--- |
| **Admin Access** | Unauthorized elevation | `get()` call to check role in `users` collection. |
| **Lead Creation** | Spam / Spoofing | `isValidLead()` helper + `request.auth.uid` validation if `userId` present. |
| **Catalog Updates** | Vandalism | Restricted to `role == 'admin'` via internal doc check. |
| **Public Links** | Private data leak | `shared_files` only contains public metadata (name, link, views). |
