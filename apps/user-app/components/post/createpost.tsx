// components/CreatePostForm.js
import React, { useState } from 'react';

const CreatePostForm = () => {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    // Add more states for other fields as needed

    const handleSubmit = async (e:any) => {
        e.preventDefault();
        // Submit logic here
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Link" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
            {/* Add more input fields for other post details */}
            <button type="submit">Submit</button>
        </form>
    );
};

export default CreatePostForm;
