import React from 'react';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { SupportTicketsFilterBar } from '../SupportTicketsFilterBar.component';

afterEach(() => {
  cleanup();
});

describe('SupportTicketsFilterBar', () => {
  it('renders the status select with its current value', () => {
    render(<SupportTicketsFilterBar status="open" onStatusChange={() => {}} />);
    const select = screen.getByDisplayValue('Open') as HTMLSelectElement;
    assert.equal(select.value, 'open');
  });

  it('calls onStatusChange with the selected status', () => {
    let received: string | null = null;
    render(<SupportTicketsFilterBar status="all" onStatusChange={(v) => (received = v)} />);
    const select = screen.getByDisplayValue('All Tickets');
    fireEvent.change(select, { target: { value: 'resolved' } });
    assert.equal(received, 'resolved');
  });

  it('offers all four ticket statuses plus the all-tickets option', () => {
    render(<SupportTicketsFilterBar status="all" onStatusChange={() => {}} />);
    for (const label of ['All Tickets', 'Open', 'In Progress', 'Resolved', 'Closed']) {
      assert.ok(screen.getByText(label), `expected option "${label}" to render`);
    }
  });
});
