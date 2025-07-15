import { API_BASE_URL } from "@/constants";

interface APIState<T> {
  data: T | undefined;
  getData: (url: string) => Promise<T | undefined>;
  postData: (url: string, body: unknown) => Promise<T | undefined>;
  putData: (url: string, body: unknown) => Promise<T | undefined>;
  deleteData: (url: string) => Promise<T | undefined>;
}

const DEFAULT_HEADERS = (accessToken?: string) => ({
  Authorization: accessToken ? `Bearer ${accessToken}` : "",
  "Content-Type": "application/json",
});

const ApiClient = <T,>(baseUrl?: string): APIState<T> => {
  let data: T | undefined = undefined; // ← keep data in closure scope

  const getData = async (url: string) => {
    try {
      const res = await fetch(`${baseUrl ?? API_BASE_URL}${url}`, {
        method: "GET",
        headers: DEFAULT_HEADERS(),
      });

      if (!res.ok) {
        const error = await res.json();
        return error;
      }
      data = await res.json();
      return data;
    } catch (err) {
      console.error("GET failed:", err);
      return undefined;
    }
  };

  const postData = async (url: string, body: unknown) => {
    try {
      const res = await fetch(`${baseUrl ?? API_BASE_URL}${url}`, {
        method: "POST",
        headers: DEFAULT_HEADERS(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        return error;
      }
      data = await res.json();
      return data;
    } catch (err) {
      console.error("POST failed:", err);
      return err;
    }
  };

  const putData = async (url: string, body: unknown) => {
    try {
      const res = await fetch(`${baseUrl ?? API_BASE_URL}${url}`, {
        method: "PUT",
        headers: DEFAULT_HEADERS(),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const error = await res.json();
        return error;
      }
      data = await res.json();
      return data;
    } catch (err) {
      console.error("PUT failed:", err);
      return undefined;
    }
  };

  const deleteData = async (url: string) => {
    try {
      const res = await fetch(`${baseUrl ?? API_BASE_URL}${url}`, {
        method: "DELETE",
        headers: DEFAULT_HEADERS(),
      });

      if (!res.ok) {
        const error = await res.json();
        return error;
      }
      data = await res.json();
      return data;
    } catch (err) {
      console.error("DELETE failed:", err);
      return undefined;
    }
  };

  return {
    get data() {
      return data;
    },
    getData,
    postData,
    putData,
    deleteData,
  };
};

export default ApiClient;
