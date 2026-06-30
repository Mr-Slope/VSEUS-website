'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Ticket } from '@/components/portal/Ticket';
import { Event, QuestionAnswer, Registration } from '@/types/event';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/contexts/AuthContext';

interface RegistrationModalProps {
  event: Event | null;
  onClose: () => void;
  onConfirm: (
    eventId: string,
    answers: QuestionAnswer[],
    ticketEmail: string,
  ) => Promise<Registration | undefined>;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

type Step = 'questions' | 'ticket_email' | 'confirm' | 'ticket';

function firstStep(event: Event | null): Step {
  if (!event) return 'ticket_email';
  return event.questions.length > 0 ? 'questions' : 'ticket_email';
}

export function RegistrationModal({ event, onClose, onConfirm }: RegistrationModalProps) {
  const { user } = useAuth();
  const { saveTicketEmail } = useAuthContext();
  const [step, setStep] = useState<Step>(() => firstStep(event));
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [ticketEmail, setTicketEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [emailToast, setEmailToast] = useState('');
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(false);
  // ticket_email step sub-state
  const [changingEmail, setChangingEmail] = useState(false);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [newEmailError, setNewEmailError] = useState('');

  const profileTicketEmail = user?.ticketEmail || user?.email || '';

  useEffect(() => {
    if (event) {
      setStep(firstStep(event));
      setAnswers({});
      setTicketEmail(profileTicketEmail);
      setEmailError('');
      setValidationError('');
      setEmailToast('');
      setRegistration(null);
      setChangingEmail(false);
      setNewEmailInput('');
      setNewEmailError('');
    }
  }, [event?.id, user?.email, user?.ticketEmail]);

  function handleAnswer(questionId: string, value: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setValidationError('');
  }

  function handleNextFromQuestions() {
    if (!event) return;
    const missing = event.questions.filter(
      (q) => q.required && !answers[q.id]?.trim()
    );
    if (missing.length > 0) {
      setValidationError(`Please answer all required questions (${missing.length} remaining).`);
      return;
    }
    setStep('ticket_email');
  }

  async function handleNextFromEmail() {
    if (changingEmail) {
      const val = newEmailInput.trim();
      if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setNewEmailError('Please enter a valid email address.');
        return;
      }
      // Update profile and use new email
      await saveTicketEmail(val);
      setTicketEmail(val);
    } else {
      setTicketEmail(profileTicketEmail);
    }
    setStep('confirm');
  }

  async function handleConfirm() {
    if (!event) return;
    setLoading(true);
    setValidationError('');
    const collectedAnswers: QuestionAnswer[] = event.questions.map((q) => ({
      questionId: q.id,
      question: q.text,
      answer: answers[q.id] ?? '',
    }));
    try {
      const reg = await onConfirm(event.id, collectedAnswers, ticketEmail);
      if (reg) setRegistration(reg);
      setEmailToast(`A ticket has been sent to ${ticketEmail}`);
      setStep('ticket');
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setStep(firstStep(event));
    setAnswers({});
    setTicketEmail(profileTicketEmail);
    setEmailError('');
    setValidationError('');
    setEmailToast('');
    setRegistration(null);
    setChangingEmail(false);
    setNewEmailInput('');
    setNewEmailError('');
    onClose();
  }

  const spotsLeft = event ? event.capacity - event.registeredCount : null;

  const titleMap: Record<Step, string> = {
    questions: 'Before You Register',
    ticket_email: 'Your Ticket',
    confirm: 'Confirm Registration',
    ticket: 'Registration Complete',
  };

  return (
    <Modal open={!!event} onClose={handleClose} title={titleMap[step]}>

      {/* ── Questions ── */}
      {step === 'questions' && event && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            Please answer the following before completing your registration.
          </p>
          <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
            {event.questions.map((q) => (
              <div key={q.id}>
                <label className="block text-sm font-medium text-navy-900 mb-1.5">
                  {q.text}
                  {q.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {q.type === 'text' && (
                  <textarea
                    rows={3}
                    value={answers[q.id] ?? ''}
                    onChange={(e) => handleAnswer(q.id, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-navy-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all resize-none"
                    placeholder="Your answer..."
                  />
                )}
                {q.type === 'yes_no' && (
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} className="accent-navy-700" />
                        <span className="text-sm text-navy-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} className="accent-navy-700" />
                        <span className="text-sm text-navy-900">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {validationError && <p className="text-xs text-red-600 mt-3">{validationError}</p>}
          <div className="flex gap-3 mt-5">
            <Button variant="ghost" fullWidth onClick={handleClose}>Cancel</Button>
            <Button variant="primary" fullWidth onClick={handleNextFromQuestions}>Next</Button>
          </div>
        </div>
      )}

      {/* ── Ticket Email ── */}
      {step === 'ticket_email' && event && (
        <div>
          <p className="text-sm text-gray-500 mb-5">
            Where should we send your ticket?
          </p>

          {!changingEmail ? (
            <div className="bg-navy-50 border border-navy-100 rounded-xl px-4 py-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">Send ticket to:</p>
              <p className="text-sm font-semibold text-navy-900 mb-3">{profileTicketEmail}</p>
              <button
                onClick={() => { setChangingEmail(true); setNewEmailInput(''); setNewEmailError(''); }}
                className="text-xs text-navy-500 hover:text-navy-700 font-medium underline underline-offset-2"
              >
                No, I&apos;d like to change it
              </button>
            </div>
          ) : (
            <div className="mb-5">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-navy-900">
                  New ticket email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={newEmailInput}
                  onChange={(e) => { setNewEmailInput(e.target.value); setNewEmailError(''); }}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-navy-900 placeholder:text-gray-400 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all"
                />
                {newEmailError && <p className="text-xs text-red-600 mt-1">{newEmailError}</p>}
              </div>
              <p className="text-xs text-gray-400 mt-2">This will also update your profile&apos;s ticket email.</p>
              <button
                onClick={() => { setChangingEmail(false); setNewEmailInput(''); setNewEmailError(''); }}
                className="text-xs text-navy-500 hover:text-navy-700 font-medium underline underline-offset-2 mt-1"
              >
                Use {profileTicketEmail} instead
              </button>
            </div>
          )}

          <div className="flex gap-3">
            {event.questions.length > 0 ? (
              <Button variant="ghost" fullWidth onClick={() => { setChangingEmail(false); setStep('questions'); }}>Back</Button>
            ) : (
              <Button variant="ghost" fullWidth onClick={handleClose}>Cancel</Button>
            )}
            <Button variant="primary" fullWidth onClick={handleNextFromEmail}>Next</Button>
          </div>
        </div>
      )}

      {/* ── Confirm ── */}
      {step === 'confirm' && event && (
        <div>
          <div className="bg-navy-100 rounded-xl p-4 mb-4 space-y-2">
            <h3 className="font-bold text-navy-900 text-sm">{event.title}</h3>
            <div className="text-xs text-gray-500 space-y-1">
              <p>{formatDate(event.date)} · {event.time}</p>
              <p>{event.location}</p>
              {spotsLeft !== null && (
                <p className={spotsLeft <= 5 ? 'text-red-600 font-medium' : ''}>
                  {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} remaining
                </p>
              )}
              {event.isPaid && <p className="font-semibold text-yellow-700">Cost: ${event.price}</p>}
            </div>
          </div>
          <p className="text-xs text-gray-500 mb-2">
            Ticket will be sent to: <span className="font-medium text-navy-700">{ticketEmail}</span>
          </p>
          {event.isPaid && (
            <p className="text-xs text-gray-500 mb-4 bg-yellow-50 border border-yellow-100 rounded-lg p-3">
              Payment will be collected at the door or via e-transfer to events@vseus.ca before the event.
            </p>
          )}
          <p className="text-sm text-gray-600 mb-5">
            By registering, you confirm you plan to attend. Please cancel at least 24 hours in advance if your plans change.
          </p>
          {validationError && <p className="text-xs text-red-600 mb-3">{validationError}</p>}
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setStep('ticket_email')}>Back</Button>
            <Button variant="primary" fullWidth loading={loading} onClick={handleConfirm}>Confirm Registration</Button>
          </div>
        </div>
      )}

      {/* ── Ticket (success) ── */}
      {step === 'ticket' && event && registration && (
        <div>
          {emailToast && (
            <div className="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
              <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-xs text-green-700">{emailToast}</p>
            </div>
          )}
          <div className="mb-4">
            <Ticket registration={registration} event={event} />
          </div>
          <Button variant="primary" fullWidth onClick={handleClose}>Done</Button>
        </div>
      )}
    </Modal>
  );
}
