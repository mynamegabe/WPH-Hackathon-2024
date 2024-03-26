// import { FormFieldProps } from "@/types";
import { Input } from "@nextui-org/input";

export const FormField = ({
  type,
  placeholder,
  name,
  register,
  error,
  valueAsNumber,
}: {
  type: string;
  placeholder: string;
  name: string;
  register: any;
  error: any;
  valueAsNumber: boolean;
}) => (
  <>
    {/* <input
      type={type}
      placeholder={placeholder}
      {...register(name, { valueAsNumber })}
    />
    {error && <span className="error-message">{error.message}</span>} */}
    <Input
      type={type}
      label={placeholder}
      placeholder={placeholder}
      radius="sm"
      size="lg"
      labelPlacement="outside"
      {...register(name, { valueAsNumber })}
    />
    {error && <span className="text-rose-500">{error.message}</span>}
  </>
);
