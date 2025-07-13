import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  friendCode: string;
  createdAt: string;
}

interface LoginData {
  users: User[];
  nextId: number;
}

const LOGIN_FILE = path.join(process.cwd(), 'login.json');

// Initialize login.json if it doesn't exist
async function initializeLoginFile() {
  try {
    await fs.access(LOGIN_FILE);
  } catch {
    const initialData: LoginData = {
      users: [],
      nextId: 1
    };
    await fs.writeFile(LOGIN_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read user data from login.json
async function readUserData(): Promise<LoginData> {
  await initializeLoginFile();
  const data = await fs.readFile(LOGIN_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write user data to login.json
async function writeUserData(data: LoginData): Promise<void> {
  await fs.writeFile(LOGIN_FILE, JSON.stringify(data, null, 2));
}

// Generate unique friend code
function generateFriendCode(): string {
  return 'GD' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Check if username is available
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const data = await readUserData();
  return !data.users.some(user => user.username.toLowerCase() === username.toLowerCase());
}

// Check if email is already registered
export async function isEmailAvailable(email: string): Promise<boolean> {
  const data = await readUserData();
  return !data.users.some(user => user.email.toLowerCase() === email.toLowerCase());
}

// Register new user
export async function registerUser(username: string, email: string, password: string): Promise<User | null> {
  const data = await readUserData();
  
  // Check if username or email already exists
  if (!await isUsernameAvailable(username)) {
    throw new Error('Username is already taken');
  }
  
  if (!await isEmailAvailable(email)) {
    throw new Error('Email is already registered');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser: User = {
    id: data.nextId,
    username,
    email,
    password: hashedPassword,
    friendCode: generateFriendCode(),
    createdAt: new Date().toISOString()
  };
  
  // Add user to data
  data.users.push(newUser);
  data.nextId++;
  
  // Save to file
  await writeUserData(data);
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

// Login user
export async function loginUser(username: string, password: string): Promise<User | null> {
  const data = await readUserData();
  
  // Find user by username
  const user = data.users.find(u => u.username.toLowerCase() === username.toLowerCase());
  
  if (!user) {
    return null;
  }
  
  // Check password
  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const data = await readUserData();
  const user = data.users.find(u => u.id === id);
  
  if (!user) {
    return null;
  }
  
  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}