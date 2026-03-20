import React, { createContext } from "react";
import type { UserNotification } from "./navigationSmall";

export const NotificationContext = createContext<{message: UserNotification | null, dispatch: React.Dispatch<React.SetStateAction<UserNotification | null>>} | null>(null)