# LMS Test Accounts

These are the hardcoded test accounts for local development and staging.
No database connection is required — credentials are validated in-memory.

---

## Manager Accounts

| Field    | Account 1                          | Account 2                            |
|----------|------------------------------------|--------------------------------------|
| Name     | Aisha Nakato                       | Ronald Mugisha                       |
| Email    | aisha.nakato@company.co.ug         | ronald.mugisha@company.co.ug         |
| Password | Manager@2025                       | Manager@2025                         |
| Branch   | Kampala Central                    | Entebbe                              |
| Routes to | `/manager` → Manager Dashboard   | `/manager` → Manager Dashboard       |

**Manager access includes:** Manager Dashboard, Loan Categories, Staff Performance, User Roles, Reports, Payroll.

---

## Staff Account

| Field    | Account                            |
|----------|------------------------------------|
| Name     | James Okello                       |
| Email    | james.okello@company.co.ug         |
| Password | Staff@2025                         |
| Branch   | Kampala Central                    |
| Routes to | `/staff` → Staff Dashboard       |

**Staff access includes:** Staff Dashboard, Loan Management, Reports.

---

## Client Accounts

| Field    | Account 1                          | Account 2                            |
|----------|------------------------------------|--------------------------------------|
| Name     | Fatuma Nalwanga                    | Sarah Kizza                          |
| Email    | fatuma.nalwanga@gmail.com          | sarah.kizza@yahoo.com                |
| Password | Client@2025                        | Client@2025                          |
| Routes to | `/client` → Client Home          | `/client` → Client Home              |

**Client access includes:** Client Home, Loan Application, Loan Repayment.

---

## Self-Registration (Sign Up)

New users can register via the **Create Account** button on the login page (`/signIn`).

- Registered accounts are stored in browser `localStorage` under the key `registeredUsers`.
- All self-registered accounts are assigned the **client** role automatically.
- Data persists across page reloads but is browser-local (no backend).

---

## Notes

- Passwords are case-sensitive.
- Invalid email or password shows an inline error message (no alert boxes).
- After login, the active user is saved in `localStorage` under `currentUser` (password excluded).
- Logging out navigates to `/logout` which returns to the login screen.
