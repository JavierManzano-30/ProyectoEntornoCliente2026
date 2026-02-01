/**
 * Componente selector de rango de fechas
 */

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import { formatDate, getStartOfMonth, getEndOfDay, addDays } from '../../utils/dateUtils';
import './DateRangePicker.css';

const DateRangePicker = ({ 
  value = null, 
  onChange, 
  placeholder = 'Seleccionar rango...',
  disabled = false,
  presets = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(value?.start ? new Date(value.start) : null);
  const [endDate, setEndDate] = useState(value?.end ? new Date(value.end) : null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDate = (date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date < startDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
      onChange({ start: startDate, end: date });
      setIsOpen(false);
    }
  };

  const handlePreset = (preset) => {
    const today = new Date();
    const ranges = {
      today: { start: today, end: today },
      yesterday: { start: addDays(today, -1), end: addDays(today, -1) },
      last7days: { start: addDays(today, -6), end: today },
      last30days: { start: addDays(today, -29), end: today },
      thisMonth: { start: getStartOfMonth(today), end: today },
      lastMonth: {
        start: getStartOfMonth(addDays(today, -30)),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      }
    };

    const range = ranges[preset];
    if (range) {
      setStartDate(range.start);
      setEndDate(range.end);
      onChange(range);
      setIsOpen(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date) => {
    if (startDate && startDate.toDateString() === date.toDateString()) return true;
    if (endDate && endDate.toDateString() === date.toDateString()) return true;
    return false;
  };

  const isDateHovered = (date) => {
    if (!startDate || !hoverDate) return false;
    if (hoverDate < startDate) {
      return date >= hoverDate && date <= startDate;
    }
    return date >= startDate && date <= hoverDate;
  };

  const renderCalendar = (date) => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day-empty" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      const isSelected = isDateSelected(currentDate);
      const isInRange = isDateInRange(currentDate);
      const isHovered = isDateHovered(currentDate);
      const isPast = currentDate < new Date() && currentDate.toDateString() !== new Date().toDateString();

      days.push(
        <button
          key={day}
          type="button"
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''} ${isHovered ? 'hovered' : ''} ${isPast ? 'past' : ''}`}
          onClick={() => handleSelectDate(currentDate)}
          onMouseEnter={() => setHoverDate(currentDate)}
          onMouseLeave={() => setHoverDate(null)}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange(null);
  };

  const displayValue = startDate && endDate 
    ? `${formatDate(startDate)} - ${formatDate(endDate)}`
    : startDate 
    ? formatDate(startDate)
    : placeholder;

  return (
    <div className="date-range-picker" ref={containerRef}>
      <div 
        className={`date-picker-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <Calendar size={18} />
        <span className={startDate || endDate ? 'has-value' : 'placeholder'}>
          {displayValue}
        </span>
        {(startDate || endDate) && !disabled && (
          <button
            type="button"
            className="date-picker-clear"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && !disabled && (
        <div className="date-picker-dropdown">
          {presets && (
            <div className="date-picker-presets">
              <button
                type="button"
                className="preset-btn"
                onClick={() => handlePreset('today')}
              >
                Hoy
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handlePreset('yesterday')}
              >
                Ayer
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handlePreset('last7days')}
              >
                Últimos 7 días
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handlePreset('last30days')}
              >
                Últimos 30 días
              </button>
              <button
                type="button"
                className="preset-btn"
                onClick={() => handlePreset('thisMonth')}
              >
                Este mes
              </button>
            </div>
          )}

          <div className="date-picker-calendar">
            <div className="calendar-header">
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                ←
              </button>
              <span className="calendar-title">
                {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                className="calendar-nav-btn"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                →
              </button>
            </div>

            <div className="calendar-weekdays">
              <div>L</div>
              <div>M</div>
              <div>X</div>
              <div>J</div>
              <div>V</div>
              <div>S</div>
              <div>D</div>
            </div>

            <div className="calendar-days">
              {renderCalendar(currentMonth)}
            </div>
          </div>

          {(startDate || endDate) && (
            <div className="date-picker-actions">
              <button
                type="button"
                className="action-btn action-cancel"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Limpiar
              </button>
              <button
                type="button"
                className="action-btn action-apply"
                onClick={() => setIsOpen(false)}
                disabled={!startDate || !endDate}
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
