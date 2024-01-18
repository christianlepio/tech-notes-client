import { useState, useEffect, useRef } from "react"
// generated custom hook from rtk query
import { useAddNewNoteMutation } from "../notesApiSlice"
import { useNavigate } from "react-router-dom"

const NewNoteForm = ({ users }) => {
    // console.log('users: ', users)
    // initialize RTK query custom hooks mutation, and get the method and variables
    const [addNewNote, {
        isLoading, 
        isSuccess, 
        isError, 
        error
    }] = useAddNewNoteMutation()

    // initialize useNavigate hook
    const navigate = useNavigate()

    const titleRef = useRef()

    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [userId, setUserId] = useState(users[0]?.id)

    useEffect(() => {
        //focus on title input when this component loads
        titleRef.current.focus()
    }, [])

    // if success then navigate back to the users page
    useEffect(() => {
        if (isSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()

        if (canSave) {
            await addNewNote({ user: userId, title, text })
        }
    }

    const options = users.map(user => {
        return (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        )
    })

    const content = (
        <>
            <section className="px-4 py-4 shadow border rounded-4 align-self-center">
                <div
                    className={'alert alert-danger ' + (isError ? null : 'd-none')}
                    role="alert"
                >
                    <div><i className="bi bi-exclamation-circle me-2"></i><strong>{error?.data?.message}</strong></div>
                </div>

                <h1 className="h1 mb-4 mt-2 text-center">Create New Note</h1>

                <form onSubmit={onSaveNoteClicked}>
                    {/* title input */}
                    <div className="mb-3">
                        <label htmlFor="titleInput" className="form-label lead">Title</label>
                        <input 
                            type="text" 
                            id="titleInput"
                            placeholder="Enter title here:"
                            className='form-control mb-1'
                            ref={titleRef}
                            value={title}
                            onChange={onTitleChanged}
                            required
                        />
                    </div>

                    {/* text input */}
                    <div className="mb-3">
                        <label htmlFor="textInput" className="form-label lead">Text</label>
                        <textarea 
                            type="text" 
                            id="textInput"
                            placeholder="Enter text here:"
                            className='form-control mb-1'
                            value={text}
                            onChange={onTextChanged}
                            rows='3'
                            required
                        ></textarea>
                    </div>

                    {/* select userId option */}
                    <div className="mb-3">
                        <label htmlFor="userIdInput" className="form-label lead">Assigned User</label>
                        <select 
                            className='form-select' 
                            id="userIdInput"
                            name="userIdInput" 
                            aria-describedby="userIdInputFeedback" 
                            value={userId}
                            onChange={onUserIdChanged}
                            required
                        >
                            {options}
                        </select>
                    </div>

                    {/* save button */}
                    <div className="d-flex">
                        <button 
                            type="submit"
                            className="btn btn-success flex-grow-1 mt-2"
                            disabled={isLoading ? true : !canSave}
                        >
                            {isLoading ? 'Loading...' : 'Submit New Note'}
                        </button>
                    </div>
                </form>

            </section>
        </>
    )

    return content
}

export default NewNoteForm