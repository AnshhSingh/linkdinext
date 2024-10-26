import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import icon from '@/assets/icon.svg';

// Function to update LinkedIn message box content
function linkedinUpdate(actEl, text) {
  const dc = getDeepestChild(actEl);
  if (dc.nodeName.toLowerCase() === "br") {
    // Replace <br> with the text directly
    dc.replaceWith(document.createTextNode(text));
  } else {
    dc.textContent = text;
  }
  // Simulate user's input event to ensure LinkedIn registers the text change
  actEl.dispatchEvent(new InputEvent("input", { bubbles: true }));
}

// Helper function to find the deepest child
function getDeepestChild(element) {
  if (element.lastChild) {
    return getDeepestChild(element.lastChild);
  } else {
    return element;
  }
}

// Modal component
const Modal = ({ onClose, onGenerate, generatedText, promptText, setPromptText, chatHistory, onInsert }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-[400px] rounded-lg p-8 shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 max-h-80 overflow-y-auto">
          {chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-end">
                  <div className="bg-gray-200 text-gray-700 p-3 rounded-2xl max-w-md w-full font-inter text-2xl font-normal leading-9 text-left">
                    {chat.prompt}
                  </div>
                </div>
                <div className="flex justify-start mt-2">
                  <div className="bg-blue-500 text-white p-3 rounded-2xl max-w-md w-full font-inter text-2xl font-normal leading-9 text-left">
                    {chat.response}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 font-inter text-2xl font-normal leading-9 text-left"></div>
          )}
        </div>

        <input
          ref={inputRef}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 font-inter text-2xl font-normal leading-9 text-left"
          placeholder="Your prompt"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />

        <div className="flex justify-end gap-4 mt-4">
          <button onClick={onInsert} className="border-black border-2 text-gray-700 px-4 py-2 rounded font-inter text-2xl font-normal leading-9">
            ↓ Insert
          </button>
          <button onClick={onGenerate} className="bg-blue-500 text-white px-4 py-2 rounded font-inter text-2xl font-normal leading-9">
            {generatedText ? '↻ Regenerate' : 'Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [promptText, setPromptText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showModal]);

  const handleGenerate = () => {
    if (promptText) {
      const response = 'Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.';
      setGeneratedText(response);
      setChatHistory([...chatHistory, { prompt: promptText, response }]);
      setPromptText('');
    }
  };

  const handleInsert = () => {
    const textBox = document.querySelector('[role="textbox"][contenteditable="true"]');
    if (textBox) {
      linkedinUpdate(textBox, generatedText);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <img
        className="pt-20 cursor-pointer"
        src={icon}
        alt="Open Modal"
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerate}
          generatedText={generatedText}
          promptText={promptText}
          setPromptText={setPromptText}
          chatHistory={chatHistory}
          onInsert={handleInsert}
        />
      )}
    </div>
  );
};

export default App;