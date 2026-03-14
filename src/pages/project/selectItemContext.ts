import { createContext } from "react";

type selectIndexContext = {
    value: number,
    dispatcher?: React.Dispatch<React.SetStateAction<number>>
}

export const SelectedIndexContext = createContext<selectIndexContext>({
    value: -1,
})