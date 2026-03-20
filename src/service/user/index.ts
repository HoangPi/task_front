import { changePassword, createUser, getNotification, getUsersByEmail, handleNotification, logIn, updateInvitation, updateUser, VerifyUserSession } from "./userService";

export const UserService = {
    logIn,
    VerifyUserSession,
    updateUser,
    changePassword,
    createUser,
    getNotification,
    updateInvitation,
    handleNotification,
    getUsersByEmail
}