# NIJI — Social Media Platform

A full-stack social media web application built with Django REST Framework and React, featuring real-time notifications via WebSocket.

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![Django](https://img.shields.io/badge/Django-6.0-green?logo=django)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![WebSocket](https://img.shields.io/badge/WebSocket-Django%20Channels-red)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

# Features

- **Authentication** — Register, login, logout with JWT (access + refresh token)
- **Posts** — Create, edit, delete posts with multiple image uploads
- **Feed** — View all posts or only posts from followed users
- **Likes & Comments** — Like posts, comment with nested replies
- **Follow System** — Follow/unfollow users, view followers/following lists
- **User Profile** — View and edit profile, avatar upload
- **Search** — Search users by username
- **Real-time Notifications** — Instant notifications via WebSocket when someone likes, comments, or follows you
- **Notification Management** — Mark individual or all notifications as read

---

# Tech Stack

# Backend
| Technology | Purpose |
|---|---|
| Django 6.0 | Web framework |
| Django REST Framework | REST API |
| Django Channels + Daphne | WebSocket / ASGI server |
| SimpleJWT | JWT Authentication |
| SQLite | Database (development) |
| Pillow | Image handling |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Bootstrap Icons | Icon library |

---

## Project Structure

```
NIJI_PROJECT/
├── accounts/          # User auth & profile
├── posts/             # Posts, likes, comments
├── socials/           # Follow system
├── notifications/     # Real-time notifications
├── niji/              # Django settings, urls, asgi
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── services/
│       └── router/
└── media/             # Uploaded images
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/your-username/niji-project.git
cd niji-project

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start the server (Daphne for WebSocket support)
daphne niji.asgi:application
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login, returns JWT tokens |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET | `/api/auth/me/` | Get current user profile |
| PATCH | `/api/auth/update/` | Update profile |

### Posts
| Method | Endpoint | Description |
| GET | `/api/posts/` | Get all posts |
| POST | `/api/posts/create/` | Create a post |
| GET | `/api/posts/:id/` | Get post detail |
| PUT | `/api/posts/:id/update/` | Update a post |
| DELETE | `/api/posts/:id/delete/` | Delete a post |
| POST | `/api/posts/:id/like/` | Toggle like |
| POST | `/api/posts/:id/comment/` | Add comment |
| GET | `/api/posts/feed/` | Get feed (followed users) |

### Social
| Method | Endpoint | Description |
| POST | `/api/social/follow/:username/` | Follow/unfollow user |
| GET | `/api/social/followers/:username/` | Get followers list |
| GET | `/api/social/following/:username/` | Get following list |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications/` | Get notifications |
| POST | `/api/notifications/read/` | Mark all as read |
| POST | `/api/notifications/:id/read/` | Mark one as read |

### WebSocket
```
ws://localhost:8000/ws/notifications/?token=<access_token>
```

---

## Real-time Notifications

Notifications are pushed instantly via WebSocket when:
- Someone **likes** your post
- Someone **comments** on your post
- Someone **follows** you

The WebSocket connection is authenticated using JWT token passed as a query parameter.

---

## Author

**Dam Quang Phuong**
- GitHub: [@quangphuong0004-lang](https://github.com/quangphuong0004-lang)

---

## License

This project is for educational purposes.