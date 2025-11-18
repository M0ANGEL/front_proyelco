/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal, Typography } from "antd";

// Componentes globales
import { SearchBar } from "@/components/global/SearchBar";
import { DataTable } from "@/components/global/DataTable";
import { LoadingSpinner } from "@/components/global/LoadingSpinner";
import { GlobalCard } from "@/components/global/GlobalCard";

// Tipos y servicios
import { Props } from "./types";
import { AmClientes } from "@/types/typesGlobal";
import { getCLientesNIT } from "@/services/proyectos/proyectosAPI";
import { notify } from "@/components/global/NotificationHandler";

const { Text } = Typography;

export const ModalTerceros = ({
  open,
  setOpen,
  handleSelectTercero,
}: Props) => {
  const [dataSource, setDataSource] = useState<AmClientes[]>([]);
  const [initialData, setInitialData] = useState<AmClientes[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  useEffect(() => {
    if (open) {
      setDataSource([]);
      setInitialData([]);
      setSearchValue("");
      setLoader(true);
      
      getCLientesNIT()
        .then(({ data: { data } }) => {
          setDataSource(data);
          setInitialData(data);
        })
        .catch((error) => {
          console.error("Error fetching clients:", error);
          notify.error("Error", "No se pudieron cargar los clientes");
        })
        .finally(() => {
          setLoader(false);
        });
    }
  }, [open]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    if (!value.trim()) {
      setDataSource(initialData);
      return;
    }

    const filterTable = initialData?.filter((o: any) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setDataSource(filterTable);
  };

  const handleReset = () => {
    setSearchValue("");
    setDataSource(initialData);
  };

  const handleRowClick = (record: AmClientes) => {
    handleSelectTercero(record.nit.toString(), record.emp_nombre);
    setOpen(false);
  };

  const columns = [
    {
      title: "NIT",
      dataIndex: "nit",
      key: "nit",
      align: "center" as const,
      width: 120,
      render: (nit: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {nit}
        </Text>
      ),
    },
    {
      title: "Cliente",
      dataIndex: "emp_nombre",
      key: "emp_nombre",
      render: (nombre: string) => (
        <Text>{nombre}</Text>
      ),
    },
  ];

  return (
    <Modal
      open={open}
      footer={null}
      width={800}
      title={
        <Text strong style={{ fontSize: '16px' }}>
          Seleccionar Tercero
        </Text>
      }
      keyboard={false}
      onCancel={() => setOpen(false)}
      maskClosable={false}
      destroyOnClose={true}
      styles={{
        body: { 
          padding: '16px 0',
          minHeight: '400px'
        }
      }}
    >
      <LoadingSpinner spinning={loader}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Barra de búsqueda */}
          <GlobalCard variant="default" style={{ marginBottom: 0 }}>
            <SearchBar
              onSearch={handleSearch}
              onReset={handleReset}
              placeholder="Buscar por NIT o nombre..."
              showFilterButton={false}
            />
          </GlobalCard>

          {/* Información de resultados */}
          {!loader && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">
                Total: {dataSource.length} clientes encontrados
              </Text>
              {searchValue && (
                <Text type="secondary">
                  Búsqueda: "{searchValue}"
                </Text>
              )}
            </div>
          )}

          {/* Tabla de clientes */}
          <GlobalCard variant="default" style={{ marginBottom: 0 }}>
            <DataTable
              columns={columns}
              dataSource={dataSource}
              customClassName="terceros-table"
              withPagination={true}
              stickyHeader={true}
              scroll={{ y: 300 }}
              size="small"
              loading={loader}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                style: { 
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                },
                onMouseEnter: (e: any) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                },
                onMouseLeave: (e: any) => {
                  e.currentTarget.style.backgroundColor = '';
                },
              })}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} de ${total} clientes`
              }}
            />
          </GlobalCard>

          {/* Mensaje cuando no hay resultados */}
          {!loader && dataSource.length === 0 && (
            <GlobalCard variant="default">
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: '#999'
              }}>
                <Text type="secondary">
                  {searchValue 
                    ? `No se encontraron clientes que coincidan con "${searchValue}"`
                    : 'No hay clientes disponibles'
                  }
                </Text>
              </div>
            </GlobalCard>
          )}

          {/* Instrucciones */}
          {!loader && dataSource.length > 0 && (
            <div style={{ 
              textAlign: 'center',
              padding: '8px',
              backgroundColor: '#f0f8ff',
              borderRadius: '6px',
              border: '1px solid #d6e4ff'
            }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                👆 Haz clic en cualquier fila para seleccionar el cliente
              </Text>
            </div>
          )}
        </div>
      </LoadingSpinner>
    </Modal>
  );
};