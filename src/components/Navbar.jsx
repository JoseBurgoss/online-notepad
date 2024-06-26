import { Link, useNavigate, useLocation } from 'react-router-dom';
import Firestore from '../handlers/firestore';
import { useFirestoreContext } from '../context/FirestoreContext';
import { useAuthContext } from '../context/AuthContext';
import LoginButton from './LoginButton';

function LogoutButton() {
  const { logout } = useAuthContext();
  return (
    <button type='button' className='btn btn-danger' onClick={logout}>
      Cerrar sesión
    </button>
  );
}

function NavigationLeft() {
  const { currentUser } = useAuthContext();
  const { createNote } = Firestore;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const newNote = async () => {
    const { uid } = currentUser;
    const noteRef = await createNote(uid);
    navigate(`/note/${noteRef}`);
  };

  return (
    <ul className='navbar-nav me-auto mb-2 mb-md-0'>
      {currentUser && (
        <>
          <li className='nav-item'>
            <Link
              to='/'
              className={`nav-link ${pathname === '/' ? 'active' : ''}`}
              aria-current='page'
            >
                Inicio
            </Link>
          </li>
          <li className='nav-item'>
            <button type='button' onClick={newNote} className='nav-link'>
              ➕ Nueva nota
            </button>
          </li>
        </>
      )}
    </ul>
  );
}

function SearchForm() {
  const { currentUser } = useAuthContext();
  const { filterNotes } = useFirestoreContext();
  const { pathname } = useLocation();

  const handleChange = (event) => {
    filterNotes(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    pathname === '/' &&
    currentUser && (
      <form className='d-flex' role='search' onSubmit={handleSubmit}>
        <input
          className='form-control me-2'
          type='search'
          placeholder='Search'
          aria-label='Search'
          onChange={handleChange}
        />
      </form>
    )
  );
}

function NavigationRight() {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();

  return (
    <ul className='navbar-nav mb-2 mb-md-0'>
      {currentUser ? (
        <Dropdown />
      ) : (
        <>
          <Link
            to='/about'
            className={`nav-link pe-3 ${pathname === '/about' ? 'active' : ''}`}
          >
            Sobre
          </Link>
          <LoginButton />
        </>
      )}
    </ul>
  );
}

function Dropdown() {
  const { currentUser } = useAuthContext();

  return (
    <li className='nav-item dropdown ms-2'>
      <button
        className='nav-link dropdown-toggle p-md-0'
        data-bs-toggle='dropdown'
        aria-expanded='false'
      >
        <img
          src={currentUser.photoURL}
          alt={currentUser.displayName}
          style={{ width: '36px', height: '36px', borderRadius: '50%' }}
        />
      </button>
      <ul className='dropdown-menu dropdown-menu-end text-center'>
        <li>
          <Link to='/profile' className='dropdown-item'>
            Mi Perfil
          </Link>
        </li>
        <li>
          <Link to='/about' className='dropdown-item'>
            Sobre
          </Link>
        </li>
        <hr className='dropdown-divider' />
        <li>
          <LogoutButton />
        </li>
      </ul>
    </li>
  );
}

function Navbar() {
  return (
    <>
      <nav className='navbar navbar-expand-md bg-body-tertiary sticky-top'>
        <div className='container-fluid'>
          <Link to='/' className='navbar-brand'>
            📒 Online Notepad
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarSupportedContent'
            aria-controls='navbarSupportedContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <NavigationLeft />
            <SearchForm />
            <NavigationRight />
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
