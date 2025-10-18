import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  ctrl?: boolean;
  meta?: boolean;
  condition?: () => boolean;
}

export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  onShowHelp?: () => void
) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let goPressedAt: number | null = null;

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Check for Cmd/Ctrl + K (search)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Open search dialog
        console.log('Search shortcut triggered');
        return;
      }

      // Check for ? (help)
      if (e.key === '?' && onShowHelp) {
        e.preventDefault();
        onShowHelp();
        return;
      }

      // Check for "G" then another key (navigation)
      if (e.key === 'g' || e.key === 'G') {
        goPressedAt = Date.now();
        return;
      }

      // If "G" was pressed recently, check for navigation keys
      if (goPressedAt && Date.now() - goPressedAt < 1000) {
        goPressedAt = null;

        if (e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          navigate('/admin/dashboard');
          return;
        }

        if (e.key === 'v' || e.key === 'V') {
          e.preventDefault();
          navigate('/admin/divisions');
          return;
        }

        if (e.key === 't' || e.key === 'T') {
          e.preventDefault();
          navigate('/admin/teams');
          return;
        }

        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          navigate('/admin/pools');
          return;
        }

        if (e.key === 'm' || e.key === 'M') {
          e.preventDefault();
          navigate('/admin/matches');
          return;
        }
      }

      // Check custom shortcuts
      for (const shortcut of shortcuts) {
        // Check if condition is met (if provided)
        if (shortcut.condition && !shortcut.condition()) {
          continue;
        }

        // Check modifier keys
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && keyMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    // Reset "G" flag after timeout
    const intervalId = setInterval(() => {
      if (goPressedAt && Date.now() - goPressedAt > 1000) {
        goPressedAt = null;
      }
    }, 100);

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(intervalId);
    };
  }, [shortcuts, navigate, location, onShowHelp]);
}
