import Layout from "../components/Layout";
import TableCalender from "../components/TableCalender";

function Dashboard() {
  return (
    <Layout>
      <div className="p-8">
        <section className="mb-4 flex items-center justify-between">
          <article className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <img
                src="/logoCompany.svg"
                className="h-16 w-16 overflow-hidden rounded-full"
                alt="company "
              />
              <div>
                <h3 className="text-base font-medium text-gray-800">
                  Barberia el Bosque
                </h3>
                <p className="text-sm font-normal text-gray-500">
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
              className="button bg-gray-900 text-base font-medium text-white"
            >
              Mis citas
            </button>
          </article>
        </section>
        <TableCalender />
      </div>
    </Layout>
  );
}

export default Dashboard;
