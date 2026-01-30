import React from 'react';
import { Eye, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../../../../components/common/Button';
import Badge from '../../../../components/common/Badge';
import { CUSTOMER_STATUS_LABELS, CUSTOMER_STATUS_COLORS } from '../../constants/customerStatuses';
import './CustomerTable.css';

const SortIcon = ({ field, sortBy, sortOrder }) => {
  if (sortBy !== field) return null;
  return sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
};

const CustomerTable = ({ 
  customers, 
  onView, 
  onEdit, 
  onDelete,
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

  if (customers.length === 0) {
    return (
      <div className="customer-table-empty">
        <p>No se encontraron clientes</p>
      </div>
    );
  }

  return (
    <div className="customer-table-container">
      <table className="customer-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('nombre')} className="sortable">
              Nombre <SortIcon field="nombre" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>CIF</th>
            <th onClick={() => handleSort('estado')} className="sortable">
              Estado <SortIcon field="estado" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>Responsable</th>
            <th onClick={() => handleSort('valorTotal')} className="sortable">
              Valor Total <SortIcon field="valorTotal" sortBy={sortBy} sortOrder={sortOrder} />
            </th>
            <th>Email</th>
            <th>Teléfono</th>
            <th className="actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="customer-name">
                <strong>{customer.nombre}</strong>
              </td>
              <td>{customer.cif}</td>
              <td>
                <Badge variant={CUSTOMER_STATUS_COLORS[customer.estado] || 'default'}>
                  {CUSTOMER_STATUS_LABELS[customer.estado] || customer.estado}
                </Badge>
              </td>
              <td>{customer.responsable?.nombre || 'Sin asignar'}</td>
              <td className="customer-value">
                {formatCurrency(customer.valorTotal || 0)}
              </td>
              <td>{customer.email || 'N/A'}</td>
              <td>{customer.telefono || 'N/A'}</td>
              <td className="customer-actions">
                <Button
                  variant="ghost"
                  size="small"
                  icon={Eye}
                  onClick={() => onView(customer.id)}
                  title="Ver detalles"
                />
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={Edit}
                    onClick={() => onEdit(customer.id)}
                    title="Editar"
                  />
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="small"
                    icon={Trash2}
                    onClick={() => onDelete(customer.id)}
                    title="Eliminar"
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

export default CustomerTable;
