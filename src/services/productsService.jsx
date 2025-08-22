import { useQuery } from "@tanstack/react-query";
import { getMockProducts } from "../api/api";

export const useAllProducts = (params) => {
  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allProducts", params],
    queryFn: () => getMockProducts(params),
    keepPreviousData: true,
  });

  const { data: allProducts = [], pagination = {} } = response;

  return { allProducts, pagination, isLoading, isError, error, refetch };
};
