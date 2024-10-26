import './style.css'; 
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Utility function to handle adding UI to elements with the specific class
function bindUIToClass(ctx, element) {
  createShadowRootUi(ctx, {
    name: 'example-ui',
    position: 'inline',
    anchor: element,
    onMount: (container) => {
      const app = document.createElement('div');
      container.append(app);

      const root = ReactDOM.createRoot(app);
      root.render(<App />);
      return root;
    },
    onRemove: (root) => {
      root?.unmount();
    },
  }).then((ui) => ui.mount());
}

export default defineContentScript({
  matches: ['<all_urls>'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    // Set up a MutationObserver to wait for changes in the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList.contains('msg-form__msg-content-container')) {
            // Bind UI to the newly added element
            bindUIToClass(ctx, node);
          }
        });
      });
    });

    // Start observing the DOM for changes
    observer.observe(document.body, {
      childList: true, // Watch for direct children being added/removed
      subtree: true,   // Watch for changes in all descendants
    });

    // Initial binding in case any matching elements already exist in the DOM
    document.querySelectorAll('.msg-form__msg-content-container').forEach((element) => {
      bindUIToClass(ctx, element);
    });
  },
});