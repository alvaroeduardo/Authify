export interface ResetPasswordToken {
    email: string,
    iat: number,
    exp: number
}

export interface UserPayload {
    data: {
        id: string,
        name: string,
        email: string,
        password: string,
        confirmedEmail: boolean
    },
    iat: number,
    exp: number
}