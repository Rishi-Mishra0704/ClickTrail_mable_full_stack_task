# ClickTrail – Mable Full-Stack Developer Task (17/07/2025)

## 📌 Overview

**ClickTrail** is a complete full-stack analytics pipeline built for Mable's hiring task. It includes an e-commerce demo frontend, a robust backend using Go and ClickHouse, a tracking script using the Web APIs, and a Grafana dashboard.

---

## 🚀 Deployment Choices

### ⚡ Frontend – Vercel
The frontend is deployed on **Vercel**.

> Although the original task mentioned using Cloudflare Workers for deployment, I chose Vercel due to the **lack of solid documentation for deploying Remix apps on Workers**.  
> I **spent several hours trying different approaches**, but there was **no clear or reliable way to get it working smoothly**.  
> If there's a proper method, I would genuinely **love to learn** about it.
>
> Vercel, on the other hand, provided **seamless integration with Remix and GitHub**, which made deployment quick and hassle-free.
---

## 🧠 Backend Framework Decision

The backend is built using **Gin**, but I would have preferred **Echo** for the following reason:

> While Gin offers simplicity and good performance, it lacks **explicit error handling** in handler signatures, which Echo supports.

**Example:**

```go
// Gin
func (s *Server) SomeHandler(c *gin.Context) {
    // No way to return an error explicitly
}

// Echo
func (s *Server) SomeHandler(c echo.Context) error {
    // Explicit error return, more control
    return c.JSON(http.StatusOK, someData)
}
```
This makes Echo better suited for writing clean, testable, and debuggable business logic, especially when handling multiple failure scenarios.

## 📁 Repository Structure

```
.
├── api         # Golang backend with Gin & ClickHouse
├── ecommerce   # Remix-based frontend (React 18 + Zustand + Tailwind )
├── script      # Standalone tracking script
├── links       # Walkthrough video and Grafana dashboard URLs
```

---

## 🤖 Features

### Frontend (`/ecommerce`)

* Built with **Remix**, **React 18**, **Zustand**, **Tailwind CSS**, **TypeScript**, **ShadCN**
* Features:

  * Signup, Login
  * Product listing
  * Add to Cart
  * Simulated Checkout
* JWT-based auth
* Deployed on **Vercel**

### Backend (`/api`)

* Developed using **Go** and **Gin Gonic**
* Endpoints:

  * `POST /auth/signup`
  * `POST /auth/login`
  * `POST /events/add`
  * `GET /events/stats`
  * `GET /health`
* Uses **ClickHouse** for event analytics storage
* Implements **JWT** tokens with secure expiration and hashing
* Deployed on **Render**

### Tracking Script (`/script`)

* Built using **Standard Web APIs**
* Tracks:

  * Page Views
  * Click Events
  * Add to Cart
  * Checkout
  * Purchase Events
* Captures:

  * User Agent, Timestamp, Device Info, Event Type
  * Cart data
* Sends event data to `/events/add` API

### Analytics Dashboard (`Grafana`)

* ClickHouse powers the analytics layer
* Grafana board displays:

  * Average Session Length (proxy via timestamp gaps)
  * Top URLs by Events
  * Events per session
  * Avg Time Between Events (Top 10 Sessions)
  * Event Types Over Time
* Public link included in `links/links.txt`

---

## 🛠️ Tech Stack

| Layer      | Stack                                      | 
| ---------- | ----------------------------------         |
| Frontend   | Remix, React 18, Zustand, Tailwind,ShadCN  |
| Backend    | Go, Gin Gonic                              |
| Database   | ClickHouse                                 |
| Tracking   | Vanilla JS (Standard Web APIs)             |
| Deployment | Vercel, Render                             |
| Monitoring | Grafana + ClickHouse                       |

---

## 🔗 Links

See `./links/links.txt` for:

* 🎥 Walkthrough Video
* 📊 Grafana Dashboard
* 🌐 Live Frontend URL

---

## 📊 Observability

* Event ingestion via `/events/add` endpoint
* Aggregated inside **ClickHouse**
* Visualized in **Grafana**
* Dashboards show usage patterns and breakdown of event types

---

## 🧐 Author

**Rishi Mishra**
Fullstack Engineer | 3 Years 7 Months EXP
[GitHub](https://github.com/Rishi-Mishra0704)

---

## 📜 License
[LICENSE](./LICENSE)

