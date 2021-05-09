import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  BoxProps,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { ReactNode } from "react";

type ListProps<T> = BoxProps & {
  data: T[];
  isLoading?: boolean;
  error?: Error;
  renderItem: (item: T) => ReactNode;
  emptyMessage?: string | null;
};

export default function List<T>({
  data,
  isLoading,
  error,
  renderItem,
  emptyMessage = "Empty dataset",
  ...props
}: ListProps<T>) {
  if (isLoading) {
    return (
      <Box d='flex' alignItems='center' justifyContent='center' {...props}>
        <Spinner />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        {...props}
      >
        <AlertIcon boxSize='40px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          {error.name}
        </AlertTitle>
        <AlertDescription maxWidth='sm'>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (data.length === 0) {
    return (
      <Box d='flex' alignItems='center' justifyContent='center' {...props}>
        <Text fontSize='lg' textAlign='center' color='gray'>
          {emptyMessage}
        </Text>
      </Box>
    );
  }

  return (
    <Stack
      d='flex'
      flexDir='column'
      alignItems='stretch'
      justifyContent='flex-start'
      overflow-y='auto'
      {...props}
    >
      {data.map((item) => renderItem(item))}
    </Stack>
  );
}
