type LoadingPropsType = {
  message?: string;
};

export default function Loading({ message }: LoadingPropsType) {
  return (
    <div className="flex h-96 flex-col items-center justify-center">
      <div className="w-full flex-col justify-center">
        <div className="flex justify-center">
          <img
            className="animate-spin"
            src="/logoCompany.svg"
            alt="Logo"
            width="75"
            height="75"
          />
        </div>
        <div className="text-center">
          <div className="text-gray-300">{message || "Cargando..."}</div>
        </div>
      </div>
    </div>
  );
}
