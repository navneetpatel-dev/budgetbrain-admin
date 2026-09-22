import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { toEditableRole, ROLES } from '../useUserDetail.hook';

describe('useUserDetail role management', () => {
  it('contains expected assignable roles', () => {
    assert.deepEqual(ROLES, ['free', 'premium', 'lifetime', 'admin']);
  });

  it('normalizes admin role', () => {
    assert.equal(toEditableRole('admin'), 'admin');
  });

  it('normalizes premium and lifetime roles', () => {
    assert.equal(toEditableRole('premium'), 'premium');
    assert.equal(toEditableRole('lifetime'), 'lifetime');
  });

  it('defaults unexpected or free roles to free', () => {
    assert.equal(toEditableRole('free'), 'free');
    assert.equal(toEditableRole('unknown_role'), 'free');
    assert.equal(toEditableRole(''), 'free');
  });
});
