import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Save, X } from 'lucide-react';
import { bpmService } from '../services/bpmService';
import './ProcessForm.css';

const INITIAL_FORM = {
  name: '',
  description: '',
  status: 'draft',
  version: 1
};

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'published', label: 'Publicado' },
  { value: 'archived', label: 'Archivado' }
];

const API_STATUS_MAP = {
  draft: 'inactive',
  published: 'active',
  archived: 'archived',
  inactive: 'inactive',
  active: 'active'
};

const ProcessForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'version' ? Number(value) : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('El nombre del proceso es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      await bpmService.createProcess({
        name: form.name.trim(),
        description: form.description.trim() || null,
        version: Number(form.version) > 0 ? Number(form.version) : 1,
        status: API_STATUS_MAP[form.status] || 'inactive'
      });
      navigate('/bpm/procesos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear el proceso.');
      console.error('Error creating process:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="process-form-page">
      <div className="process-form-header">
        <h1>Nuevo Proceso</h1>
        <p>Crea un nuevo proceso BPM para tu empresa</p>
      </div>

      {error && (
        <div className="process-form-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form className="process-form-card" onSubmit={handleSubmit}>
        <div className="process-form-grid">
          <label className="process-form-field">
            <span>Nombre *</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ej: Aprobacion de Compras"
              required
            />
          </label>

          <label className="process-form-field">
            <span>Estado</span>
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="process-form-field">
            <span>Version</span>
            <input
              type="number"
              name="version"
              min="1"
              step="1"
              value={form.version}
              onChange={handleChange}
            />
          </label>

          <label className="process-form-field process-form-field--full">
            <span>Descripcion</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe el objetivo del proceso"
            />
          </label>
        </div>

        <div className="process-form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/bpm/procesos')}
            disabled={loading}
          >
            <X size={16} />
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            <Save size={16} />
            {loading ? 'Guardando...' : 'Crear Proceso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProcessForm;
