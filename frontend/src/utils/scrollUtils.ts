/**
 * Utility functions for scroll behavior
 */

/**
 * Scrolls an element into view smoothly
 * @param element - The element to scroll into view
 * @param block - Vertical alignment: 'start', 'center', 'end', or 'nearest'
 */
export const scrollIntoView = (
  element: HTMLElement | null,
  block: ScrollLogicalPosition = 'center'
) => {
  if (!element) return;
  
  setTimeout(() => {
    element.scrollIntoView({
      behavior: 'smooth',
      block,
      inline: 'nearest'
    });
  }, 100);
};

/**
 * Scrolls to top of page
 */
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

/**
 * Scrolls to bottom of page
 */
export const scrollToBottom = () => {
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  });
};

/**
 * Scrolls to a specific element by ID
 */
export const scrollToElement = (elementId: string, block: ScrollLogicalPosition = 'center') => {
  const element = document.getElementById(elementId);
  if (element) {
    scrollIntoView(element, block);
  }
};

