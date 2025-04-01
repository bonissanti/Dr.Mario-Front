export type AuthResponseDTO = {
    token: string;
    refreshToken?: string;
    userUuid: string; // will be UUID
}