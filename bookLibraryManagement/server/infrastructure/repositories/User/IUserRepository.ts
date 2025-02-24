import { User } from './../../../domain/entities/User';

export interface IUserRepository {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
}