export class Room {
  id: string;
  name: string;
  createdAt: Date;
  sharableLink: string;
  participants: string[]; // user IDs
}
