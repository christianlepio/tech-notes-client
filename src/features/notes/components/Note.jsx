import { useNavigate } from 'react-router-dom'
// useSelector: to get global state variable from store
// import { useSelector } from 'react-redux'
// memoized selector
// import { selectNoteById } from '../notesApiSlice'

import { useGetNotesQuery } from '../notesApiSlice'
import { memo } from 'react' // this is to return memoized data

const Note = ({ noteId, index }) => {
    // get specific note by id from state
    // const note = useSelector(state => selectNoteById(state, noteId))

    // get specific note by id by calling query endpoint getNotes
    const { note } = useGetNotesQuery('notesList', {
        // built in function to get/return specific note
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        }),
    })

    // initialize useNavigate hook
    const navigate = useNavigate()

    if (note) {
        // navigate to edit form of note
        const handleEdit = () => navigate(`/dash/notes/${noteId}`)

        // format dates
        const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        return (
            <tr>
                <th scope='row'>{index + 1}</th>
                <td>
                    {note.completed
                        ? <span className='text-success'>Completed</span>
                        : <span className=''>Open</span>
                    }
                </td>
                <td>{created}</td>
                <td>{updated}</td>
                <td>{note.title}</td>
                <td>{note.username}</td>
                <td>
                    <button 
                        className="btn btn-primary" 
                        onClick={handleEdit}
                    >
                        <i className="bi bi-pen"></i>
                    </button>
                </td>
            </tr>
        )

    } else return null
}

// this component will only re-render when the memoized data changes
const memoizedNote = memo(Note)

export default memoizedNote