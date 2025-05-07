import { Select, Typography } from "antd";
import { Props } from "./types";
import { forwardRef } from "react";

const { Text } = Typography;

export const CustomSelect = forwardRef(({
  options,
  error,
  placeholder,
  mode,
  disabled,
  value,
  onChange,
  defaultValue,
  style,
  maxTagCount,
  listHeight
}: Props) => {
  return (
    <Select
      defaultValue={defaultValue}
      style={style}
      mode={mode}
      options={options}
      placeholder={placeholder}
      showSearch
      allowClear
      maxTagCount={maxTagCount}
      listHeight={listHeight}
      value={value}
      disabled={disabled}
      onChange={onChange}
      filterOption={(input, option) =>
        option?.label
          ? option.label.toString().toLowerCase().includes(input.toLowerCase())
          : false
      }
      optionRender={(option, index) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "95%",
            whiteSpace: "nowrap",
            overflow: "auto",
            textWrap: "wrap",
            border: "1px solid #ffc73b",
            padding: 5,
            borderRadius: 5,
          }}
          key={`${index}-div`}
        >
          <Text key={`${index}-text`} style={{ fontSize: 12 }}>
            {option.label}
          </Text>
        </div>
      )}
      status={error && "error"}
    />
  );
});
