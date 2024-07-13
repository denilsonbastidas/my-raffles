import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const today = new Date();
const formattedToday = formatDate(today);

const events = [
  {
    title: " Corte de pelo",
    start: `${formattedToday}T09:00:00`,
    end: `${formattedToday}T10:00:00`,
    resourceId: "1",
  },
  {
    title: " Corte de pelo",
    start: `${formattedToday}T10:00:00`,
    end: `${formattedToday}T11:00:00`,
    resourceId: "2",
  },
  {
    title: " Tinte de cabello",
    start: `${formattedToday}T11:00:00`,
    end: `${formattedToday}T12:00:00`,
    resourceId: "3",
  },
];

const resources = [
  {
    id: "1",
    title: "Matías García",
    imageUrl: "https://picsum.photos/300",
  },
  { id: "2", title: "Sofía Reyes", imageUrl: "https://picsum.photos/300" },
  {
    id: "3",
    title: "Andrea Fuenzalida",
    imageUrl: "https://picsum.photos/300",
  },
  {
    id: "4",
    title: "Catalina Fuentes",
    imageUrl: "https://picsum.photos/300",
  },
  {
    id: "5",
    title: "Gabriel Ortiz",
    imageUrl: "https://picsum.photos/300",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderEventContent = (eventInfo: any) => {
  // seccion de como se muestra la cita agendada.
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderResourceHeader = (resource: any) => {
  // seccion de profesionales (header)
  return (
    <div className="flex flex-col items-center">
      <img
        src="src/assets/user.jpg"
        alt={resource.title}
        className="border w-12 h-12 rounded-full"
      />
      <span>{resource.title}</span>
    </div>
  );
};

export function CalendarComponent() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventDrop = (info: any) => {
    console.log("Event dropped:", info.event);
    // Aquí puedes agregar la lógica para actualizar el evento en el backend
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventResize = (info: any) => {
    console.log("Event resized:", info.event);
    // Aquí puedes agregar la lógica para actualizar el evento en el backend
  };

  return (
    <div className="p-4">
      <div className="sticky top-0 bg-white z-10">
        <h1 className="text-base text-gray-800 font-semibold mb-4">
          Calendario de citas
        </h1>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <FullCalendar
            plugins={[resourceTimeGridPlugin, interactionPlugin]}
            initialView="resourceTimeGridDay"
            resources={resources}
            events={events}
            eventContent={renderEventContent}
            resourceLabelContent={(resource) =>
              renderResourceHeader(resource.resource)
            }
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "resourceTimeGridDay",
            }}
            resourceAreaHeaderContent="Profesionales"
            editable={true}
            droppable={true}
            eventDrop={handleEventDrop}
            eventResize={handleEventResize}
            allDaySlot={false}
            locale={esLocale}
            height="auto"
            contentHeight="auto"
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarComponent;
