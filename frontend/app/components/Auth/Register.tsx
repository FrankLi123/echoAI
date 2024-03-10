import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
    onRegistrationSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegistrationSuccess }) => {
    const [answer, setAnswer] = useState('');
    const [isVerified, setIsVerified] = useState(false); // State to track verification status

    const handleVerify = async () => {
        try {
            
            console.log("hello!")
            // Send a POST request to the backend with the answer
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, {
                model_id: 'your_model_id', // Use your model ID here
                message: answer,
                user_address: 'your_user_address' // Use your user address here
            });

            // Assuming the response data directly contains the boolean verification result
            if (response.data !== null) {
                setIsVerified(true); // Update state if verified
                onRegistrationSuccess();
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
        const modal = document.getElementById('my_modal_5');
        if (modal instanceof HTMLDialogElement) {
            modal.close();
        }
    };

    return (
        <dialog id="my_modal_5" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                {isVerified ? (
                    <>
                        {/* Verified message with adjusted styles for narrower and lower appearance */}
                        <div className="bg-green-100 p-4 rounded-md text-center text-black">
                            <h3 className="font-bold text-lg">Congratulations!</h3>
                            <p>Your identity has been successfully registered.</p>
                        </div>
                        {/* Close button displayed alongside the message */}
                        <div className="modal-action justify-center">
                            <button className="btn" onClick={handleClose}>Close</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h3 className="font-bold text-lg"> Register Your Own Identity: </h3>
                        <p className="py-4 text-white">Please answer the following question:</p>

                        <p className="py-4 text-white">What is your Ideal lifestyle ? </p>
                        {/* Input text area for the answer */}
                        <textarea
                            className="border rounded-lg p-2 w-full text-white"
                            placeholder="Your answer"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />

                        <div className="modal-action">
                            {/* Verify button */}
                            <button className="btn" onClick={handleVerify}>Register</button>
                            {/* Close button */}
                            <button className="btn" onClick={handleClose}>Close</button>
                        </div>
                    </>
                )}
            </div>
        </dialog>
    );
};

export default Register;
