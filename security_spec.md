# Security Specification & Test Suite

## 1. Data Invariants

1. **Authentication & Identity**: Every write operation (user profile creation/update, message submission, project like, guestbook entry) requires an authenticated user with verified email (`request.auth.token.email_verified == true`).
2. **User Profile Isolation (PII Protection)**: `/users/{userId}` can only be read and updated by the user whose UID matches `{userId}`, or by an authenticated admin (`shiwanshusingh153@gmail.com`). Users cannot alter their own `id` or elevate their own privileges to `admin`.
3. **Contact Messages (The Master Gate)**: `/users/{userId}/messages/{messageId}` can only be created by the owner `{userId}`. `userId` in document payload MUST match `request.auth.uid`. Messages are immutable once created (users cannot modify sent message texts or alter `createdAt`), and only the recipient/admin or the author can read their messages.
4. **Project Likes**: `/projects/{projectId}/likes/{userId}` can only be created or deleted by the user where `{userId} == request.auth.uid`. Field `userId` must match `request.auth.uid`, and `projectId` must match path.
5. **Guestbook Signatures**: `/guestbook/{entryId}` can be read publicly. Writes require verified Google Sign-In, `incoming().userId == request.auth.uid`, size limits (3–500 chars), and no modification after creation except deletion by the author or admin.
6. **Temporal & Boundary Integrity**: All `createdAt` fields must be bound to `request.time`. All string fields must adhere to maximum length boundaries to prevent Denial-of-Wallet attacks.

---

## 2. The "Dirty Dozen" Malicious Payloads

1. **Payload 1 (Ghost Field / Shadow Field Injection in User)**:
   Attempting to inject `isAdmin: true` into `/users/victim_123`.
   ```json
   {
     "id": "victim_123",
     "email": "user@example.com",
     "displayName": "Hacker",
     "isAdmin": true,
     "createdAt": "2026-10-14T00:00:00Z",
     "lastLoginAt": "2026-10-14T00:00:00Z"
   }
   ```
2. **Payload 2 (Cross-User Profile Hijacking)**:
   Authenticated user `attacker_uid` writing to `/users/victim_uid`.
   ```json
   {
     "id": "victim_uid",
     "email": "victim@example.com",
     "displayName": "Impersonator"
   }
   ```
3. **Payload 3 (Unverified Email Spoofing)**:
   Attempting to write with unverified email token (`email_verified: false`).
   ```json
   {
     "id": "unverified_uid",
     "email": "shiwanshusingh153@gmail.com"
   }
   ```
4. **Payload 4 (Orphaned Message / UID Mismatch)**:
   User `user_abc` attempting to submit a message claiming `userId: "admin_xyz"`:
   ```json
   {
     "id": "msg_1",
     "userId": "admin_xyz",
     "name": "Spoofed Sender",
     "email": "spoof@domain.com",
     "message": "Forged inquiry message",
     "status": "sent",
     "createdAt": "2026-10-14T10:00:00Z"
   }
   ```
5. **Payload 5 (Denial of Wallet String Injection in Message)**:
   Message with payload exceeding 3000-character volumetric boundary.
   ```json
   {
     "id": "msg_huge",
     "userId": "user_abc",
     "name": "Spammer",
     "email": "spam@example.com",
     "message": "<100,000 characters junk string>",
     "status": "sent"
   }
   ```
6. **Payload 6 (Client Timestamp Tampering in Message)**:
   Providing a fabricated past/future timestamp instead of `request.time`.
   ```json
   {
     "id": "msg_time",
     "userId": "user_abc",
     "name": "Time Traveler",
     "email": "time@example.com",
     "message": "Message with fake timestamp",
     "status": "sent",
     "createdAt": "1999-01-01T00:00:00Z"
   }
   ```
7. **Payload 7 (Post-Creation Message Tampering)**:
   Updating message body or changing sender after initial dispatch.
   ```json
   {
     "message": "Tampered content after submission",
     "userId": "new_owner"
   }
   ```
8. **Payload 8 (Project Like Cross-User Forgery)**:
   User `user_1` liking project on behalf of `user_2`.
   Path: `/projects/proj-1/likes/user_2`
   ```json
   {
     "projectId": "proj-1",
     "userId": "user_2",
     "userDisplayName": "User 2"
   }
   ```
9. **Payload 9 (Project Like Mismatched Path Invariant)**:
   Liking project with payload `projectId: "proj-different"` on path `/projects/proj-1/likes/user_1`.
   ```json
   {
     "projectId": "proj-different",
     "userId": "user_1",
     "userDisplayName": "User 1"
   }
   ```
10. **Payload 10 (Guestbook Impersonation)**:
    User `attacker_uid` signing guestbook with `userId: "victim_uid"`.
    ```json
    {
      "id": "gb_123",
      "userId": "victim_uid",
      "userName": "Victim",
      "message": "Fake endorsement"
    }
    ```
11. **Payload 11 (Blanket Unauthenticated Profile Scraping)**:
    Unauthenticated caller attempting to list all `/users` documents.
12. **Payload 12 (Path Injection / ID Poisoning)**:
    Targeting path with malicious traversal or 10KB junk ID:
    `/users/../../admins` or path with `/users/{oversized_id_3000_chars}`.

---

## 3. Test Runner (firestore.rules.test.ts)

A test specification suite validating that all 12 dirty payloads are denied:
See `tests/firestore.rules.test.ts`.
