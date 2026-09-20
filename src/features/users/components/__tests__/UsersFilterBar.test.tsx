import React from 'react';
import { describe, it, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { UsersFilterBar } from '../UsersFilterBar.component';

afterEach(() => {
  cleanup();
});

function renderBar(overrides: Partial<React.ComponentProps<typeof UsersFilterBar>> = {}) {
  const onSearchChange = overrides.onSearchChange ?? (() => {});
  const onRoleChange = overrides.onRoleChange ?? (() => {});
  const onSuspendedChange = overrides.onSuspendedChange ?? (() => {});
  render(
    <UsersFilterBar
      search={overrides.search ?? ''}
      role={overrides.role ?? 'all'}
      isSuspended={overrides.isSuspended ?? 'all'}
      onSearchChange={onSearchChange}
      onRoleChange={onRoleChange}
      onSuspendedChange={onSuspendedChange}
    />
  );
}

describe('UsersFilterBar', () => {
  it('renders the search input with its current value', () => {
    renderBar({ search: 'jane' });
    const input = screen.getByPlaceholderText('Search name or email...') as HTMLInputElement;
    assert.equal(input.value, 'jane');
  });

  it('calls onSearchChange with the typed value', () => {
    let received: string | null = null;
    renderBar({ onSearchChange: (v) => (received = v) });
    const input = screen.getByPlaceholderText('Search name or email...');
    fireEvent.change(input, { target: { value: 'premium user' } });
    assert.equal(received, 'premium user');
  });

  it('calls onRoleChange with the selected role', () => {
    let received: string | null = null;
    renderBar({ onRoleChange: (v) => (received = v) });
    const select = screen.getByDisplayValue('All Roles');
    fireEvent.change(select, { target: { value: 'premium' } });
    assert.equal(received, 'premium');
  });

  it('calls onSuspendedChange with the selected status', () => {
    let received: string | null = null;
    renderBar({ onSuspendedChange: (v) => (received = v) });
    const select = screen.getByDisplayValue('All Statuses');
    fireEvent.change(select, { target: { value: 'true' } });
    assert.equal(received, 'true');
  });
});
