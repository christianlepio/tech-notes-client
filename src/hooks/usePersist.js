// custom hook to persist login and not go back to 1st page once logged in when refresh page
import { useState, useEffect } from 'react'

const usePersist = () => {
    // get persist variable from local storage persist, if not exist then set persist to false
    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem('persist')) || false )

    useEffect(() => {
        // set persist local storage value when persist variable changes
        localStorage.setItem('persist', JSON.stringify(persist))
    }, [persist])

    return [persist, setPersist]
}

export default usePersist