/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormContext } from "react-hook-form";
import { Col, Row } from "antd";
import { useContext, useEffect, useMemo, useState } from "react";
import { ItemModulo, Props } from "./types";
import Tree, { DataNode, TreeProps } from "antd/es/tree";
import { GlobalContext } from "@/router/GlobalContext";

export const ModulosPerfil = ({ perfil, modulos }: Props) => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ModulosPerfil: No se encuentra en el contexto GlobalContext");
  }

  const { userGlobal } = context;  
  const methods = useFormContext();
  const [modules, setModules] = useState<ItemModulo[]>([]);
  const [selectKeysGlobal, setSelectedKeysGlobal] = useState<string[]>([]);

  useEffect(() => {
    const selectKeysGlobal: string[] = [];
    const modulesList: ItemModulo[] = modulos.map((modulo) => {
      const treeData: DataNode[] = [
        {
          key: `modulo_${modulo.id}`,
          title: modulo.nom_modulo,
          disabled: modulo.cod_modulo == 'GSTHUM' && userGlobal?.perfiles[0].nom_perfil != 'SUPER_ADMIN',
          children: modulo.menus.map((menu) => {
            return {
              key: `menu_${modulo.id}_${menu.id}`,
              title: menu.nom_menu,
              disabled: menu.estado,
              children: menu.submenus.map((submenu) => {
                return {
                  disabled: submenu.estado,
                  key: `submenu_${modulo.id}_${menu.id}_${submenu.id}`,
                  title: submenu.nom_smenu,
                };
              }),
            };
          }),
        },
      ];

      const selectedKeys: string[] = [];
      if (perfil) {
        perfil.modulos.forEach((item) => {
          if (item.id_modulo == modulo.id.toString()) {
            let key = `modulo_${item.id_modulo}`;
            if (item.menu && item.submenu) {
              key = `submenu_${item.id_modulo}_${item.id_menu}_${item.id_submenu}`;
            } else if (item.menu) {
              key = `menu_${item.id_modulo}_${item.id_menu}`;
            }
            selectedKeys.push(key);
            selectKeysGlobal.push(key);
          }
        });
      }

      return { treeData, selectedKeys };
    });
    setSelectedKeysGlobal(selectKeysGlobal);
    setModules(modulesList);
  }, [modulos, perfil]);

  useMemo(() => {
    methods.setValue("modulos", selectKeysGlobal);
  }, [selectKeysGlobal]);

  const onCheck: TreeProps["onCheck"] = (_checkedKeys, { node }) => {
    let newKeys = selectKeysGlobal;
    if (!node.checked) {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (child.children && child.children.length > 0) {
            for (const subchild of child.children) {
              if (!newKeys.some((key) => key == subchild.key.toString())) {
                newKeys = [...newKeys, subchild.key.toString()];
              }
            }
          } else {
            if (!newKeys.some((key) => key == child.key.toString())) {
              newKeys = [...newKeys, child.key.toString()];
            }
          }
        }
      } else {
        if (!newKeys.some((key) => key == node.key.toString())) {
          newKeys = [...newKeys, node.key.toString()];
        }
      }
    } else {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (child.children && child.children.length > 0) {
            for (const subchild of child.children) {
              newKeys = newKeys.filter(
                (value) => value != subchild.key.toString()
              );
            }
          } else {
            newKeys = newKeys.filter((value) => value != child.key.toString());
          }
        }
      } else {
        newKeys = newKeys.filter((value) => value != node.key.toString());
      }
    }
    setSelectedKeysGlobal(newKeys);
  };

  return (
    <>
      <Row gutter={[16, 16]} key={"row"}>
        {modules.map(({ treeData, selectedKeys }, index) => {
          return (
            <Col
              md={{ span: 6 }}
              sm={{ span: 12 }}
              xs={{ span: 24 }}
              key={`col_${index}`}
            >
              <Tree
                key={`tree_${index}`}
                checkable
                selectable={false}
                onCheck={onCheck}
                treeData={treeData}
                defaultCheckedKeys={selectedKeys.length > 0 ? selectedKeys : []}
                defaultExpandParent={false}
              />
            </Col>
          );
        })}
      </Row>
    </>
  );
};
