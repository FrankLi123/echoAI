export interface Message {
    role: Role
    content: string
    isNew?: boolean
}

export type Role = "assistant" | "user"
