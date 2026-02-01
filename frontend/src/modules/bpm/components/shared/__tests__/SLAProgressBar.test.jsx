import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SLAProgressBar from '../SLAProgressBar';

describe('SLAProgressBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('no renderiza si faltan fechas', () => {
    const { container } = render(<SLAProgressBar item={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('muestra estado SLA a tiempo', () => {
    const item = {
      fecha_inicio: '2026-02-01T08:00:00Z',
      fecha_limite: '2026-02-01T20:00:00Z',
      estado: 'assigned'
    };

    render(<SLAProgressBar item={item} />);
    expect(screen.getByText('A Tiempo')).toBeInTheDocument();
  });
});
