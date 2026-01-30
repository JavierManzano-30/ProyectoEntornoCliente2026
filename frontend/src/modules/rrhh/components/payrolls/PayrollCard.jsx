import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency, formatPayrollPeriod, calculateNetAmount } from '../../utils/payrollFormatters';
import './PayrollCard.css';

const PayrollCard = ({ payroll, onDownload }) => {
  const netAmount = calculateNetAmount(payroll);

  return (
    <div className="payroll-card">
      <div className="payroll-card-header">
        <div>
          <h4 className="payroll-card-period">{formatPayrollPeriod(payroll)}</h4>
          <p className="payroll-card-employee">{payroll.employeeName}</p>
        </div>
        {onDownload && (
          <button className="payroll-download-btn" onClick={() => onDownload(payroll)}>
            <Download size={18} />
            <span>PDF</span>
          </button>
        )}
      </div>

      <div className="payroll-card-amounts">
        <div className="payroll-amount-item">
          <span className="amount-label">Bruto</span>
          <span className="amount-value">{formatCurrency(payroll.grossAmount)}</span>
        </div>
        <div className="payroll-amount-divider">-</div>
        <div className="payroll-amount-item">
          <span className="amount-label">Deducciones</span>
          <span className="amount-value amount-negative">{formatCurrency(payroll.deductions)}</span>
        </div>
        <div className="payroll-amount-divider">=</div>
        <div className="payroll-amount-item payroll-amount-net">
          <span className="amount-label">Neto</span>
          <span className="amount-value amount-highlight">{formatCurrency(netAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default PayrollCard;
