type MyInputProps = {
  label: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
  value: string;
};

const MyInput = ({ label, handleChange, type, value }: MyInputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <input
        type={type}
        onChange={handleChange}
        value={value}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default MyInput;
