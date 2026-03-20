import { changePassword, createUser, logIn, updateUser, VerifyUserSession } from "./userService";

export const UserService = {
    logIn,
    VerifyUserSession,
    updateUser,
    changePassword,
    createUser
}