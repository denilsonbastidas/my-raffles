// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Layout from "../components/Layout";
import TableCalender from "../components/TableCalender";

function Dashboard() {
  return (
    <Layout>
      <div className=" p-8">
        <section className="flex justify-between items-center mb-4">
          <article className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <img
                src="/logoCompany.svg"
                className="rounded-full overflow-hidden w-16 h-16"
                alt="company image"
              />
              <div>
                <h3 className="text-base text-gray-800 font-medium">
                  Barberia el Bosque
                </h3>
                <p className="text-sm text-gray-500 font-normal">
                  Av. las delicias
                </p>
              </div>
            </div>
            {/* <FaChevronLeft className="text-gray-700 cursor-pointer" />
            <FaChevronRight className="text-gray-700 cursor-pointer" />

            <p className="text-2xl font-semibold text-gray-700">
              Jueves, 06 mayo 2024
            </p> */}
          </article>

          <article>
            <button
              type="button"
              className="button bg-gray-900 text-white font-medium text-base"
            >
              My dates
            </button>
          </article>
        </section>
        <TableCalender />
      </div>
    </Layout>
  );
}

export default Dashboard;
