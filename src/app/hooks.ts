import React, { useEffect } from "react";
import { HTTP_TYPE } from "./type";

function useFetch(url: string, type: HTTP_TYPE) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetch("/api", {
      method: type,
      headers: {
        Authorization: `Bearer  APP_CONFIG.TOKEN`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setData(data.payload);
        //console.log(data);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]);

  return { data, isLoading, error };
}

export default useFetch;
