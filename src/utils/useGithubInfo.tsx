import { useState, useEffect } from 'react';

const apiUrl = `https://api.github.com/repos/arrow-kt/arrow`;
const storageKey = 'arrow-github-info';

export function useGithubInfo() {
  const [data, setData] = useState<{ [key: string]: unknown }>({});

  useEffect(() => {
    const fetchData = async () => {
      const localData = sessionStorage.getItem(storageKey);
      if (localData) {
        const parsedLocalData = JSON.parse(localData);
        setData(parsedLocalData);
      } else {
        const response = await fetch(apiUrl);
        const responseData = await response.json();
        sessionStorage.setItem(storageKey, JSON.stringify(responseData)); // set response in cache;
        setData(responseData);
      }
    };
    fetchData();
  }, [apiUrl]);

  return { githubInfo: data };
}
