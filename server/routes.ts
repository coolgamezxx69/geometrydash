import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerUser, loginUser, isUsernameAvailable, getUserById } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (username.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters" });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const user = await registerUser(username, email, password);
      
      if (!user) {
        return res.status(500).json({ error: "Failed to create user" });
      }
      
      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          friendCode: user.friendCode,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.log(`Registration error: ${error?.message}`);
      res.status(400).json({ error: error?.message || 'Registration failed' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
      }

      const user = await loginUser(username, password);
      
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          friendCode: user.friendCode,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.log(`Login error: ${error?.message}`);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    if (req.session) {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ error: "Logout failed" });
        }
        res.json({ success: true });
      });
    } else {
      res.json({ success: true });
    }
  });

  app.get("/api/auth/check-username", async (req, res) => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ error: "Username is required" });
      }

      const available = await isUsernameAvailable(username);
      res.json({ available });
    } catch (error: any) {
      console.log(`Username check error: ${error?.message}`);
      res.status(500).json({ error: "Failed to check username" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await getUserById(req.session.userId);
      
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json({ 
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          friendCode: user.friendCode,
          createdAt: user.createdAt
        }
      });
    } catch (error: any) {
      console.log(`Get user error: ${error?.message}`);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
