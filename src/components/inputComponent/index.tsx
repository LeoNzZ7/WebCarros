import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps<T extends Record<string, unknown>> {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<T>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input<T extends Record<string, unknown>>({
  name,
  placeholder,
  type,
  register,
  rules,
  error
}: InputProps<T>) {
  return (
    <div>
      <input
        className="w-full border-2 rounded-md h-11 px-2"
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="my-1 text-red-500">{error}</p>}
    </div>
  )
}