// components/global/FormTabs.tsx
import React from 'react';
import { Tabs, TabsProps, Typography } from 'antd';

const { Text } = Typography;

interface FormTabsProps extends TabsProps {
  hasErrors?: boolean;
  tabItems: Array<{
    key: string;
    label: string;
    children: React.ReactNode;
    forceRender?: boolean;
    error?: boolean;
  }>;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  hasErrors = false,
  tabItems,
  ...props
}) => {
  const items = tabItems.map(item => ({
    key: item.key,
    label: item.error || hasErrors ? (
      <Text type="danger">{item.label}</Text>
    ) : (
      <Text>{item.label}</Text>
    ),
    children: item.children,
    forceRender: item.forceRender
  }));

  return (
    <Tabs
      defaultActiveKey="1"
      items={items}
      animated
      {...props}
    />
  );
};