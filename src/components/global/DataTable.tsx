// components/global/DataTable.tsx
import React from "react";
import { Table, TableProps } from "antd";

interface DataTableProps extends TableProps<any> {
  customClassName?: string;
  withPagination?: boolean;
  hasFixedColumn?: boolean; // ✅ Primera columna fija si se requiere
  stickyHeader?: boolean;    // ✅ Nueva prop para headers sticky
}

export const DataTable: React.FC<DataTableProps> = ({
  columns = [],
  dataSource = [],
  customClassName = "",
  withPagination = false,
  hasFixedColumn = false,
  stickyHeader = true, // ✅ Headers por defecto sticky
  scroll,
  ...props
}) => {
  const paginationConfig = withPagination
    ? {
        position: ["bottomRight"] as const,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total: number, range: number[]) =>
          `${range[0]}-${range[1]} de ${total} registros`,
        pageSizeOptions: ["100", "50", "20", "10"],
        defaultPageSize: 100,
      }
    : false;

  // Fijar la primera columna si se requiere
  const processedColumns =
    hasFixedColumn && columns.length > 0
      ? columns.map((col, index) => (index === 0 ? { ...col, fixed: "left" as const } : col))
      : columns;

  // Configuración de scroll: combinar scroll recibido con sticky header
  const scrollConfig = {
    x: scroll?.x || true,
    y: scroll?.y || 400,
  };

  return (
    <Table
      className={`custom-table ${customClassName}`}
      columns={processedColumns}
      dataSource={dataSource}
      pagination={paginationConfig}
      scroll={scrollConfig}
      sticky={stickyHeader} // ✅ Header sticky
      size="middle"
      {...props}
    />
  );
};
