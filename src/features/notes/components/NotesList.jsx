// import generated rtk query custom hook
import { useGetNotesQuery } from "../notesApiSlice"
// component
import Note from "./Note"

const NotesList = () => {
    // get variables from generated custom hooks (rtk query)
    const {
        data: notes, // rename data to notes, this returns a notes array
        isLoading, // boolean
        isSuccess, // boolean
        isError, // boolean
        error // error message
    } = useGetNotesQuery('notesList', {
        pollingInterval: 15000, // means, it will refetch notes data every after 15 seconds
        refetchOnFocus: true, // will refetch notes data if you go to another window and comeback to previous window
        refetchOnMountOrArgChange: true // will refetch notes data if component reloads
    })

    // define content
    let content

    if (isLoading) content = <p>Loading . . . </p>

    if (isError) content = <p className="text-danger">{error?.data?.message}</p>

    if (isSuccess) {
        // get ids array from normalized state obj of notes
        const { ids } = notes

        const tableContent = ids?.length
            ? ids.map((noteId, i) => <Note key={noteId} noteId={noteId} index={i} />)
            : null

        content = (
            <div className="table-responsive">
                <table className="table table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col"> # </th>
                            <th scope="col">Status</th>
                            <th scope="col">Created On</th>
                            <th scope="col">Updated On</th>
                            <th scope="col">Title</th>
                            <th scope="col">Owner</th>
                            <th scope="col">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </div>
        )
    }

    return content
}

export default NotesList