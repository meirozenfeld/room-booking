import { UserRepo } from "../repositories/user.repo";

export async function getUserById(userId: string) {
    return UserRepo.findPublicById(userId);
}
