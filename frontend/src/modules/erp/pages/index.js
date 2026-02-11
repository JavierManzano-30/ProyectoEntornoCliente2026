import React from 'react';

export { default as ERPDashboard } from './ERPDashboard';
export { default as AccountingGeneral } from './AccountingGeneral';
export { default as SalesInvoicing } from './SalesInvoicing';
export { default as InventoryControl } from './InventoryControl';

// Placeholders para las páginas restantes
export const PurchaseManagement = () =>
	React.createElement(
		'div',
		{ style: { padding: '2rem' } },
		React.createElement('h1', null, 'Gestión de Compras'),
		React.createElement('p', null, 'Página en desarrollo')
	);

export const ProductionPlanning = () =>
	React.createElement(
		'div',
		{ style: { padding: '2rem' } },
		React.createElement('h1', null, 'Planificación de Producción'),
		React.createElement('p', null, 'Página en desarrollo')
	);

export const ProjectCosting = () =>
	React.createElement(
		'div',
		{ style: { padding: '2rem' } },
		React.createElement('h1', null, 'Costos por Proyecto'),
		React.createElement('p', null, 'Página en desarrollo')
	);

export const TreasuryManagement = () =>
	React.createElement(
		'div',
		{ style: { padding: '2rem' } },
		React.createElement('h1', null, 'Gestión de Tesorería'),
		React.createElement('p', null, 'Página en desarrollo')
	);

export const FinancialReporting = () =>
	React.createElement(
		'div',
		{ style: { padding: '2rem' } },
		React.createElement('h1', null, 'Reportes Financieros'),
		React.createElement('p', null, 'Página en desarrollo')
	);
