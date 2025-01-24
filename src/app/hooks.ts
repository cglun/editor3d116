import React, { useEffect, useState } from "react";
import { AppConfig, HTTP_TYPE } from "../type";
import { APP_CONFIG } from "./config";

function getApp() {
  const appStr: string | null = localStorage.getItem("persist:root");
  if (appStr === null) {
    return;
  }
  const appJson: AppConfig = JSON.parse(JSON.parse(appStr).app);
  APP_CONFIG.TOKEN = appJson?.accessToken.data;
  APP_CONFIG.projectId = appJson.currentProjectID;
}
getApp();

const PUBLIC_URL_STR = `${APP_CONFIG.SERVER}/sources/query?projectId=${APP_CONFIG.projectId}&`;
function useFetch(url: string, type: HTTP_TYPE) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    setIsLoading(true);
    fetch(PUBLIC_URL_STR + url, {
      method: type,
      headers: {
        Authorization: `Bearer ${APP_CONFIG.TOKEN}`,
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

export function useEditorState<T>(_state: T) {
  const [editorState, setEditorState] = useState<T>(_state);

  useEffect(() => {
    setEditorState(editorState);
  }, []);
  return { editorState, setEditorState };
}

export default useFetch;
