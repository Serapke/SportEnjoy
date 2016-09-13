/* Defines the spot entity */

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
    images: any;
    approved: boolean;
    reviewed: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}
