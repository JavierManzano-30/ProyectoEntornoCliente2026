import React from 'react';
import { Eye, Edit, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS } from '../../constants/leadSources';
import './LeadTable.css';

const SortIcon = ({ field, sortBy, sortOrder }) => {
  if (sortBy !== field) return null;
  return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
};

const LeadTable = ({ 
  leads, 
  onView, 
  onEdit,
  onConvert,
  sortBy,
  sortOrder,
  onSort
}) => {
  const handleSort = (field) => {
    if (onSort) {
      onSort(field);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  if (leads.length === 0) {
    return (
      <div className="lead-table-empty">
        <p>No se encontraron leads</p>
      </div>
    );
  }

  return (
    <div className="lead-table-container">
      <table className="lead-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('nombre')} className="sortable">
              Nombre <SortIcon field="nombre" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>CIF</th>
            <th onClick={() => handleSort('fuente')} className="sortable">
              Fuente <SortIcon field="fuente" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th onClick={() => handleSort('estado')} className="sortable">
              Estado <SortIcon field="estado" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>Responsable</th>
            <th onClick={() => handleSort('valorEstimado')} className="sortable">
              Valor Estimado <SortIcon field="valorEstimado" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>Contacto</th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td className="lead-name">
                <strong>{lead.nombre}</strong>
              </td>
              <td>{lead.cif || 'N/A'}</td>
              <td>
                <Badge variant="secondary">
                  {LEAD_SOURCE_LABELS[lead.fuente] || lead.fuente}
                </Badge>
              </td>
              <td>
                <Badge variant={LEAD_STATUS_COLORS[lead.estado] || 'default'}>
                  {LEAD_STATUS_LABELS[lead.estado] || lead.estado}
                </Badge>
              </td>
              <td>{lead.responsable?.nombre || 'Sin asignar'}</td>
              <td className="lead-value">
                {formatCurrency(lead.valorEstimado || 0)}
              </td>
              <td>
                {lead.email && <div>{lead.email}</div>}
                {lead.telefono && <div className="lead-phone">{lead.telefono}</div>}
              </td>
              <td className="lead-actions">
                <Button
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => onView(lead.id)}
                  title="Ver detalles"
                />
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={Edit}
                    onClick={() => onEdit(lead.id)}
                    title="Editar"
                  />
                )}
                {onConvert && lead.estado === 'calificado' && (
                  <Button
                    variant="primary"
                    size="small"
                    icon={ArrowRight}
                    onClick={() => onConvert(lead.id)}
                    title="Convertir a cliente"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
