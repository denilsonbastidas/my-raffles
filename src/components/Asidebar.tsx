import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import ProfileHeader from "./ProfileHeader";
import CustomSelect from "./CustomSelect";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface Props {
  mobile?: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const optionsBranch = [
  { value: "delicias", label: "Av Delicias" },
  { value: "calle paez", label: "Calle Paez" },
  { value: "aviadores", label: "Los Aviadores" },
];

const optionsCustomerService = [
  { value: "corte basico", label: "Corte Basico" },
  { value: "corte premium", label: "Corte Premium" },
];

const optionsProfessional = [
  { value: "deivis cortez", label: "Deivis Cortez" },
  { value: "jose duarte", label: "Jose Duarte" },
  { value: "rod armedia", label: "Rodner armedia" },
];

const optionsTime = [
  { value: "08:00", label: "08:00 AM" },
  { value: "09:00", label: "09:00 AM" },
  { value: "10:00", label: "08:00 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "12:00", label: "12:00 AM" },
  { value: "13:00", label: "13:00 PM" },
  { value: "14:00", label: "14:00 PM" },
  { value: "15:00", label: "15:00 PM" },
];

interface ContentAsideType {
  isOpen: boolean;
}
const ContentAside = ({ isOpen }: ContentAsideType) => {
  const [date, setDate] = useState<Date>(new Date());

  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const [selectedValues, setSelectedValues] = useState({
    branch: optionsBranch[0],
    customerService: optionsCustomerService[0],
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (id: string, option: any) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [id]: option,
    }));
    console.log(`Selected ${id}:`, option);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = (date: any) => {
    setDate(date);
  };
  return (
    <section
      className={`p-6 mt-6 flex flex-col gap-6  ${isOpen ? "block" : "hidden"}`}
    >
      <div className="border-b border-gray-500 pb-2">
        <ProfileHeader
          email="testwr01@mailinator.com"
          picture="https://picsum.photos/200"
        />
      </div>
      <section>
        <h4 className="text-base text-gray-50 font-semibold mb-5">
          Welcome! Schedule Your Appointment
        </h4>

        <div className="flex flex-col gap-4">
          <article className="flex flex-col items-start">
            <label
              htmlFor="branch"
              className="text-gray-300 font-medium text-base mb-1"
            >
              Select the branch
            </label>
            <CustomSelect
              id="branch"
              onChange={handleChange}
              options={optionsBranch}
            />
          </article>

          <article className="flex flex-col items-start mb-3">
            <label
              htmlFor="customer service"
              className="text-gray-300 font-medium text-base mb-1"
            >
              Customer service
            </label>
            <CustomSelect
              id="customerService"
              onChange={handleChange}
              options={optionsCustomerService}
            />
          </article>

          <article className="flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-1">
              <label
                htmlFor="customer service"
                className="text-gray-300 font-medium text-base mb-1"
              >
                Professionals
              </label>

              <div className="flex -space-x-3">
                <img
                  className="w-7 h-7 rounded-full border-2 overflow-hidden"
                  src="https://picsum.photos/300"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 overflow-hidden"
                  src="https://picsum.photos/100"
                />
                <img
                  className="w-7 h-7 rounded-full border-2 overflow-hidden"
                  src="https://picsum.photos/50"
                />
              </div>
            </div>
            <CustomSelect
              id="professional"
              onChange={handleChange}
              options={optionsProfessional}
            />
          </article>

          <article className="text-gray-800">
            <Calendar
              onChange={onChange}
              value={date}
              minDate={firstDayOfMonth}
              maxDate={lastDayOfMonth}
              tileDisabled={({ date }) => {
                return (
                  date.getMonth() !== new Date().getMonth() ||
                  (date < new Date() && date.getDate() !== new Date().getDate())
                );
              }}
            />
          </article>

          <article className="flex flex-col items-start mb-3">
            <label
              htmlFor="customer service"
              className="text-gray-300 font-medium text-base mb-1"
            >
              Available times
            </label>
            <CustomSelect
              id="times"
              onChange={handleChange}
              options={optionsTime}
            />
          </article>

          <button
            className="button font-semibold text-base bg-primary-400"
            type="button"
          >
            Schedule Now
          </button>
        </div>
      </section>
    </section>
  );
};

function Asidebar({ mobile, isOpen, toggleSidebar }: Props) {
  if (mobile) {
    return (
      <nav
        className={`fixed inset-0 z-40 flex w-full justify-center gap-10 p-4 bg-gray-900 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        <button onClick={toggleSidebar} className="absolute top-4 right-4">
          <FaTimes className="text-white" />
        </button>
        <section className="flex flex-col text-white">
          <ContentAside isOpen={isOpen} />
        </section>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed inset-y-0 left-0 z-30  bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? "w-96" : "w-16"
      }`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-10 transform translate-x-full"
      >
        {isOpen ? (
          <FaChevronLeft className="text-white" />
        ) : (
          <FaChevronRight className="text-white" />
        )}
      </button>
      <ContentAside isOpen={isOpen} />
    </nav>
  );
}

export default Asidebar;
