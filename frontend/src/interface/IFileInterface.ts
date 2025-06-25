export interface Ifile {
  id: number;
  name: string;
  src: string;
  size: number;
  type: string;
  iv: string;
  encryptedAesKey: string;
  keyIv: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}
