import React , {useState} from "react";
import "./Login.css"
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import {useHistory} from "react-router-dom"

const Login = () => {

    // const history = useHistory()
    const navigate = useNavigate()
    const [newUser, setNewUser] = useState(
       
        {
   
    email:"",
    password: "",
     }
    );
    console.log("newUser",newUser)

    const handleChange = (e)=>{
        setNewUser({...newUser, [e.target.name]: e.target.value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault();
        // const formData = new FormData()
    //    formData.append("email",newUser.email);
    //     formData.append("password",newUser.password);
    //    console.log('newUser', newUser);

        try {
     const res =  await  axios.post("http://localhost:5000/users/login/", newUser)
            // .then(res =>{
            //     console.log('resss', res);
            //     alert(res.data.message)
            //     setLoginUser(res.data.userid)
            //      history.push("/")
            // })
            console.log(res,"res")
            alert(res.data.message)
            // setUser(res.data.userid
            //     ) 
            localStorage.setItem("user", res.data.userid)
            //  history.push("/")
            navigate('/')
          
        } catch (error) {
            console.log("error",error)

            alert("Please Registered first ",error)
        }
}
 
  return (
   
    <form onSubmit={handleSubmit} >
        <div className="container1">
         <div className='register'>
         <h1>Login Page</h1>
       
         <input type="email" placeholder="Email address or phone number" name="email" value={newUser.email}  onChange={handleChange}/>
         
         <input type="password" placeholder="password" name="password" value={newUser.password}  onChange={handleChange}/>
      
<div className='button' onClick={handleSubmit}>Login</div>

<div className='Link1'onClick={()=>navigate("/Register")}>Register</div> 
<div className='Link2'onClick={()=>navigate("/ForgotAccount")}>Forgotten account?</div> 
        </div>
        </div>
    </form>
)

}


export default Login
