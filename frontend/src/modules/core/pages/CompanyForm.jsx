import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../hooks/useCompany';
import { createCompany, updateCompany } from '../services/coreService';
import PageHeader from '../../../components/common/PageHeader';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ErrorMessage from '../../../components/common/ErrorMessage';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import { Save, X } from 'lucide-react';
import '../pages/UserForm.css'; // Reutilizamos los estilos del formulario de usuario

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, loading, error } = useCompany(id);
  const [formData, setFormData] = useState({
    nombre: '',
    cif: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    pais: 'España',
    sector: '',
    numeroEmpleados: '',
    estado: 'activa',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (company) {
      setFormData({
        nombre: company.nombre || '',
        cif: company.cif || '',
        email: company.email || '',
        telefono: company.telefono || '',
        direccion: company.direccion || '',
        ciudad: company.ciudad || '',
        codigoPostal: company.codigoPostal || '',
        pais: company.pais || 'España',
        sector: company.sector || '',
        numeroEmpleados: company.numeroEmpleados || '',
        estado: company.estado || 'activa',
      });
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setFormError(null);
      
      if (id) {
        await updateCompany(id, formData);
      } else {
        await createCompany(formData);
      }
      
      navigate('/core/empresas');
    } catch (err) {
      setFormError(err.message || 'Error al guardar empresa');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && id) return <LoadingSpinner fullScreen />;
  if (error && id) return <ErrorMessage message={error} fullScreen />;

  return (
    <div className="user-form-page">
      <PageHeader
        title={id ? 'Editar Empresa' : 'Nueva Empresa'}
        subtitle={id ? 'Modifica los datos de la empresa' : 'Completa el formulario para crear una nueva empresa'}
      />

      <form onSubmit={handleSubmit}>
        <Card padding="large">
          {formError && (
            <div className="form-error-message">{formError}</div>
          )}

          <div className="form-section">
            <h3 className="form-section-title">Información General</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombre *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cif">CIF *</label>
                <input
                  type="text"
                  id="cif"
                  name="cif"
                  value={formData.cif}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Dirección</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="codigoPostal">Código Postal</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="pais">País</label>
                <input
                  type="text"
                  id="pais"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="form-section-title">Datos Empresariales</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="sector">Sector</label>
                <input
                  type="text"
                  id="sector"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="numeroEmpleados">Número de Empleados</label>
                <input
                  type="number"
                  id="numeroEmpleados"
                  name="numeroEmpleados"
                  value={formData.numeroEmpleados}
                  onChange={handleChange}
                  min="0"
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado *</label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  disabled={submitting}
                >
                  <option value="activa">Activa</option>
                  <option value="inactiva">Inactiva</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              icon={X}
              onClick={() => navigate('/core/empresas')}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={Save}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Empresa'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default CompanyForm;
