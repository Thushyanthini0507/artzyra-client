export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
}

