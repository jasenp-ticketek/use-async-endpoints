import React from "react";
import axios from "axios";

export const globalRequestConfig = {
  baseURL: "https://api.github.com/search"
};

// Origin: https://medium.com/@jaryd_34198/seamless-api-requests-with-react-hooks-part-2-3ab42ba6ad5c

/**
 * Define:
 * const [ { data: addressByIdResult }, getAddressById, cancel ] = useAsyncEndpoint({
 *   url: "/GetAddressById",
 *   method: "post"
 * });
 *
 * Use:
 *   getAddressById({ data: { AddressId: selectedItem.AddressId } });
 *
 *   cancel("Some cancel message here.....");
 *
 * @param {object} config Request Configuration
 */
export const useAsyncEndpoint = (config = {}) => {
  const reqConfig = React.useRef(config);
  const sourceRef = React.useRef(axios.CancelToken.source());

  const [res, setRes] = React.useState({
    data: undefined,
    headers: undefined,
    isComplete: false,
    isPending: false,
    hasError: false,
    errorInfo: undefined,
    statusCode: undefined
  });
  const [req, setReq] = React.useState();

  React.useEffect(() => {
    let isCleanup = false;

    const cancel = sourceRef.current.cancel;
    const reqEndpoint = async () => {
      setRes({
        data: undefined,
        headers: undefined,
        isPending: true,
        hasError: false,
        isComplete: false,
        errorInfo: undefined,
        statusCode: undefined,
        statusText: undefined
      });
      try {
        const result = await axios({
          ...globalRequestConfig,
          ...reqConfig.current,
          ...req,
          cancelToken: sourceRef.current.token
        });

        if (!isCleanup) {
          setRes(() => ({
            data: result.data,
            headers: result.headers,
            isPending: false,
            hasError: false,
            isComplete: true,
            errorInfo: undefined,
            statusCode: result.status,
            statusText: result.statusText
          }));
        }
      } catch (error) {
        const commonRes = {
          headers: undefined,
          data: undefined,
          isPending: false,
          hasError: true
        };

        if (!isCleanup) {
          if (axios.isCancel(error)) {
            setRes(() => ({
              ...commonRes,
              errorInfo: error.message,
              statusText: "Canceled",
              statusCode: "499"
            }));
          } else {
            setRes(() => ({
              ...commonRes,
              headers: error.response.headers,
              errorInfo: error.response,
              statusCode: error.response.status,
              statusText: error.response.statusText,
              isComplete: true
            }));
          }
        }
      } finally {
        sourceRef.current = axios.CancelToken.source();
      }
    };

    if (!req) return;

    if (!isCleanup) {
      reqEndpoint();
    }

    return () => {
      if (!isCleanup) {
        cancel("Unmount period, cancelled.");
        sourceRef.current = axios.CancelToken.source();
      }

      isCleanup = true;
    };
  }, [req]);

  return [res, setReq, sourceRef.current.cancel];
};
