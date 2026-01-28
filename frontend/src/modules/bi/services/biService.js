// services/biService.js
import axios from "axios";

const BASE_URL = "/api/v1/bi";

export const biService = {
  getGlobalDashboard: (filters) =>
    axios
      .get(`${BASE_URL}/dashboards/global`, { params: filters })
      .then((r) => r.data),
  getModuleDashboard: (module, filters) =>
    axios
      .get(`${BASE_URL}/dashboards/${module}`, { params: filters })
      .then((r) => r.data),
  getAllReports: (filters) =>
    axios.get(`${BASE_URL}/informes`, { params: filters }).then((r) => r.data),
  getReportById: (id) =>
    axios.get(`${BASE_URL}/informes/${id}`).then((r) => r.data),
  getAllDatasets: (filters) =>
    axios.get(`${BASE_URL}/datasets`, { params: filters }).then((r) => r.data),
  getAllAlerts: (filters) =>
    axios.get(`${BASE_URL}/alertas`, { params: filters }).then((r) => r.data),
  // ...otros métodos según necesidades
};
export default biService;
