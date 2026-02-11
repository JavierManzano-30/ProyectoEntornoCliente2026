import { pool } from "../../config/db.js";

export const getTickets = async (empresaId) => {

  const { rows } = await pool.query(`
    SELECT *
    FROM support_tickets
    WHERE empresa_id = $1
    ORDER BY created_at DESC
  `, [empresaId]);

  return rows;
};

export const createTicket = async (data, userId, empresaId) => {

    const { titulo, descripcion, categoria, prioridad } = data;
  
    const { rows } = await pool.query(`
      INSERT INTO support_tickets
      (empresa_id, creador_id, titulo, descripcion, categoria, prioridad)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *
    `, [
      empresaId,
      userId,
      titulo,
      descripcion,
      categoria,
      prioridad
    ]);
  
    return rows[0];
  };

  export const addMessage = async (ticketId, contenido, userId) => {

    const { rows } = await pool.query(`
      INSERT INTO support_messages
      (ticket_id, usuario_id, contenido)
      VALUES ($1,$2,$3)
      RETURNING *
    `, [ticketId, userId, contenido]);
  
    return rows[0];
  };

  export const assignTicket = async (ticketId, asignadoA, userId) => {

    await pool.query(`
      UPDATE support_tickets
      SET asignado_a = $1
      WHERE id = $2
    `, [asignadoA, ticketId]);
  
    await pool.query(`
      INSERT INTO support_audit_log
      (ticket_id, user_id, action, new_value)
      VALUES ($1,$2,'ASSIGN',$3)
    `, [ticketId, userId, asignadoA]);
  };

  export const closeTicket = async (ticketId, userId) => {

    await pool.query(`
      UPDATE support_tickets
      SET estado = 'cerrado',
          closed_at = NOW()
      WHERE id = $1
    `, [ticketId]);
  
    await pool.query(`
      INSERT INTO support_audit_log
      (ticket_id, user_id, action)
      VALUES ($1,$2,'CLOSE')
    `, [ticketId, userId]);
  };
  