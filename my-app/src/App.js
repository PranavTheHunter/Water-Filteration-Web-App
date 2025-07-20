import { BrowserRouter,Route ,Routes } from "react-router-dom";
import Home from'./pages/Home.js';
import Signup from "./pages/Sign.js";
import About from "./pages/about.js"
import Contact from "./pages/contact.js"
import Products from "./pages/products.js"
import Login from "./pages/login.js"
import Admin from "./pages/Admin.js"
import "./App.css"




export default function App(){
    return(
        <div>
            <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path='/Home' element={<Home />} />
                <Route path='/Signup'element={<Signup />} />
                <Route path='/About'element={<About />} />
                <Route path='/Contact'element={<Contact />} />
                <Route path='/Products'element={<Products />} />
                <Route path='/login'element={<Login />} />
                <Route path='/Admin' element={<Admin />} />
                

            </Routes>
            </BrowserRouter>
        </div>

) 
}