import React, { useState } from 'react';
import axios from 'axios'; 

const Verify: React.FC = () => {

    const [answer, setAnswer] = useState('');

    const handleVerify = async () => {
        try {
            // Mock data for model_id, secrets, user_address
            const model_id = 'mock_model_id';
            const secrets = ['mock_secret_1', 'mock_secret_2'];
            const user_address = 'mock_user_address';


            const apiUrl = 'http://localhost:8081/api/recover';

            // Send a POST request to the backend with the answer and mock data
            const response = await axios.post(apiUrl, {
                model_id,
                secrets,
                user_address,
                answer
            });

            console.log('Verification response:', response.data);
        } catch (error) {
            console.error('Error sending verification request:', error);
        }
    };

    const handleClose = () => {
        // Close the dialog
        const modal = document.getElementById('my_modal_4');
        if (modal) {
            modal.close();
        }
    };

    return (
<dialog id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Please answer the following question:</p>
                <p className="py-4">Who is someone you admire the most and why?</p>

                {/* Input text area for the answer */}
                <textarea
                    className="border rounded-lg p-2 w-full"
                    placeholder="Your answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />

                <div className="modal-action">
                    {/* Verify button */}
                    <button className="btn" onClick={handleVerify}>Verify</button>
                    {/* Close button */}
                   <button className="btn" onClick={handleClose}>Close</button>
                </div>
            </div>
        </dialog>
    )
}

export default Verify
