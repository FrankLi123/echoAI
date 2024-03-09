import React from "react"

const Cards = () => {
    const DataList = Array(10).fill(0)
    return (
        <div className="grid grid-cols-3 gap-4 px-32 py-8">
            {DataList.map((_, index) => (
                <div className="card w-72 shadow-xl border-2 border-blue-200">
                    <figure>
                        <img className="rounded-3xl" src="/logo.jpg" alt="" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">AI {index}</h2>
                        <p>some explaination</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">Chat</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Cards
