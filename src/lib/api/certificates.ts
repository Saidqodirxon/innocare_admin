import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface PortfolioData {
  _id?: string;
  image: ImageData;
}

export const getPortfolios = async (): Promise<PortfolioData[]> => {
  try {
    const response = await api.get("/certificates");
    console.log("Get portfolios response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Get portfolios error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolios"
    );
  }
};

export const getPortfolio = async (id: string): Promise<PortfolioData> => {
  try {
    const response = await api.get(`/certificates/${id}`);
    console.log("Get portfolio response:", response.data);

    // Ensure image is always an object
    if (response.data && response.data.image) {
      response.data.image
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Get portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch portfolio"
    );
  }
};

export const createPortfolio = async (
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Creating portfolio with data:", data);
    const response = await api.post("/certificates", data);
    console.log("Create portfolio response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create portfolio"
    );
  }
};

export const updatePortfolio = async (
  id: string,
  data: PortfolioData
): Promise<PortfolioData> => {
  try {
    console.log("Updating portfolio with data:", data);
    const response = await api.patch(`/certificates/${id}`, data);
    console.log("Update portfolio response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update portfolio"
    );
  }
};

export const deletePortfolio = async (id: string): Promise<void> => {
  try {
    await api.delete(`/certificates/${id}`);
  } catch (error: any) {
    console.error(
      "Delete portfolio error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete portfolio"
    );
  }
};
