/**
 * Utility to fix interaction issues
 * Ensures all buttons and inputs are clickable
 */

export const fixInteractions = () => {
  if (typeof window === 'undefined') return;
  // Fix all buttons
  const buttons = document.querySelectorAll('button:not(:disabled)');
  buttons.forEach((button) => {
    const btn = button as HTMLElement;
    btn.style.pointerEvents = 'auto';
    btn.style.cursor = 'pointer';
    btn.style.position = 'relative';
    btn.style.zIndex = '100';
    
    // Add click handler to scroll into view
    if (!btn.dataset.scrollFixed) {
      btn.dataset.scrollFixed = 'true';
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }, { once: false });
    }
  });

  // Fix all inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    const inp = input as HTMLElement;
    inp.style.pointerEvents = 'auto';
    inp.style.position = 'relative';
    inp.style.zIndex = '100';
  });

  // Fix all links
  const links = document.querySelectorAll('a:not([aria-disabled="true"])');
  links.forEach((link) => {
    const lnk = link as HTMLElement;
    lnk.style.pointerEvents = 'auto';
    lnk.style.cursor = 'pointer';
    lnk.style.position = 'relative';
    lnk.style.zIndex = '100';
  });
};

// Auto-run on DOM ready (only if imported directly)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixInteractions);
  } else {
    fixInteractions();
  }

  // Also run after a delay to catch dynamically added elements
  setTimeout(fixInteractions, 1000);
  
  // Run on route changes (for React Router)
  window.addEventListener('popstate', () => {
    setTimeout(fixInteractions, 100);
  });
}

