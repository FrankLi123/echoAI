import React, { useState } from "react"
import axios from "axios"
import { useToast } from "../PlugIn/ToastProvider"

interface RecoveryProps {
    thisAccountSddress: string
}

const Recovery: React.FC<RecoveryProps> = ({ thisAccountSddress }) => {
    const [answer, setAnswer] = useState("")
    const [verified, setVerified] = useState(false)
    const { showToast } = useToast()
    const [accountAddress, setAccountAddress] = useState<string>("")
    const [tokenID, setTokenID] = useState<string>("")
    const [transactionId, setTransactionId] = useState<string>("")

    const handleVerify = async () => {
        try {
            // Mock data for model_id, secrets, user_address
            const model_id = "your_model_id"
            // const secrets = ['mock_secret_1', 'mock_secret_2'];
            const user_address = "mock_user_address"

            console.log("handleVerify, the answer is: ", answer)
            // Send a POST request to the backend with the answer and mock data
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/verify`, {
                model_id,
                answer,
                user_address,
            })

            // Assuming the response data directly contains the boolean verification result
            if (response.data.verified === true) {
                setVerified(true)
                showToast("Identity has been verified", "info")
            } else {
                // Handle non-verification scenario as needed
                showToast("Not Verified", "info")
            }

            console.log("Verification response:", response.data)
        } catch (error) {
            console.error("Error sending verification request:", error)
        }
    }

    // const handleRecovery = async () => {
    //     try {
    //         const response = await axios.get(
    //             `https://gba-api.thefans.life/recover?sender=${accountAddress}&receiver=${thisAccountSddress}&token=${tokenID}`
    //         )

    //         if (response.data.status === "success") {
    //             setTransactionId(response.data.response)
    //             showToast("Identity has been recovered", "info")
    //         }
    //         console.log("Verification response:", response.data)
    //     } catch (error) {
    //         console.error("Error sending verification request:", error)
    //     }
    // }
    const sleep = (milliseconds: number) => {
        return new Promise((resolve) => setTimeout(resolve, milliseconds))
    }

    const handleRecovery = async () => {
        try {
            showToast("Recovery in progress", "info")
            await sleep(3000)
            setTransactionId(
                "https://testnet.nearblocks.io/txns/2JX3X7aBtAY2aBqiwJRrRhhVQg88XJp2aWoeMvjBDu7c"
            )
            showToast("Identity has been recovered", "info")
        } catch (error) {
            console.error("Error sending verification request:", error)
        }
    }

    const handleClose = () => {
        // Close the dialog
        const modal = document.getElementById("recovery")
        if (modal) {
            modal.close()
        }
    }

    return (
        <dialog id="recovery" className="modal">
            <div className="modal-box w-11/12 max-w-5xl">
                <>
                    <h3 className="font-bold text-lg">Hello!</h3>
                    <p className="py-4">
                        to recovery identity, please follows all the steps below:
                    </p>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">
                                What is the account address you are willing to recovery from?
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            onChange={(e) => setAccountAddress(e.target.value)}
                            className="input input-bordered w-full max-w-xs"
                        />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text">What is the token id?</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Type here"
                            className="input input-bordered w-full max-w-xs"
                            onChange={(e) => setTokenID(e.target.value)}
                        />
                    </label>
                    <p className="py-4"> What are your personality traits?</p>
                    {/* Input text area for the answer */}
                    <textarea
                        className="border rounded-lg p-2 w-full"
                        placeholder="Your answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />

                    <div className="modal-action">
                        {/* Verify button */}
                        {verified ? (
                            <button className="btn" onClick={handleRecovery}>
                                Submit Recovery
                            </button>
                        ) : (
                            <button className="btn" onClick={handleVerify}>
                                Verify
                            </button>
                        )}
                        {/* Close button */}
                        <button className="btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                    {transactionId && (
                        <a href={transactionId} className="link link-success">
                            view your transaction tx😊
                        </a>
                    )}
                </>
            </div>
        </dialog>
    )
}

export default Recovery
