export const validateTicketForm = (data) => {
  const errors = {};

  if (!data.titulo || data.titulo.trim() === '') {
    errors.titulo = 'El título es obligatorio';
  } else if (data.titulo.length < 5) {
    errors.titulo = 'El título debe tener al menos 5 caracteres';
  } else if (data.titulo.length > 200) {
    errors.titulo = 'El título no puede exceder 200 caracteres';
  }

  if (!data.descripcion || data.descripcion.trim() === '') {
    errors.descripcion = 'La descripción es obligatoria';
  } else if (data.descripcion.length < 10) {
    errors.descripcion = 'La descripción debe tener al menos 10 caracteres';
  }

  if (!data.categoria) {
    errors.categoria = 'La categoría es obligatoria';
  }

  if (!data.prioridad) {
    errors.prioridad = 'La prioridad es obligatoria';
  }

  if (!data.clienteId) {
    errors.clienteId = 'El cliente es obligatorio';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateMessageForm = (data) => {
  const errors = {};

  if (!data.contenido || data.contenido.trim() === '') {
    errors.contenido = 'El mensaje no puede estar vacío';
  } else if (data.contenido.length > 5000) {
    errors.contenido = 'El mensaje no puede exceder 5000 caracteres';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateFileUpload = (file, maxSizeMB = 10) => {
  const errors = [];

  if (!file) {
    errors.push('No se ha seleccionado ningún archivo');
    return { isValid: false, errors };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`El archivo no puede exceder ${maxSizeMB}MB`);
  }

  const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.pdf', 
    '.doc', '.docx', '.xls', '.xlsx', '.txt',
    '.zip', '.rar', '.log'
  ];
  
  const fileName = file.name.toLowerCase();
  const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));
  
  if (!isAllowed) {
    errors.push('Tipo de archivo no permitido');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
