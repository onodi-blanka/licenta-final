export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  likedPictures: string[];
  profilePic: string;
}

export interface Picture {
  id: string;
  imageUrl: string;
  createdBy: {
    userId: string;
    userEmail: string;
  };
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
