import { Link } from "react-router-dom"

const PublicPage = () => {
    const content = (
        <>
            <header className="my-5">
                <h1 className="text-center">Welcome to <span>Tech Notes</span></h1>
            </header>
            <main className="border container rounded-3 p-4">
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Necessitatibus, tempora accusantium? Commodi quas iste est numquam ullam dolore saepe tempora neque repudiandae totam expedita, quibusdam quisquam alias recusandae eius nostrum.</p>
                <address>
                    Ryan Tech Notes <br />
                    555 Foo Drive <br />
                    Paranaque City <br />
                    Contact: 09123456789
                </address><br />
                <p>Owner: Christian Ryan</p>
            </main>
            <footer className="text-center py-5">
                <Link to="/login">Employee Login</Link>
            </footer>
        </> 
    )

    return content
}

export default PublicPage