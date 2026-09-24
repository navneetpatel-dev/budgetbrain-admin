'use client';

import { useState } from 'react';
import { useCachedResource } from '@/shared/hooks/useCachedResource.hook';
import {
  createTemplateFromSkeleton,
  dismissSkeleton,
  listAliasCandidates,
  listSkeletonQueue,
  promoteAliasCandidate,
} from '../api/detection.api';
import { defaultTemplateFields, suggestTemplateId, templateMappingErrors } from '../utils/templateMapping';
import type {
  AliasCandidate,
  SkeletonGroup,
  TemplateField,
  TemplateFromSkeletonInput,
} from '../types/detection.types';

type MappingForm = Omit<TemplateFromSkeletonInput, 'paymentMethod' | 'dateOrder'> & {
  paymentMethod: string;
  dateOrder: '' | 'DMY' | 'MDY' | 'YMD';
};

function formFor(group: SkeletonGroup): MappingForm {
  return {
    id: suggestTemplateId(group.institutionId, group.skeletonHash),
    institutionId: group.institutionId ?? '',
    language: 'en',
    fields: defaultTemplateFields(group.skeleton),
    direction: /credit|received|deposit/i.test(group.skeleton) ? 'CREDIT' : 'DEBIT',
    transactionType: /credit|received|deposit/i.test(group.skeleton) ? 'income' : 'expense',
    paymentMethod: '',
    dateOrder: '',
    sample: '',
  };
}

/**
 * Learning queues (T7.4, T7.5): message shapes at least k users submitted, mapped to a draft
 * template (a sample message is required and must match), and merchant names at least k users
 * categorised, promoted to a draft global alias. Drafts are published from the catalog.
 */
export function useLearningQueues() {
  const skeletons = useCachedResource<SkeletonGroup[]>('detection-skeletons', listSkeletonQueue, { cache: false });
  const aliases = useCachedResource<AliasCandidate[]>('detection-alias-candidates', listAliasCandidates, { cache: false });

  const [mapping, setMapping] = useState<{ group: SkeletonGroup; form: MappingForm } | null>(null);
  const [promote, setPromote] = useState<{ candidate: AliasCandidate; merchantId: string; country: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');

  const mappingErrors = mapping ? templateMappingErrors(mapping.group.skeleton, mapping.form.fields, mapping.form.sample) : [];

  const act = async (action: () => Promise<unknown>, done: string) => {
    setSaving(true);
    setActionError('');
    setMessage('');
    try {
      await action();
      setMessage(done);
      return true;
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Request failed');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateMapping = (patch: Partial<MappingForm>) =>
    setMapping((prev) => (prev ? { ...prev, form: { ...prev.form, ...patch } } : prev));

  const setField = (index: number, field: TemplateField) =>
    setMapping((prev) => {
      if (!prev) return prev;
      const fields = [...prev.form.fields];
      fields[index] = field;
      return { ...prev, form: { ...prev.form, fields } };
    });

  const submitMapping = async () => {
    if (!mapping || mappingErrors.length > 0) return;
    const { paymentMethod, dateOrder, ...rest } = mapping.form;
    const input: TemplateFromSkeletonInput = {
      ...rest,
      sample: rest.sample.trim(),
      ...(paymentMethod ? { paymentMethod } : {}),
      ...(dateOrder ? { dateOrder } : {}),
    };
    const ok = await act(
      () => createTemplateFromSkeleton(mapping.group.skeletonHash, input),
      `Draft template ${input.id} created. Publish it from the catalog.`
    );
    if (ok) {
      setMapping(null);
      await skeletons.reload();
    }
  };

  const dismiss = async (group: SkeletonGroup) => {
    if (!window.confirm('Dismiss this shape? It leaves the queue for every submitter.')) return;
    if (await act(() => dismissSkeleton(group.skeletonHash), 'Shape dismissed.')) await skeletons.reload();
  };

  const submitPromote = async () => {
    if (!promote || !promote.merchantId.trim()) {
      setActionError('Choose the merchant id this alias points to.');
      return;
    }
    const ok = await act(
      () =>
        promoteAliasCandidate({
          aliasKey: promote.candidate.aliasKey,
          merchantId: promote.merchantId.trim(),
          ...(promote.country ? { country: promote.country } : {}),
        }),
      `Draft alias "${promote.candidate.aliasKey}" created. Publish it from the catalog.`
    );
    if (ok) {
      setPromote(null);
      await aliases.reload();
    }
  };

  return {
    skeletons,
    aliases,
    mapping,
    mappingErrors,
    startMapping: (group: SkeletonGroup) => setMapping({ group, form: formFor(group) }),
    cancelMapping: () => setMapping(null),
    updateMapping,
    setField,
    submitMapping,
    dismiss,
    promote,
    startPromote: (candidate: AliasCandidate) => setPromote({ candidate, merchantId: '', country: '' }),
    updatePromote: (patch: { merchantId?: string; country?: string }) =>
      setPromote((prev) => (prev ? { ...prev, ...patch } : prev)),
    cancelPromote: () => setPromote(null),
    submitPromote,
    saving,
    actionError,
    message,
  };
}
