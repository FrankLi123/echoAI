"use client"
// LoginPage.js
import { FC, useState } from "react"
import NearWallet from "./NearWallet"

const LoginPage: FC = () => {
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleLogin = () => {
        console.log("Username:", username)
        console.log("Password:", password)
    }

    return (
        <div className="mb-2">
            <h2>Login Page</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            
        </div>
    )
}

export default LoginPage
