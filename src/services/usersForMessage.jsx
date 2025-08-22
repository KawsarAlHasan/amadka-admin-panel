import { useQuery } from "@tanstack/react-query";
import {  getMockUsersForMessages } from "../api/api";

export const useUsersForMessage = () => {
  const {
    data: usersForMessage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["usersForMessage"],
    queryFn: getMockUsersForMessages,
  });

  return { usersForMessage, isLoading, isError, error, refetch };
};
