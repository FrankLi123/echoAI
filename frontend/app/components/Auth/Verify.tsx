import React, { useState } from 'react';
import axios from 'axios';


interface VerifyProps {
    onVerifySuccess: () => void;
}

const Verify: React.FC<VerifyProps>  = ({ onVerifySuccess }) => {
    const [answer, setAnswer] = useState('');
    const [isVerified, setIsVerified] = useState(false); // State to track verification status

    const handleVerify = async () => {
        try {
            // Mock data for model_id, secrets, user_address
            const model_id = 'your_model_id';
            // const secrets = ['mock_secret_1', 'mock_secret_2'];
            const user_address = 'mock_user_address';

            console.log("handleVerify, the answer is: ", answer)
            // Send a POST request to the backend with the answer and mock data
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verify`, {
                model_id,
                answer,
                user_address,
                
            });

            // Assuming the response data directly contains the boolean verification result
            if (response.data.verified === true) {
                setIsVerified(true); // Update state if verified
                onVerifySuccess();
            } else {
                // Handle non-verification scenario as needed
                console.log('Not verified');
            }

            console.log('Verification response:', response.data);
        } catch (error) {
            console.error('Error sending verification request:', error);
        }
    };

    const handleClose = () => {
        // Close the dialog
        const modal = document.getElementById('my_modal_4');
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    return (
        <dialog id="my_modal_4" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                {isVerified ? (
                    <>
                        {/* Verified message with adjusted styles for narrower and lower appearance */}
                        <div className="bg-green-100 p-4 rounded-md text-center text-black">
                            <h3 className="font-bold text-lg">Congratulations!</h3>
                            <p>Your identity has been verified.</p>
                        </div>
                        {/* Close button displayed alongside the message */}
                        <div className="modal-action justify-center">
                            <button className="btn" onClick={handleClose}>Close</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold text-lg">Hello!</h3>
                        <p className="py-4 text-white">Please answer the following question:</p>
                        <p className="py-4 text-white"> What are your personality traits?</p>

                        {/* Input text area for the answer */}
                        <textarea
                            className="border rounded-lg p-2 w-full text-white"
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
                    </>
                )}
            </div>
        </dialog>
    );
};

export default Verify;
