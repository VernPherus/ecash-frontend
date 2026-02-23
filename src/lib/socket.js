import { io } from "socket.io-client";

// In development, connect directly to the backend dev server.
// In production, connect to the same origin so Nginx can proxy /socket.io/*
// to the backend container — no URL needs to be baked into the bundle.
const URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "";

export const socket = io(URL, { autoConnect: true, reconnection: true });
