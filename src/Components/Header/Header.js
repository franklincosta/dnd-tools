function Header(){
    return(
        <div className="bg-primary rounded">
            <nav className="navbar navbar-expand-lg">
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav   ">
                        <li className="nav-item">
                            <a className="nav-link text-white" aria-current="page" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link text-white" href="/upload-itens">Upload Itens</a>
                        </li>
                    </ul>            
                </div>
            </nav>
        </div>
    )
}
export default Header;