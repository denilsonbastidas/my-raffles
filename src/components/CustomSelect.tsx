import { useState } from "react";
import Select, { SingleValue } from "react-select";

interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onChange: (id: string, selectedOption: Option) => void;
  id: string;
}

function CustomSelect({ options, onChange, id }: Props) {
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const handleChange = (option: SingleValue<Option>) => {
    if (option) {
      setSelectedOption(option);
      onChange(id, option);
    }
  };

  return (
    <Select
      defaultValue={options[0]}
      className="w-full text-gray-800"
      value={selectedOption}
      onChange={handleChange}
      options={options}
    />
  );
}

export default CustomSelect;
