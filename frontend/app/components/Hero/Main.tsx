import React from "react"
import Cards from "./Cards"
import Verify from "../Auth/Verify"
import { AccountInfo } from "@/app/page"

interface MainProps {
    accountInfo: AccountInfo | null
}
const Main: React.FC<MainProps> = ({ accountInfo }) => {
    return (
        <div className="w-full px-3 flex flex-row justify-between">
            <Cards accountInfo={accountInfo} />
            <div>
                <button
                    className="btn"
                    onClick={() => {
                        const modal = document.getElementById("my_modal_4")
                        if (modal instanceof HTMLDialogElement) {
                            modal.showModal()
                        }
                    }}
                >
                    verify your identity
                </button>
                <Verify />
            </div>
        </div>
    )
}

export default Main
