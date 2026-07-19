import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import './App.css'
import router from "./Router/Routes";
import { RouterProvider } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserContext } from "./context/UserContext";
import axios from "axios";

axios.defaults.withCredentials = true;

// Intercept requests to redirect to local backend in development mode
axios.interceptors.request.use((config) => {
    const REMOTE_API = "https://job-portal-mc7r.vercel.app/";
    const LOCAL_API = "https://job-portal-mc7r.vercel.app/";
    if (config.url && config.url.includes(REMOTE_API)) {
        if (import.meta.env.DEV) {
            config.url = config.url.replace(REMOTE_API, LOCAL_API);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* <UserContext>
            <RouterProvider router={router}></RouterProvider>
        </UserContext> */}

        <QueryClientProvider client={queryClient}>
            <UserContext>
                <RouterProvider router={router}></RouterProvider>
            </UserContext>
        </QueryClientProvider>
    </React.StrictMode>
);
