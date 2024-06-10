export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  likedPictures: string[];
}

export interface Picture {
  id: string;
  imageUrl: string;
  createdBy: string;
  createdAt: Date;
  likesCount: number;
  groups: string[];
  prompt?: string;
}

export interface Group {
  id: string;
  groupName: string;
  createdBy: string;
  createdAt: Date;
  isPublic: boolean;
  pictures: string[];
}
