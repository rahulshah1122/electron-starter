// Utility functions
const HealthPostApp = {
  // Toast notifications
  showToast: function (title, message, type = "info", duration = 3000) {
    const toastContainer = document.querySelector(".toast-container") || this.createToastContainer()

    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-header">
        <div class="toast-title">${title}</div>
        <button class="toast-close">&times;</button>
      </div>
      <div class="toast-body">${message}</div>
    `

    toastContainer.appendChild(toast)

    // Show the toast
    setTimeout(() => {
      toast.classList.add("show")
    }, 10)

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }, duration)

    // Close button
    toast.querySelector(".toast-close").addEventListener("click", () => {
      toast.classList.remove("show")
      setTimeout(() => {
        toast.remove()
      }, 300)
    })
  },

  createToastContainer: () => {
    const container = document.createElement("div")
    container.className = "toast-container"
    document.body.appendChild(container)
    return container
  },

  // Local storage helpers
  saveToStorage: (key, data) => {
    localStorage.setItem(key, JSON.stringify(data))
  },

  getFromStorage: (key, defaultValue = []) => {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  },

  // Modal/Dialog
  openModal: (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.add("active")
    }
  },

  closeModal: (modalId) => {
    const modal = document.getElementById(modalId)
    if (modal) {
      modal.classList.remove("active")
    }
  },

  // Tabs
  initTabs: () => {
    document.querySelectorAll(".tab-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const tabsContainer = trigger.closest(".tabs")
        const targetId = trigger.getAttribute("data-tab")

        // Update active trigger
        tabsContainer.querySelectorAll(".tab-trigger").forEach((t) => {
          t.classList.remove("active")
        })
        trigger.classList.add("active")

        // Update active content
        tabsContainer.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })
        tabsContainer.querySelector(`.tab-content[data-tab="${targetId}"]`).classList.add("active")
      })
    })
  },

  // Mobile sidebar toggle
  initSidebar: () => {
    const toggleBtn = document.getElementById("sidebar-toggle")
    const sidebar = document.querySelector(".sidebar")

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active")
      })
    }
  },

  // Authentication
  login: (username, password, role) => {
    // In a real app, this would validate against a server
    // For demo purposes, we'll use hardcoded credentials
    const credentials = {
      registration: { username: "registration", password: "password" },
      pharmacy: { username: "pharmacy", password: "password" },
      laboratory: { username: "laboratory", password: "password" },
    }

    if (credentials[role] && credentials[role].username === username && credentials[role].password === password) {
      // Store login state
      sessionStorage.setItem(
        "healthpost_auth",
        JSON.stringify({
          role: role,
          username: username,
          loggedIn: true,
        }),
      )
      return true
    }

    return false
  },

  logout: () => {
    sessionStorage.removeItem("healthpost_auth")
    window.location.href = "index.html"
  },

  isLoggedIn: () => {
    const auth = sessionStorage.getItem("healthpost_auth")
    return auth ? JSON.parse(auth).loggedIn : false
  },

  getCurrentRole: () => {
    const auth = sessionStorage.getItem("healthpost_auth")
    return auth ? JSON.parse(auth).role : null
  },

  // Initialize app
  init: function () {
    this.initTabs()
    this.initSidebar()

    // Check if user is logged in for protected pages
    if (document.body.classList.contains("protected-page")) {
      if (!this.isLoggedIn()) {
        window.location.href = "index.html"
      }
    }

    // Logout buttons
    document.querySelectorAll(".logout-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        this.logout()
      })
    })
  },
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  HealthPostApp.init()
})

