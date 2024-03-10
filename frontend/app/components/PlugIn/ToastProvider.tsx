import React, { createContext, useContext, useState, useCallback, ReactNode, FC } from "react"
import Toast, { ToastProps } from "./Toast"

type ToastContextType = {
    showToast: (message: string, type: ToastProps["type"]) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}

type ToastProviderProps = {
    children: ReactNode
}

export const ToastProvider: FC<ToastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<{
        message: string
        type: ToastProps["type"]
        visible: boolean
    }>({
        message: "",
        type: "info",
        visible: false,
    })

    const showToast = useCallback((message: string, type: ToastProps["type"] = "info") => {
        setToast({ message, type, visible: true })

        setTimeout(() => {
            setToast((current) => ({ ...current, visible: false }))
        }, 5000)
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && <Toast message={toast.message} type={toast.type} />}
        </ToastContext.Provider>
    )
}
