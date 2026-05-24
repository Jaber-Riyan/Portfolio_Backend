# Portfolio CMS — Frontend Integration Guide

Complete reference for connecting any frontend (React) to this backend API.

---

## Table of Contents

1. [Setup & Base URL](#1-setup--base-url)
2. [Response Format](#2-response-format)
3. [Authentication](#3-authentication)
4. [Axios / Fetch Setup](#4-axios--fetch-setup)
5. [Static File URLs](#5-static-file-urls)
6. [Public API (No Auth)](#6-public-api-no-auth)
7. [CMS — Auth Module](#7-cms--auth-module)
8. [CMS — Hero](#8-cms--hero)
9. [CMS — About](#9-cms--about)
10. [CMS — Skills](#10-cms--skills)
11. [CMS — Experience](#11-cms--experience)
12. [CMS — Projects](#12-cms--projects)
13. [CMS — Education](#13-cms--education)
14. [CMS — Certificates](#14-cms--certificates)
15. [CMS — Reviews](#15-cms--reviews)
16. [CMS — Blogs](#16-cms--blogs)
17. [CMS — Contact](#17-cms--contact)
18. [CMS — Greeting](#18-cms--greeting)
19. [CMS — Theme](#19-cms--theme)
20. [CMS — Upload Cleanup](#20-cms--upload-cleanup)
21. [Error Reference](#21-error-reference)
22. [TypeScript Types](#22-typescript-types)

---

## 1. Setup & Base URL

```
Development:  http://localhost:5000
Production:   https://your-domain.com
```

| Route prefix   | Purpose                          | Auth required |
|----------------|----------------------------------|---------------|
| `/api/*`       | CMS operations (admin)           | Most routes   |
| `/public/*`    | Public read-only portfolio data  | No            |
| `/uploads/*`   | Static file serving              | No            |
| `/api/docs`    | Swagger UI                       | No            |

---

## 2. Response Format

Every response follows this envelope:

**Success**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error**
```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {}
}
```

**Paginated success** (projects, blogs)
```json
{
  "success": true,
  "message": "Fetched successfully",
  "data": {
    "data": [...],
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## 3. Authentication

The API uses **JWT stored in an httpOnly cookie** named `token`. There is no registration — only one admin exists (seeded via `npm run seed:admin`).

### Cookie-based (recommended)
The browser handles the cookie automatically when `withCredentials: true` is set. No manual token management needed.

### Bearer token fallback
If cookies are not available, pass the token in the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```
The token is returned in the login response `data.token` field.

### Protected routes
Any route marked **[Admin]** requires a valid session. Requests without auth return `401 Unauthorized`.

---

## 4. Axios / Fetch Setup

### Axios instance (recommended)

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000',
  withCredentials: true,           // sends the httpOnly cookie automatically
  headers: { 'Content-Type': 'application/json' },
});

// Optional: attach Bearer token when cookie is not available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Optional: redirect to /login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(err);
  },
);

export default api;
```

### Multipart helper (for file uploads)

```typescript
// Always use FormData for endpoints that accept files.
function buildFormData(body: Record<string, unknown>): FormData {
  const fd = new FormData();
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    if (value instanceof File) {
      fd.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => fd.append(key, typeof item === 'object' ? JSON.stringify(item) : String(item)));
    } else if (typeof value === 'object') {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  }
  return fd;
}
```

> **Note:** Do NOT set `Content-Type: multipart/form-data` manually. Let the browser set it with the correct boundary.

---

## 5. Static File URLs

Uploaded files are served from `/uploads/`. Build the full URL like this:

```typescript
const fileUrl = (path: string | null | undefined) =>
  path ? `${process.env.NEXT_PUBLIC_API_URL}/${path}` : null;

// Example
// path stored in DB:  "uploads/hero/abc123.jpg"
// full URL:           "http://localhost:5000/uploads/hero/abc123.jpg"
```

Upload folders:

| Folder              | Used by             |
|---------------------|---------------------|
| `uploads/hero/`     | Hero profile image  |
| `uploads/projects/` | Project thumbnails  |
| `uploads/blogs/`    | Blog cover images   |
| `uploads/reviews/`  | Reviewer avatars    |
| `uploads/greeting/` | Greeting popup img  |
| `uploads/theme/`    | Section backgrounds |

---

## 6. Public API (No Auth)

These endpoints power the public portfolio site. No authentication required.

### GET /public/all

Returns all portfolio data in a single request — ideal for SSG/SSR.

```typescript
const res = await api.get('/public/all');
const {
  hero, about, skills, experience, projects,
  education, certificates, reviews, blogs,
  contact, greeting, theme,
} = res.data.data;
```

**Response shape:**
```json
{
  "hero": { ... },
  "about": { ... },
  "skills": [ ... ],
  "experience": [ ... ],
  "projects": [ ... ],
  "education": [ ... ],
  "certificates": [ ... ],
  "reviews": [ ... ],
  "blogs": [ ... ],
  "contact": { ... },
  "greeting": { ... },
  "theme": { ... }
}
```

- `blogs` only includes `published: true` entries.
- `theme` returns the default theme object if no theme is in the database.
- Singleton fields (`hero`, `about`, `contact`, `greeting`) are `null` if not seeded.

---

### GET /public/hero

```typescript
const res = await api.get('/public/hero');
const hero = res.data.data;
```

### GET /public/about

```typescript
const res = await api.get('/public/about');
const about = res.data.data;
```

### GET /public/projects

Returns all projects sorted by `sortOrder`.

```typescript
const res = await api.get('/public/projects');
const projects = res.data.data;
```

### GET /public/theme

```typescript
const res = await api.get('/public/theme');
const theme = res.data.data;
```

---

## 7. CMS — Auth Module

### POST /api/auth/login

```typescript
const res = await api.post('/api/auth/login', {
  email: 'admin@mail.com',
  password: 'password123',
});

const { user, token } = res.data.data;
// user: { _id, email, role }
// token: JWT string (also set as httpOnly cookie automatically)
```

**Request body:**
| Field    | Type   | Required |
|----------|--------|----------|
| email    | string | Yes      |
| password | string | Yes      |

### POST /api/auth/logout

Clears the httpOnly cookie.

```typescript
await api.post('/api/auth/logout');
```

### GET /api/auth/me  `[Admin]`

Returns the currently authenticated admin user.

```typescript
const res = await api.get('/api/auth/me');
const user = res.data.data; // { _id, email, role }
```

---

## 8. CMS — Hero

### GET /api/hero

```typescript
const res = await api.get('/api/hero');
const hero = res.data.data; // null if not created yet
```

**Response data shape:**
```json
{
  "_id": "...",
  "name": "Jaber Riyan",
  "role": "Full Stack Developer",
  "description": "...",
  "profileImage": "uploads/hero/abc.jpg",
  "primaryCta": { "label": "View Work", "href": "#projects" },
  "secondaryCta": { "label": "Contact Me", "href": "#contact" },
  "socialLinks": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/...",
    "twitter": "https://twitter.com/...",
    "facebook": ""
  }
}
```

### POST /api/hero  `[Admin]`

Uses `multipart/form-data` because of `profileImage` file upload.

```typescript
const fd = new FormData();
fd.append('name', 'Jaber Riyan');
fd.append('role', 'Full Stack Developer');
fd.append('description', 'I build...');
fd.append('profileImage', fileInput.files[0]);
fd.append('primaryCta', JSON.stringify({ label: 'View Work', href: '#projects' }));
fd.append('secondaryCta', JSON.stringify({ label: 'Contact Me', href: '#contact' }));
fd.append('socialLinks', JSON.stringify({ github: 'https://github.com/...' }));

const res = await api.post('/api/hero', fd);
```

**Fields:**
| Field         | Type                    | Required |
|---------------|-------------------------|----------|
| name          | string                  | Yes      |
| role          | string                  | Yes      |
| description   | string                  | Yes      |
| profileImage  | File (image)            | Yes      |
| primaryCta    | `{ label, href }` (JSON)| Yes      |
| secondaryCta  | `{ label, href }` (JSON)| Yes      |
| socialLinks   | `{ github?, linkedin?, twitter?, facebook? }` (JSON) | No |

### PATCH /api/hero/:id  `[Admin]`

All fields optional. Send only what changes. Include file only if replacing image.

```typescript
const fd = new FormData();
fd.append('name', 'Updated Name');
// optionally: fd.append('profileImage', newFile);

const res = await api.patch(`/api/hero/${heroId}`, fd);
```

### DELETE /api/hero/:id  `[Admin]`

```typescript
await api.delete(`/api/hero/${heroId}`);
```

---

## 9. CMS — About

JSON body (no file uploads).

### GET /api/about

```typescript
const res = await api.get('/api/about');
const about = res.data.data;
```

**Response data shape:**
```json
{
  "_id": "...",
  "intro": "I'm a passionate developer...",
  "journey": "My journey started...",
  "work": "I specialize in...",
  "hobbies": "When not coding...",
  "belief": "I believe in..."
}
```

### POST /api/about  `[Admin]`

```typescript
const res = await api.post('/api/about', {
  intro: 'I\'m a passionate developer...',
  journey: 'My journey started...',
  work: 'I specialize in...',
  hobbies: 'When not coding...',
  belief: 'I believe in...',
});
```

**Fields:**
| Field   | Type   | Required |
|---------|--------|----------|
| intro   | string | Yes      |
| journey | string | Yes      |
| work    | string | Yes      |
| hobbies | string | Yes      |
| belief  | string | Yes      |

### PATCH /api/about/:id  `[Admin]`

```typescript
await api.patch(`/api/about/${aboutId}`, { intro: 'Updated intro...' });
```

### DELETE /api/about/:id  `[Admin]`

```typescript
await api.delete(`/api/about/${aboutId}`);
```

---

## 10. CMS — Skills

### GET /api/skills

Returns array of skill categories sorted by `sortOrder`.

```typescript
const res = await api.get('/api/skills');
const categories = res.data.data;
```

**Response data shape:**
```json
[
  {
    "_id": "...",
    "title": "Frontend",
    "sortOrder": 0,
    "items": [
      { "name": "React", "icon": "react" },
      { "name": "TypeScript", "icon": "typescript" }
    ]
  }
]
```

### POST /api/skills  `[Admin]`

```typescript
const res = await api.post('/api/skills', {
  title: 'Frontend',
  sortOrder: 0,
  items: [
    { name: 'React', icon: 'react' },
    { name: 'TypeScript', icon: 'typescript' },
  ],
});
```

**Fields:**
| Field     | Type                          | Required |
|-----------|-------------------------------|----------|
| title     | string                        | Yes      |
| sortOrder | number                        | No       |
| items     | `{ name: string, icon: string }[]` | No |

### PATCH /api/skills/reorder  `[Admin]`

Pass ordered array of category IDs. Updates `sortOrder` for all at once.

```typescript
await api.patch('/api/skills/reorder', {
  ids: ['id1', 'id2', 'id3'],
});
```

### PATCH /api/skills/:id  `[Admin]`

```typescript
await api.patch(`/api/skills/${categoryId}`, {
  title: 'Updated Title',
  items: [{ name: 'Vue', icon: 'vue' }],
});
```

### DELETE /api/skills/:id  `[Admin]`

```typescript
await api.delete(`/api/skills/${categoryId}`);
```

---

## 11. CMS — Experience

### GET /api/experience

```typescript
const res = await api.get('/api/experience');
const experiences = res.data.data;
```

**Response data shape:**
```json
[
  {
    "_id": "...",
    "role": "Senior Frontend Developer",
    "company": "Acme Corp",
    "companyUrl": "https://acme.com",
    "period": "2022 – Present",
    "location": "Remote",
    "description": "Led a team of...",
    "impact": ["Reduced load time by 40%", "Mentored 3 junior devs"],
    "sortOrder": 0
  }
]
```

### POST /api/experience  `[Admin]`

```typescript
const res = await api.post('/api/experience', {
  role: 'Senior Frontend Developer',
  company: 'Acme Corp',
  companyUrl: 'https://acme.com',
  period: '2022 – Present',
  location: 'Remote',
  description: 'Led a team of...',
  impact: ['Reduced load time by 40%', 'Mentored 3 junior devs'],
  sortOrder: 0,
});
```

**Fields:**
| Field       | Type       | Required |
|-------------|------------|----------|
| role        | string     | Yes      |
| company     | string     | Yes      |
| companyUrl  | string URL | No       |
| period      | string     | Yes      |
| location    | string     | Yes      |
| description | string     | Yes      |
| impact      | string[]   | No       |
| sortOrder   | number     | No       |

### PATCH /api/experience/:id  `[Admin]`

```typescript
await api.patch(`/api/experience/${expId}`, { location: 'Hybrid' });
```

### DELETE /api/experience/:id  `[Admin]`

```typescript
await api.delete(`/api/experience/${expId}`);
```

---

## 12. CMS — Projects

### GET /api/projects

Supports pagination, search, and featured filter.

```typescript
const res = await api.get('/api/projects', {
  params: {
    page: 1,
    limit: 10,
    search: 'react',    // searches title field
    featured: true,     // filter featured only
  },
});

const { data: projects, meta } = res.data.data;
```

**Query params:**
| Param    | Type    | Default | Description          |
|----------|---------|---------|----------------------|
| page     | number  | 1       | Page number          |
| limit    | number  | 10      | Items per page (max 100) |
| search   | string  | —       | Search by title      |
| featured | boolean | —       | Filter featured only |

**Response data shape:**
```json
{
  "_id": "...",
  "title": "Portfolio CMS",
  "image": "uploads/projects/abc.jpg",
  "techStack": ["React", "Node.js", "MongoDB"],
  "summary": "A full-stack CMS...",
  "description": "Detailed description...",
  "githubLinks": [
    { "label": "Frontend", "url": "https://github.com/..." },
    { "label": "Backend", "url": "https://github.com/..." }
  ],
  "live": "https://myportfolio.com",
  "featured": true,
  "sortOrder": 0
}
```

### POST /api/projects  `[Admin]`

```typescript
const fd = new FormData();
fd.append('title', 'Portfolio CMS');
fd.append('image', fileInput.files[0]);
fd.append('summary', 'A full-stack CMS...');
fd.append('description', 'Detailed description...');
// Arrays: append each item separately
['React', 'Node.js'].forEach((t) => fd.append('techStack', t));
['Frontend||https://github.com/front', 'Backend||https://github.com/back']
  // OR pass githubLinks as JSON string
fd.append('githubLinks', JSON.stringify([{ label: 'Frontend', url: 'https://github.com/...' }]));
fd.append('live', 'https://myportfolio.com');
fd.append('featured', 'true');
fd.append('sortOrder', '0');

const res = await api.post('/api/projects', fd);
```

**Fields:**
| Field       | Type                             | Required |
|-------------|----------------------------------|----------|
| title       | string                           | Yes      |
| image       | File (image)                     | No       |
| techStack   | string[]                         | No       |
| summary     | string                           | Yes      |
| description | string                           | Yes      |
| githubLinks | `{ label, url }[]` (JSON string) | No       |
| live        | string URL                       | No       |
| featured    | boolean                          | No       |
| sortOrder   | number                           | No       |

### PATCH /api/projects/reorder  `[Admin]`

```typescript
await api.patch('/api/projects/reorder', {
  ids: ['id1', 'id2', 'id3'],
});
```

### PATCH /api/projects/:id  `[Admin]`

```typescript
const fd = new FormData();
fd.append('featured', 'false');
// fd.append('image', newFile); // only if replacing image

await api.patch(`/api/projects/${projectId}`, fd);
```

### DELETE /api/projects/:id  `[Admin]`

Deletes the project **and its image file** from the server.

```typescript
await api.delete(`/api/projects/${projectId}`);
```

---

## 13. CMS — Education

### GET /api/education

```typescript
const res = await api.get('/api/education');
const educations = res.data.data;
```

**Response data shape:**
```json
[
  {
    "_id": "...",
    "degree": "B.Sc. Computer Science",
    "school": "University of Dhaka",
    "period": "2019 – 2023",
    "summary": "Focused on software engineering...",
    "sortOrder": 0
  }
]
```

### POST /api/education  `[Admin]`

```typescript
const res = await api.post('/api/education', {
  degree: 'B.Sc. Computer Science',
  school: 'University of Dhaka',
  period: '2019 – 2023',
  summary: 'Focused on software engineering...',
  sortOrder: 0,
});
```

**Fields:**
| Field     | Type   | Required |
|-----------|--------|----------|
| degree    | string | Yes      |
| school    | string | Yes      |
| period    | string | Yes      |
| summary   | string | Yes      |
| sortOrder | number | No       |

### PATCH /api/education/:id  `[Admin]`

```typescript
await api.patch(`/api/education/${eduId}`, { summary: 'Updated...' });
```

### DELETE /api/education/:id  `[Admin]`

```typescript
await api.delete(`/api/education/${eduId}`);
```

---

## 14. CMS — Certificates

### GET /api/certificates

```typescript
const res = await api.get('/api/certificates');
const certs = res.data.data;
```

**Response data shape:**
```json
[
  {
    "_id": "...",
    "title": "AWS Solutions Architect",
    "issuer": "Amazon Web Services",
    "date": "2023-06",
    "link": "https://credly.com/...",
    "learned": "Cloud architecture, serverless, and IAM...",
    "sortOrder": 0
  }
]
```

### POST /api/certificates  `[Admin]`

```typescript
const res = await api.post('/api/certificates', {
  title: 'AWS Solutions Architect',
  issuer: 'Amazon Web Services',
  date: '2023-06',
  link: 'https://credly.com/...',
  learned: 'Cloud architecture, serverless, and IAM...',
  sortOrder: 0,
});
```

**Fields:**
| Field     | Type       | Required |
|-----------|------------|----------|
| title     | string     | Yes      |
| issuer    | string     | Yes      |
| date      | string     | Yes      |
| link      | string URL | No       |
| learned   | string     | Yes      |
| sortOrder | number     | No       |

### PATCH /api/certificates/:id  `[Admin]`

```typescript
await api.patch(`/api/certificates/${certId}`, { date: '2024-01' });
```

### DELETE /api/certificates/:id  `[Admin]`

```typescript
await api.delete(`/api/certificates/${certId}`);
```

---

## 15. CMS — Reviews

### GET /api/reviews

```typescript
const res = await api.get('/api/reviews');
const reviews = res.data.data;
```

**Response data shape:**
```json
[
  {
    "_id": "...",
    "quote": "Exceptional developer who delivered...",
    "author": "Alice Johnson",
    "role": "CTO at StartupXYZ",
    "avatar": "uploads/reviews/abc.jpg",
    "featured": true,
    "sortOrder": 0
  }
]
```

### POST /api/reviews  `[Admin]`

```typescript
const fd = new FormData();
fd.append('quote', 'Exceptional developer who delivered...');
fd.append('author', 'Alice Johnson');
fd.append('role', 'CTO at StartupXYZ');
fd.append('avatar', fileInput.files[0]);
fd.append('featured', 'true');
fd.append('sortOrder', '0');

const res = await api.post('/api/reviews', fd);
```

**Fields:**
| Field     | Type         | Required |
|-----------|--------------|----------|
| quote     | string       | Yes      |
| author    | string       | Yes      |
| role      | string       | Yes      |
| avatar    | File (image) | No       |
| featured  | boolean      | No       |
| sortOrder | number       | No       |

### PATCH /api/reviews/:id  `[Admin]`

```typescript
const fd = new FormData();
fd.append('featured', 'false');
// fd.append('avatar', newFile); // only if replacing

await api.patch(`/api/reviews/${reviewId}`, fd);
```

### DELETE /api/reviews/:id  `[Admin]`

Deletes review **and its avatar file**.

```typescript
await api.delete(`/api/reviews/${reviewId}`);
```

---

## 16. CMS — Blogs

### GET /api/blogs

Supports pagination, search, and published filter.

```typescript
const res = await api.get('/api/blogs', {
  params: {
    page: 1,
    limit: 10,
    search: 'typescript',  // searches title and excerpt
    published: true,
  },
});

const { data: blogs, meta } = res.data.data;
```

**Query params:**
| Param     | Type    | Default | Description                    |
|-----------|---------|---------|--------------------------------|
| page      | number  | 1       | Page number                    |
| limit     | number  | 10      | Items per page (max 100)       |
| search    | string  | —       | Search title and excerpt       |
| published | boolean | —       | Filter by published status     |

**Response data shape:**
```json
{
  "_id": "...",
  "title": "Getting Started with TypeScript",
  "slug": "getting-started-with-typescript",
  "excerpt": "A beginner-friendly intro...",
  "body": "## Introduction\n\n...",
  "image": "uploads/blogs/abc.jpg",
  "tags": ["typescript", "javascript"],
  "link": "https://medium.com/...",
  "readTime": 5,
  "published": true,
  "draft": false,
  "sortOrder": 0
}
```

### POST /api/blogs  `[Admin]`

```typescript
const fd = new FormData();
fd.append('title', 'Getting Started with TypeScript');
// slug is auto-generated from title if omitted
fd.append('excerpt', 'A beginner-friendly intro...');
fd.append('body', '## Introduction\n\n...');
fd.append('image', fileInput.files[0]);
['typescript', 'javascript'].forEach((t) => fd.append('tags', t));
fd.append('link', 'https://medium.com/...');
fd.append('readTime', '5');
fd.append('published', 'false');
fd.append('draft', 'true');
fd.append('sortOrder', '0');

const res = await api.post('/api/blogs', fd);
```

**Fields:**
| Field     | Type         | Required | Notes                          |
|-----------|--------------|----------|--------------------------------|
| title     | string       | Yes      |                                |
| slug      | string       | No       | Auto-generated from title      |
| excerpt   | string       | Yes      |                                |
| body      | string       | Yes      | Markdown / HTML                |
| image     | File (image) | No       |                                |
| tags      | string[]     | No       |                                |
| link      | string URL   | No       | External article link          |
| readTime  | number       | No       | Minutes                        |
| published | boolean      | No       | Default: false                 |
| draft     | boolean      | No       | Default: true                  |
| sortOrder | number       | No       |                                |

### PATCH /api/blogs/publish/:id  `[Admin]`

Toggles `published` and `draft` flags atomically.

```typescript
const res = await api.patch(`/api/blogs/publish/${blogId}`);
// If was published: published=false, draft=true
// If was draft:     published=true, draft=false
```

### PATCH /api/blogs/:id  `[Admin]`

Slug auto-regenerates if `title` changes and no explicit `slug` is provided.

```typescript
const fd = new FormData();
fd.append('title', 'Updated Title');
// fd.append('image', newFile); // only if replacing

await api.patch(`/api/blogs/${blogId}`, fd);
```

### DELETE /api/blogs/:id  `[Admin]`

Deletes blog **and its image file**.

```typescript
await api.delete(`/api/blogs/${blogId}`);
```

---

## 17. CMS — Contact

### GET /api/contact

```typescript
const res = await api.get('/api/contact');
const contact = res.data.data;
```

**Response data shape:**
```json
{
  "_id": "...",
  "headline": "Let's Work Together",
  "description": "I'm open to freelance projects...",
  "email": "hello@jaberriyan.com",
  "github": "https://github.com/...",
  "linkedin": "https://linkedin.com/...",
  "twitter": "https://twitter.com/..."
}
```

### POST /api/contact  `[Admin]`

```typescript
const res = await api.post('/api/contact', {
  headline: "Let's Work Together",
  description: "I'm open to freelance projects...",
  email: 'hello@jaberriyan.com',
  github: 'https://github.com/...',
  linkedin: 'https://linkedin.com/...',
  twitter: 'https://twitter.com/...',
});
```

**Fields:**
| Field       | Type       | Required |
|-------------|------------|----------|
| headline    | string     | Yes      |
| description | string     | Yes      |
| email       | string     | Yes      |
| github      | string URL | No       |
| linkedin    | string URL | No       |
| twitter     | string URL | No       |

### PATCH /api/contact/:id  `[Admin]`

```typescript
await api.patch(`/api/contact/${contactId}`, { email: 'new@email.com' });
```

### DELETE /api/contact/:id  `[Admin]`

```typescript
await api.delete(`/api/contact/${contactId}`);
```

---

## 18. CMS — Greeting

The greeting is a popup/splash screen shown to first-time visitors.

### GET /api/greeting

```typescript
const res = await api.get('/api/greeting');
const greeting = res.data.data;
```

**Response data shape:**
```json
{
  "_id": "...",
  "enabled": true,
  "title": "Hey there!",
  "message": "Welcome to my portfolio. I'm...",
  "image": "uploads/greeting/abc.jpg",
  "bgColor": "#0f172a",
  "textColor": "#f1f5f9",
  "ctaLabel": "Explore",
  "ctaHref": "#hero"
}
```

### POST /api/greeting  `[Admin]`

```typescript
const fd = new FormData();
fd.append('enabled', 'true');
fd.append('title', 'Hey there!');
fd.append('message', 'Welcome to my portfolio...');
fd.append('image', fileInput.files[0]);
fd.append('bgColor', '#0f172a');
fd.append('textColor', '#f1f5f9');
fd.append('ctaLabel', 'Explore');
fd.append('ctaHref', '#hero');

const res = await api.post('/api/greeting', fd);
```

**Fields:**
| Field     | Type         | Required |
|-----------|--------------|----------|
| enabled   | boolean      | No       |
| title     | string       | Yes      |
| message   | string       | Yes      |
| image     | File (image) | No       |
| bgColor   | string       | No       |
| textColor | string       | No       |
| ctaLabel  | string       | Yes      |
| ctaHref   | string       | Yes      |

### PATCH /api/greeting/:id  `[Admin]`

```typescript
const fd = new FormData();
fd.append('enabled', 'false');
await api.patch(`/api/greeting/${greetingId}`, fd);
```

### DELETE /api/greeting/:id  `[Admin]`

```typescript
await api.delete(`/api/greeting/${greetingId}`);
```

---

## 19. CMS — Theme

The theme document is a **singleton** — the server auto-creates it with defaults on first GET. There is only ever one theme document.

### GET /api/theme

```typescript
const res = await api.get('/api/theme');
const theme = res.data.data;
```

**Response data shape:**
```json
{
  "_id": "...",
  "global": {
    "primary": "#6366f1",
    "secondary": "#8b5cf6",
    "background": "#0f172a",
    "text": "#f1f5f9",
    "muted": "#64748b",
    "panel": "#1e293b",
    "animationSpeed": "normal"
  },
  "sections": {
    "hero": { "bg": "#0f172a", "text": "#f1f5f9", "accent": "#6366f1", "bgImage": "" },
    "about": { "bg": "#0f172a", "text": "#f1f5f9", "accent": "#6366f1", "bgImage": "" },
    "skills": { ... },
    "experience": { ... },
    "projects": { ... },
    "education": { ... },
    "certificates": { ... },
    "reviews": { ... },
    "blogs": { ... },
    "contact": { ... }
  }
}
```

### PATCH /api/theme  `[Admin]`

Updates global theme colors. JSON body (no file).

```typescript
await api.patch('/api/theme', {
  primary: '#7c3aed',
  secondary: '#a78bfa',
  background: '#020617',
  text: '#e2e8f0',
  muted: '#475569',
  panel: '#0f172a',
  animationSpeed: 'fast',
});
```

**Global theme fields:**
| Field          | Type   | Values              |
|----------------|--------|---------------------|
| primary        | string | CSS color           |
| secondary      | string | CSS color           |
| background     | string | CSS color           |
| text           | string | CSS color           |
| muted          | string | CSS color           |
| panel          | string | CSS color           |
| animationSpeed | string | `slow/normal/fast`  |

All fields optional — send only what you want to change.

### PATCH /api/theme/:section  `[Admin]`

Updates a specific section's colors and optional background image.

**Valid section names:** `hero` `about` `skills` `experience` `projects` `education` `certificates` `reviews` `blogs` `contact`

```typescript
// Text/color update only (JSON)
await api.patch('/api/theme/hero', {
  bg: '#020617',
  text: '#e2e8f0',
  accent: '#7c3aed',
});

// With background image (multipart)
const fd = new FormData();
fd.append('bg', '#020617');
fd.append('accent', '#7c3aed');
fd.append('bgImage', fileInput.files[0]);

await api.patch('/api/theme/hero', fd);
```

**Section theme fields:**
| Field   | Type         | Required |
|---------|--------------|----------|
| bg      | string       | No       |
| text    | string       | No       |
| accent  | string       | No       |
| bgImage | File (image) | No       |

---

## 20. CMS — Upload Cleanup

Scans the `uploads/` directory and deletes any file not currently referenced in the database. Useful after bulk deletes or failed uploads.

### POST /api/upload/cleanup  `[Admin]`

```typescript
const res = await api.post('/api/upload/cleanup');
// res.data.data: { deleted: 3 }
console.log(`Deleted ${res.data.data.deleted} orphaned files`);
```

---

## 21. Error Reference

| HTTP Status | Meaning                          | When it happens                                     |
|-------------|----------------------------------|-----------------------------------------------------|
| 400         | Bad Request / Validation Error   | Missing required fields, invalid format             |
| 401         | Unauthorized                     | No token, expired token, invalid token              |
| 403         | Forbidden                        | Authenticated but not admin role                    |
| 404         | Not Found                        | Resource ID does not exist                          |
| 409         | Conflict                         | Duplicate (e.g. email already exists)               |
| 413         | Payload Too Large                | File exceeds 5 MB limit                             |
| 415         | Unsupported Media Type           | Invalid file type (only jpeg/png/gif/webp/svg)      |
| 500         | Internal Server Error            | Unexpected server error                             |

**Validation error shape:**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "field": "email",
    "message": "Valid email required"
  }
}
```

---

## 22. TypeScript Types

Copy these types into your frontend project for full type safety.

```typescript
// ============ Shared ============
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ============ Auth ============
export interface User {
  _id: string;
  email: string;
  role: 'admin';
}

export interface AuthData {
  user: User;
  token: string;
}

// ============ Hero ============
export interface CtaButton {
  label: string;
  href: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
}

export interface Hero {
  _id: string;
  name: string;
  role: string;
  description: string;
  profileImage: string;
  primaryCta: CtaButton;
  secondaryCta: CtaButton;
  socialLinks: SocialLinks;
}

// ============ About ============
export interface About {
  _id: string;
  intro: string;
  journey: string;
  work: string;
  hobbies: string;
  belief: string;
}

// ============ Skills ============
export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  _id: string;
  title: string;
  sortOrder: number;
  items: SkillItem[];
}

// ============ Experience ============
export interface Experience {
  _id: string;
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  location: string;
  description: string;
  impact: string[];
  sortOrder: number;
}

// ============ Projects ============
export interface GithubLink {
  label: string;
  url: string;
}

export interface Project {
  _id: string;
  title: string;
  image: string;
  techStack: string[];
  summary: string;
  description: string;
  githubLinks: GithubLink[];
  live?: string;
  featured: boolean;
  sortOrder: number;
}

// ============ Education ============
export interface Education {
  _id: string;
  degree: string;
  school: string;
  period: string;
  summary: string;
  sortOrder: number;
}

// ============ Certificates ============
export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
  learned: string;
  sortOrder: number;
}

// ============ Reviews ============
export interface Review {
  _id: string;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  featured: boolean;
  sortOrder: number;
}

// ============ Blogs ============
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  image: string;
  tags: string[];
  link?: string;
  readTime: number;
  published: boolean;
  draft: boolean;
  sortOrder: number;
}

// ============ Contact ============
export interface Contact {
  _id: string;
  headline: string;
  description: string;
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

// ============ Greeting ============
export interface Greeting {
  _id: string;
  enabled: boolean;
  title: string;
  message: string;
  image?: string;
  bgColor: string;
  textColor: string;
  ctaLabel: string;
  ctaHref: string;
}

// ============ Theme ============
export type SectionName =
  | 'hero' | 'about' | 'skills' | 'experience' | 'projects'
  | 'education' | 'certificates' | 'reviews' | 'blogs' | 'contact';

export interface GlobalTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  muted: string;
  panel: string;
  animationSpeed: string;
}

export interface SectionTheme {
  bg: string;
  text: string;
  accent: string;
  bgImage?: string;
}

export interface Theme {
  _id: string;
  global: GlobalTheme;
  sections: Record<SectionName, SectionTheme>;
}

// ============ Public /all ============
export interface PublicPortfolio {
  hero: Hero | null;
  about: About | null;
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  education: Education[];
  certificates: Certificate[];
  reviews: Review[];
  blogs: Blog[];
  contact: Contact | null;
  greeting: Greeting | null;
  theme: Theme;
}
```

---

## Quick Start Checklist

- [ ] Copy `.env.example` → `.env`, fill in `MONGO_URI` and `JWT_SECRET` (min 32 chars)
- [ ] `npm run seed:admin` — creates the admin account
- [ ] `npm run seed:portfolio` — populates all sections with sample data
- [ ] `npm run dev` — starts the server on port 5000
- [ ] Set `NEXT_PUBLIC_API_URL=http://localhost:5000` in your frontend `.env`
- [ ] Set `withCredentials: true` on your Axios instance (enables cookie auth)
- [ ] Login via `POST /api/auth/login` to get a session
- [ ] Use `GET /public/all` for your main portfolio page (one request = everything)
- [ ] Build image URLs as `${NEXT_PUBLIC_API_URL}/${item.image}`
- [ ] Run `POST /api/upload/cleanup` periodically to remove orphan files

---

*Swagger UI with live try-it-out is available at `http://localhost:5000/api/docs`*
