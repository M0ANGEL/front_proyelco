import { Modulo, Perfil } from "@/services/types";
import { DataNode } from "antd/es/tree";

export interface Props {
    perfil: Perfil | undefined;
    modulos: Modulo[];
}

export interface ItemModulo {
    treeData: DataNode[];
    selectedKeys: string[];
}