/**
 * Formulario especializado para iniciar procesos
 */

import React, { useState, useEffect } from 'react';
import { useProcesses } from '../hooks/useProcesses';
import DynamicFormBuilder from '../components/forms/DynamicFormBuilder';
import { Play, AlertCircle } from 'lucide-react';
import './ProcessStartForm.css';

const ProcessStartForm = ({ processId, onSuccess, onCancel }) => {
  const { process, loading: processLoading } = useProcesses(processId);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // En producción, llamar a useInstances().startInstance()
      console.log('Iniciando proceso:', { processId, data });

      onSuccess && onSuccess();
    } catch (err) {
      setError('Error al iniciar el proceso. Por favor, intente nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (processLoading) {
    return <div className="form-loading">Cargando proceso...</div>;
  }

  if (!process) {
    return (
      <div className="form-error">
        <AlertCircle size={24} />
        <p>Proceso no encontrado</p>
      </div>
    );
  }

  const formDefinition = process.formulario_inicio || {
    fields: [
      {
        name: 'motivo',
        label: 'Motivo de la solicitud',
        type: 'textarea',
        required: true,
        placeholder: 'Describe el motivo de tu solicitud...'
      }
    ]
  };

  return (
    <div className="process-start-form">
      <div className="form-header">
        <h1>Iniciar Proceso</h1>
        <p className="process-name">{process.nombre}</p>
        {process.descripcion && (
          <p className="process-description">{process.descripcion}</p>
        )}
      </div>

      {error && (
        <div className="error-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-container">
        <DynamicFormBuilder
          formDefinition={formDefinition}
          initialValues={formData}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          submitButtonText="Iniciar Proceso"
          loading={loading}
        />
      </div>

      <div className="form-info">
        <div className="info-item">
          <span className="label">Versión:</span>
          <span className="value">{process.version}</span>
        </div>
        {process.sla_horas && (
          <div className="info-item">
            <span className="label">SLA:</span>
            <span className="value">{process.sla_horas} horas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessStartForm;
