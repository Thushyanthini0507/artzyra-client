export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  type?: "physical" | "remote";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  image?: string;
  type?: "physical" | "remote";
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  image?: string;
  type?: "physical" | "remote";
}

