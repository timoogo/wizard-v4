import {User} from "@/prisma/generated/client";

export interface UserFront extends User {
    [key: string]: any;
}