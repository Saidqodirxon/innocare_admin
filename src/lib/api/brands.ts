import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface BrandsData {
  _id?: string;
  name: string;
}

export const getBrands = async (id: string): Promise<BrandsData[]> => {
  try {
    const response = await api.get("/brands");
    console.log("Get Brands response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Get Brands error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Brands  "
    );
  }
};

export const getBrand = async (id: string): Promise<BrandsData> => {
  try {
    const response = await api.get(`/brands/${id}`);
    console.log("Get Brands response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Get Brands error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Brands"
    );
  }
};

export const createBrands = async (
  data: BrandsData
): Promise<BrandsData> => {
  try {
    console.log("Creating Brands with data:", data);
    const response = await api.post("/brands", data);
    console.log("Create Brands response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create Brands error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create Brands"
    );
  }
};

export const updateBrands = async (
  id: string,
  data: BrandsData
): Promise<BrandsData> => {
  try {
    console.log("Updating Brands with data:", data);
    const response = await api.patch(`/brands/${id}`, data);
    console.log("Update Brands response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update Brands error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Brands"
    );
  }
};

export const deleteBrands = async (id: string): Promise<void> => {
  try {
    await api.delete(`/brands/${id}`);
  } catch (error: any) {
    console.error(
      "Delete Brands error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete Brands"
    );
  }
};
