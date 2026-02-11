import { pool } from "../../config/db.js";

export const getKPIs = async (empresaId) => {

  const openTickets = await pool.query(`
    SELECT COUNT(*) 
    FROM support_tickets
    WHERE empresa_id = $1
    AND estado != 'cerrado'
  `,[empresaId]);

  const avgResolution = await pool.query(`
    SELECT AVG(EXTRACT(EPOCH FROM (closed_at - created_at))/60)
    FROM support_tickets
    WHERE empresa_id = $1
    AND estado = 'cerrado'
  `,[empresaId]);

  return {
    openTickets: openTickets.rows[0].count,
    avgResolutionMinutes: avgResolution.rows[0].avg
  };
};
