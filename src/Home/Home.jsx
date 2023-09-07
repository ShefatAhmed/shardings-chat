import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Home.css';
import sanitizeHtml from 'sanitize-html';

const Home = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isReactionsMenuOpen, setIsReactionsMenuOpen] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Load messages from local storage when the component mounts
        const storedMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
        setMessages(storedMessages);
    }, []);

    const handleMessageChange = (value) => {
        setMessage(value);
    };

    const handleSendMessage = () => {
        if (message.trim() === '') return;

        // Sanitize the message content to remove unwanted HTML tags
        const sanitizedMessage = sanitizeHtml(message, {
            allowedTags: [],
            allowedAttributes: {},
        });

        // Add the new message to the messages array
        const newMessages = [...messages, sanitizedMessage];
        setMessages(newMessages);

        // Store messages in local storage
        localStorage.setItem('chatMessages', JSON.stringify(newMessages));

        // Clear the message input
        setMessage('');
    };

    const handleFileUpload = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        console.log('Selected File:', selectedFile);
    };

    const toggleReactionsMenu = () => {
        setIsReactionsMenuOpen(!isReactionsMenuOpen);
    };

    const handleReactionClick = (reaction) => {
        // Handle the selected reaction here
        console.log('Selected Reaction:', reaction);
        // You can perform further actions with the selected reaction here
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white">
            <div className="bg-black p-4 flex-grow overflow-y-auto flex-shrink-0">
                {/* Display messages */}
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${
                            index % 2 === 0 ? 'message-right' : 'message-left'
                        }`}
                        dangerouslySetInnerHTML={{ __html: message }}
                    ></div>
                ))}
                <ReactQuill
                    value={message}
                    onChange={handleMessageChange}
                    modules={{
                        toolbar: [
                            ['bold', 'italic', 'strike', 'link'],
                            [{ list: 'bullet' }, { list: 'ordered' }],
                            ['blockquote'],
                            ['code-block'],
                            [{ code: 'javascript' }],
                        ],
                    }}
                    placeholder="Chat comes here..."
                />
            </div>
            <div className="flex items-center p-4 border-t border-gray-300 flex-shrink-0">
                <button className="mr-2 text-white" onClick={handleFileUpload}>
                    <i className="fa-solid fa-plus"></i>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <div
                    className="relative"
                    onMouseEnter={toggleReactionsMenu}
                    onMouseLeave={toggleReactionsMenu}
                >
                    <button className="mr-2 text-white">
                        <i className="fa fa-smile"></i>
                    </button>
                    {isReactionsMenuOpen && (
                        <div className="absolute bottom-10 left-0 bg-white p-2 rounded shadow">
                            {/* Display reaction options */}
                            <button
                                className="reaction-option"
                                onClick={() => handleReactionClick('Like')}
                            >
                                Like
                            </button>
                            <button
                                className="reaction-option"
                                onClick={() => handleReactionClick('Love')}
                            >
                                Love
                            </button>
                            <button
                                className="reaction-option"
                                onClick={() => handleReactionClick('Haha')}
                            >
                                Haha
                            </button>
                        </div>
                    )}
                </div>
                <button className="mr-2 text-white">
                    <i className="fa-solid fa-at"></i>
                </button>
                <div className="flex items-center p-4 border-t border-gray-300">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-600 transition duration-300"
                        onClick={handleSendMessage}
                    >
                        <i className="fa fa-paper-plane mr-2"></i> Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
