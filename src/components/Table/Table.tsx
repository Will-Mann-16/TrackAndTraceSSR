import React, { Ref, useMemo } from "react";
import {
  useTable,
  TableOptions,
  useBlockLayout,
  useAbsoluteLayout,
  useFlexLayout,
  useSortBy,
  useGlobalFilter,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  TableInstance,
} from "react-table";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  forwardRef,
  Input,
  Spinner,
  Table as ChakraTable,
  TableCaption,
  TableProps as ChakraTableProps,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";

type TableProps<T extends object> = TableOptions<T> &
  ChakraTableProps & {
    caption?: string;
    layout?: "table" | "block" | "flex" | "absolute";
    tableRef: Ref<HTMLTableElement>;
    isLoading?: boolean;
    error?: Error;
    sort?: boolean;
    search?: boolean;
  };

export default function Table<T extends object>({
  data,
  columns,
  autoResetHiddenColumns,
  defaultColumn,
  getRowId,
  getSubRows,
  initialState,
  stateReducer,
  useControlledState,
  caption,
  layout = "table",
  tableRef: ref,
  isLoading,
  error,
  sort,
  search,
  css,
  ...props
}: TableProps<T>): JSX.Element {
  const plugins = useMemo(() => {
    const plugins = [];
    if (search) {
      plugins.push(useGlobalFilter);
    }
    if (sort) {
      plugins.push(useSortBy);
    }
    switch (layout) {
      case "block":
        plugins.push(useBlockLayout);
        break;
      case "flex":
        plugins.push(useFlexLayout);
        break;
      case "absolute":
        plugins.push(useAbsoluteLayout);
        break;
    }

    return plugins;
  }, [layout]);

  const tableInstance = useTable<T>(
    {
      columns,
      data,
      autoResetHiddenColumns,
      defaultColumn,
      getRowId,
      getSubRows,
      initialState,
      stateReducer,
      useControlledState,
    },
    ...plugins
  );

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

  switch (layout) {
    case "block":
    case "flex":
      const {
        style: tableStyle,
        ...tableProps
      } = tableInstance.getTableProps();
      const {
        style: tableBodyStyle,
        ...tableBodyProps
      } = tableInstance.getTableBodyProps();
      return (
        <Box
          d='flex'
          alignItems='center'
          justifyContent='center'
          flexDir='column'
          ref={ref}
        >
          {caption && (
            <Text textAlign='center' fontSize='xl' fontWeight='500'>
              {caption}
            </Text>
          )}
          {search && (
            <Input
              placeholder='Search...'
              w='100%'
              value={
                (tableInstance.state as UseGlobalFiltersState<T>).globalFilter
              }
              setGlobalFilter={
                (tableInstance as TableInstance<T> &
                  UseGlobalFiltersInstanceProps<T>).setGlobalFilter
              }
            />
          )}
          <Box d='inline-block' sx={tableStyle} {...tableProps}>
            <Box>
              {tableInstance.headerGroups.map((headerGroup) => {
                const {
                  style,
                  ...headerGroupProps
                } = headerGroup.getHeaderGroupProps();
                return (
                  <Box sx={style} {...headerGroupProps}>
                    {headerGroup.headers.map((column) => {
                      const { style, ...headerProps } = column.getHeaderProps();
                      return (
                        <Box
                          textTransform='uppercase'
                          fontWeight='bold'
                          fontFamily='heading'
                          letterSpacing='wider'
                          textAlign='start'
                          paddingInline={4}
                          pt={1}
                          pb={1}
                          lineHeight='4'
                          fontSize='xs'
                          color='gray.400'
                          sx={style}
                          {...headerProps}
                        >
                          {column.render("Header")}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
            <Box
              overflowY='auto'
              sx={tableBodyStyle}
              {...props}
              {...tableBodyProps}
            >
              {tableInstance.rows.map((row) => {
                tableInstance.prepareRow(row);
                const { style, ...rowProps } = row.getRowProps();
                return (
                  <Box
                    borderTopColor={useColorModeValue(
                      "gray.300",
                      "whiteAlpha.300"
                    )}
                    borderTopWidth='thin'
                    sx={style}
                    {...rowProps}
                  >
                    {row.cells.map((cell) => {
                      const { style, ...cellProps } = cell.getCellProps();
                      return (
                        <Box
                          paddingInline={4}
                          pt={1}
                          pb={1}
                          lineHeight='4'
                          fontSize='md'
                          verticalAlign='middle'
                          sx={style}
                          {...cellProps}
                        >
                          {cell.render("Cell")}
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      );
    case "table":
      return (
        <ChakraTable
          ref={ref}
          variant='simple'
          {...props}
          {...tableInstance.getTableProps()}
        >
          {caption && <TableCaption placement='top'>{caption}</TableCaption>}
          {search && (
            <Input
              placeholder='Search...'
              w='100%'
              value={
                (tableInstance.state as UseGlobalFiltersState<T>).globalFilter
              }
              setGlobalFilter={
                (tableInstance as TableInstance<T> &
                  UseGlobalFiltersInstanceProps<T>).setGlobalFilter
              }
            />
          )}
          <Thead>
            {tableInstance.headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...tableInstance.getTableBodyProps()}>
            {tableInstance.rows.map((row) => {
              tableInstance.prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </ChakraTable>
      );
  }
}
