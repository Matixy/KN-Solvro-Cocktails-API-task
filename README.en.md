### 🌐
**[ 🇵🇱 ](./README.md)** | **[ 🇬🇧 ]**

---

# 🍹 Cocktail Manager API

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Matixy/KN-Solvro-Cocktails-API-task)

An API built in the **REST API** standard for managing cocktails, ingredients, and categories.

## 🚀 Live Demo

The application has been deployed to a production environment.

👉 **[Swagger Documentation (Render)](https://kn-solvro-cocktails-api-task.onrender.com/api#/)**

> The database is powered by the [Neon.tech](https://neon.tech/) platform. Read (`GET`) endpoints are public, but to test state-modifying operations, use the login credentials below in the `/auth/login` endpoint.

**Test accounts (password for each account is: `Password123!`):**
- `admin@cocktails.local` (Role: **ADMIN** – dictionary management, full access)
- `bartender@cocktails.local` (Role: **USER** – cocktail creation, editing own cocktails)
- `guest@cocktails.local` (Role: **USER** – test account)

---

## 🎯 Requirements Fulfillment

✅ Full **CRUD** for cocktails and ingredients (additionally extended with categories). </br>
✅ **Relational database** PostgreSQL handled by prisma ORM. </br>
✅ Generic **pagination**, advanced **sorting** and **filtering**. </br>
✅ Input **data validation** using DTOs and `class-validator` (including URL parsing). </br>
✅ **JWT Authorization** with role division (USER / ADMIN). </br>
✅ **Resource ownership:** Only the author or an administrator can edit/delete a cocktail. </br>
✅ **Automated e2e tests** using the Supertest library. </br>
✅ Generated **Swagger OpenAPI** documentation. 

---

## 🗄 Database Schema

The architecture is based on a relational model incorporating *nested writes* operations (writing to multiple tables in a single ACID transaction).

![Database Schema](./docs/db_schema.png)

---

## 🔐 Permissions Architecture and RBAC (Role-Based Access Control)

The system implements security rules based on roles and identity. The access logic for individual tables is as follows:

### 1. Data Read
All listing (`findAll`) and detail-fetching (`findOne`) endpoints for cocktails, ingredients, and categories are **public**. Guests can freely browse the menu without a JWT token.

### 2. Ingredients and Categories
These are dictionary data constituting the core of the application.
- **Creation, editing, deletion:** Reserved **for the `ADMIN` role** (protected by a custom `@RolesGuard`).

### 3. Cocktails
Community-generated data.
- **Creation:** Available to any logged-in user (role `USER` or `ADMIN`). The author's identifier is extracted directly from the JWT token.
- **Editing and Deletion:** Available **only** to the actual author of a given recipe or an administrator (enforced at the business logic rules level).

---

## 🔍 Searching, Filtering, and Sorting

Listing endpoints have been equipped with a URL query system featuring type transformation (`class-transformer`):

*   **Single-column sorting:** Secured with strongly typed Enums. It enables sorting by name, creation date, boolean flags, and for cocktails – native relational sorting by **the associated category name**.
*   **Advanced ingredient filtering:** Searching by name, alcohol-free filtering, and time intervals.
*   **Advanced cocktail filtering:** The ability to search cocktails by name, category ID, *category name*, time intervals, alcohol-free filtering - the system enters the associative tables `CocktailIngredient` and verifies ingredients using `some`/`none` instructions.

---

## Seed Data

- **3 Categories:** Classic, Tropical, Empty.
- **5 Ingredients:** Vodka (with alcohol), Rum (with alcohol), Lime Juice, Sugar Syrup, Mint.
- **3 Users:** With bcrypt-hashed passwords - `Password123!` (Admin, Bartender, Guest).
- **3 Cocktails:** 
  - *Mojito* (Creator: Admin).
  - *Daiquiri* (Creator: Bartender).
  - *Vodka Gimlet* (Creator: Admin).

---

## 🧪 Test Scenarios (End-to-End)

The project includes an e2e test file (`test/app.e2e-spec.ts`) written using the **Supertest** library.

**Tested scenarios:**

### **Administrator Operations (categories and ingredients):**
1. 🔴 Blocking a standard user (`USER`) from creating a category (expected: `403 Forbidden`).
2. 🟢 Allowing an administrator (`ADMIN`) to create a new category (expected: `201 Created`).
3. 🟢 Allowing an administrator (`ADMIN`) to create a new ingredient (expected: `201 Created`).

### **User Operations (cocktail management):**
4. 🔴 Blocking an unauthenticated guest from creating a cocktail (expected: `401 Unauthorized`).
5. 🟢 Allowing a logged-in user (`USER`) to create a cocktail with attached ingredient relations (expected: `201 Created`).
6. 🟢 Public access (for everyone) to read the generated list of cocktails (expected: `200 OK`).
7. 🟢 Allowing a creator (`USER`) to update their **own** cocktail (expected: `200 OK`).
8. 🔴 Blocking a user (`USER`) from attempting to overwrite a cocktail created by someone else / an administrator (expected: `403 Forbidden`).
9. 🟢 Allowing a creator (`USER`) to delete their **own** cocktail (expected: `204 No Content`).

---

## 💻 Local Setup Instructions

### Prerequisites
- **Node.js** (version 20+)
- **Docker** and **Docker Compose**

### 1. Clone the repository
```bash
git clone https://github.com/Matixy/KN-Solvro-Cocktails-API-task.git
cd KN-Solvro-Cocktails-API-task