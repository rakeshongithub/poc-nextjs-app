import useSWR from 'swr';
import apiClient from '../utils/apiClient';

export const SwrWrapper = (props) => {
  const fetcher = async (url) =>
    await apiClient({
      url: url,
      method: method
    }).then((res) => {
      console.log(res, '=======x==++++++++++=========');
      return res.data;
    });
  const { key, method } = props;
  const { data, error } = useSWR(key, fetcher);

  return {
    error: error,
    data: !error,
    isLoading: !data
  };
};

// export default SwrWrapper;
