import React, { useEffect, useState } from "react"
import Cards from "./Cards"
import Verify from "../Auth/Verify"
import Register from "../Auth/Register"
import { AccountInfo } from "@/app/page"
import axios from "axios"
import Recovery from "../Auth/Recovery"

interface MainProps {
    accountInfo: AccountInfo | null
}

const Main: React.FC<MainProps> = ({ accountInfo }) => {
    // const [isRegistered, setIsRegistered] = useState<boolean | null>(null)
    // const [isVerified, setIsVerified] = useState<boolean | null>(null)
    // useEffect(() => {
    //     const checkIsRegistered = async () => {
    //         if (accountInfo) {
    //             try {
    //                 const response = await axios.post(
    //                     `${process.env.NEXT_PUBLIC_API_URL}/api/isRegistered`,
    //                     {
    //                         model_id: "your_model_id", // Adjust with actual logic to obtain the model_id
    //                         user_address: accountInfo.accountId,
    //                     }
    //                 )
    //                 setIsRegistered(response.data.verified)
    //             } catch (error) {
    //                 console.error("Error checking registration status:", error)
    //                 setIsRegistered(false) // Assuming default to not registered in case of error
    //             }
    //         }
    //     }

    //     checkIsRegistered()
    // }, [accountInfo])

    // const handleRegistrationSuccess = () => {
    //     setIsRegistered(true)
    // }

    // const handleVerifySuccess = () => {
    //     setIsVerified(true)
    // }

    return (
        <div className="w-full px-3 flex flex-row justify-between">
            <Cards accountInfo={accountInfo} />
            {/* {!isVerified && (
                <p className="fixed bottom-0 left-0 right-0 text-red-500 text-xs p-4 bg-opacity-75 text-center">
                    Please verify your identity before chatting with any bot!
                </p>
            )} */}
            <div className="flex flex-col">
                <div>
                    <button
                        className="btn"
                        onClick={() => {
                            const modal = document.getElementById("recovery")
                            if (modal instanceof HTMLDialogElement) {
                                modal.showModal()
                            }
                        }}
                    >
                        recovery your identity
                    </button>
                    {accountInfo && <Recovery thisAccountSddress={accountInfo!.accountId} />}
                </div>
            </div>
        </div>
    )
}

export default Main