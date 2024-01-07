import { useState, useEffect, useRef } from "react"
// generated custom hook from rtk query
import { useUpdateNoteMutation, useDeleteNoteMutation } from "../notesApiSlice"
import { useNavigate } from "react-router-dom"

const EditNoteForm = ({ note, users }) => {
    // initialize RTK query custom hooks mutation, and get the method and variables
    const [updateNote, {
        isLoading, 
        isSuccess, 
        isError, 
        error
    }] = useUpdateNoteMutation()

    // initialize RTK query custom hooks mutation, and get the method and variables and rename it
    const [deleteNote, {
        isLoading: isDelLoading,
        isSuccess: isDelSuccess, 
        isError: isDelError,
        error: delError
    }] = useDeleteNoteMutation()

    // initialize useNavigate hook
    const navigate = useNavigate()

    const titleRef = useRef()

    const [title, setTitle] = useState(note?.title)
    const [text, setText] = useState(note?.text)
    const [userId, setUserId] = useState(note?.user)
    const [completed, setCompleted] = useState(note?.completed)

    useEffect(() => {
        //focus on title input when this component loads
        titleRef.current.focus()
    }, [])

    // if success, navigate to notes page
    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setTitle('')
            setText('')
            setUserId('')
            navigate('/dash/notes')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onTitleChanged = e => setTitle(e.target.value)
    const onTextChanged = e => setText(e.target.value)
    const onUserIdChanged = e => setUserId(e.target.value)
    const onCompletedChanged = () => setCompleted(prev => !prev)

    const canSave = [title, text, userId].every(Boolean) && !isLoading

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()

        if (canSave) {
            await updateNote({
                id: note.id, 
                user: userId, 
                title, 
                text, 
                completed
            })
        }
    }

    const onDeleteNoteClicked = async () => {
        await deleteNote({ id: note.id })
    }

    const created = new Date(note.createdAt).toLocaleString('en-US', { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })
    const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })

    const options = users?.map(user => {
        return (
            <option key={user.id} value={user.id}>
                {user.username}
            </option>
        )
    })

    // define error either from update error or delete error
    // using Nullish coalescing, this will returns blank errContent if update/delete error is undefined
    const errContent = (error?.data?.message || delError?.data?.message) ?? ''

    const content = (
        <>
            <section className="px-4 py-4 shadow border rounded-4 align-self-center">
                <div
                    className={'alert alert-danger ' + ((isError || isDelError) ? null : 'd-none')}
                    role="alert"
                >
                    <div><i className="bi bi-exclamation-circle me-2"></i><strong>{errContent}</strong></div>
                </div>

                <h1 className="h1 mb-4 mt-2 text-center">Update Note Details</h1>

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

                    {/* checkbox for completed */}
                    <div className="mb-3">
                        <div className="form-check form-switch">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                role="switch" 
                                id="flexSwitchCheckDefault" 
                                checked={completed}
                                onChange={onCompletedChanged}
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"> Work Completed</label>
                        </div>
                    </div>

                    {/* dates */}
                    <div className="mb-3">
                        <p className="text-start">Created: <br />{created}</p>
                        <p className="text-start">Updated: <br />{updated}</p>
                    </div>

                    {/* save button */}
                    <div className="d-flex">
                        <button 
                            type="submit"
                            className="btn btn-success flex-grow-1 mt-2"
                            disabled={(isLoading || isDelLoading) ? true : !canSave}
                        >
                            {isLoading ? 'Updating...' : 'Save User'}
                        </button>
                    </div>

                    {/* delete button */}
                    <div className="d-flex">
                        <button 
                            type="button"
                            className="btn btn-warning flex-grow-1 mt-2"
                            onClick={onDeleteNoteClicked}
                            disabled={(isLoading || isDelLoading) ? true : false}
                        >
                            {isDelLoading ? 'Deleting...' : 'Delete User'}
                        </button>
                    </div>
                </form>

            </section>
        </>
    )


    return content
}

export default EditNoteForm