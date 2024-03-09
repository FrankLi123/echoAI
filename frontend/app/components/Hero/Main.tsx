import React from "react"
import Cards from "./Cards"
import Verify from "../Auth/Verify"

const Main: React.FC = () => {
    return (
        <div className="w-full px-3 flex flex-row justify-between">
            <Cards />
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
