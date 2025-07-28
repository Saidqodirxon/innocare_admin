import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface ServiceData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  about_uz?: string;
  about_ru?: string;
  about_en?: string;
  is_view?: boolean;
  categoryId: string;
  brandId: string;
  image: ImageData[];
  file: {
    url: string;
    id: string;
  }
  video?: string;
  link_1?: string;
  link_2?: string;
  link_3?: string;
  is_visible: boolean;
}

export const getServices = async (
  endpoint: string,
  filters: {
    categoryId?: string;
    q?: string;
    is_visible?: boolean;
    is_view?: boolean;
  } = {}
): Promise<{
  data: ServiceData[];
  total: number;
  offset: number;
  limit: number;
}> => {
  try {
    // Build query string from filters
    const query = new URLSearchParams();
    if (filters.categoryId) {
      query.append("categoryId", filters.categoryId);
    }
    if (filters.is_visible !== undefined) {
      query.append("is_visible", filters.is_visible.toString());
    }
    if (filters.is_view !== undefined) {
      query.append("is_view", filters.is_view.toString());
    }
    if (filters.q) {
      console.log("Query string:", filters.q);

      query.append("q", filters.q);
    }

    const queryString = query.toString();
    console.log("Fetching products with query:", `/products?${queryString}`);

    const response = await api.get(`/products?${queryString}`);
    console.log("Get products response:", response.data);

    // Ensure response.data is an array
    const responseData = Array.isArray(response.data) ? response.data : [];

    // Normalize image field to ensure it's always an array
    const normalizedServices = responseData.map((service: ServiceData) => ({
      ...service,
      image: Array.isArray(service.image)
        ? service.image
        : service.image
          ? [service.image]
          : [],
    }));

    // Return paginated result
    return {
      data: normalizedServices,
      total: response.data?.pageInfo?.total ?? 0,
      offset: response.data?.pageInfo?.offset ?? 0,
      limit: response.data?.pageInfo?.limit ?? 0,
    };
  } catch (error: any) {
    console.error(
      "Get products error:",
      error.response?.data || error.message,
      { filters, endpoint }
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch products"
    );
  }
};

// Other functions remain unchanged
export const getService = async (id: string): Promise<ServiceData> => {
  try {
    const response = await api.get(`/products/${id}`);
    console.log("Get service response:", response.data);

    // Ensure image is always an array
    if (response.data && !Array.isArray(response.data.image)) {
      response.data.image = response.data.image ? [response.data.image] : [];
    }

    return response.data;
  } catch (error: any) {
    console.error("Get service error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch service");
  }
};

export const createService = async (
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Creating service with data:", data);
    const response = await api.post("/products", data);
    console.log("Create service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create service"
    );
  }
};

export const updateService = async (
  id: string,
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Updating service with data:", data);
    const response = await api.patch(`/products/${id}`, data);
    console.log("Update service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update service"
    );
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error: any) {
    console.error(
      "Delete service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete service"
    );
  }
};
