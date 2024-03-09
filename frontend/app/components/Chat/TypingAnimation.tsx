import React, { useEffect, useState } from "react"

const TypingAnimation = (props: { text: string; typingSpeed: number }) => {
    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (currentIndex < props.text.length) {
                setDisplayText((prev) => prev + props.text.charAt(currentIndex))
                setCurrentIndex((prev) => prev + 1)
            } else {
                clearInterval(intervalId)
            }
        }, props.typingSpeed)

        return () => clearInterval(intervalId)
    }, [props.text, props.typingSpeed, currentIndex])

    return <span>{displayText}</span>
}

export default TypingAnimation
