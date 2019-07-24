import React, { useCallback } from "react";
import axios from "axios";

export const globalRequestConfig = {
  baseURL: "https://api.github.com/search"
};

// Origin: https://medium.com/@jaryd_34198/seamless-api-requests-with-react-hooks-part-2-3ab42ba6ad5c
/**   repositories?q=
 * Define:
 * const [{ data: addressByIdResult }, getAddressById] = useAsyncEndpoint({
 *   url: "/GetAddressById",
 *   method: "post"
 * });
 *
 * Use:
 *   getAddressById({ data: { AddressId: selectedItem.AddressId } });
 *
 * @param {object} config Request Configuration
 */

export const useAsyncEndpoint = (config = {}) => {
  const reqConfig = React.useRef(config);
  const sourceRef = React.useRef(axios.CancelToken.source());

  const [res, setRes] = React.useState({
    data: undefined,
    isComplete: false,
    isPending: false,
    hasError: false,
    errorInfo: undefined,
    statusCode: undefined
  });
  const [req, setReq] = React.useState();

  // const setReqqq = useCallback(args => {
  //   setReq(args);
  // }, []);
  React.useEffect(() => {
    let didCancel = false;
    console.log("runrunrun");
    const cancel = sourceRef.current.cancel;
    const reqEndpoint = async () => {
      setRes({
        data: undefined,
        isPending: true,
        hasError: false,
        isComplete: false,
        errorInfo: undefined,
        statusCode: undefined
      });
      try {
        const result = await axios({
          ...globalRequestConfig,
          ...reqConfig.current,
          ...req,
          cancelToken: sourceRef.current.token
        });
        if (!didCancel) {
          setRes(() => ({
            data: result.data,
            isPending: false,
            hasError: false,
            isComplete: true,
            errorInfo: undefined,
            statusCode: result.status
          }));
        }
      } catch (error) {
        const commonRes = {
          data: undefined,
          isPending: false,
          hasError: true
        };
        if (!didCancel) {
          if (axios.isCancel(error)) {
            console.log("error 111111 ", error.message);
            setRes(() => ({
              ...commonRes,
              errorInfo: error.message,
              statusCode: "499"
            }));
          } else {
            setRes(() => ({
              ...commonRes,
              errorInfo: error,
              statusCode: error.response.status,
              isComplete: true
            }));
          }
        }
      } finally {
        sourceRef.current = axios.CancelToken.source();
      }
    };

    if (!req) return;

    reqEndpoint();

    return () => {
      didCancel = true;
      if (!didCancel) {
        console.log("unununun");
        cancel("Unmount page, cancelled.");
      }
    };
  }, [req]);

  return {
    res,
    setReq,
    cancel: sourceRef.current.cancel
  };
};
