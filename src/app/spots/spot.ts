/* Defines the spot entity */

import {IUser} from "../users/user";
import {ISpotComment} from "./spot-comment";

export class ISpot {
    id: number;
    title: string;
    category: string;
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    description: string;
    beenHere: number;
    rating: number;
    main_image: any;
    images: any[];
    approved: boolean;
    reviewed: boolean;
    created_at: string;
    author: IUser;
    original_comments: ISpotComment[];
}
