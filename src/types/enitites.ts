export interface User {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  likedPictures: string[];
  profilePic: string;
  pictureGroups: PictureGroup[];
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

export interface PictureGroup {
  id: string;
  name: string;
  pictures: Picture[];
  isPrivate: boolean;
}
