import React, { useContext, useEffect } from "react";
import { HTTP_TYPE } from "./type";
import { MyContext } from "./MyContext";

export default function useFetch(url: string, type: HTTP_TYPE) {
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

export function useUpdateScene() {
  const { scene, dispatchScene } = useContext(MyContext);
  function updateScene(payload: any) {
    dispatchScene({ type: "setScene", payload: payload });
  }
  return { scene, updateScene };
}
