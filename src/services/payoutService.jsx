import { useQuery } from "@tanstack/react-query";
import { getMockPayouts } from "../api/api";

export const usePayments = () => {
  const {
    data: paymentsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paymentsData"],
    queryFn: getMockPayouts,
  });

  return { paymentsData, isLoading, isError, error, refetch };
};
