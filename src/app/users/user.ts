export interface IUser {
    id: number;
    email: string;
		name: string;
    location: string;
		beenHereCount: number;
		spotsMarked: number;
		commentsCount: number;
    admin: boolean;
		moderator: boolean;
    banned: boolean;
    image: any;
    created_at: string;
		updated_at: string;
		auth_token: string;
}
