import { createContext } from "react";
import { type ToastState } from "./notification";

export const ToastContext = createContext<
    {
        data: ToastState | null,
        dispatcher: React.Dispatch<React.SetStateAction<ToastState | null>>
    } | null>(null)