import useSessionStorage from "../../hooks/useSessionStorage";
import { FaRegCalendarXmark } from "react-icons/fa6";
import { IoDocumentsOutline } from "react-icons/io5";
import { AiFillBank, AiOutlineBarChart, AiOutlineFileDone, AiTwotoneProject } from "react-icons/ai";
import { LogoSider, SiderMenu } from "./styled";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { RiBillLine, RiDashboardLine } from "react-icons/ri";
import { UserData } from "@/services/types";
import { KEY_EMPRESA } from "@/config/api";
import Link from "antd/es/typography/Link";
import { FiUsers } from "react-icons/fi";
import { ConfigProvider } from "antd";
import { BsBank } from "react-icons/bs";
import { TfiAlarmClock } from "react-icons/tfi";
import { HiUserGroup } from "react-icons/hi";
import {
  FaRegHandshake,
  FaTruckLoading,
  FaHistory,
  FaUserTie,
  FaSync,
  FaBook,
} from "react-icons/fa";
import {
  BsCalendarRange,
  BsBuildingsFill,
  BsBuildingGear,
  BsBriefcase,
  BsBoxes,
  BsGear,
} from "react-icons/bs";
import {
  LiaClipboardListSolid,
  LiaTerminalSolid,
  LiaBarcodeSolid,
} from "react-icons/lia";
import { MdGroup, MdLocalGroceryStore, MdOutlineAddHomeWork } from "react-icons/md";
import { IoTicketOutline } from "react-icons/io5";

interface Props {
  onLoader: (value: boolean) => void;
  user?: UserData;
  collapsed: boolean;
}

const moduleIcons = [
  { cod: "GSTEMP", icon: <BsBuildingsFill /> },
  { cod: "ADMUSU", icon: <FiUsers /> },
  { cod: "CFGSIS", icon: <BsGear /> },
  { cod: "ADMBOD", icon: <BsBuildingGear /> },
  { cod: "DOCS", icon: <IoDocumentsOutline /> },
  { cod: "SLD", icon: <FaUserTie /> },
  { cod: "LPR", icon: <LiaClipboardListSolid /> },
  { cod: "TER", icon: <FaUserTie /> },
  { cod: "PRD", icon: <LiaBarcodeSolid /> },
  { cod: "LOGSIS", icon: <LiaTerminalSolid /> },
  { cod: "GSTAUD", icon: <BsBriefcase /> },
  { cod: "CTRLVEN", icon: <FaRegCalendarXmark /> },
  { cod: "GSTINV", icon: <BsBoxes /> },
  { cod: "FACELE", icon: <RiBillLine /> },
  { cod: "REP", icon: <AiOutlineBarChart /> },
  { cod: "PER", icon: <BsCalendarRange /> },
  { cod: "SYNCCON", icon: <FaSync /> },
  { cod: "KARDEX", icon: <FaHistory /> },
  { cod: "RDC", icon: <FaBook /> },
  { cod: "ALDO", icon: <FaRegHandshake /> },
  { cod: "DIST", icon: <FaTruckLoading /> },
  { cod: "GSTHUM", icon: <MdGroup /> },
  { cod: "TKS", icon: <IoTicketOutline /> },
  { cod: "GSTHUM", icon: <MdGroup /> },
  { cod: "AFJ", icon: <BsBank /> },
  { cod: "MA", icon: <TfiAlarmClock /> },
  { cod: "CLI", icon: <HiUserGroup /> },
  { cod: "PMPT", icon: <MdOutlineAddHomeWork /> },
  { cod: "COMPA", icon: <MdLocalGroceryStore /> },
  { cod: "CA", icon: <AiTwotoneProject /> },
  { cod: "DSH", icon: <RiDashboardLine  /> },
  { cod: "ACTIV", icon: <AiFillBank /> },
  { cod: "LOGI", icon:<AiOutlineFileDone  /> },
];

export const CustomMenu = ({ onLoader, user, collapsed }: Props) => {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const { getSessionVariable } = useSessionStorage();
  const [items, setItems] = useState<any[]>([]);

  const onMenuClick = ({ key }: { key: string }) => {
    if (key == "dashboard") {
      setSelectedKeys([]);
    }
    navigate(`/${key}`.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }
  
    const empresaId = getSessionVariable(KEY_EMPRESA);
    const perfil = user.perfiles.find(p => Number(p.id_empresa) === Number(empresaId));
  
    if (!perfil) {
      console.error(`No se encontró perfil para la empresa ${empresaId}`);
      setItems([]);
      return;
    }
  
    if (!perfil.menu || !Array.isArray(perfil.menu)) {
      console.error(`El perfil no tiene menú válido`);
      setItems([]);
      return;
    }
  
    const data = perfil.menu.map((modulo) => {
      if (modulo.children) {
        const children = modulo.children.map((menu) => {
          if (menu.children) {
            const children = menu.children.map((submenu) => {
              return submenu.children ? submenu : { ...submenu, onClick: onMenuClick };
            });
            return { ...menu, children };
          }
          return { ...menu, onClick: onMenuClick };
        });
        return {
          ...modulo,
          children,
          icon: moduleIcons.find(({ cod }) => cod === modulo.cod_modulo)?.icon,
        };
      }
      return {
        ...modulo,
        onClick: onMenuClick,
        icon: moduleIcons.find(({ cod }) => cod === modulo.cod_modulo)?.icon,
      };
    });
  
    setItems(data);
  }, [user]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            colorBgContainer: "#1976d2", //azul
            itemColor: "#FFFFFF",
            itemSelectedColor: "#a5a5a5ff", //color de texto selecionado
            itemHoverBg: "#0967a7",  //azul de hover
            itemHoverColor: "#FFFFFF",
            itemSelectedBg: "#FFFFFF",
            itemActiveBg: "#FFFFFF",
            popupBg: "#000000",
          },
        },
      }}
    >
      <Link
        onClick={() => {
          onMenuClick({ key: "dashboard" });
        }}
      >
        <LogoSider>
          <img src={collapsed ? "./logo_dash.png" : "./logo_dash.png"} />
        </LogoSider>
      </Link>
      <SiderMenu
        selectedKeys={selectedKeys}
        onSelect={({ selectedKeys }) => {
          const keys = selectedKeys[0].split("/");
          setSelectedKeys(keys.concat(selectedKeys));
          onLoader(true);
        }}
        openKeys={openKeys}
        onOpenChange={(openKeys) => setOpenKeys(openKeys)}
        mode="inline"
        items={items}
        inlineIndent={12}
        white_space={collapsed ? "unset" : "break-spaces"}
      />
    </ConfigProvider>
  );
};
