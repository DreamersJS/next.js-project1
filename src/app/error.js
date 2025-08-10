'use client';
import dynamic from 'next/dynamic';

const ErrorContent = dynamic(() => import('../components/ErrorDisplay'));

export default function Error({ error, reset }) {
  return <ErrorContent error={error} reset={reset} />;
}