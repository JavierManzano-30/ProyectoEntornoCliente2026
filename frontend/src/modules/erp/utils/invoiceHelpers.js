/**
 * Calcular subtotal de línea de factura
 */
export const calculateLineSubtotal = (quantity, unitPrice, discount = 0) => {
  const subtotal = quantity * unitPrice;
  const discountAmount = (subtotal * discount) / 100;
  return subtotal - discountAmount;
};

/**
 * Calcular impuesto de línea
 */
export const calculateLineTax = (subtotal, taxRate) => {
  return (subtotal * taxRate) / 100;
};

/**
 * Calcular total de línea (subtotal + impuestos)
 */
export const calculateLineTotal = (quantity, unitPrice, discount = 0, taxRate = 0) => {
  const subtotal = calculateLineSubtotal(quantity, unitPrice, discount);
  const tax = calculateLineTax(subtotal, taxRate);
  return subtotal + tax;
};

/**
 * Calcular totales de factura
 */
export const calculateInvoiceTotals = (lines) => {
  const subtotal = lines.reduce((sum, line) => {
    return sum + calculateLineSubtotal(line.quantity, line.unitPrice, line.discount || 0);
  }, 0);
  
  const totalTax = lines.reduce((sum, line) => {
    const lineSubtotal = calculateLineSubtotal(line.quantity, line.unitPrice, line.discount || 0);
    return sum + calculateLineTax(lineSubtotal, line.taxRate || 0);
  }, 0);
  
  const total = subtotal + totalTax;
  
  return {
    subtotal,
    totalTax,
    total
  };
};

/**
 * Calcular monto pendiente de pago
 */
export const calculatePendingAmount = (invoiceTotal, payments = []) => {
  const totalPaid = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
  return invoiceTotal - totalPaid;
};

/**
 * Verificar si factura está vencida
 */
export const isInvoiceOverdue = (dueDate, currentDate = new Date()) => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  return due < currentDate;
};

/**
 * Calcular días de vencimiento
 */
export const getDaysOverdue = (dueDate, currentDate = new Date()) => {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const diff = currentDate.getTime() - due.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

/**
 * Generar número de factura
 */
export const generateInvoiceNumber = (prefix = 'INV', year, sequence) => {
  const yearShort = year.toString().slice(-2);
  const sequenceStr = sequence.toString().padStart(6, '0');
  return `${prefix}-${yearShort}-${sequenceStr}`;
};

/**
 * Validar número de factura
 */
export const isValidInvoiceNumber = (number) => {
  // Patrón: PREFIX-YY-NNNNNN
  const pattern = /^[A-Z]{2,5}-\d{2}-\d{6}$/;
  return pattern.test(number);
};

/**
 * Agrupar facturas por estado de vencimiento
 */
export const groupInvoicesByAging = (invoices, currentDate = new Date()) => {
  const groups = {
    current: [],
    overdue_0_30: [],
    overdue_31_60: [],
    overdue_61_90: [],
    overdue_90_plus: []
  };
  
  invoices.forEach(invoice => {
    const daysOverdue = getDaysOverdue(invoice.dueDate, currentDate);
    
    if (daysOverdue === 0) {
      groups.current.push(invoice);
    } else if (daysOverdue <= 30) {
      groups.overdue_0_30.push(invoice);
    } else if (daysOverdue <= 60) {
      groups.overdue_31_60.push(invoice);
    } else if (daysOverdue <= 90) {
      groups.overdue_61_90.push(invoice);
    } else {
      groups.overdue_90_plus.push(invoice);
    }
  });
  
  return groups;
};

/**
 * Calcular totales por grupo de antigüedad
 */
export const calculateAgingTotals = (groupedInvoices) => {
  const totals = {};
  
  Object.keys(groupedInvoices).forEach(group => {
    totals[group] = groupedInvoices[group].reduce((sum, inv) => sum + (inv.total || 0), 0);
  });
  
  totals.grandTotal = Object.values(totals).reduce((sum, val) => sum + val, 0);
  
  return totals;
};
