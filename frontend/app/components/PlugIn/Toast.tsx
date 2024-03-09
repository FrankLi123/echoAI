import React from "react"

export interface ToastProps {
    message: string
    type: "info" | "success"
}

const Toast: React.FC<ToastProps> = ({ message, type }) => {
    return (
        <div className="toast toast-bottom toast-center">
            {type == "info" && (
                <div className="alert alert-info">
                    <span>{message}</span>
                </div>
            )}
            {type == "success" && (
                <div className="alert alert-success">
                    <span>{message}</span>
                </div>
            )}
        </div>
    )
}

export default Toast
