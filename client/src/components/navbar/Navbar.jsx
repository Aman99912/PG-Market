// import { useContext, useState } from "react";
// import "./navbar.scss";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import { useNotificationStore } from "../../lib/notificationStore";

// function Navbar() {
//   const [open, setOpen] = useState(false);

//   const { currentUser } = useContext(AuthContext);

//   const fetch = useNotificationStore((state) => state.fetch);
//   const number = useNotificationStore((state) => state.number);

//   if(currentUser) fetch();

//   return (
//     <nav>
//       <div className="left">
//         <a href="/" className="logo">
//           <img src="/logo.png" alt="" />
//           <span>Amandeep.</span>
//         </a>
//         <a href="/">Home</a>
//         <a href="/">About</a>
//         <a href="/">Contact</a>
//         <a href="/">Agents</a>
//       </div>
//       <div className="right">
//         {currentUser ? (
//           <div className="user">
//             <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
//             <span>{currentUser.username}</span>
//             <Link to="/profile" className="profile">
//               {number > 0 && <div className="notification">{number}</div>}
//               <span>Profile</span>
//             </Link>
//           </div>
//         ) : (
//           <>
//             <a href="/">Sign in</a>
//             <a href="/" className="register">
//               Sign up
//             </a>
//           </>
//         )}
//         <div className="menuIcon">
//           <img
//             src="/menu.png"
//             alt=""
//             onClick={() => setOpen((prev) => !prev)}
//           />
//         </div>
//         <div className={open ? "menu active" : "menu"}>
//           <a href="/">Home</a>
//           <a href="/">About</a>
//           <a href="/">Contact</a>
//           <a href="/">Agents</a>
//           <a href="/">Sign in</a>
//           <a href="/">Sign up</a>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;
import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img src="/logo.jpg" alt="logo" />
          <span>Amandeep.</span>
        </a>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/agents">Agents</Link>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar" />
            <span>{currentUser.username}</span>
            <Link to="/profile" className="profile">
              {number > 0 && <div className="notification">{number}</div>}
              <span>  <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link></span>
            </Link>
          </div>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
            <Link to="/register" className="register">
              Sign up
            </Link>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt="menu"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/agents">Agents</Link>
          {currentUser ? (
            <Link to="/profile" onClick={() => setOpen(false)}>
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

