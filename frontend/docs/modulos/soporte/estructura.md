# Módulo Soporte Frontend - Estructura y Código (React)

## 📁 Estructura de Carpetas Completa

```
src/
└── modules/
    └── soporte/
        ├── components/
        │   ├── tickets/
        │   │   ├── TicketTable.jsx
        │   │   ├── TicketForm.jsx
        │   │   ├── TicketStatusBadge.jsx
        │   │   ├── TicketPriorityBadge.jsx
        │   │   ├── TicketCategoryBadge.jsx
        │   │   ├── TicketFilters.jsx
        │   │   └── TicketStats.jsx
        │   ├── conversation/
        │   │   ├── ConversationThread.jsx
        │   │   ├── MessageInput.jsx
        │   │   ├── MessageItem.jsx
        │   │   └── AttachmentList.jsx
        │   ├── audit/
        │   │   └── AuditTimeline.jsx
        │   ├── sla/
        │   │   ├── SLAIndicator.jsx
        │   │   └── SLAList.jsx
        │   ├── dashboard/
        │   │   └── SupportDashboardCards.jsx
        │   └── common/
        │       ├── SupportHeader.jsx
        │       ├── ConfirmModal.jsx
        │       └── ProtectedLayout.jsx
        ├── pages/
        │   ├── TicketList.jsx
        │   ├── TicketDetail.jsx
        │   ├── TicketForm.jsx
        │   ├── SupportDashboard.jsx
        │   ├── SLAList.jsx
        │   └── EscalationPanel.jsx
        ├── hooks/
        │   ├── useTickets.js
        │   ├── useTicket.js
        │   ├── useConversation.js
        │   ├── useSLA.js
        │   └── useSupportDashboard.js
        ├── context/
        │   ├── SupportContext.jsx
        │   └── SupportProvider.jsx
        ├── services/
        │   └── soporteService.js
        ├── utils/
        │   ├── ticketHelpers.js
        │   ├── slaHelpers.js
        │   └── validationSchemas.js
        ├── constants/
        │   ├── ticketStatuses.js
        │   ├── ticketPriorities.js
        │   ├── ticketCategories.js
        │   └── slaLevels.js
        ├── styles/
        │   ├── soporte.module.css
        │   ├── tickets.module.css
        │   ├── conversation.module.css
        │   ├── sla.module.css
        │   └── dashboard.module.css
        └── __tests__/
            ├── pages/
            │   ├── TicketList.test.jsx
            │   ├── TicketDetail.test.jsx
            │   └── SupportDashboard.test.jsx
            ├── components/
            │   ├── TicketTable.test.jsx
            │   ├── ConversationThread.test.jsx
            │   └── SLAIndicator.test.jsx
            ├── hooks/
            │   ├── useTickets.test.js
            │   └── useConversation.test.js
            └── services/
                └── soporteService.test.js
```

---

## 📄 Ejemplos de Código y Flujos

### 1. Listado de Tickets

```jsx
// pages/TicketList.jsx
import React from "react";
import { useTickets } from "../hooks/useTickets";
import TicketTable from "../components/tickets/TicketTable";
import TicketFilters from "../components/tickets/TicketFilters";
import TicketStats from "../components/tickets/TicketStats";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import PageHeader from "@/components/common/PageHeader";
import styles from "../styles/tickets.module.css";

const TicketList = () => {
  const { tickets, loading, error, filters, setFilters, refetch } =
    useTickets();

  const handleCreateTicket = () => {
    // Navegación a formulario de alta de ticket
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className={styles.ticketListContainer}>
      <PageHeader
        title="Gestión de Tickets"
        subtitle="Incidencias y peticiones de soporte"
        actions={
          <Button variant="primary" onClick={handleCreateTicket} icon="plus">
            Nuevo Ticket
          </Button>
        }
      />

      <TicketStats data={tickets} />

      <TicketFilters filters={filters} onFilterChange={setFilters} />

      <TicketTable
        tickets={tickets}
        onView={(id) => {
          /* ... */
        }}
        onAssign={(id) => {
          /* ... */
        }}
        onClose={(id) => {
          /* ... */
        }}
      />
    </div>
  );
};
export default TicketList;
```

---

### 2. Detalle de Ticket y Conversación

```jsx
// pages/TicketDetail.jsx
import React from "react";
import { useTicket } from "../hooks/useTicket";
import ConversationThread from "../components/conversation/ConversationThread";
import AuditTimeline from "../components/audit/AuditTimeline";
import AttachmentList from "../components/conversation/AttachmentList";
import SLAIndicator from "../components/sla/SLAIndicator";
import Button from "@/components/common/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Tabs from "@/components/common/Tabs";
import styles from "../styles/tickets.module.css";

const TicketDetail = ({ ticketId }) => {
  const { ticket, loading, error, refetch } = useTicket(ticketId);
  const [activeTab, setActiveTab] = React.useState("conversation");

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!ticket) return <div>Ticket no encontrado</div>;

  return (
    <div className={styles.ticketDetailContainer}>
      <header className={styles.ticketHeader}>
        <h2>{ticket.titulo}</h2>
        <SLAIndicator sla={ticket.sla} />
        {/* ...badges de estado, prioridad, categoría... */}
      </header>
      <Tabs
        tabs={[
          { id: "conversation", label: "Conversación" },
          { id: "historial", label: "Historial" },
          { id: "adjuntos", label: "Adjuntos" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
      <div className={styles.tabContent}>
        {activeTab === "conversation" && (
          <ConversationThread ticketId={ticketId} />
        )}
        {activeTab === "historial" && <AuditTimeline ticketId={ticketId} />}
        {activeTab === "adjuntos" && <AttachmentList ticketId={ticketId} />}
      </div>
    </div>
  );
};
export default TicketDetail;
```

---

### 3. Hook de Tickets

```js
// hooks/useTickets.js
import { useState, useEffect } from "react";
import { soporteService } from "../services/soporteService";

export const useTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await soporteService.getTickets(filters);
      setTickets(res.data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  return {
    tickets,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchTickets,
  };
};
```

---

### 4. Servicio API de Soporte

```js
// services/soporteService.js
import axios from "axios";

export const soporteService = {
  getTickets: (filters) =>
    axios.get("/api/v1/support/tickets", { params: filters }),
  getTicket: (id) => axios.get(`/api/v1/support/tickets/${id}`),
  createTicket: (data) => axios.post("/api/v1/support/tickets", data),
  addMessage: (id, data) =>
    axios.post(`/api/v1/support/tickets/${id}/messages`, data),
  // ...otros métodos
};
```

---

### 5. Constantes del Módulo

```js
// constants/ticketStatuses.js
export const TICKET_STATUSES = [
  { value: "abierto", label: "Abierto", color: "#10b981" },
  { value: "en_progreso", label: "En Progreso", color: "#f59e0b" },
  { value: "resuelto", label: "Resuelto", color: "#6366f1" },
  { value: "cerrado", label: "Cerrado", color: "#ef4444" },
];
```

---

### 6. Rutas del Módulo

```jsx
// routes/soporteRoutes.jsx
import React, { lazy } from "react";
import { Route } from "react-router-dom";
import { SupportProvider } from "../modules/soporte/context/SupportProvider";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const TicketList = lazy(() => import("../modules/soporte/pages/TicketList"));
const TicketDetail = lazy(
  () => import("../modules/soporte/pages/TicketDetail"),
);
const TicketForm = lazy(() => import("../modules/soporte/pages/TicketForm"));
const SupportDashboard = lazy(
  () => import("../modules/soporte/pages/SupportDashboard"),
);
const SLAList = lazy(() => import("../modules/soporte/pages/SLAList"));
const EscalationPanel = lazy(
  () => import("../modules/soporte/pages/EscalationPanel"),
);

const soporteRoutes = (
  <Route
    path="/soporte"
    element={
      <SupportProvider>
        <ProtectedRoute requiredPermission="soporte.tickets.view" />
      </SupportProvider>
    }
  >
    <Route index element={<TicketList />} />
    <Route path="tickets" element={<TicketList />} />
    <Route path="tickets/nuevo" element={<TicketForm />} />
    <Route path="tickets/:id" element={<TicketDetail />} />
    <Route path="tickets/:id/editar" element={<TicketForm />} />
    <Route path="dashboard" element={<SupportDashboard />} />
    <Route path="sla" element={<SLAList />} />
    <Route path="escalados" element={<EscalationPanel />} />
  </Route>
);

export default soporteRoutes;
```

---

## 📦 Dependencias Específicas del Módulo

```json
{
  "dependencies": {
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.3",
    "yup": "^1.3.3",
    "date-fns": "^3.0.0"
  }
}
```

---

Este archivo contiene ejemplos completos y la estructura recomendada para implementar el módulo Soporte en React, siguiendo el mismo nivel de detalle que RRHH.
