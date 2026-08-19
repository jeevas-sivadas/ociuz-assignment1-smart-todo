import axios from "axios";


const API_URL =
  "http://localhost:5000/api/statistics";


// =========================
// Get Statistics
// =========================

export const getStatistics =
  async (token) => {

    const response =
      await axios.get(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

    return response.data;
  };