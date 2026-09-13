import Swal from "sweetalert2";

// Shared dark SweetAlert2 theme so every confirmation/alert matches the app's design system.
const baseCustomClass = {
  popup: "!rounded-2xl !border !border-gray-700 !bg-gray-900 !text-gray-100 !font-sans",
  title: "!text-white",
  htmlContainer: "!text-gray-300",
  confirmButton:
    "!rounded-xl !px-5 !py-2.5 !font-semibold !text-white !mx-1.5 !shadow-none",
  cancelButton:
    "!rounded-xl !px-5 !py-2.5 !font-semibold !bg-gray-700 hover:!bg-gray-600 !text-white !mx-1.5 !shadow-none",
};

const baseOptions = {
  background: "#111827",
  color: "#F3F4F6",
  buttonsStyling: false as const,
};

export const swal = Swal.mixin({
  ...baseOptions,
  customClass: {
    ...baseCustomClass,
    confirmButton: `${baseCustomClass.confirmButton} !bg-primary hover:!bg-primary-hover`,
  },
});

export const swalSuccess = Swal.mixin({
  ...baseOptions,
  customClass: {
    ...baseCustomClass,
    confirmButton: `${baseCustomClass.confirmButton} !bg-success hover:!bg-success-hover`,
  },
});

export const swalDanger = Swal.mixin({
  ...baseOptions,
  customClass: {
    ...baseCustomClass,
    confirmButton: `${baseCustomClass.confirmButton} !bg-danger hover:!bg-danger-hover`,
  },
});

export default swal;
