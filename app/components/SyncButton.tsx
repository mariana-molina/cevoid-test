'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const SyncButton = () =>{
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/sync', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        router.replace(window.location.pathname + window.location.search);
      }
    } catch (error) {
      console.error('Error syncing products:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button onClick={handleSync} disabled={isSyncing}>
      {isSyncing ? 'Syncing...' : 'Sync Products'}
    </Button>
  );
}