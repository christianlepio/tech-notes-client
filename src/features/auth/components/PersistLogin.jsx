import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useRefreshMutation } from "../authApiSlice" // rtk query custom hook
import usePersist from "../../../hooks/usePersist" // custom react hook
import { useSelector } from "react-redux" // enables to selectCurrentToken
import { selectCurrentToken } from "../authSlice"

const PersistLogin = () => {
    const [persist] = usePersist() // get persist state
    const token = useSelector(selectCurrentToken) // get access token from selector
    // handles strict mode
    // this will let useEffect code to run once
    const effectRan = useRef(false) 
    // will set true if the refresh function already perform
    const [trueSuccess, setTrueSuccess] = useState(false) 

    // get functions/states from rtk query useRefreshMutation
    const [refresh, {
        isUninitialized, // will check if the refresh function has not been called yet
        isLoading, 
        isSuccess, 
        isError, 
        error
    }] = useRefreshMutation()

    useEffect(() => {
        // code below will run on the 2nd time that this useEffect renders due to strict mode update of reactJS
        // useEffect will only run twice in the development env and not in the production env
        if (effectRan.current === true || import.meta.env.NODE_ENV !== 'development') {
            const verifyRefreshToken = async () => {
                console.log('Verifying refresh token!...')

                try {
                    // const response = 
                    await refresh() // get new access token
                    // const { accessToken } = response.data
                    setTrueSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }

            // if there is no access token & persist login is true then,
            // get new access token
            if (!token && persist) verifyRefreshToken()
        }
        // clean up function of useEffect
        return () => effectRan.current = true

        // this comment below will disable some warnings 
        // eslint-disable-next-line
    }, [])

    // define the content
    let content
    if (!persist) { // persist: no/false
        console.log('No persist!...')
        content = <Outlet /> // return children routes
    } else if (isLoading) { // persist: yes/true token: no
        console.log('getting new access token')
        content = <p>Getting new access token!...</p>
    } else if (isError) { // persist: yes/true token: no
        console.log('Get new access token error: ', error)
        content = (
            <p className="text-danger text-center">
                {error.data?.message}
                <Link to='/login'>Please login again</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) { // persist: yes/true token: yes
        console.log('success to get new access token!...')
        content = <Outlet /> // return children routes
    } else if (token && isUninitialized) { // persist: yes/true token: yes
        console.log('token is there and refreshing it is uninitialized!...')
        console.log('isUninitialized: ', isUninitialized)
        content = <Outlet /> // return children routes
    }

    return content
}

export default PersistLogin